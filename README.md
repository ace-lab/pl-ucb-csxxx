# Welcome!  New here?

If you're new, please use [this repo's wiki](https://github.com/ace-lab/pl-ucb-csxxx/wiki)
to get started!

# Did you just have a course created for  you?

If so, this repo was used as a template, and your course repo's name should be `pl-SSS-CCC`, 
where `SSS` is your project
institution name (`ucb`, `csulb`, `ecc`) and `CCC` is the lowercase course
number at your institution (eg `pl-ucb-cs169a`, `pl-ecc-csci8`, etc).
    
We (UCB PL admins) should already have created a team
`pl-dev-SSS-CCC` that has write access to your repo; email us the
names of any course staff who should have access.  **WARNING:** your
repo will likely contain sensitive content such as exam questions.  Be
careful who has access.  **All access to PL repos is by teams**, not
by adding individuals, to keep access control manageable.

* Delete (meaning `git rm`) the `elements` subdirectory, unless you specifically want to use
the custom elements in here (see below for some documentation)
* Delete the contents of `serverFilesCourse` and `clientFilesCourse`
* Delete the contents of `courseInstances` (you'll add your own
later)
* Delete the contents of `questions/`, which will be replaced with
your course's questions
* Immediately update this `README.md` and `infoCourse.json` to
reflect the info for your course, including inserting a valid UUID for
the course.  You can run `uuidgen` at a shell prompt to make one.
**Important.** Just about every type of thing in PL -- course, question, element, etc. -- has a UUID (Universally Unique ID).  You can generate one by typing `uuidgen` at a terminal window or by using the [UUID generator](https://www.uuidgenerator.net). For safety, in the template repo all UUID values have been set to "9999...".  **In your new repo, immediately `git rm` any files you do not need, and in the files that remain, replace every UUID with a fresh one.**


**Note:** Although it has become customary to name the primary Git
branch `main` rather than `master`, **do not do so for PL repos** as
the server will not be able to sync them.  The server will only sync
to the `master` branch.

# Developing Prairielearn materials with this repo

We now have a configuration to launch a devcontainer with Prairielearn launched *automatically*! The primary benefit of this is to enable demos/development without installing docker (or even an IDE!) locally -- see "Run in the cloud" below.

### Run in the cloud / browser
<img width="1243" alt="Screenshot 2024-06-12 at 10 58 32 AM" src="https://github.com/ace-lab/pl-ucb-csxxx/assets/31297176/3ccb1a62-6985-4e4f-b321-d49beb8735ad">
1. Click the "Code" dropdown on the page of this branch (will also work on master once merged)
2. Click the "Codespaces" tab
3. Click the "+" to create a new codespace
4. You will be dropped into a VSCode web editor
    - If you prefer your local IDE, then you can connect to the codespace via an extension ([vscode](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) | [intellij](https://plugins.jetbrains.com/plugin/20060-github-codespaces))


### Run locally
0. Have docker installed ([desktop](https://docs.docker.com/desktop/) | [headless](https://docs.docker.com/engine/install/)) and (if you installed docker engine) [your user given docker execution/configuration permissions](https://docs.docker.com/engine/install/linux-postinstall/)
1. Open this repo in your IDE
2. Launch the devcontainer as supported by your IDE
    - VSCode:
        1. Install the Devcontainers extension <img width="921" alt="Screenshot 2024-06-12 at 11 05 03 AM" src="https://github.com/ace-lab/pl-ucb-csxxx/assets/31297176/cc35270d-b75e-4f64-93cf-1a42f6d133c2">
        2. Open the Command Pallet (Ctrl+Shift+P (Windows,Linux) or  Cmd+Shift+P (Mac)) and select "Dev Containers: Reopen in Container" <img width="622" alt="Screenshot 2024-06-12 at 11 07 59 AM" src="https://github.com/ace-lab/pl-ucb-csxxx/assets/31297176/59ebe8a2-3bb9-4e6a-a50e-01d98f2e3270">

     - IntelliJ: [see their docs](https://www.jetbrains.com/help/idea/connect-to-devcontainer.html) 
     - Other IDEs will likely require the [devcontainers cli](https://github.com/devcontainers/cli) and a remote (similar to ssh) connection to the started container. This process is rather involved and somewhat unstable as of 12 June 2024. If your IDE supports it, I recommend connecting to a codespace as detailed above ("Run in the cloud").
