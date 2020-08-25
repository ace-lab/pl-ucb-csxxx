# Welcome!  New here?

We require that everyone doing PL development at Berkeley (and if you can see this, that's you) include their
**real name and a reasonable photo** in their GitHub profile.  Some of the repos you'll have access to
contain sensitive stuff, e.g. exam questions, so we need to know who you are, especially if your real identity
is not obvious from your GitHub username.  **Please take a moment now to add your real name and photo to your GitHub profile.**

Use this repo's [wiki](https://github.com/ace-lab/pl-ucb-csxxx/wiki)
to contribute knowledge.  If you're new to the project, start there
for instructions on getting set up.

## To create a new course repo (1 university course <=> 1 repo)

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

3. Name the new course repo `pl-` followed by the university abbreviation (`ucb`, `csulb`, `ecc`)
followed by department and course number,
e.g. `pl-ucb-cs61a`, `pl-ucb-ee120`, etc.  

4. Select **private** as the new repo's visibility, since PL-related repos will necessarily contain sensitive content (future exam questions, etc.)

5. Create a new team `pl-dev-`_university_`-`_course_, e.g. `pl-dev-ucb-cs10` and grant that team **read and write** access on your repo. Add all instructors and student
developers for the course to that team. If you don't have the privileges to do this in the org, ask one of the org's owners.

5. Also, you must grant the teams `cbt-DEV-machines` and `cbt-PROD-machines` **read only** access to your course repo, in order that the courses can be served from Berkeley's PL servers.

6. **Important.** Just about every type of thing in PL -- course, question, element, etc. -- has a UUID (Universally Unique ID).  You can generate one my typing `uuidgen` at a Mac terminal or by using the [UUID generator](https://www.uuidgenerator.net). For safety, in this template repo all UUID values have been set to "9999...".  **In your new repo, immediately `git rm` any files you do not need, and in the files that remain, replace every UUID with a fresh one.**

## Repo structure

Within a course repo,
`courseInstances/` should contain subdirectories for each offering of
the course, beginning with Fa,Sp,or Su plus a 2-digit year, eg Fa20.

`questions/` contains all the questions (that is, question generators)
used by any instance of the course.  Question subdirs should have names that
describe the content/topic of the question, **not** how it is used.
E.g. good question name: "html-css-simple-1".  Bad name:
"Exam1Question4".  This template repo contains some interesting questions
developed for some of our courses.  The
[pl-example-questions](https://github.com/ace-lab/pl-example-questions)
repo also has lots of examples of question generators.

Question subdirs can be nested, so (e.g.) if you have a whole bunch of
QGs that address roughly the same topic, you can group them.

Within a course instance, the `assessments` subdir contains one subdir
for each assessment (homework, exam, quiz, lab, anything that looks
like a collection of questions) of that course instance.  The most
important file inside an assessment is the `.json` file that actually
contains the details of the assessment (which questions, grading
policy, etc.)

## Tagging conventions - PLEASE READ

The top-level `infoCourse.json` of this repo defines a few "global" tags that all questions should have to add an extra layer of filtering and identification. This will help curation of questions in the future, so please *follow these guidelines* when adding tags to each question's `info.json`.

- You are encouraged to add your own tag definitions and use [PL's 30 colors](https://prairielearn.readthedocs.io/en/latest/course/#colors) on the top-level `infoCourse.json` of this repo. Some tags are defined for you as a guide.

- ALL tags should be lowercase for consistency throughout the course repo.

### Required Tags

1. Type of assessment:
   - formative (Practice level, public)
   - summative (Exam level, secret)

2. Author name as Github username:
   - All developers should define their author tag inside `infoCourse.json`
   - Under description, add your institution's or personal email in the case that your institution's email gets deleted or contributer is not part of an institution.

3. University or institution:
   - Use your institution's approved naming conventions as per policy.
   - For UC Berkeley, the correct tag name is 'berkeley'.

### Automatic Validation

To enforce adherence to these required tags, we have a few tools in place. There is a pre-commit hook script, `pre-commit`, that does two things:

1. It enforces `isort` and `black` formatting. So you must run `pip install isort black` or `pip3 install isort black` in order to use it. If you are against the use of `isort` and/or `black`, feel free to remove the usage (by ed), but I highly recommend it.

2. It runs a python script, `info_json_check.py`. This script does the validation on all created and modified `info.json` files in the qusetions directory. You never need to run this file yourself. I have provided bash scripts that handle the various types of arguments you would pass in. If this script catches errors in the json files, it will throw an error and prevent you from committing code until all fixes are made.

In order to add this pre-commit hook, you must run `bash validation_workflow/copy-hooks` to copy the pre-commit hook script into your local git hooks directory. This also copies a `post-merge` that automatically updates your hooks everytime someone pushes changes to them. If you want to view the contents of the actual hooks you are currently using, you can find them at `.git/hooks/`. This is a hidden directory that exists outside the source control.

In short, after you clone the repo run the following commands:
- `bash validation_workflow/copy-hooks`
- `pip install isort black` or `pip3 install isort black`

In addition to these local requirements, there is also a github action workflow that runs the same validations command and will throw the error in the checks section of your PR.

If have already have several questions and don't know if they all meet the standards outlined here, you can run `bash validation_workflow/validate_all` and all existing `info.json`s will be checked for validity. You should run this every time you create a new required tag.

Below we have a list of recommended tags. If you want to make any of those tags required for your course there are 3 steps you need to take:

1. For each of those categories, define a name. For example, the first category, you can call it `exam_question_type`.

2. In `infoCourse.json`, whenever you create a tag that falls under that category, add an additional field that is named the same. So for our `exam_question_type` example, in `infoCourse.json`, if I want a new required tag under this category, I would add the following:

```json
{
   "name": "quiz",
   "color": "brown3",
   "description": "quiz question",
   "exam_question_type": true
}
```
Specifying `exam_question_type` to `true` will tell the validation flow that the `quiz` tag belongs to `exam_question_type` category.

3. Lastly, in `info_json_check.py`, on line 24 you can find the `fields` variable. This is a list of all the categories of required tags. Simply add any category to this list. So, for our running example, I would simply add "exam_question_type".

### Recommended Tags

1. Type of exam question: (These may vary by course, Ex: midterm2)
   - quiz
   - midterm
   - final
   - Developers should define these for their course in `infoCourse.json`
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
   - release (instructor has blessed the question and can now be released to students)`'/
5. Any subtopics not covered in the Topics section ojf `infoCourse.json` should be defined on `infoCourse.json` under tags.
6. Conceptual v Numerical variants: (ex: 4v5)
   - Conceptual variants are the number of times the prompt changes in a QG.
   - Numerical variants are the number of times the values or other parameters in a question change.
   - If every conceptual variant has 5 numerical variants and we have 4 conceptual variants, we get "4v5".
   - These should not be defined in `infoCourse.json` and only tagged in each question's `info.json`.
7. Semester the original question was written in and the question number: (Ex: Fa18Q6 or Sp20Q10 or Su20)
   - Usually the 'type of exam' tag goes hand in hand with this tag.
   - These should not be defined in `infoCourse.json` and only tagged in each question's `info.json`.

NOTE: Any tags not defined in `infoCourse.json` but tagged in each question's `info.json` will default to the gray1 color on Prairielearn.
