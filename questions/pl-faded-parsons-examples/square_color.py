## import square_color_question.html as question_text ##

## setup_code ##
def to_coordinates(pos: str) -> tuple[int, int]:
    """ turns a file-and-rank string and turns it into an (int, int),
        eg 'a1' -> (0, 0), 'd6' -> (3, 5)
    """
    f_ord, r_ord = tuple(map(ord, pos[:2]))
    return f_ord - ord('a'), r_ord - ord('1')
## setup_code ##

def square_color(pos): #0given
    file, rank = to_coordinates(pos)
    black_first_square = file % ?2? == 0
    same_as_first = rank % ?2? == 0
    return black_first_square == same_as_first

## import square_color_test.json as test ##
