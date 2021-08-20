<!-- markdownlint-disable -->

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L0"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

# <kbd>module</kbd> `uml_element_classes.py`






---

## <kbd>class</kbd> `Connection`
This class represents a line placed on the canvas. 

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L233"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `__init__`

```python
__init__(
    vertices: list = [],
    uml_line_type=<UmlLine.NORMAL_LINE: 'normal_line'>,
    endpoint_1_shape='circle',
    endpoint_2_shape='circle',
    endpoint_1_fill='black',
    endpoint_2_fill='black',
    dashed=False
)
```



**Args:**
 
 - <b>`vertices`</b> (list):  vertices of line object 
 - <b>`uml_line_type`</b> (str, optional):  UML line type, see UmlLine. Defaults to None. 
 - <b>`endpoint_1_shape`</b> (str, optional):  shape of endpoint one. Defaults to "circle". 
 - <b>`endpoint_2_shape`</b> (str, optional):  shape of endpoint two. Defaults to "circle". 
 - <b>`endpoint_1_fill`</b> (str, optional):  fill of endpoint one. Defaults to "black". 
 - <b>`endpoint_2_fill`</b> (str, optional):  fill of endpoint two. Defaults to "black". 
 - <b>`dashed`</b> (bool, optional):  flag for dashed line. Defaults to False. 




---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L458"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_connected_object_count`

```python
get_connected_object_count()
```

Gets connected object count. 



**Returns:**
 
 - <b>`(int)`</b>:  Amount of connected objects in connection. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L398"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_constraint_at`

```python
get_constraint_at(side: int)
```

Gets constraint object at endpoint side.  Throws error if objct does not exist. 

**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 



**Returns:**
 
 - <b>`(Constraint)`</b>:  constraint at endpoint 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L450"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_constraint_count`

```python
get_constraint_count()
```

Gets the amount of constraints on connection. 



**Returns:**
 
 - <b>`(int)`</b>:  Amount of constraint on connection. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L385"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_constraints`

```python
get_constraints()
```

Gets list of constraint 



**Returns:**
 
 - <b>`(list)`</b>:  list of constraints 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L356"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_endpoints`

```python
get_endpoints()
```

Gets endpoints. 



**Returns:**
 
 - <b>`(list)`</b>:  Connection endpoints. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L431"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_fill_at`

```python
get_fill_at(side: int)
```

Gets fill at endpoint. 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 



**Returns:**
 
 - <b>`(str)`</b>:  fill of endpoint. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L409"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_object_at`

```python
get_object_at(side: int)
```

Gets constraint object at endpoint side.  Throws error if object does not exist. 

**Args:**
 
 - <b>`side`</b> (int):  [description] 



**Returns:**
 
 - <b>`(object)`</b>:  object connected at endpoint. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L364"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_objects`

```python
get_objects()
```

Gets connected objects 



**Returns:**
 
 - <b>`(list)`</b>:  list of connected objects. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L420"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_shape_at`

```python
get_shape_at(side: int)
```

Gets shape type endpoint side. 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 



**Returns:**
 
 - <b>`(dict)`</b>:  object connected at endpoint. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L442"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_uml_line_type`

```python
get_uml_line_type()
```

Gets UML line type. 



**Returns:**
 
 - <b>`(UmlLine)`</b>:  UML line type of connection. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L377"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_vertices`

```python
get_vertices()
```

Gets vertices 



**Returns:**
 
 - <b>`(list)`</b>:  vertices 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L466"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_vertices_count`

```python
get_vertices_count()
```

Gets the amount of vertices 



**Returns:**
 
 - <b>`(int)`</b>:  amount of vertices 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L553"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_connection_complete`

```python
is_connection_complete()
```

Checks if a connection has two objects connected 



**Returns:**
 
 - <b>`(bool)`</b>:  True if equal, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L509"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_constraint_at_equal`

```python
is_constraint_at_equal(side: int, other_endpoint: dict)
```

Checks if two endpoints share the same constraint type 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 
 - <b>`other_endpoint`</b> (dict):  Endpoint of a connection. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if equal, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L561"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_constraint_valid_at`

```python
is_constraint_valid_at(side: int)
```

Checks if an constraint exist at an endpoint 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if exist, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L545"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_dashed`

```python
is_dashed()
```

Checks if this connection is dashed 



**Returns:**
 
 - <b>`(bool)`</b>:  True if dashed, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L474"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_endpoint_at_equal`

```python
is_endpoint_at_equal(side: int, other_endpoint: dict)
```

Checks if an endpoint at an index is exactly equal to another Checks object connected, constraint, shape, and fill 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 
 - <b>`other_endpoint`</b> (dict):  Endpoint of a connection. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if equal, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L533"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_fill_at_equal`

```python
is_fill_at_equal(side: int, other_endpoint: dict)
```

Checks if endpoint at side share the same fill. 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 
 - <b>`other_endpoint`</b> (dict):  Endpoint of a connection. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if equal, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L497"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_object_at_equal`

```python
is_object_at_equal(side: int, other_endpoint: dict)
```

Checks if two endpoints share the same connected object 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 
 - <b>`other_endpoint`</b> (dict):  Endpoint of a connection. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if equal, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L575"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_object_valid_at`

```python
is_object_valid_at(side: int)
```

Checks if an object exist at an endpoint 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if exist, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L521"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `is_shape_at_equal`

```python
is_shape_at_equal(side: int, other_endpoint: dict)
```

Checks if two endpoints share the same shape 



**Args:**
 
 - <b>`side`</b> (int):  side of endpoint. 
 - <b>`other_endpoint`</b> (dict):  Endpoint of a connection. 



**Returns:**
 
 - <b>`(bool)`</b>:  True if equal, False otherwise 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L341"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `set_constraint_at`

```python
set_constraint_at(side: int, constraint: Constraint)
```

Sets a constraint at an endpoint 

**Args:**
 
 - <b>`side`</b> (int):  endpoint side. 
 - <b>`constraint`</b> (Constraint):  constraint. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L333"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `set_object_at`

```python
set_object_at(side: int, object: object)
```

Sets a connected object at an endpoint 

**Args:**
 
 - <b>`side`</b> (int):  endpoint side. 
 - <b>`object`</b> (any):  connected object. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L349"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `set_uml_line_type`

```python
set_uml_line_type(uml_line_type: UmlLine)
```

Sets uml line type for connection 

**Args:**
 
 - <b>`uml_line_type`</b> (UmlLine):  Type of uml line 


---

## <kbd>class</kbd> `Constraint`
Enumeration of contraint types ONE_TO_ONE = "1..1" ONE_TO_MANY = "1..*" ZERO_TO_ONE = "0..1" ZERO_TO_MANY = "0..*" 





---

## <kbd>class</kbd> `UMLClass`
This class represents a UML Class. 

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L48"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `__init__`

```python
__init__(class_name: str)
```

UMLClass constructor 



**Args:**
 
 - <b>`class_name`</b> (str):  Name of class. 




---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L128"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_attribute_count`

```python
get_attribute_count()
```

Gets UML class attribute count. 



**Returns:**
 
 - <b>`(int)`</b>:  UML class attribute count. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L173"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_attribute_duplicates`

```python
get_attribute_duplicates()
```

Gets UML class attribute duplicates. 



**Returns:**
 
 - <b>`(list)`</b>:  UML class attribute duplicates. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L110"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_attributes`

```python
get_attributes()
```

Gets UML class attributes. 



**Returns:**
 
 - <b>`(list)`</b>:  UML class methods. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L211"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_debug_str`

```python
get_debug_str()
```

Gets debug string. 



**Returns:**
 
 - <b>`(str)`</b>:  Debug string. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L136"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_method_count`

```python
get_method_count()
```

Gets UML class method count. 



**Returns:**
 
 - <b>`(int)`</b>:  UML class method count. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L192"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_method_duplicates`

```python
get_method_duplicates()
```

Gets UML class method duplicates. 



**Returns:**
 
 - <b>`(list)`</b>:  UML class method duplicates. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L119"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_methods`

```python
get_methods()
```

Gets UML class methods. 



**Returns:**
 
 - <b>`(list)`</b>:  UML class methods. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L102"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_name`

```python
get_name()
```

Gets class name 



**Returns:**
 
 - <b>`(str)`</b>:  Class name. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L144"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_unique_attributes`

```python
get_unique_attributes()
```

Gets all unique UML class attributes. 



**Returns:**
 
 - <b>`(list)`</b>:  all unique UML class attributes. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L159"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `get_unique_methods`

```python
get_unique_methods()
```

Gets all unique UML class methods. 



**Returns:**
 
 - <b>`(list)`</b>:  all unique UML class methods. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L86"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `set_attributes`

```python
set_attributes(attributes: list)
```

Sets UML class attributes. 



**Args:**
 
 - <b>`attributes`</b> (list):  UML class attributes. 

---

<a href="../serverFilesCourse/customElements/UMLclasses/uml_element_classes.py#L94"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square"></a>

### <kbd>function</kbd> `set_methods`

```python
set_methods(methods: list)
```

Sets UML class methods. 



**Args:**
 
 - <b>`methods`</b> (list):  UML class methods. 


---

## <kbd>class</kbd> `UmlLine`
Enumeration of UML line types ASSOCIATION = "association" INHERITANCE = "inheritance" REALIZATION = "realization" DEPENDENCY = "dependency" AGGREGATION = "aggregation" COMPOSITION = "composition" NORMAL_LINE = "normal_line" 







---

_This file was automatically generated via [lazydocs](https://github.com/ml-tooling/lazydocs)._
