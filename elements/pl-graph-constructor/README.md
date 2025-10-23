# pl-graph-constructor for PrairieLearn

## Overview
`pl-graph-constructor` is a custom interactive element for PrairieLearn which enables students to construct graphs in a drag-and-drop interface and converts the student-entered graph into a DOT-language form to facilitate autograding.

## Description
The element provides the student with an empty canvas in which they will construct a graph. This graph can either be graded using pre- or self-defined methods, or the canvas can serve as a sketching element for the student.

In either case, a student can create nodes simply by clicking on the location at which they want to create the node. Edges can be created by selecting the node at which the edge originates and dragging toward the next node. There is a detailed description of tool usage for students under each instance of the Graph Constructor.

## Usage

### 1. Include the Element in Your Question
Embed the custom element tag `<pl-graph-constructor>` in your question HTML file. The XML should look like this:

```xml
<pl-graph-constructor 
    answers-name="graph_input1" 
    directed="true" 
    allow-selflinks="true" 
    multigraph="true" 
    allow-nodemarking="true"
    parser="dot">
</pl-graph-constructor>
```


### 2. Set Attributes
Customize the behavior and appearance of the element using XML attributes. The element supports a variety of attributes to cater to different question types and requirements:

- `answers-name`: **String**. Specifies the name associated with the PL Graph Creator instance. This will be included as the graph name in the exported DOT-string. Therefore, only alphanumeric characters and underscores are allowed.
- `directed`: **Boolean**. Specify whether the graph a student draws is directed or undirected.
- `parser`: **String**. Specify how the student graph is received in the `server.py`. Defaults to:
  - `"dot"`: Get the [DOT code](https://graphviz.org/doc/info/lang.html) of the submitted graph.
  - `"dict"`: Receive a string version of a tuple dictionary, explaining the structure of the submitted graph. Example:
    ```python
    dict_values(['A', 'B', 'C', 'B']), {('C', 'A', '2'), ('C', 'B', '3')}
    ```
- `allow-selflinks`: **Boolean**. Specifies whether the graph a student draws can have an edge (a link) between a node and itself. Default: `true`.
- `multigraph`: **Boolean**. Specifies whether the graph a student draws can have multiple edges (links) between the same two nodes. If true, this is allowed; if false, at most one edge can be between each pair of nodes. Default: `true`.
- `allow-nodemarking`: **Boolean**. Specifies whether students can mark nodes in the graph by double-clicking a node. These nodes will appear as having a doubled boundary. Default: `true`.

### 3. Add a `server.py` File
Determine how you want to grade the question.

- If you are using the `"dot"` parser, receive your graph's DOT code using:
  ```python
  student_dot = data['submitted_answers'].get('graphData', '')
   ```
- If you choose to use the `"dict"` parser, you will already have a preprocessed version of the graph to work with.

We strongly recommend checking out our **"Study question 0: Tutorial"** in the `Graph-Construction-Q1` folder for the `server.py`. It contains two very useful helpers you can use in your grading:

#### 1. `parse_dot`
- A function that takes the DOT code of the graph and parses it into the `"dict"` form.
- This makes it easier to grade for specific structural parts of the graph or identify desired properties.

#### 2. `graph_distance`
- A function that takes two `"dict"`-formatted graphs and returns multiple useful difference metrics, such as:
  - **`node_diff`**: Number of different nodes.
  - **`edge_diff`**: Number of different edges.
  - **`edge_mismatch`**: Number of edge label mismatches.
  - **`node_label_mismatch`**: Number of node label mismatches.
  - **`total_distance`**: Total of all differences between the two graphs (useful for evaluating overall similarity).

#### Recommended Use
- Use `parse_dot(student_dot)` or the direct `"dict"` form of the student’s graph alongside the `"dict"` form of the correct graph in `graph_distance` to calculate how far the student is from the correct answer.
- Alternatively, we recommend using the [NetworkX Python library](https://networkx.org/) or your preferred graph library for more complex grading schemes. Many libraries provide advanced tools to manipulate or evaluate graphs, catering to specific needs.

---

## Project Progress Slide Deck
For detailed updates on this tool's development, check out our [Project Progress Slide Deck](https://docs.google.com/presentation/d/1SkArctLa5vL14UhI9kjoltAFjjmip4KYLXfPLw8k4Ho/edit?usp=sharing).

---

## Potential Applications in UC Berkeley Courses
The PL Graph Creator is a versatile tool applicable to various graph-related topics in UC Berkeley's curriculum. Below are some classes and topics where this tool can provide significant value:

### CS 170 (Efficient Algorithms and Intractable Problems)
Dive into advanced topics like BFS, DFS, MSTs, planar graph analysis, graph coloring, strongly connected components (SCCs), network flows, and bipartite matching.

### CS 61B (Data Structures)
Explore foundational graph algorithms like Breadth-First Search (BFS), Depth-First Search (DFS), Minimum Spanning Trees (MSTs), and Weighted Quick Union.

### CS 70 (Discrete Mathematics and Probability Theory)
Facilitate graph proofs, study Markov Chains, analyze planar graphs, and construct hypercubes.

### CS 61C (Machine Structures)
Design Finite State Machines (FSMs) and Sequential Digital Systems (SDSs).

This list represents just a fraction of the potential applications. The PL Graph Creator is highly adaptable and can support any graph-like structures, making it a valuable tool for a wide range of scenarios.

---

## Example Questions
The `questions` folder includes a variety of example questions for reference:

- **Graph-Construction-QX**  
  A series of questions (`X` ranges from 1 to 5) used during our studies, showcasing the tool's core functionality.

- **SCC and Residual-Graph**  
  Advanced examples based on real CS 170 discussion questions, demonstrating the tool's application in complex scenarios such as strongly connected components (SCCs) and residual graph construction.

  ## Expected Outcome

Below is a screenshot demonstrating the expected outcome of running the `Graph-Construction-Q1`. This includes the following XML configuration:

```xml
<pl-graph-constructor 
    answers-name="graph_input1" 
    directed="true" 
    allow-selflinks="true" 
    multigraph="true" 
    allow-nodemarking="true">
</pl-graph-constructor>
```

[Expected Output](../../questions/Graph-Construction-Q1/Q1.png)



