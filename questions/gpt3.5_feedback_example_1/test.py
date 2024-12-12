from code_feedback import Feedback
from pl_helpers import name, points
from pl_unit_test import PLTestCase
from openai import OpenAI
import textwrap

file_path = '/grade/run/user_code.py'
with open(file_path, 'r') as file:
    student_solution = file.read()

client = OpenAI(
  api_key='FIXME' # FIXME: Add your API key here.
)

# FIXME: Replace this with your own problem-statement.
problem_statement = "A valid partition of a positive integer n is a sequence of positive integers in non-decreasing order that sum up to n. Write a Python function named generate_partitions that takes in two arguments: n, a positive integer, and I, a positive integer with a default value of 1. The function should return a list of tuples of valid partitions of n — where I is the smallest integer used in any partition."


# FIXME: Replace this with your own solution.
solution = """
def generate_partitions(n, I=1):
    if n == 0: return [()]
    partitions = []
    for i in range(I, n+1):
        for p in generate_partitions(n-i, i):
            partitions.append((i,) + p)
    return partitions
    """

# FIXME: Replace this with context about your own course in the first paragraph. Further, change the test-cases in the prompt.
prompt = f"""
You are a very talented CS10 tutoring bot, the intro CS class at UC Berkeley; you are helping students learn how to program.
A student has asked for help. The question they are trying to solve is:
{problem_statement}.
Here's all the code the student has written so far:
{student_solution}
The students code does not work. Here are the test cases: [generate_partitions(0), generate_partitions(1), generate_partitions(4), generate_partitions(4,)]
The correct answer is:
{solution}

Here's what you should consider, based on their code:
1. Do they understand the question?
2. Do they understand the concepts involved?
3. Do they have a plan -- if not, help them generate one.

Do not give the student the answer or any code. If there's an obvious bug, direct them to its location. If there's a conceptual misunderstanding, 
offer them a conceptual refresher. Limit your response to a sentence or 2 at most. Be as socratic as possible, and be super friendly.

Your response should be addressed to the student (not me), and should ONLY include the suggestions you want to give them.
"""

# FIXME: You might wish to change the test cases and scoring logic for your assessment.
class Test(PLTestCase):
    @points(10)
    @name("Test various values")
    def test_1(self):
        test_cases = [(0, 1), (1, 1), (4,1) , (4, 2)]
        for n, I in test_cases:
            expected = self.ref.generate_partitions(n, I)
            user_val = Feedback.call_user(self.st.generate_partitions, n, I)
            if not expected == user_val:
                Feedback.set_score(0)
                response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                temperature = 0,
                messages=[
                        {
                            "role": "system",
                            "content": prompt,
                        },
                    ],
                )
                model_response = response.choices[0].message.content
                model_response = textwrap.fill(model_response, width=80)
                Feedback.add_feedback(model_response)
                return
            
        Feedback.set_score(1)