from enum import Enum

class Constraint(Enum):
    """Enumeration of contraint types
        ONE_TO_ONE = "1..1"
        ONE_TO_MANY = "1..*"
        ZERO_TO_ONE = "0..1"
        ZERO_TO_MANY = "0..*"
    """
    ONE_TO_ONE = "1..1"
    ONE_TO_MANY = "1..*"
    ZERO_TO_ONE = "0..1"
    ZERO_TO_MANY = "0..*"

    def __str__(self):
        return self.value

    def __eq__(self, str_constraint: str):
        copy_of_str = str(str_constraint).strip("?")
        return copy_of_str in str(self.value)


class UmlLine(Enum):
    """Enumeration of UML line types
        ASSOCIATION = "association"
        INHERITANCE = "inheritance"
        REALIZATION = "realization"
        DEPENDENCY = "dependency"
        AGGREGATION = "aggregation"
        COMPOSITION = "composition"
        NORMAL_LINE = "normal_line"

    """
    ASSOCIATION = "association"
    INHERITANCE = "inheritance"
    REALIZATION = "realization"
    DEPENDENCY = "dependency"
    AGGREGATION = "aggregation"
    COMPOSITION = "composition"
    NORMAL_LINE = "normal_line"


class UMLClass:
    """This class represents a UML Class."""

    def __init__(self, class_name: str):
        """UMLClass constructor

        Args:
            class_name (str): Name of class.
        """
        self.class_name = class_name

    def __str__(self):
        """

        Returns:
            (str): UML class str.
        """
        return self.class_name

    def __eq__(self, other: object):
        """

        Args:
            other (object): Other UML class.

        Returns:
            (bool): True if equal, False otherwise.
        """
        return self.class_name == other.class_name

    def __ne__(self, other: object):
        """

        Args:
            other (object): Other UML class.

        Returns:
            (bool): True if equal, False otherwise.
        """
        return not self.__eq__(other)

    def set_attributes(self, attributes: list):
        """Sets UML class attributes.

        Args:
            attributes (list): UML class attributes.
        """
        self.attributes = attributes

    def set_methods(self, methods: list):
        """Sets UML class methods.

        Args:
            methods (list): UML class methods.
        """
        self.methods = methods

    def get_name(self):
        """Gets class name

        Returns:
            (str): Class name.
        """
        return self.class_name

    def get_attributes(self):
        """Gets UML class attributes.

        Returns:
            (list): UML class methods.
        """

        return self.attributes

    def get_methods(self):
        """Gets UML class methods.

        Returns:
            (list): UML class methods.
        """

        return self.methods

    def get_attribute_count(self):
        """Gets UML class attribute count.

        Returns:
            (int): UML class attribute count.
        """
        return len(self.get_attributes())

    def get_method_count(self):
        """Gets UML class method count.

        Returns:
            (int): UML class method count.
        """
        return len(self.get_methods())

    def get_unique_attributes(self):
        """Gets all unique UML class attributes.

        Returns:
            (list): all unique UML class attributes.
        """

        unique_attributes = []

        for attrib in self.attributes:
            if attrib not in unique_attributes:
                unique_attributes.append(attrib)

        return unique_attributes

    def get_unique_methods(self):
        """Gets all unique UML class methods.

        Returns:
            (list): all unique UML class methods.
        """
        unique_methods = []

        for mthd in self.methods:
            if mthd not in unique_methods:
                unique_methods.append(mthd)

        return unique_methods

    def get_attribute_duplicates(self):
        """Gets UML class attribute duplicates.

        Returns:
            (list): UML class attribute duplicates.
        """
        duplicate_attributes = []
        attribute_count = self.get_attribute_count()

        for i in range(attribute_count):
            for j in range(i + 1, attribute_count):
                if (
                    self.attributes[i] == self.attributes[j]
                    and self.attributes[i] not in duplicate_attributes
                ):
                    duplicate_attributes.append(self.attributes[i])

        return duplicate_attributes

    def get_method_duplicates(self):
        """Gets UML class method duplicates.

        Returns:
            (list): UML class method duplicates.
        """
        duplicate_methods = []
        method_count = self.get_method_count()

        for i in range(method_count):
            for j in range(i + 1, method_count):
                if (
                    self.methods[i] == self.methods[j]
                    and self.methods[i] not in duplicate_methods
                ):
                    duplicate_methods.append(self.methods[i])

        return duplicate_methods

    def get_debug_str(self):
        """Gets debug string.

        Returns:
            (str): Debug string.
        """
        uml_class_str = "==========" + str(self.class_name) + "==========\n"

        uml_class_str += "=====Attributes=====\n"
        for attribute in self.get_attributes():
            uml_class_str += "  " + str(attribute) + "\n"

        uml_class_str += "=====Methods=====\n"
        for method in self.get_methods():
            uml_class_str += "  " + str(method) + "\n"

        return uml_class_str


class Connection:
    """This class represents a line placed on the canvas."""

    def __init__(
        self,
        vertices: list = [],
        uml_line_type=UmlLine.NORMAL_LINE,
        endpoint_1_shape="circle",
        endpoint_2_shape="circle",
        endpoint_1_fill="black",
        endpoint_2_fill="black",
        dashed=False,
    ):
        """

        Args:
            vertices (list): vertices of line object
            uml_line_type (str, optional): UML line type, see UmlLine. Defaults to None.
            endpoint_1_shape (str, optional): shape of endpoint one. Defaults to "circle".
            endpoint_2_shape (str, optional): shape of endpoint two. Defaults to "circle".
            endpoint_1_fill (str, optional): fill of endpoint one. Defaults to "black".
            endpoint_2_fill (str, optional): fill of endpoint two. Defaults to "black".
            dashed (bool, optional): flag for dashed line. Defaults to False.
        """

        self.vertices = vertices
        self.endpoints = [
            {"shape": endpoint_1_shape, "fill": endpoint_1_fill, "constraint": None},
            {"shape": endpoint_2_shape, "fill": endpoint_2_fill, "constraint": None},
        ]

        self.dashed = dashed
        self.uml_line_type = UmlLine(uml_line_type)

    def __str__(self):
        """
        Returns:
            (str): connection string
        """
        connection_str = "Connection<<" + str(self.uml_line_type) + ">>:"
        for i, endpoint in enumerate(self.endpoints):
            connection_str += " " + str(endpoint["shape"])
            connection_str += " fill='" + str(endpoint["fill"]) + "'   "
            if "object" in endpoint:
                connection_str += str(endpoint["object"]) + " "
            if "constraint" in endpoint:
                connection_str += str(endpoint["constraint"]) + " "

            if i < 1:
                connection_str += "  <-->  "

        return connection_str

    def __eq__(self, other_connection: object):
        """
        Args:
            other_connection (Connection): right operand connection object.

        Returns:
            (bool): True if equal, False otherwise
        """
        equal_count = 0

        if (
            self.uml_line_type == other_connection.uml_line_type
            and not self.uml_line_type == UmlLine.NORMAL_LINE
        ):
            for side in range(len(self.endpoints)):
                other_endpoint = other_connection.endpoints[side]
                try:
                    if self.is_endpoint_at_equal(side, other_endpoint):
                        equal_count += 1
                except:
                    pass

            equal_count += 1
        else:
            for side in range(len(self.endpoints)):
                for other_endpoint in other_connection.endpoints:
                    try:
                        if self.is_endpoint_at_equal(side, other_endpoint):
                            equal_count += 1
                    except:
                        pass

            if self.dashed == other_connection.dashed:
                equal_count += 1

        if equal_count >= 3:
            return True

        return False

    def __ne__(self, other_connection: object):
        """
        Args:
            other_connection (Connection): right operand connection object.

        Returns:
            (bool): True if not equal, False otherwise
        """
        return not self.__eq__(other_connection)

    def set_object_at(self, side: int, object: object):
        """Sets a connected object at an endpoint
        Args:
            side (int): endpoint side.
            object (any): connected object.
        """
        self.endpoints[side].update({"object": object})

    def set_constraint_at(self, side: int, constraint: Constraint):
        """Sets a constraint at an endpoint
        Args:
            side (int): endpoint side.
            constraint (Constraint): constraint.
        """
        self.endpoints[side].update({"constraint": constraint})

    def set_uml_line_type(self, uml_line_type: UmlLine):
        """Sets uml line type for connection
        Args:
            uml_line_type (UmlLine): Type of uml line
        """
        self.uml_line_type = uml_line_type

    def get_endpoints(self):
        """Gets endpoints.

        Returns:
            (list): Connection endpoints.
        """
        return self.endpoints

    def get_objects(self):
        """Gets connected objects

        Returns:
            (list): list of connected objects.
        """
        connectedObjects = []
        for i in range(2):
            if self.is_object_valid_at(i):
                connectedObjects.append(self.endpoints[i]["object"])

        return connectedObjects

    def get_vertices(self):
        """Gets vertices

        Returns:
            (list): vertices
        """
        return self.vertices

    def get_constraints(self):
        """Gets list of constraint

        Returns:
            (list): list of constraints
        """
        constraints = []
        for i in range(2):
            if self.is_constraint_valid_at(i):
                constraints.append(self.endpoints[i]["constraint"])

        return constraints

    def get_constraint_at(self, side: int):
        """Gets constraint object at endpoint side.
            Throws error if objct does not exist.
        Args:
            side (int): side of endpoint.

        Returns:
            (Constraint): constraint at endpoint
        """
        return self.endpoints[side]["constraint"]

    def get_object_at(self, side: int):
        """Gets constraint object at endpoint side.
            Throws error if object does not exist.
        Args:
            side (int): [description]

        Returns:
            (object): object connected at endpoint.
        """
        return self.endpoints[side]["object"]

    def get_shape_at(self, side: int):
        """Gets shape type endpoint side.

        Args:
            side (int): side of endpoint.

        Returns:
            (dict): object connected at endpoint.
        """
        return dict(self.endpoints[side]["shape"])

    def get_fill_at(self, side: int):
        """Gets fill at endpoint.

        Args:
            side (int): side of endpoint.

        Returns:
            (str): fill of endpoint.
        """
        return self.endpoints[side]["fill"]

    def get_uml_line_type(self):
        """Gets UML line type.

        Returns:
            (UmlLine): UML line type of connection.
        """
        return self.uml_line_type

    def get_constraint_count(self):
        """Gets the amount of constraints on connection.

        Returns:
            (int): Amount of constraint on connection.
        """
        return len(self.get_constraints())

    def get_connected_object_count(self):
        """Gets connected object count.

        Returns:
            (int): Amount of connected objects in connection.
        """
        return len(self.get_objects())

    def get_vertices_count(self):
        """Gets the amount of vertices

        Returns:
            (int): amount of vertices
        """
        return len(self.vertices)

    def is_endpoint_at_equal(self, side: int, other_endpoint: dict):
        """Checks if an endpoint at an index is exactly equal to another
        Checks object connected, constraint, shape, and fill

        Args:
            side (int): side of endpoint.
            other_endpoint (dict): Endpoint of a connection.

        Returns:
            (bool): True if equal, False otherwise
        """
        conn_constraint_equal = self.is_object_at_equal(
            side, other_endpoint
        ) and self.is_constraint_at_equal(side, other_endpoint)

        fill_and_shape_equal = (
            self.is_shape_at_equal(side, other_endpoint)
            and self.is_fill_at_equal(side, other_endpoint)
            if self.uml_line_type == UmlLine.NORMAL_LINE
            else True
        )
        return conn_constraint_equal and fill_and_shape_equal

    def is_object_at_equal(self, side: int, other_endpoint: dict):
        """Checks if two endpoints share the same connected object

        Args:
            side (int): side of endpoint.
            other_endpoint (dict): Endpoint of a connection.

        Returns:
            (bool): True if equal, False otherwise
        """
        return self.endpoints[side]["object"] == other_endpoint["object"]

    def is_constraint_at_equal(self, side: int, other_endpoint: dict):
        """Checks if two endpoints share the same constraint type

        Args:
            side (int): side of endpoint.
            other_endpoint (dict): Endpoint of a connection.

        Returns:
            (bool): True if equal, False otherwise
        """
        return self.endpoints[side]["constraint"] == other_endpoint["constraint"]

    def is_shape_at_equal(self, side: int, other_endpoint: dict):
        """Checks if two endpoints share the same shape

        Args:
            side (int): side of endpoint.
            other_endpoint (dict): Endpoint of a connection.

        Returns:
            (bool): True if equal, False otherwise
        """
        return self.endpoints[side]["shape"] == other_endpoint["shape"]

    def is_fill_at_equal(self, side: int, other_endpoint: dict):
        """Checks if endpoint at side share the same fill.

        Args:
            side (int): side of endpoint.
            other_endpoint (dict): Endpoint of a connection.

        Returns:
            (bool): True if equal, False otherwise
        """
        return self.endpoints[side]["fill"] == other_endpoint["fill"]

    def is_dashed(self):
        """Checks if this connection is dashed

        Returns:
            (bool): True if dashed, False otherwise
        """
        return self.dashed

    def is_connection_complete(self):
        """Checks if a connection has two objects connected

        Returns:
            (bool): True if equal, False otherwise
        """
        return self.get_connected_object_count() == 2

    def is_constraint_valid_at(self, side: int):
        """Checks if an constraint exist at an endpoint

        Args:
            side (int): side of endpoint.

        Returns:
            (bool): True if exist, False otherwise
        """
        try:
            return not (type(self.endpoints[side]["constraint"]) == None)
        except:
            return False

    def is_object_valid_at(self, side: int):
        """Checks if an object exist at an endpoint

        Args:
            side (int): side of endpoint.

        Returns:
            (bool): True if exist, False otherwise
        """
        try:
            return not (type(self.endpoints[side]["object"]) == None)
        except:
            return False
