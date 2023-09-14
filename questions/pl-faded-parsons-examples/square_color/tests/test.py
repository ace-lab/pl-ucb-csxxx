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
    @name('example cases')
    @points(2)
    def test_0(self):
        score_cases(self.st.square_color, self.ref.square_color,
            ('a1',),
            ('d6',)
        )
    
    @name('advanced cases')
    @points(5)
    def test_1(self):
        score_cases(self.st.square_color, self.ref.square_color,
            ('i9',),
            *((f + str(r),) for f in 'abcdefg' for r in range(1, 9))
        )
    
