import re

def parse_dot(dot_string):
    # This function will parse nodes and edges, keeping whitespace in mind.
    node_labels = {}
    
    # Improved node pattern to account for any whitespace around square brackets
    node_pattern = re.compile(r'(\w+)\s*\[label="([^"]+)",\s*shape=circle\]')
    for match in node_pattern.finditer(dot_string):
        node_id, label = match.groups()
        node_labels[node_id] = label

    edges = set()
    # Improved edge pattern to account for optional whitespace and both positive/negative labels
    edge_pattern = re.compile(r'(\w+)\s*->\s*(\w+)\s*\[label="(-?\d+)"\]')
    for match in edge_pattern.finditer(dot_string):
        source_id, target_id, label = match.groups()
        if source_id in node_labels and target_id in node_labels:
            # Use the mapped labels instead of node IDs
            edges.add((node_labels[source_id], node_labels[target_id], label))
    
    return edges

def grade(data):
    # Define the correct graph structure using label-based edges
    correct_edges = {
        ("A", "B", "6"),
        ("A", "C", "2"),
        ("B", "C", "2"),
        ("B", "D", "-3"),
        ("B", "E", "2"),
        ("C", "E", "-2"),
        ("C", "F", "3"),
        ("D", "E", "-1"),
        ("E", "F", "4")
    }
    
    # Parse the student's answer
    student_dot = data['submitted_answers'].get('graphData', '')
    student_edges = parse_dot(student_dot)

    #print("Parsed student edges:", student_edges)  # Debug output to verify parsing

    # Check if the student's edges match the correct edges
    if student_edges == correct_edges:
        data['score'] = 1  # Full credit
    else:
        data['score'] = 0  # No credit