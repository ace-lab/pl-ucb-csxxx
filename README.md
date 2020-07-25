# Contribute to this documentation

Use this repo's [wiki](https://github.com/ace-lab/pl-ucb-csxxx/wiki)
to contribute knowledge.  If you're new to the project, start there
for instructions on getting set up.

## To create a new course repo (1 Berkeley course <=> 1 repo)

A course is the platonic ideal of a class, e.g. `cs61c`.  Each course
has exactly one repo; different offerings (instances) of the course
are in a subdirectory of the one repo.

1. Click Use This Template above, which will [create a brand-new repo (not a
fork)](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template)
that starts from a fresh commit history.
This will give you the correct basic directory
structure, etc.

2. Select **ace-lab** as the destination of the new repo rather than under your personal
account.  **If you do not do this, your course repo will not
be able to be published to the CBT servers.**

3. Name the new course repo `pl-ucb-` followed by the department and course number,
e.g. `pl-ucb-cs61a`, `pl-ucb-ee120`, etc.  

4. Select **private** as the new repo's visibility, since PL-related
repos will necessarily contain sensitive content (future exam questions, etc.)

5. In your new repo,  grant at least read access to the `pl-dev`
team. (Click Settings, then Manage Access.)
Contact one of the ACELab owners
(your advisor, generally) if someone needs to be added to that team.
You're also free to create teams around your specific course and add
those teams to course repos, giving `pl-dev` read-only access but
giving your smaller team push access.

6. **Important.** Just about every type of thing in PL -- course, question, element,
etc. -- has a UUID (Universally Unique ID).  You can generate one my typing `uuidgen` at a Mac
terminal or by using the [UUID
generator](https://www.uuidgenerator.net).  For safety, in this
template repo all UUID values have been set to "9999...".  **In your new repo,
immediately `git rm` any files you do not need, and in the files that
remain, replace every UUID with a fresh one.**

## Repo structure

Within a course repo,
`courseInstances/` should contain subdirectories for each offering of
the course, beginning with Fa,Sp,or Su plus a 2-digit year, eg Fa20.

`questions/` contains all the questions (that is, question generators)
used by any instance of the course.  Question subdirs should have names that
describe the content/topic of the question, **not** how it is used.
E.g. good question name: "html-css-simple-1".  Bad name:
"Exam1Question4".  In this template repo, the `questions` directory is empty, but
take a look at the
[pl-example-questions](https://github.com/ace-lab/pl-example-questions)
repo for lots of examples of question generators.

Question subdirs can be nested, so (e.g.) if you have a whole bunch of
QGs that address roughly the same topic, you can group them.

Within a course instance, the `assessments` subdir contains one subdir
for each assessment (homework, exam, quiz, lab, anything that looks
like a collection of questions) of that course instance.  The most
important file inside an assessment is the `.json` file that actually
contains the details of the assessment (which questions, grading
policy, etc.)

## Tagging conventions - PLEASE READ

The top-level `infoCourse.json` of this repo defines a few "global" tags that
all questions should have.  This will help curation of questions in the future,
so please *follow these guidelines* when adding tags to each question's `info.json`.

ALL tags should be lowercase for consistency throughout the course repo.
Some tags are defined for you on `infoCourse.json`.

### Required Tags

1. Type of assessment:
   - formative (HW or non-graded level)
   - summative (Exam level)
2. Difficulty of the question relative to class pace:
   - easy
   - medium
   - hard
3. Answer format tag: (tag multiple for multiple elements)
   - radio --> single select multiple choice
   - checkbox --> multiple select multiple choice
   - blank --> input box (string, integer, symbol, ect.)
   - code (The answer format is a piece of code.)
     - CS10 has changed this tag to 'dead python' for specificity. Feel free to change it accordingly.
   - dropdown
   - matrix
   - drawing (The answer format requires drawing on a canvas to input a graphical representation of an answer.)
4. Stage of completion:
   - alpha (question is ready for TA review)
   - beta (question is ready for instructor to review)
   - release (instructor has blessed the question and can now be released to students)
5. Author name as Github username:
   - All developers should define their author tag inside `infoCourse.json`
   - Under description, add your Berkeley or personal email in the case that your Berkeley email gets deleted or contributer is not part of UC Berkeley.
   - CS10 uses first initial and last name (Ex: dgarcia for Dan Garcia) with all other identifying components in the description.
6. Conceptual v Numerical variants: (ex: 4v20)
   - Conceptual variants are the number of times the prompt changes in a QG.
   - Numerical variants are the number of times the values in a question change.
   - If every conceptual variant has 5 numerical variants and we have 4 conceptual variants, we get "4v20".
   - These should not be defined in `infoCourse.json` and only tagged in each question's `info.json`.

### Optional Tags

1. Type of exam question: (These may vary by course, Ex: midterm2)
   - quiz
   - midterm
   - final
   - Developers should define these for their course in `infoCourse.json`
2. Semester the original question was written in and the question number: (Ex: Fa18Q6 or Sp20Q10)
   - Usually the 'type of exam' tag goes hand in hand with this tag.
   - These should not be defined in `infoCourse.json` and only tagged in each question's `info.json`.
3. Any subtopics not covered in the Topics section of `infoCourse.json` should be defined on `infoCourse.json` under tags.

NOTE: Any tags not defined in `infoCourse.json` but tagged in each question's `info.json` will default to the gray1 color on Prairielearn.
