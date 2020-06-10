# Example Course Repo

This is an example repo for a course in PrairieLearn.  It is a
template repo, so cloning the template actually makes a separate repo
for you (vs. a fork of this one).

`courseInstances/` should contain subdirectories for each offering of
the course, beginning with Fa,Sp,or Su plus a 2-digit year, eg Fa20.

`questions/` contains all the questions (really, QGs) used by any instance of the course.
Remember that a question is not the same as an assessment, so question
subdirs should have names that describe the content/topic of the question,
**not** how it is used.  E.g. good question name: "html-css-simple-1".
Bad name: "Exam1Question4".

Question subdirs can be nested, so (e.g.) if you have a whole bunch of
QGs that address roughly the same topic, you can group them.

Within a course instance, the `assessments` subdir contains one subdir
for each assessment (homework, exam, quiz, lab, anything that looks
like a collection of questions) of that course instance.  The most
important file inside an assessment is the `.json` file that actually
contains the details of the assessment (which questions, grading
policy, etc.)

