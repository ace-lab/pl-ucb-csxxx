def to_coordinates(pos: str) -> tuple[int, int]:
    """ turns a file-and-rank string and turns it into an (int, int),
        eg 'a1' -> (0, 0), 'd6' -> (3, 5)
    """
    f_ord, r_ord = tuple(map(ord, pos[:2]))
    return f_ord - ord('a'), r_ord - ord('1')