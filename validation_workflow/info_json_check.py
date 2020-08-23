import argparse
import json
import sys
from os import path, walk


class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


sys.tracebacklimit = 0

course_info = json.load(open("infoCourse.json"))
course_tags = course_info["tags"]
course_topics = [topic["name"] for topic in course_info["topics"]]
# List of categories of required tags to check for
fields = ["assessment", "institution", "author"]


def check(tags, field):
    necessary_tags = [tag["name"] for tag in course_tags if tag.get(field, None)]
    for n_tag in necessary_tags:
        if n_tag in tags:
            return
    return f"Must add a {field} tag"


def validate_all(errors):
    # walk through questions directory
    for (dirpath, _, filenames) in walk("questions"):
        for filename in filenames:
            if filename == "info.json":
                # build absolute path to each info.json
                file_path = path.join(dirpath, filename)
                validate_input(file_path, errors)


def validate_input(input, errors):
    info_dict = json.load(open(input))
    tags = info_dict["tags"]
    msgs = []

    # check topics
    topic = info_dict["topic"]
    if topic not in course_topics:
        msgs.append(f"Topic {topic} doesn't exist")

    # perform various checks on tags
    for field in fields:
        msg = check(tags, field)
        # if returned message is not none, add it to list
        msgs += [msg] if msg else []

    if len(msgs) > 0:
        errors[input] = msgs


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Parsing arguments")
    parser.add_argument("--inputs", nargs="*", help="A list of files to check")
    parser.add_argument("--all", action="store_true", help="Validate all info.json's")

    args = parser.parse_args()
    errors = {}
    if args.all:
        validate_all(errors)
    else:
        for input in args.inputs:
            validate_input(input, errors)

    # If there are errors, create an error messsage and throw an exception
    if len(errors) > 0:
        msgs = [
            f"{bcolors.FAIL}Some of the info.json's you have edited or created are missing the required tags. Read the output below for more information.{bcolors.ENDC}\n"
        ]
        for key in errors:
            for msg in errors[key]:
                msgs.append(
                    f"{bcolors.WARNING}{key}{bcolors.ENDC}: {bcolors.FAIL}{msg}{bcolors.ENDC}"
                )
            # Create visual spacing between error messages for each file
            msgs[-1] += "\n"
        raise Exception("\n".join(msgs))
    print(f"{bcolors.OKGREEN}All checks passed!{bcolors.ENDC}")
