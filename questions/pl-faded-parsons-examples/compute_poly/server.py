import numpy as np
import prairielearn as pl
import json


def generate(data):

    # Define the variables here
    names_for_user = []
    names_from_user = [
        {"name": "poly", "description": "compute polynomial", "type": "python function"}
    ]

    data["params"]["names_for_user"] = names_for_user
    data["params"]["names_from_user"] = names_from_user

    return data