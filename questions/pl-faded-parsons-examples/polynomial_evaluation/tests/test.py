from pl_helpers import name, points
from pl_unit_test import PLTestCase
from code_feedback import Feedback
from unittest import mock
from io import StringIO
from random import randrange


class Test(PLTestCase):

    @points(1)
    @name("testing single case")
    def test_0(self):
        case = [[10], 3]
        points = 0
        user_val = Feedback.call_user(self.st.poly, *case)
        ref_val = self.ref.poly(*case)
        if Feedback.check_scalar(f"args: {case}", ref_val, user_val):
            points += 1
        Feedback.set_score(points)

    @points(4)
    @name("testing multiple cases")
    def test_1(self):
        cases = [
            [[4, 5], 2],
            [[2, 4, 7], 6],
            [[2, 4, 7], 1],
            [[1,2,3,4,5,6], 7]
        ]
        points = 0
        for case in cases:
            user_val = Feedback.call_user(self.st.poly, *case)
            ref_val = self.ref.poly(*case)
            if Feedback.check_scalar(name=f"args: {case}", ref=ref_val, data=user_val, report_success=False, report_failure=False):
                points += 1
                Feedback.add_feedback('Well Done')
            else:
                Feedback.add_feedback('Whoops!')
            Feedback.add_feedback(f'Your answer: {user_val}\nReference Answer: {ref_val}')

        Feedback.set_score(points/len(cases))

    @points(3)
    @name("testing hidden cases")
    def test_2(self):
        cases = [
            [[10], 3],
            [[6,5,4,3,2,1], 7],
            [[1,2,3,4,5,6], 8],
        ]
        points = 0
        for case in cases:
            user_val = Feedback.call_user(self.st.poly, *case)
            ref_val = self.ref.poly(*case)
            if Feedback.check_scalar(name=f"hidden case", ref=ref_val, data=user_val, report_success=False, report_failure=False):
                points += 1
                Feedback.add_feedback('Check')
            else:
                Feedback.add_feedback('Wrong')
        Feedback.set_score(points/len(cases))

    @points(3)
    @name("testing user output")
    def test_3(self):
        cases = [
            [[10], 3],
            [[6,5,4,3,2,1], 7],
            [[1,2,3,4,5,6], 8],
        ]
        points = 0
        for case in cases:
            user_val = Feedback.call_user(self.st.poly, *case)
            ref_val = self.ref.poly(*case)
            if Feedback.check_scalar(name=f"args: {case}", ref=ref_val, data=user_val, report_success=False, report_failure=False):
                points += 1
                Feedback.add_feedback('Well Done')
            else:
                Feedback.add_feedback('Whoops!')
            Feedback.add_feedback(f'Your answer: {user_val}\nReference Answer: {ref_val}')
            with mock.patch('sys.stdout', new_callable=StringIO) as mock_stdout:
                try:
                    self.st.poly(*case)
                    Feedback.add_feedback(f"stdout\n---------\n{mock_stdout.getvalue()}---------")
                except Exception as e:
                    Feedback.add_feedback(f"error: {e}")
        Feedback.set_score(points/len(cases))

    @points(20)
    @name("testing random cases")
    def test_4(self):
        cases = []
        num_cases = 20
        for case in range(num_cases):
            coeffs = []
            for i in range(10):
                coeffs.append(randrange(0, 101))
            x = randrange(0, 10)
            cases.append([coeffs, x])
        points = 0
        for case in cases:
            user_val = Feedback.call_user(self.st.poly, *case)
            ref_val = self.ref.poly(*case)
            if Feedback.check_scalar(name=f"args: {case}", ref=ref_val, data=user_val, report_success=True, report_failure=True):
                points += 1
                Feedback.add_feedback('Well Done')
            else:
                Feedback.add_feedback('Whoops!')
            Feedback.add_feedback(f'Your answer: {user_val}\nReference Answer: {ref_val}')
        Feedback.set_score(points/len(cases))