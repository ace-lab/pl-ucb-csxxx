""" Make a function <code>is_sublist</code> that checks whether the first
    argument contains the second as a sublist (including ordering), eg

    <pl-code language="python">
    >> is_sublist(['a', 'b', 'c', 'd'], ['b', 'c'])
    True
    >> is_sublist([1, 2, 3, 4], [4, 3])
    False</pl-code>
"""

def is_sublist(list, sublist): #0given
    n, m = len(list), len(sublist) #1given
    # we only want to search to the last place
    # where the sublist could occur (n - m - 1)
    for i in range(?n - m?):
        start, end = i, i + m
        # compare to the slice of len m at i
        if list[?start:end?] == sublist: #blank _:_
            return ?True? # return early!
    return False #1given

## test ##
# this content could be generated using sublist_test.json
from pl_helpers import name, points
from pl_unit_test import PLTestCase
from code_feedback import Feedback


def score_cases(student_fn, ref_fn, *cases):
    """ Compares the results of `student_fn` to `ref_fn` over each case,
        and sets the feedback score to the ratio of cases that had the
        correct result over the total number of cases
    """
    correct = 0
    for case in cases:
        user_val = Feedback.call_user(student_fn, *case)
        ref_val = ref_fn(*case)
        if user_val == ref_val:
            correct += 1
    
    # set_score must be in range 0.0 to 1.0
    if cases:
        Feedback.set_score(correct / len(cases))
    else:
        Feedback.set_score(1.0)


class Test(PLTestCase):
    @points(2)
    @name("example cases")
    def test_0(self):
        score_cases(self.st.is_sublist, self.ref.is_sublist,
            (['a', 'b', 'c', 'd'], ['b', 'c']),
            ([1, 2, 3, 4], [4, 3])
        )

    
    @points(8)
    @name("advanced cases")
    def test_1(self):
        score_cases(self.st.is_sublist, self.ref.is_sublist,
            ([1, 2, 3, 4], [2, 3]),
            ([1, 2, 3, 4], [3, 2]),
            ([1, 2, 3, 4], []),
            ([1, 2, 3, 4], [1, 2, 3, 4]),
            ([1, 2, 3, 4], [1, 2, 3, 4, 5]),
        )
## test ##
