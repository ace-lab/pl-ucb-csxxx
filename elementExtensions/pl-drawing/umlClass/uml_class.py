import numpy as np
import prairielearn as pl

# Import class definitions and default values from the drawing element
defaults = pl.load_host_script("defaults.py")
elements = pl.load_host_script("elements.py")


class UmlClass(elements.BaseElement):
    def generate(element, data):
        """Sends attributes to client side js
        Returns:
            dictionary: attribute to send to client side js
        """
        options = {
            "width": pl.get_float_attrib(element, "width", 3)
            if "width" in element.attrib
            else 200,
            "height": pl.get_float_attrib(element, "width", 3)
            if "width" in element.attrib
            else 100,
            "className": pl.get_string_attrib(element, "class-name"),
            "top": pl.get_float_attrib(element, "top", 3)
            if "top" in element.attrib
            else 100,
            "left": pl.get_float_attrib(element, "left", 3)
            if "left" in element.attrib
            else 100,
            "selectable": pl.get_boolean_attrib(element, "selectable")
            if "selectable" in element.attrib
            else True,
            "umlTextFont": pl.get_float_attrib(element, "uml-text-font", 3)
            if "uml-text-font" in element.attrib
            else 15,
        }

        if "grid-size" in element.attrib:
            options.update({"gridSize": pl.get_float_attrib(element, "grid-size", 3)})
        else:
            options.update({"gridSize": 0})

        if "starting-attributes" in element.attrib:
            options.update(
                {
                    "startingAttributes": element.attrib["starting-attributes"]
                    .strip("']['")
                    .split("', '")
                }
            )
            if "start-attr-editable" in element.attrib:
                options.update(
                    {
                        "startAttrEditable": pl.get_boolean_attrib(
                            element, "start-attr-editable"
                        )
                    }
                )
            else:
                options.update({"startAttrRemoveble": False})

        if "starting-methods" in element.attrib:
            options.update(
                {
                    "startingMethods": element.attrib["starting-methods"]
                    .strip("']['")
                    .split("', '")
                }
            )
            if "start-mthd-editable" in element.attrib:
                options.update(
                    {
                        "startMthdEditable": pl.get_boolean_attrib(
                            element, "start-mthd-editable"
                        )
                    }
                )
            else:
                options.update({"startMthdRemoveble": False})

        if "class-name-editable" in element.attrib:
            options.update(
                {
                    "classNameEditable": pl.get_boolean_attrib(
                        element, "class-name-editable"
                    )
                }
            )
        else:
            options.update({"classNameEditable": False})

        return options

    def get_attributes():
        """gets list of attributes for the element
        Returns:
            list: list of attributes
        """
        return [
            "width",
            "height",
            "class-name",
            "top",
            "left",
            "starting-attributes",
            "starting-methods",
            "uml-text-font",
            "start-attr-editable",
            "start-mthd-editable",
            "class-name-editable",
            "grid-size",
            "selectable",
        ]


elements = {}
elements["pl-uml-class"] = UmlClass
