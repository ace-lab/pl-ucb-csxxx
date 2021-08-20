from customElements.UMLclasses.model import Model
from customElements.UMLclasses.parser import UMLParser
from customElements.UMLclasses.uml_element_classes import UmlLine


def grade(data):
    raw_submitted_elements_list = data["submitted_answers"]["uml_model"]
    parser = UMLParser(raw_submitted_elements_list)
    model = parser.get_model()

    score = 0

    """This checks if a connection exist that is exactly equal to this one
        This does not tell you which components of the connection are not equal, 
        but there are functions in the connection class that can help you achieve that.
    """
    if model.contains_connection(
        "Product", "Order", constraint_1="1..*", constraint_2="0..*"
    ):
        score += 1

    data["score"] = score
