from customElements.UMLclasses.uml_element_classes import *

class Model:
    """Represents a UML model.
    """
    def __init__(self, uml_classes, connections, raw_elements: dict):
        self.uml_classes = uml_classes
        self.connections = connections
        self.raw_elements = raw_elements

    def __str__(self):
        model_str = ""
        for uml_class in self.uml_classes:
            model_str += str(uml_class) + " \n"

        for connection in self.connections:
            model_str += str(connection)

        return model_str

    def get_connections(self):
        """Gets the connections on the model.

        Returns:
            (list): List of contraints.
        """
        return self.connections

    def get_uml_classes(self):
        """Gets the UML classes on the model.

        Returns:
            (list): List of UML classes.
        """
        return self.uml_classes

    def get_incomplete_connection_count(self):
        """Gets the amount of incomplete connections on the model.

        Returns:
            (int): Amount of incomplete connections on model. 
        """
        incomplete_connections = 0
        for connection in self.connections:
            if not connection.is_connection_complete():
                incomplete_connections += 1

        return incomplete_connections

    def get_complete_connection_count(self):
        """Gets the amount of complete connections on model.

        Returns:
            (int): Amount of complete connections on model.
        """
        return len(self.get_connections()) - self.get_incomplete_connection_count()

    def get_floating_constraint_count(self):
        """Gets the amount of floating constraints on model.

        Returns:
            (int): Amount of floating constraints on model.
        """
        constrains_submitted_count = len(self.raw_elements["pl-constraints"].values())
        return constrains_submitted_count - self.get_snapped_constraint_count()

    def get_uml_class_count(self):
        """Gets the amount of UML classes on model.

        Returns:
            (int): Amount of UML classes on model.
        """
        return len(self.get_uml_classes)

    def get_connections_count(self):
        """Gets the total amount of connections on model.

        Returns:
            (int): Total amount of connections on model.
        """
        return len(self.get_connections())

    def get_snapped_constraint_count(self):
        """Gets the amount of constraints that are snapped to lines on model.

        Returns:
            (int): Amount of constraints that are snapped to lines on model.
        """
        snapped_constraints_count = 0
        for connection in self.connections:
            snapped_constraints_count += connection.get_constraint_count()

        return snapped_constraints_count

    def get_class_names(self):
        """Gets a list of all class names on model.

        Returns:
            (list): List of all class names on model.
        """
        return [uml_class.get_name() for uml_class in self.uml_classes]

    def get_uml_line_types(self):
        """Gets a list of every connection's UML line type.

        Returns:
            (list): list of every connection's UML line type.
        """
        return [conn.get_uml_line_type() for conn in self.connections]

    def __contains_connection(self, conn_to_check: Connection):
        """Checks if a connection matches another on the model.
            This checks if every part of the connection is the same.

        Args:
            conn_to_check (Connection): Other connection.

        Returns:
            (bool): True if complete match, false otherwise.
        """
        for connection in self.connections:
            if connection == conn_to_check:
                return True

        return False

    def contains_connection(
        self,
        uml_class_name_1: str,
        uml_class_name_2: str,
        connection_options: dict = {},
        constraint_1=None,
        constraint_2=None,
    ):
        """Checks if a connection is in the model.

        Args:
            uml_class_name_1 (str): Name of uml class one.
            uml_class_name_2 (str): Name of uml class two.
            connection_options (dict, optional): Line options, ex.{ dashed: , fill_1: , shape_2:  }. Defaults to {}.
            constraint_1 ([type], optional): Constraint on end one. Defaults to None.
            constraint_2 ([type], optional): Constraint on end two. Defaults to None.

        Returns:
            (bool): True if there is a match in the model, False otherwise.
        """
        uml_class_1 = UMLClass(uml_class_name_1)
        uml_class_2 = UMLClass(uml_class_name_2)

        connection_obj = Connection(**connection_options)
        connection_obj.set_object_at(0, uml_class_1)
        connection_obj.set_object_at(1, uml_class_2)

        if not constraint_1 == None:
            if type(constraint_1) == Constraint:
                connection_obj.set_constraint_at(0, constraint_1)
            else:
                connection_obj.set_constraint_at(0, Constraint(constraint_1))

        if not constraint_2 == None:
            if type(constraint_2) == Constraint:
                connection_obj.set_constraint_at(1, constraint_2)
            else:
                connection_obj.set_constraint_at(1, Constraint(constraint_2))

        return self.__contains_connection(connection_obj)

    def get_report(self):
        return {
            "floating_constraints_count": self.get_floating_constraint_count(),
            "snapped_constraint_count": self.get_snapped_constraint_count(),
            "complete_connections": self.get_complete_connection_count(),
            "incomplete_connections": self.get_incomplete_connection_count(),
            "uml_class_count": self.get_uml_class_count(),
        }
