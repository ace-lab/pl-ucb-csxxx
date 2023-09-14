def is_sublist(list, sublist):
    n, m = len(list), len(sublist)
    # we only want to search to the last place
    # where the sublist could occur (n - m - 1)
    for i in range(n - m):
        start, end = i, i + m
        # compare to the slice of len m at i
        if list[start:end] == sublist:
            return True # return early!
    return False