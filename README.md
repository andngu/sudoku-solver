# Sudoku Solver

The Interactive Sudoku Solver is a web-based application that allows users to play Sudoku, generate new Sudoku puzzles, and solve puzzles.

## Features

- Interactive gameplay where you can select cells and place numbers.
- Automatic error-checking if you've made 3 mistakes.
- New game generation for endless puzzles.
- An option to solve the puzzle, if it gets too difficult.

## Installation

1. Clone the repository
```
git clone https://github.com/andngu/sudoku-solver.git
```
2. Install the requirements
```
pip install -r requirements.txt
```
3. Run the Flask application
```
python server.py
```

## Tech Stack

This project uses Python for the backend with Flask as the web server, and JavaScript, HTML, and CSS for the frontend.

## Sudoku Algorithm

This project uses a backtracking algorithm to generate and solve the Sudoku puzzles. The backtracking algorithm is a brute force method where all possible numbers are placed in an empty cell and if no contradictions are found, it proceeds to the next cell and does the same. If it encounters a contradiction, it backtracks to the previous cell, replaces the number with the next possible number, and continues. This algorithm is an efficient method for solving Sudoku puzzles.


Enjoy the game!
