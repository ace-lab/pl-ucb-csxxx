import re

def parse_dot(dot_string):
    # Normalize line endings and whitespace
    dot_string = dot_string.replace("\r", "").replace("\n", "")
    
    node_count = 0
    edge_count = 0    
    # Node pattern to account for any whitespace around square brackets
    node_pattern = re.compile(r'(\w+)\s*\[.*?shape=circle.*?\];')
    for match in node_pattern.finditer(dot_string):
        node_count += 1

    edges = set()
    # Edge pattern to account for optional whitespace and positive/negative labels
    edge_pattern = re.compile(r'(\w+)\s*->\s*(\w+)\s*(\[[^\]]*\])?;')
    for match in edge_pattern.finditer(dot_string):
        edge_count += 1
    
    return node_count, edge_count

def grade(data):
    # Define required number of nodes and edges
    required_node_count = 10
    required_edge_count = 12
    
    # Parse the student's answer
    student_dot = data['submitted_answers'].get('graphData', '')
    node_count, edge_count = parse_dot(student_dot)

    # Calculate penalties for missing or extra nodes/edges
    node_difference = abs(node_count - required_node_count)
    edge_difference = abs(edge_count - required_edge_count)

    # Score nodes and edges separately
    node_score = max(0, (required_node_count - node_difference) / required_node_count)
    edge_score = max(0, (required_edge_count - edge_difference) / required_edge_count)
    
    # Calculate the final score as a weighted average
    data['score'] = 0.5 * node_score + 0.5 * edge_score