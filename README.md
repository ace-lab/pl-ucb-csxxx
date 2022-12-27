# Welcome!  New here?

If you're new, please use this repo's [wiki](https://github.com/ace-lab/pl-ucb-csxxx/wiki)
to get started!

# Using this repo as a template to make a new course?

If you are using this repo as a template to make your own course
(highly recommended), your course repo's name should be `pl-SSS-CCC`, 
where `SSS` is your project
institution name (`ucb`, `csulb`, `ecc`) and `CCC` is the lowercase course
number at your institution (eg `pl-ucb-cs169a`, `pl-ecc-csci8`, etc).
    
Once you have your repo established, you should immediately do the following:

* Create a team that is a child of `pl-dev` and is named
`pl-dev-SSS-CCC` (like the repo name; eg for `pl-ucb-cs169`, the
team name should be `pl-dev-ucb-cs169`) that has Read/Write access
to your repo, and add the course staff to it
* Delete the `elements` subdirectory, unless you specifically want to use
the custom elements in here (see below for some documentation)
* Delete the contents of `serverFilesCourse` and `clientFilesCourse`
* Delete the contents of `courseInstances` (you'll add your own
later)
* Delete the contents of `questions/`, which will be replaced with
your course's questions
* Immediately update this `README.md` and `infoCourse.json` to
reflect the info for your course
