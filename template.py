import sys
import os
import uuid

"""
Run this script with PATH to create all files and subfolders for a new QG.
Good example of path: python/list-mutation/hard-question
Bad example of path: python/list mutation/ list: mutation!!
"""
def question_template(quid):
    if os.path.isdir('questions'):
        os.chdir('questions')
    else:
        os.mkdir('questions')
        os.chdir('questions')
    for folder in quid:
        if os.path.isdir(folder):
            if folder == quid[-1]:
                print("QUID already exists.")
                return 0
            os.chdir(folder)
        else:
            os.mkdir(folder)
            os.chdir(folder)

    server = open('server.py', 'w')
    question = open('question.html', 'w')
    info = open('info.json', 'w')
    readme = open('README.md', 'w')
    os.mkdir('clientFilesQuestion')
    os.mkdir('serverFilesQuestion')

    server.write("""import random 
def generate(data):
    return data
    """)
    question.write("""<pl-question-panel>
</pl-question-panel>
""")
    new_uuid = str(uuid.uuid1())
    info.write("""{
    "uuid": "%s",
    "title": "",
    "topic": "",
    "tags": ["berkeley"],
    "type": "v3"
}
""" % (new_uuid))
    readme.write("""# Title
> Description
## Table of Contents
## Examples
## Solutions
## Contact <email> or find <name> on Slack for questions
""")

def main():
    if len(sys.argv) != 2:
        sys.exit("Please enter one valid path")
    split_dir = sys.argv[1].split("/")
    if '' in split_dir:
        sys.exit("Not a valid path")
    if question_template(split_dir) != 0: 
        print("Your question's QUID is: " + sys.argv[1])

if __name__ == "__main__":
    main()
