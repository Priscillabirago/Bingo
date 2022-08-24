# A function that determines whether a student won a bingo or not
def bingo_validator(bingo_grid):
    # iterate through each element in bingo_grid
    for each_list in bingo_grid:
        # iterate through each row of the bingo_grid to determine if any row has five 1s
        if each_list[0] == 1 and each_list[1] == 1 and each_list[2] == 1 and each_list[3] == 1 and each_list[4] == 1:
            return True
        # iterate through elements from the top-left corner to the bottom-right corner(diagonal)
        elif bingo_grid[0][0] == 1 and bingo_grid[1][1] == 1 and bingo_grid[2][2] == 1 and bingo_grid[3][3] == 1 and \
                bingo_grid[4][4] == 1:
            return True
        # iterate through elements from the top-right corner to the bottom-left corner(diagonal)
        elif bingo_grid[0][4] == 1 and bingo_grid[1][3] == 1 and bingo_grid[2][2] and bingo_grid[3][1] and \
                bingo_grid[4][0]:
            return True
        # iterate through the first column
        elif bingo_grid[0][0] == 1 and bingo_grid[1][0] == 1 and bingo_grid[2][0] == 1 and bingo_grid[3][0] == 1 and \
                bingo_grid[4][0]:
            return True
        # iterate through the second column
        elif bingo_grid[0][1] == 1 and bingo_grid[1][1] == 1 and bingo_grid[2][1] == 1 and bingo_grid[3][1] == 1 and \
                bingo_grid[4][1]:
            return True
        # iterate through the third column
        elif bingo_grid[0][2] == 1 and bingo_grid[1][2] == 1 and bingo_grid[2][2] == 1 and bingo_grid[3][2] == 1 and \
                bingo_grid[4][2]:
            return True
        # iterate through the fourth column
        elif bingo_grid[0][3] == 1 and bingo_grid[1][3] == 1 and bingo_grid[2][3] == 1 and bingo_grid[3][3] == 1 and \
                bingo_grid[4][3]:
            return True
        # iterate through the fifth column
        elif bingo_grid[0][4] == 1 and bingo_grid[1][4] == 1 and bingo_grid[2][4] == 1 and bingo_grid[3][4] == 1 and \
                bingo_grid[4][4]:
            return True
# returns false if there are no five 1s horizontally, diagonally or vertically
    return False


print(bingo_validator([
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0]]))

print(bingo_validator([
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0]]))
