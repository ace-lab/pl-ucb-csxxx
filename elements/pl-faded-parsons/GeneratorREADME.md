# Tool Quickstart

## Run on the Examples
Install the latest version of Python, and run
```
 .../pl-ucb-csxxx % python3 elements/pl-faded-parsons/generate_fpp.py \
    --questions-dir questions/pl-faded-parsons-examples --quiet
```
The output should be:
```
** Auto-detecting questions directory **
Generating from source questions/pl-faded-parsons-examples/square_color.py
Done.
Generating from source questions/pl-faded-parsons-examples/make_four.py
- Writing unrecognized regions:
  - questions/pl-faded-parsons-examples/make_four/res/four.txt ...
  - questions/pl-faded-parsons-examples/make_four/res/empty.txt ...
  - questions/pl-faded-parsons-examples/make_four/res/seuss.py ...
Done.
Generating from source questions/pl-faded-parsons-examples/sublist.py
Done.
Generating from source questions/pl-faded-parsons-examples/polynomial_evaluation.py
Done.
Generating from source questions/pl-faded-parsons-examples/2x2_determinant.py
Done.
Batch completed successfullly on 5 files
```
## Command Usage

```
usage: generate_fpp.py [-h] [--profile] [--quiet] [--no-parse] 
                [--questions-dir path] [--force-json path] [source_paths ...]

positional arguments:
  source_paths

optional arguments:
  -h, --help            show this help message and exit
  --profile             prints profile data after running
  --quiet               restricts logging to warnings and errors only
  --no-parse            prevents the code from being parsed by py.ast to derive content
  --questions-dir path  target all .py files in directory as sources
  --force-json path     will overwrite the question's info.json file with auto-generated content
```

# Full Guide to Generating Questions

## Setup

### Development Requirements

- Docker
- Python 3.8 or Later

Via docker, the appropriate images can be maintained and installed. 
You may optionally install [a local prairielearn clone](https://github.com/PrairieLearn/PrairieLearn) if you want to tinker with its internals.

### Grading

The tool has the ability to generate testing content, but the prairielearn's python autograder will not be able to be run locally without following [these steps in the pl dev guide](https://prairielearn.readthedocs.io/en/latest/externalGrading/#running-locally-for-development) to initialize docker correctly.

### PrairieLearn Directory Structure

Your codebase should be structured like this:
```
root-course-directory
|   ...
|
+-- elements
|   +-- pl-faded-parsons        << contains all required FPP files
|   |   generate_fpp.py         << the main script for content generation
|   |   ...
|
+-- questions                   << auto-detect targets the questions directory
|   |   question1.py            <<
|   |   question2.py            << the source files for generating...
|   |   ...                     <<
|   |
|   +-- question1               <<
|   +-- question2               << ...the generated prairielearn questions
|   |   ...                     <<
```

To begin writing any FPP questions, you will need the `pl-faded-parsons` directory and all of its contents. 
It contains all the html and js files required by prairielearn to display a `<pl-faded-parsons>` element.

This element is then used by questions you would traditionally write as subfolders in the `questions` directory. 
The tool `generate_fpp.py` will take well-formatted python files and turn them into a question folder.

## Formatting a Source File

### Usable Files

Any file following the semantic rules (see below) may be provided, but the tool will only autodetect python files.

This tool will search for a provided path in `./`, `questions/`, `../../questions/`, and finally `../../` before erring.
If none is provided, it will hunt for a `questions` directory in these locations, and use all .py files there.
 
### Semantic Rules
 - If the file begins with a docstring, it will become the question text
     - The question text is removed from the reference answer
     - Docstrings are always removed from the prompt
 - Text surrounded by `?`s will become blanks in the prompt
     - Blanks cannot span more than a single line
     - The text within the question marks fills the blank in the answer
     - `?`s in any kind of string-literal or comment are ignored
 - Comments are removed from the prompt unless the comment matches a special form: 
     - `#{n}given`: include as a part of the start solution (n-times-indented)
     - `#blank {txt}`: use txt as the default for a blank in the preceding line
     - These special forms are the only comments removed from the answer
 - Regions are begun and ended by `## {region name} ##`
     - A maximum of one region may be open at a time
     - Regions must be closed before the end of the file
     - All text in a region is only copied into that region
     - Text will be copied into a new file with the regions name in the
       question directory, excluding these special regions:
         - explicit: `test` `setup_code`
         - implicit: `answer_code` `prompt_code` `question_text`
     - Code in `setup_code` will be parsed to extract exposed names unless the --no-parse
       flag is set. 
         - Type annotations and function docstrings are used to fill out `server.py` and the Provided section of the prompt text
     - Any custom region that clashes with an automatically generated file name
       will overwrite the automatically generated code
     - Reopening a region will append to its existing contents
 - Import regions allow for the contents of arbitrary files to be loaded as regions
     - They are formatted as `## import {rel_file_path} as {region name} ##` where `rel_file_path` is the relative path to the file from the source file
     - With the exception of not needing to close an import region, they operate identically to regular regions

## A Simple Example

Before running the tool, the questions directory takes the form
```
questions
|   sublist.py
```

At the header of `sublist.py` we have a docstring which will become the prompt.
``` python
""" Make a function <code>is_sublist</code> that checks whether the first
    argument contains the second as a sublist (including ordering), eg

    <pl-code language="python">
    >> is_sublist(['a', 'b', 'c', 'd'], ['b', 'c'])
    True
    >> is_sublist([1, 2, 3, 4], [4, 3])
    False
    </pl-code>
"""
...
```

Then we have the solution with blanks.
``` python
...
def is_sublist(lst, sublist): #0given
    n, m = len(lst), len(sublist) #1given
    # we only want to search to the last place
    # where the sublist could occur (n - m - 1)
    for i in range(?n - m?):
        start, end = i, i + m
        # compare to the slice of len m at i
        if lst[?start:end?] == sublist: #blank _:_
            return ?True? # return early!
    return False #1given
...
```
This will create a reference solution and sortable code lines in a `<pl-faded-parsons>` element (with blanks where the `?text?` are).

Note that the full-line comments as well as the `# return early!` comment will be included in the reference solution, but not the sortable code lines.

By contrast, the special-form comments (eg `#0given` and `#blank _:_`) will not appear in the reference solution, but will edit the starting configuration of the sortable code lines.
(`#0given` includes `def is_sublist(lst, sublist):` as a part of the starting solution with 0 indents, `#1given` includes `return False` with 1 indent, and `#blank _:_` sets the inital text of the blank in the brackets to `_:_`. )

There is no way to indicate a red-herring or distractor line! 
Distractors are philosophically  antithetical to the design of FPPs!

Continuing to the `test` region, the file concludes:
``` python
...
## test ##
from pl_helpers import name, points
from pl_unit_test import PLTestCase
from code_feedback import Feedback

def score_cases(student_fn, ref_fn, *cases):
    proportion_correct = 0
    for case in cases:
        user_val = Feedback.call_user(student_fn, *case)
        ref_val = ref_fn(*case)
        if user_val == ref_val:
            proportion_correct += 1
    proportion_correct /= len(cases)

    Feedback.set_score(proportion_correct)

class Test(PLTestCase):
    @points(2)
    @name("example cases")
    def test_0(self):
        score_cases(self.st.is_sublist, self.ref.is_sublist,
            (['a', 'b', 'c', 'd'], ['b', 'c']),
            ([1, 2, 3, 4], [4, 3])
        )

    
    @points(8)
    @name("advanced cases")
    def test_1(self):
        score_cases(self.st.is_sublist, self.ref.is_sublist,
            ([1, 2, 3, 4], [2, 3]),
            ([1, 2, 3, 4], [3, 2]),
            ([1, 2, 3, 4], []),
            ([1, 2, 3, 4], [1, 2, 3, 4]),
            ([1, 2, 3, 4], [1, 2, 3, 4, 5]),
        )
## test ##
```
If the `## test ##` does not **start and end** before the end of the file or the start of the next region, there will be a syntax error!

[The proper way to write test methods is in prairielearn's developer guide.](https://prairielearn.readthedocs.io/en/latest/python-grader/#teststestpy)

### Example Test Takeaways

At a glance:
 - Performance is evaluated and transmitted through the class `Feedback`.
 - Test functions must...
     - be methods on a class that extends `PLTestCase
     - be named `test_...`
     - have the `@points` and `@name` decorators
     - call `Feedback.set_score` **on a value between [0, 1]**
 - Any printing done by the student will automatically be relayed to them in the grading section, but we highly discourage grading printed output.

Common Gotchas:
 - Setting the highest possible points value for a test function is done through `@points`, and the performance is entered on a 0-to-1 scale through `Feedback.set_score`. 
 **Entering the number of points recieved will not work!**
 - Test helper functions (ie `score_cases` in the example above) **cannot** be methods (static or instance) on the Test class. 
 They must be defined in a different scope.


## A Complex Example

Before the tool runs, the questions directory looks like this:
```
questions
|   square_color.py
|   square_question.html
```

Instead of writing a docstring, you may choose to write a file (eg for syntax-highlighting/checking):
``` html
<!-- square_question.html -->
Make a function <code>square_color</code> that tells if a chess 
square is black based off of its position (see the labeled board below).
<br>
<img src="https://www.dummies.com/wp-content/uploads/201843.image0.jpg" 
    alt="chessboard" 
    style="margin-left:auto; margin-right:auto; display:block; width:50;"
>
<br>

<h3> Background </h3>

In this activity we will be using modulo (%)! It is often spoken about as
the remainder, the complement to integer division. We often use it to find if something 
is even or odd, by inspecting if <code>x % 2 == 0</code> for even and 
<code>x % 2 == 1</code> for odd.

Another way to think of it is to convert <i>linear</i> change into 
<i>cyclic</i> change. Consider how it acts on this linearly increasing list:

<pl-code language="python">
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8]
print([x % 3 for x in nums])
>> [0, 1, 2, 0, 1, 2, 0, 1, 2]
</pl-code>

It turns 0..8 into (0, 1 , 2) repeating!
```
And then use an import region in `square_color.py`:
``` python
## import square_question.html as question_text ##
...
```

Then we want to provide a helper function, so continuing we have:

``` python
...
## setup_code ##
def to_coordinates(pos: str) -> tuple[int, int]:
    """ Takes a file-and-rank string and turns it into an (int, int),
        eg 'a1' -> (0, 0), 'd6' -> (3, 5)
    """
    f_ord, r_ord = tuple(map(ord, pos[:2]))
    return f_ord - ord('a'), r_ord - ord('1')
## setup_code ##
...
```
The `setup_code` region is required to determine that this is not code to be given to the student. 
They will have no visibility of this code, but its name will be availiable to them.

This code will be parsed and the type information and documentation extracted.
They will be used as help text in prairielearn and displayed in the prompt.
It cannot contain blanks.

The rest of the file proceeds in the usual way:

``` python
...
def square_color(pos): #0given
    file, rank = to_coordinates(pos)
    black_first_square = file % ?2? == 0
    same_as_first = rank % ?2? == 0
    return black_first_square == same_as_first

# tests down here ...
```

### Advanced Import Regions

Note that is possible to direct imports at previously generated files to effectively prevent the tool from overwritting data, eg

``` python
## import question_name/server.py as server.py ##
## import question_name/tests/test.py as test ##
## import question_name/info.json as info.json ##
```

See the regions section for special names like `test` and `question_text`. All names that aren't special simply write to a file of the same name, so

``` python
## res/pi.txt ##
3.14159
## res/pi.txt ##
```

will write the single line `3.14159` to `question_name/res/pi.txt`.

## Generated Files

### The Question Directory

The directory name will be set by the name of the file used to generate the question.

### The `info.json` File

The `info.json` file will only be generated if a matching file doesn't exist, or if `--force-json file_path` is passed. 
This is so that a new uuid will not be generated each time the file is run.

### The `server.py` file

The server file specifies which names pass into the student's scope, and which names must pass out of their scope. 
The code in the `setup_code` and `prompt_code` regions will be parsed to derive which names enter and exit this scope, and what types they carry.

Parsing of this code can be disabled for an entire batch by the flag `--no-parse`, but it will overwrite any existing `server.py` with the default.
(See the complex example's advanced import regions on how to avoid overwritting.)

### The `tests` Directory

This is filled with the answer, setup code, and test code.
This is where the python autograder automatically looks for the files named `ans.py`, `setup_code.py`, and `test.py`.

These are the files that get generated from their respsective special name regions.
