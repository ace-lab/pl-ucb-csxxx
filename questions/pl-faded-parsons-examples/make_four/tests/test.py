from pl_helpers import name, points
from pl_unit_test import PLTestCase
from code_feedback import Feedback


class Test(PLTestCase):
    @points(10)
    @name("testing a")
    def test_0(self):
        Feedback.set_score(1 if self.st.a == 4 else 0)