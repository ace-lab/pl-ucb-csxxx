import re

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




def graph_distance(graph1, graph2):
    """
    Computes a distance metric between two graphs.
    
    Parameters:
        graph1: A tuple containing node labels and edges (from parse_dot output).
        graph2: A tuple containing node labels and edges (from parse_dot output).
        
    Returns:
        distance: A metric representing how different the two graphs are.
    """
    nodes1, edges1 = graph1
    nodes2, edges2 = graph2

    nodes1_set = set(nodes1)
    nodes2_set = set(nodes2)
    edges1_set = set(edges1)
    edges2_set = set(edges2)
    
    node_diff = abs(len(nodes1_set) - len(nodes2_set))
    edge_diff = abs(len(edges1_set) - len(edges2_set))
    edge_mismatch = len(edges1_set.symmetric_difference(edges2_set))
    node_label_mismatch = len(nodes1_set.symmetric_difference(nodes2_set))
    distance = node_diff + edge_diff + edge_mismatch + node_label_mismatch

    return {
        "node_diff": node_diff,
        "edge_diff": edge_diff,
        "edge_mismatch": edge_mismatch,
        "node_label_mismatch": node_label_mismatch,
        "total_distance": distance
    }




def grade(data):
    # Define the correct answer with label-based nodes and edges
    correct_graph = ({"A", "B"}, {("A", "B", "1")})

    # Parse the student's answer
    student_dot = data['submitted_answers'].get('graphData', '')
    #student_nodes, student_edges = parse_dot(student_dot)

    distance_dict = graph_distance(parse_dot(student_dot), correct_graph)  
    # example for correct answer:
    # {'node_diff': 0, 'edge_diff': 0, 'edge_mismatch': 0, 'node_label_mismatch': 0, 'total_distance': 0}

    if distance_dict['total_distance'] == 0:
        data['score'] = 1  # Full credit
    else:
        data['score'] = 0  # No credit