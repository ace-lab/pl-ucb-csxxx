import customElements.UMLclasses.uml_element_classes as element_classes
import customElements.UMLclasses.model as model


class UMLParser:
    def __init__(self, submitted_elements: list):
        self.submitted_elements = submitted_elements
        self.parsed_classes = {}
        self.parsed_connections = {}

        self.sorted_submitted_data = {
            "pl-uml-classs": {},
            "pl-constraints": {},
            "pl-poly-lines": {},
        }

        self.__parse_raw_submitted_data()
        self.__parse_uml_classes()
        self.__make_connection_objects()
        self.__parse_connections()
        self.__parse_constraints()

    def __parse_raw_submitted_data(self):
        for element in self.submitted_elements:
            element_grading_name = element["gradingName"]
            self.sorted_submitted_data[element_grading_name + "s"].update(
                {element["id"]: element}
            )

    def __parse_uml_classes(self):
        uml_class_elements = self.sorted_submitted_data["pl-uml-classs"]

        for scheme_id in uml_class_elements.keys():
            scheme_element = uml_class_elements[scheme_id]
            attributes = scheme_element["attributes"]
            methods = scheme_element["methods"]

            scheme = element_classes.UMLClass(scheme_element["className"])
            scheme.set_attributes(attributes)
            scheme.set_methods(methods)

            self.parsed_classes.update({scheme_id: scheme})

    def __parse_constraints(self):
        constraint_elements = self.sorted_submitted_data["pl-constraints"]

        for constraint_id in constraint_elements.keys():
            constraint_element = constraint_elements[constraint_id]
            constraint_type = element_classes.Constraint(
                constraint_element["constraintType"]
            )

            if (
                "snapData" in constraint_element
                and constraint_element["snapData"] is not None
            ):
                constraint_snap_data = constraint_element["snapData"]
                snapped_line_id = constraint_snap_data["id"]
                side = constraint_element["snapData"]["endpoint"]

                connection_obj = self.parsed_connections[snapped_line_id]
                connection_obj.set_constraint_at(side, constraint_type)

    def __parse_connections(self):
        line_elements = self.sorted_submitted_data["pl-poly-lines"]
        connection_objs = self.parsed_connections

        for line_id in line_elements.keys():
            line_element = line_elements[line_id]
            connection = connection_objs[line_id]
            if "snapData" in line_element and line_element["snapData"] is not None:
                for side, object_id in enumerate(line_element["snapData"]):
                    if object_id != None:
                        uml_class_snapped_to = self.parsed_classes[object_id]
                        connection.set_object_at(side, uml_class_snapped_to)

    def __make_connection_objects(self):
        line_elements = self.sorted_submitted_data["pl-poly-lines"]
        for line_id in line_elements.keys():
            line_element = line_elements[line_id]

            line_attributes = {
                "vertices": line_element["nodes"],
                "uml_line_type": line_element["umlLineType"],
                "endpoint_1_shape": line_element["end1Shape"],
                "endpoint_2_shape": line_element["end2Shape"],
                "endpoint_1_fill": line_element["end1Fill"],
                "endpoint_2_fill": line_element["end2Fill"],
                "dashed": bool(int(line_element["dashed"])),
            }

            self.parsed_connections.update(
                {line_id: element_classes.Connection(**line_attributes)}
            )

    def get_model(self):
        return model.Model(
            list(self.parsed_classes.values()),
            list(self.parsed_connections.values()),
            self.sorted_submitted_data,
        )
