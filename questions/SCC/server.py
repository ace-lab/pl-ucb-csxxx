import re

def parse_dot(dot_string):
    dot_string = ''.join(dot_string.split())
    
    nodes = {}
    edges = set()

    node_pattern = re.compile(r'(\w+)\[label="([^"]+)",shape=circle\]')
    for match in node_pattern.finditer(dot_string):
        node_id, label = match.groups()
        nodes[node_id] = label  

    edge_pattern = re.compile(r'(\w+)->(\w+)\[label="[^"]*"\]')
    for match in edge_pattern.finditer(dot_string):
        source, target = match.groups()
        if source in nodes and target in nodes:
            edges.add((nodes[source], nodes[target]))
    
    return nodes.values(), edges 

def grade(data):
    correct_dot = '''
    digraph G {
        N0 [label="CJFD", shape=circle];
        N1 [label="GHI", shape=circle];
        N2 [label="A", shape=circle];
        N3 [label="E", shape=circle];
        N4 [label="B", shape=circle];
        N0 -> N1 [label=""];
        N1 -> N2 [label=""];
        N2 -> N3 [label=""];
        N0 -> N2 [label=""];
        N2 -> N4 [label=""];
        N1 -> N4 [label=""];
        N1 -> N3 [label=""];
    }
    '''
    
    correct_nodes, correct_edges = parse_dot(correct_dot)
    student_dot = data['submitted_answers'].get('graphData', '')
    student_nodes, student_edges = parse_dot(student_dot)

    if set(correct_nodes) == set(student_nodes) and correct_edges == student_edges:
        data['score'] = 1  
    else:
        data['score'] = 0 