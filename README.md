# **A Direct Manipulation User Interface for Constructing Autogradable Graphs**

## **Overview**
This project introduces **pl-graph-constructor**, a direct manipulation tool designed for **PrairieLearn** that enables students to construct and edit graphs using a **drag-and-drop interface**.  
The tool automatically converts the student-created graphs into **DOT-language format** or **Python dictionary** to support **autograding, instant feedback, and iterative resubmission** within PrarieLearn.

It addresses common challenges in graph-based assessments, such as manual grading errors and limited scalability, by providing a more accurate, engaging, and automatable environment for both students and instructors.

📢 **Presented at ACM CompEd 2025** — [Conference Website]([https://prairielearn.readthedocs.io/en/latest/install/](https://comped.acm.org/2025/))

📄 **Publication:** [A Direct Manipulation User Interface for Constructing Autogradable Graphs]([[https://prairielearn.readthedocs.io/en/latest/install/](https://comped.acm.org/2025/](https://dl.acm.org/doi/10.1145/3736251.3747306)))

---

## **Features**
- 🎯 **Direct Graph Construction** – Drag and drop to create nodes and edges interactively.  
- 🔗 **DOT Format Export** – Generates DOT strings for integration with autograders.  
- ⚙️ **Flexible Configuration** – Supports directed/undirected graphs, multigraphs, and self-links.  
- 🧩 **Autogradable Assessments** – Automatically evaluates graph similarity or structure.  
- 📘 **Compatible with Multiple Courses** – Ideal for data structures, algorithms, and discrete math exercises.  

---

## **Installation & Usage**

### **Requirements**
- Python (≥ 3.8)  
- NetworkX, PyGraphviz, LXML, NumPy  
- PrairieLearn (for integration into an assessment platform)  
- Docker  

---

### **Install Docker (if not already installed)**
Follow the official Docker documentation:  
🔗 [Docker Installation Guide](https://docs.docker.com/get-docker/)

Follow the official PrairieLearn local setup guide:  
🔗 [PrairieLearn Local Setup](https://prairielearn.readthedocs.io/en/latest/install/)

The main code for this tool is in elements/pl-graph-constructor. Refer to the README.md there and element code. 

---

### **Running the Project with Docker**

To launch **PrairieLearn** and the **Graph Constructor tool** using Docker:

### **1. Clone this repository**  

### **2. Pull the PrairieLearn Docker image**  
```bash
docker pull --platform linux/x86_64 prairielearn/prairielearn
```
### **3. Run the PrairieLearn container**  
```bash
docker pull --platform linux/x86_64 prairielearn/prairielearn
```
### **3. Access PrairieLearn locally**  
Wait for <ins>http://localhost:3000</ins> to appear and click on it.

### **4. Load From Disk**  
Click "Load From Disk" in the top right corner and wait for it to run.

### **5. You are all set!**  
Try some of the example questions. Try changing their XML, or create your own questions (more information in the elements/pl-interactive-graph folder's README.md)


