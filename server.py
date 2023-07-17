from flask import Flask, render_template, jsonify, request
import json
import copy
from sudoku import empty_grid, fill_values, remove_numbers, solve

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new_game', methods=['GET'])
def new_game():
    board = empty_grid()
    fill_values(board)
    solved_board = copy.deepcopy(board)  # Store the solved board
    remove_numbers(board)  # Remove numbers after the board has been filled
    return jsonify({'board': board, 'solved_board': solved_board})


@app.route('/solve', methods=['POST'])
def solve_route():
    data = request.get_json()
    board = data['board']
    history = [copy.deepcopy(board)]
    if solve(board, history):
        return jsonify({'board': board, 'history': history})
    else:
        return jsonify({'error': 'Could not solve this board'}), 400


if __name__ == '__main__':
    app.run()
