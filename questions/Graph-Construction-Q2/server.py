import re

def parse_dot(dot_string):
    # Normalize line endings and whitespace
    dot_string = dot_string.replace("\r", "").replace("\n", "")
    
    # Parse nodes and create a mapping from N identifiers to actual labels
    node_labels = {}
    
    # Node pattern to account for any whitespace around square brackets
    node_pattern = re.compile(r'(\w+)\s*\[label="([^"]+)",\s*shape=circle\]')
    for match in node_pattern.finditer(dot_string):
        node_id, label = match.groups()
        node_labels[node_id] = label

    edges = set()
    # Edge pattern to account for optional whitespace and positive/negative labels
    edge_pattern = re.compile(r'(\w+)\s*->\s*(\w+)\s*\[label="(-?\d+)"\]')
    for match in edge_pattern.finditer(dot_string):
        source_id, target_id, label = match.groups()
        if source_id in node_labels and target_id in node_labels:
            # Use the mapped labels instead of node IDs
            edges.add((node_labels[source_id], node_labels[target_id], label))
    
    return edges

def grade(data):
    # Define the correct graph structure with label-based edges
    correct_edges = {
        ("A", "B", "5"),
        ("A", "C", "3"),
        ("B", "C", "-1"),
        ("B", "D", "4"),
        ("C", "D", "2")
    }
    
    # Parse the student's answer
    student_dot = data['submitted_answers'].get('graphData', '')
    student_edges = parse_dot(student_dot)

    # Calculate the number of correct edges
    correct_matches = student_edges.intersection(correct_edges)
    num_correct_matches = len(correct_matches)
    total_correct_edges = len(correct_edges)
    
    # Calculate the number of extra edges (edges in student's answer that are not in the correct answer)
    extra_edges = student_edges - correct_edges
    num_extra_edges = len(extra_edges)

    # Calculate partial score: correct edges minus a penalty for extra edges
    score = max(0, (num_correct_matches - num_extra_edges) / total_correct_edges)
    data['score'] = score  # Ensure score is non-negative