import prairielearn as pl

# Import class definitions and default values from the drawing element
defaults = pl.load_host_script("defaults.py")
elements = pl.load_host_script("elements.py")

# Elements
class Constraint(elements.BaseElement):
    def generate(element, data):
        """Sends attributes to client side js
        Returns:
            dictionary: attribute to send to client side js
        """
        options = {
            "coordinates": parseStringList(
                element.attrib["coordinates"].strip("][").split(", ")
            )
        }
        # element.attrib["constraint-type"]
        options.update(
            {"constraintType": pl.get_string_attrib(element, "constraint-type")}
        )
        if "key-id" in element.attrib:
            options.update({"keyID": int(pl.get_string_attrib(element, "key-id"))})
            if "above" in element.attrib:
                options.update({"above": int(element.attrib["above"])})
            else:
                error_message = "If 'key-id' is specified for any pl-constraint, a true/false value for 'above' must also be specified."
                raise ValueError(error_message)

        if "static" in element.attrib:
            options.update({"static": pl.get_string_attrib(element, "static")})
        return options

    def get_attributes():
        """gets list of attributes for the element
        Returns:
            list: list of attributes
        """
        return ["constraint-type", "coordinates", "key-id", "above", "static"]


def parseStringList(stringList):
    intList = []

    for string in stringList:
        intList.append(int(string))
    return intList


elements = {}
elements["pl-constraint"] = Constraint
