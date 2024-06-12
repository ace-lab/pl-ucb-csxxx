def square_color(pos):
    file, rank = to_coordinates(pos)
    black_first_square = file % 2 == 0
    same_as_first = rank % 2 == 0
    return black_first_square == same_as_first