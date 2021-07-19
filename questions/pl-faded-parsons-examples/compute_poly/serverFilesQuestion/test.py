# This example is probably not syntactically 100% correct. the idea is to have a single
# function that runs all tests and computes a partial score.  
# Woudl be nice if we can somehow use the built-in "external grader" functionality of PL but
# need to investigate separately.
#
# For now just capture the expectations that came with the original problem:

# the idea is to assert for each case that poly(fn_args) == expected 
# these test can be run by student each time they do a "trial submission":

# test_cases:
#   - fn_args: [[4], 2]
#     expected: 4
#   - fn_args: [[4, 5], 2]
#     expected: 14
#   - fn_args: [[2, 4, 7], 6]
#     expected: 278
#   - fn_args: [[2, 4, 7], 1]
#     expected: 13
#   - fn_args: [[1,2,3,4,5,6], 7]
#     expected: 114381

# these tests could be used eg for grading on an exam, as additional hidden test cases
#  that students cannot activate while working on question:

# hidden_tests:
#   - fn_args: [[10], 3]
#     expected: 10
#   - fn_args: [[6,5,4,3,2,1], 7]
#     expected: 22875
#   - fn_args: [[1,2,3,4,5,6], 8]
#     expected: 219345
