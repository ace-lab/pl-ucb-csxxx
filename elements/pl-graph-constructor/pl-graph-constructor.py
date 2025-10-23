import prairielearn as pl
import json
import chevron
import lxml.html
import re

import networkx as nx

ALLOW_SELFLINKS_DEFAULT = True
MULTIGRAPH_DEFAULT = True
ALLOW_NODEMARKING_DEFAULT = True
PARSING_DEFAULT = "dot"

def prepare(element_html, data):
    element = lxml.html.fragment_fromstring(element_html)
    required_attribs = ["directed", "answers-name"]
    optional_attribs = ["allow-selflinks", "multigraph", "allow-nodemarking", "parse"]
    
    pl.check_attribs(element, required_attribs, optional_attribs)
    

def render(element_html, data):
    # Render the Mustache template using chevron
    #return chevron.render(element_html, {}).strip()
    element = lxml.html.fragment_fromstring(element_html)
    directed = pl.get_boolean_attrib(element, "directed")
    
    # example:
    # (dict_values(['A', 'B', 'C', 'B']), {('C', 'A', '2'), ('C', 'B', '3')})

    answers_name = pl.get_string_attrib(element, "answers-name")
    if not re.match(r'^[A-Za-z0-9_]+$', answers_name):
        raise ValueError("answers-name can only contain alphabetic characters, numbers and underscores.")
    allow_selflinks = pl.get_boolean_attrib(element, "allow-selflinks", ALLOW_SELFLINKS_DEFAULT)
    multigraph = pl.get_boolean_attrib(element, "multigraph", ALLOW_SELFLINKS_DEFAULT)
    allow_nodemarking = pl.get_boolean_attrib(element, "allow-nodemarking", ALLOW_NODEMARKING_DEFAULT)
    parse = pl.get_string_attrib(element, "parse", PARSING_DEFAULT) # new parameter for parsing as dictionary

    #print(parse)

    config = {
        'answers_name': answers_name,
        'directed': "true" if directed else "false",
        'allow_selflinks': "true" if allow_selflinks else "false",
        'multigraph': "true" if multigraph else "false",
        'allow_nodemarking': "true" if allow_nodemarking else "false",
        'parse': parse 
    }
        
    with open('pl-graph-constructor.mustache', 'r') as f:
        return chevron.render(f, {'config_py': config}).strip()

def parse(element_html, data):
    element = lxml.html.fragment_fromstring(element_html)
    graph_data = data['submitted_answers'].get('graphData', '')
    data['submitted_answers']['graphData'] = graph_data

    parse = pl.get_string_attrib(element, "parse", PARSING_DEFAULT) # new parameter for parsing as dictionary

    if parse == "dict":
        data['submitted_answers']['graphData'] = str(parse_dot(graph_data))
    
    if parse == "dot":
        data['submitted_answers']['graphData'] = graph_data

    

def parse_dot(dot_string):
    """
    Parses a DOT format graph string and extracts labeled nodes and edges for both directed and undirected graphs.

    The function normalizes the input string by removing extra line breaks and whitespace,
    then uses regular expressions to extract labeled nodes and edges. 
    It maps node identifiers to their labels and builds a set of edges using the labels.

    Parameters:
        dot_string (str): A string representing a graph in DOT format.

    Returns:
        tuple: A tuple containing:
            - node_labels (dict_values): The labels of the nodes as a dict_values object.
            - edges (set): A set of edges represented as tuples 
                           (source_label, target_label, edge_label). 
                           For undirected edges, the order of source_label and target_label is preserved as in the DOT string.

    Example:
        Input DOT string:
            Directed:
                "A [label=\"Node A\", shape=circle]; 
                 B [label=\"Node B\", shape=circle]; 
                 A -> B [label=\"1\"]"
            Undirected:
                "A [label=\"Node A\", shape=circle]; 
                 B [label=\"Node B\", shape=circle]; 
                 A -- B [label=\"1\"]"
        
        Output:
            Directed:
                (dict_values(['Node A', 'Node B']), {('Node A', 'Node B', '1')})
            Undirected:
                (dict_values(['Node A', 'Node B']), {('Node A', 'Node B', '1')})
    """
    # Normalize line endings and whitespace
    dot_string = dot_string.replace("\r", "").replace("\n", "")
    
    # Parse nodes and create a mapping from N identifiers to actual labels
    node_labels = {}
    node_pattern = re.compile(r'(\w+)\s*\[label="([^"]+)",\s*shape=circle\]')
    for match in node_pattern.finditer(dot_string):
        node_id, label = match.groups()
        node_labels[node_id] = label

    edges = set()
    
    # Edge pattern for directed edges
    directed_edge_pattern = re.compile(r'(\w+)\s*->\s*(\w+)\s*\[label="(\d+)"\]')
    for match in directed_edge_pattern.finditer(dot_string):
        source_id, target_id, label = match.groups()
        if source_id in node_labels and target_id in node_labels:
            edges.add((node_labels[source_id], node_labels[target_id], label))
    
    # Edge pattern for undirected edges
    undirected_edge_pattern = re.compile(r'(\w+)\s*--\s*(\w+)\s*\[label="(\d+)"\]')
    for match in undirected_edge_pattern.finditer(dot_string):
        source_id, target_id, label = match.groups()
        if source_id in node_labels and target_id in node_labels:
            edges.add((node_labels[source_id], node_labels[target_id], label))

    return node_labels.values(), edges