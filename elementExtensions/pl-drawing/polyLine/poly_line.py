import json

import prairielearn as pl

# Import class definitions and default values from the drawing element
defaults = pl.load_host_script("defaults.py")
elements = pl.load_host_script("elements.py")


class PolyLine(elements.BaseElement):
    def generate(element, data):
        """Sends attributes to client side js
        Returns:
            dictionary: attribute to send to client side js
        """
        options = {}

        if "uml-line-type" in element.attrib:
            options.update(
                {"umlLineType": pl.get_string_attrib(element, "uml-line-type")}
            )
            overwrite_attribs_by_uml_line_type(
                element.attrib["uml-line-type"], element.attrib
            )
        else:
            options.update({"umlLineType": "normal_line"})

        # If user did not set init postion of init nodes
        if "nodes" in element.attrib:
            nodes_string = pl.get_string_attrib(element, "nodes").replace("'", '"')
            options.update({"nodes": json.loads(nodes_string)})
        else:
            nodes = [
                {"left": 200, "top": 200},
                {"left": 340, "top": 200},
                {"left": 380, "top": 200},
            ]
            options.update({"nodes": nodes})

        if "end-one-shape" in element.attrib:
            options.update(
                {"end1Shape": pl.get_string_attrib(element, "end-one-shape")}
            )
        else:
            options.update({"end1Shape": "circle"})

        if "end-two-shape" in element.attrib:
            options.update(
                {"end2Shape": pl.get_string_attrib(element, "end-two-shape")}
            )
        else:
            options.update({"end2Shape": "circle"})

        if "end-one-fill" in element.attrib:
            options.update({"end1Fill": pl.get_string_attrib(element, "end-one-fill")})
        else:
            if options["end1Shape"] != "arrow":
                options.update({"end1Fill": "black"})
            else:
                options.update({"end1Fill": " "})

        if "end-two-fill" in element.attrib:
            options.update({"end2Fill": pl.get_string_attrib(element, "end-two-fill")})
        else:
            if options["end2Shape"] != "arrow":
                options.update({"end2Fill": "black"})
            else:
                options.update({"end2Fill": " "})

        if "grid-size" in element.attrib:
            options.update({"gridSize": pl.get_float_attrib(element, "grid-size", 3)})
        else:
            options.update({"gridSize": 0})

        if "key-ids" in element.attrib:
            keys = parseStringList(
                pl.get_string_attrib(element, "key-ids").strip("][").split(", ")
            )
            options.update({"keyIDs": keys})
        elif "class-ids" in element.attrib and not element.attrib["class-ids"] == "":
            classes = parseStringList(
                pl.get_string_attrib(element, "class-ids").strip("][").split(", ")
            )
            options.update({"classIDs": classes})

        if "static" in element.attrib:
            options.update({"static": pl.get_string_attrib(element, "static")})

        if "dashed" in element.attrib:
            options.update({"dashed": pl.get_boolean_attrib(element, "dashed")})
        else:
            options.update({"dashed": False})

        return options

    def get_attributes():
        """gets list of attributes for the element
        Returns:
            list: list of attributes
        """
        return [
            "uml-line-type",
            "dashed",
            "nodes",
            "end-one-shape",
            "end-two-shape",
            "end-one-fill",
            "end-two-fill",
            "angle",
            "grid-size",
            "key-ids",
            "static",
            "class-ids",
        ]


def overwrite_attribs_by_uml_line_type(uml_line_type: str, element_attrib: dict):
    # Assign the correct attribute values given a uml line type
    element_attrib.update(uml_line_types[uml_line_type.lower()])

    # Erase any attributes set for the second end
    if "end-two-shape" in element_attrib:
        element_attrib.pop("end-two-shape")

    if "end-two-fill" in element_attrib:
        element_attrib.pop("end-two-fill")


def parseStringList(stringList):
    intList = []

    for string in stringList:
        try:
            intList.append(int(string))
        except ValueError:
            raise ValueError(string)
    return intList


uml_line_types = {
    "association": {"end-one-shape": "arrow", "end-one-fill": "", "dashed": "False"},
    "inheritance": {
        "end-one-shape": "triangle",
        "end-one-fill": "white",
        "dashed": "False",
    },
    "realization": {
        "end-one-shape": "triangle",
        "end-one-fill": "white",
        "dashed": "True",
    },
    "dependency": {"end-one-shape": "arrow", "end-one-fill": "", "dashed": "True"},
    "aggregation": {
        "end-one-shape": "diamond",
        "end-one-fill": "white",
        "dashed": "False",
    },
    "composition": {
        "end-one-shape": "diamond",
        "end-one-fill": "black",
        "dashed": "False",
    },
}


elements = {}
elements["pl-poly-line"] = PolyLine
