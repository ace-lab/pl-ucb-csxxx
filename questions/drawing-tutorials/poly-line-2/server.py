from customElements.UMLclasses.model import Model
from customElements.UMLclasses.parser import UMLParser
from customElements.UMLclasses.uml_element_classes import UmlLine


def grade(data):
    raw_submitted_elements_list = data["submitted_answers"]["uml_model"]
    parser = UMLParser(raw_submitted_elements_list)
    model = parser.get_model()

    uml_line_types = model.get_uml_line_types()
    lines_submitted = model.get_connections_count()

    lines_correct = 0
    score = 0

    correct_line_types = [UmlLine.AGGREGATION, UmlLine.ASSOCIATION, UmlLine.DEPENDENCY]

    for uml_line_type in uml_line_types:
        if uml_line_type in correct_line_types:
            score += 1

    score = score / 3
    if score > 1:
        data["score"] = 1
    else:
        data["score"] = score
