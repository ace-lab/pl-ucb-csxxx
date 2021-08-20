from customElements.UMLclasses.model import Model
from customElements.UMLclasses.parser import UMLParser
from customElements.UMLclasses.uml_element_classes import UmlLine


def grade(data):
    raw_submitted_elements_list = data["submitted_answers"]["uml_model"]
    parser = UMLParser(raw_submitted_elements_list)
    model = parser.get_model()

    uml_class_names = model.get_class_names()

    score = 0

    if not len(uml_class_names) > 1:
        if not uml_class_names[0] == "Enter text":
            score = 1
        else:
            score = 0
    else:
        score = 0

    data["score"] = score
