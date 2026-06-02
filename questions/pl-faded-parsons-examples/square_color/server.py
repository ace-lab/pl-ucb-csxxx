# AUTO-GENERATED FILE
# go to https://prairielearn.readthedocs.io/en/latest/python-grader/#serverpy for more info

def generate(data):
    # Define incoming variables here
    names_for_user = [
        {"name": "to_coordinates", "description": "turns a file-and-rank string and turns it into an (int, int),<br>eg 'a1' -> (0, 0), 'd6' -> (3, 5)", "type": "python fn(str) -> tuple[int, int]"},
    ]
    # Define outgoing variables here
    names_from_user = [
        {"name": "square_color", "description": "", "type": "python function"},
    ]

    data["params"]["names_for_user"] = names_for_user
    data["params"]["names_from_user"] = names_from_user

    return data
