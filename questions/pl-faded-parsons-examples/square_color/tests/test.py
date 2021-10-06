from pl_helpers import name, points
from pl_unit_test import PLTestCase
from code_feedback import Feedback

def score_cases(student_fn, ref_fn, *cases):
    proportion_correct = 0
    for case in cases:
        user_val = Feedback.call_user(student_fn, *case)
        ref_val = ref_fn(*case)
        if user_val == ref_val:
            proportion_correct += 1
    proportion_correct /= len(cases)

    Feedback.set_score(proportion_correct)

class Test(PLTestCase):
    @points(2)
    @name("example cases")
    def test_0(self):
        score_cases(self.st.square_color, self.ref.square_color,
            ('a1',),
            ('d6',)
        )

    
    @points(8)
    @name("advanced cases")
    def test_1(self):
        score_cases(self.st.square_color, self.ref.square_color,
            *((f + str(r),) for f in 'abcdefg' for r in range(1, 9))
        )