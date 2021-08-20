from customElements.UMLclasses.model import Model
from customElements.UMLclasses.parser import UMLParser
from customElements.UMLclasses.uml_element_classes import UmlLine


def grade(data):
    raw_submitted_elements_list = data["submitted_answers"]["uml_model"]
    parser = UMLParser(raw_submitted_elements_list)
    model = parser.get_model()

    score = 0

    if model.contains_connection(
        "Person", "Student", {"uml_line_type": UmlLine.DEPENDENCY}
    ):
        score += 1

    data["score"] = score
