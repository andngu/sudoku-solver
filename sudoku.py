import random
import copy
from typing import List

def empty_grid() -> List[List[int]]:
    return [[0 for _ in range(9)] for _ in range(9)]

def is_valid(board: List[List[int]], row: int, col: int, num: int) -> bool:
    # Check the number in the row
    for x in range(9):
        if board[row][x] == num:
            return False

    # Check the number in the column
    for x in range(9):
        if board[x][col] == num:
            return False

    # Check the number in the 3x3 matrix
    start_row, start_col = row - row % 3, col - col % 3
    for i in range(3):
        for j in range(3):
            if board[i + start_row][j + start_col] == num:
                return False
    return True


def fill_values(board: List[List[int]]) -> None:
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                num_list = list(range(1, 10))
                random.shuffle(num_list)
                for num in num_list:
                    if is_valid(board, i, j, num):
                        board[i][j] = num
                        if fill_values(board):
                            return True
                        board[i][j] = 0
                return False
    return True


def remove_numbers(board: List[List[int]]) -> None:
    # Remove numbers from each 3x3 sub-grid
    for x in range(0, 9, 3):
        for y in range(0, 9, 3):
            remove_numbers_from_subgrid(board, x, y)

def remove_numbers_from_subgrid(board: List[List[int]], start_row: int, start_col: int) -> None:
    # Remove a random number (between 2 and 6) of numbers from a 3x3 sub-grid
    cells = [(i, j) for i in range(start_row, start_row + 3) for j in range(start_col, start_col + 3)]
    k = random.randint(2, 6)  # Number of cells to clear, between 2 and 6
    for i, j in random.sample(cells, k):
        board[i][j] = 0


def find_empty(board: List[List[int]]) -> tuple[int, int] or None:
    # Find the first empty cell in the grid
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                return i, j
    return None  # no empty cells

def solve(board: List[List[int]], history: List[List[List[int]]]) -> bool:
    empty_cell = find_empty(board)
    if not empty_cell:
        return True

    i, j = empty_cell
    for num in range(1, 10):
        if is_valid(board, i, j, num):
            board[i][j] = num
            # Create a deep copy of the board and add it to the history
            history.append(copy.deepcopy(board))

            if solve(board, history):
                return True

            # Undo the last step and record it
            board[i][j] = 0
            history.append(copy.deepcopy(board))

    return False

