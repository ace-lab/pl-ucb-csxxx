from customElements.UMLclasses.model import Model
from customElements.UMLclasses.parser import UMLParser
from customElements.UMLclasses.uml_element_classes import UmlLine


def grade(data):
    raw_submitted_elements_list = data["submitted_answers"]["uml_model"]
    parser = UMLParser(raw_submitted_elements_list)
    model = parser.get_model()

    uml_classes = model.get_uml_classes()

    score = 0

    if len(uml_classes) == 1:
        uml_class = uml_classes[0]

        if not uml_class.get_name() == "Enter Text":
            # Add point for changing name of uml class
            score += 1

        if len(uml_class.get_attributes()) == 2:
            # Add point for adding exactly 2 attribs
            score += 1

            if len(uml_class.get_attribute_duplicates()) == 0:
                # Add point for not having duplicates
                score += 1

        if len(uml_class.get_methods()) == 2:
            # Add point for adding exactly 2 methods
            score += 1

            if len(uml_class.get_method_duplicates()) == 0:
                # Add point for not having duplicates
                score += 1

    else:
        score = 0

    data["score"] = score / 5
