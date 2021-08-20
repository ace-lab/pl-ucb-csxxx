# Overview
The UML drawing elements are custom elements made on top of FabricJS and PL's drawing API. The main feature in the UML elements is the ability to snap and unsnap elements from eachother. After submission of a canvas, the snap data of the elements are sent back to `server.py` as a dict object.

## Tutorials
There are a few tutorials that are designed for the programmer and a student. The student can learn to use controls, and the programmer can learn to grade a question.

## Parsing
There is a parser provided which turn the raw submitted data into element Python objects. The parser has the ability to compile these objects into a UML Model object. You do not need to use the parser, but it is recommended. If you decide to make your own parser, you can find the useful raw data that is submitted by the student here.

## Grading
Once the submitted data is parsed, you will have a UML Model object which can be used for grading. This object will hold all of the individual objects on the canvas as element Python objects. The element Python objects contain various functions to help you grade. 

You can find the docs for the Python element classes [here](https://github.com/ace-lab/pl-csulb-cecs323/blob/drawing-elements-dev/serverFilesCourse/docs/uml_element_classes.py.md).

Unfortunately, there was not enough time to create the DocStrings for the UML Model class, but it is a relatively easy class to understand.
The file can be found here.

## Usage question.html
You can use the UML elements in a question like so: https://github.com/ace-lab/pl-ucb-csxxx/blob/631de1fdbe2b6651af502aeb8681f0192fd6a3d7/questions/drawing-tutorials/snapping-2/question.html#L10-L36

Here are the attributes that can be assigned in the css for each element:


## Usage server.py
Use the tutorials as a guide for grading. Each tutorial will cover a different test you can run to grade. These do not cover every kind of grading you can do, but it shows most of the main tools. You can check out the functions in the element and the UML model classes for ideas.

## Things left to do
To make for a better user experience, the line button svg files should change according to the uml line type. This can be done here: 

the uml line type can be accessed using `options.umlLineType`
