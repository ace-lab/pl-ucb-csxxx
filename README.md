# Example Course Repo

This is an example repo for a course in PrairieLearn.  It is a
template repo, so clicking Use This Template above will 
[make a separate repo](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template)
for you (vs. a fork of this one) that starts from a fresh commit history.

The Wiki (click above) contains more detailed information about onboarding, PL development, links to resources, etc.

# Warning: keep repos private

PL-related repos will necessarily contain sensitive content: future
exam questions, etc.  When you create a repo for PL-related development,
whether you create it brand-new or use this template:

1. **Make it private** and
grant at least read access to the `pl-dev` team.  Contact one of the ACELab owners
(faculty, generally) if someone needs to be added to that team.
You're also free to create teams around your specific course and add
those teams to course repos.

2. **Place it in the ace-lab org** rather than under your personal
namespace, so that the org's owners (faculty) can do searches and other
operations across course repos and so that the repo ownership will
survive your departure from Cal.

# Contribute to this documentation

Use this repo's [wiki](https://github.com/ace-lab/pl-ucb-csxxx/wiki) 
to contribute knowledge.  If you're new to the project, start there
for instructions on getting set up.

# Repo structure and naming

A course is the platonic ideal of a class, e.g. `cs61c`.  

**Course repos must reside in the ace-lab org** and their names must
consist of** `pl-ucb-` followed by the department and course number,
e.g. `pl-ucb-cs61a`, `pl-ucb-ee120`, etc.

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

