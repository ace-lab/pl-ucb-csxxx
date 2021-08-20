import prairielearn as pl

# Import class definitions and default values from the drawing element
defaults = pl.load_host_script("defaults.py")
elements = pl.load_host_script("elements.py")


class UMLText(elements.BaseElement):
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
        options.update({"fontSize": int(element.attrib["font-size"])})
        options.update({"startingText": element.attrib["starting-text"]})
        options.update({"textType": element.attrib["text-type"]})

        return options

    def get_attributes():
        """gets list of attributes for the element
        Returns:
            list: list of attributes
        """
        return ["coordinates", "font-size", "starting-text", "text-type"]


def parseStringList(stringList):
    intList = []

    for string in stringList:
        intList.append(int(string))
    return intList


elements = {}
elements["pl-uml-text"] = UMLText
