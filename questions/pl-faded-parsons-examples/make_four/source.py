""" Your goal is to make <code>a</code> equal 4 by the end of the script!"""

a = 1 
a += 1
a *= 1
?a? += a

## res/four.txt ##
4
## res/four.txt ## the contents will be only "4"

## res/empty.txt ## the empty file
## res/empty.txt ##

## res/seuss ## just these four lines
fish(1)
fish(2)
fish('red')
fish('blue')
## res/seuss ## will be made as a .py by default

## test ##
from pl_helpers import name, points
from pl_unit_test import PLTestCase
from code_feedback import Feedback


class Test(PLTestCase):
    @points(10)
    @name("testing a")
    def test_0(self):
        Feedback.set_score(1 if self.st.a == 4 else 0)
## test ##