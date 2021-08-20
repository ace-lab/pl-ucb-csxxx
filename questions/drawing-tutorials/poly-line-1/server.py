from customElements.UMLclasses.model import Model
from customElements.UMLclasses.parser import UMLParser


def grade(data):
    raw_submitted_elements_list = data["submitted_answers"]["uml_model"]
    raw_submitted_elements_list
    parser = UMLParser(raw_submitted_elements_list)

    model = parser.get_model()

    connections = model.get_connections()
    lines_submitted = len(connections)

    vertices = 5
    score = 0

    if lines_submitted == 1:
        # Line endpoints count as a vertex
        if connections[0].get_vertices_count() == vertices:
            score += 1

    data["score"] = score
