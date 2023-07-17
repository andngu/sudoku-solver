const gridContainer = document.getElementById('grid-container');
const newGameButton = document.getElementById('new-game');
const solveGameButton = document.getElementById('solve-game');
const numberSelectorContainer = document.getElementById('number-selector-container');

let selectedCell = null;
let solvedBoard = [];
let mistakes = 0;
let isRunning = false;

const createCell = (gridData, i, j) => {
    const cell = document.createElement('input');
    cell.type = 'text';
    cell.readOnly = true;
    cell.id = `cell-${i}-${j}`;
    cell.className = 'grid-cell';
    cell.value = gridData[i][j] !== 0 ? gridData[i][j] : '';
    cell.disabled = gridData[i][j] !== 0;

    if ((j + 1) % 3 === 0) cell.classList.add('right-border');
    if ((i + 1) % 3 === 0) cell.classList.add('bottom-border');
    
    cell.addEventListener('click', handleCellClick(cell));
    gridContainer.appendChild(cell);
}

function handleCellClick(cell) {
    return function() {
        if(!cell.disabled) {
            if (selectedCell) selectedCell.classList.remove('selected');
            selectedCell = cell;
            selectedCell.classList.add('selected');
        }
    }
}

function createGrid(gridData) {
    gridContainer.innerHTML = '';
    gridData.forEach((row, i) => row.forEach((col, j) => createCell(gridData, i, j)));
}

function createNumberSelector() {
    Array.from({length: 9}, (_, i) => i + 1).forEach(i => {
        const numberCell = document.createElement('button');
        numberCell.innerText = i;
        numberCell.className = 'number-selector-cell';
        numberCell.addEventListener('click', handleNumberCellClick(i));
        numberSelectorContainer.appendChild(numberCell);
    });
}

function handleNumberCellClick(i) {
    return function() {
        if(selectedCell){
            checkCell(i);
            selectedCell.classList.remove('selected');
            selectedCell = null;
        }
    }
}

function checkCell(i) {
    selectedCell.value = i;
    const [_, row, col] = selectedCell.id.split('-');
    if (solvedBoard[row][col] !== Number(selectedCell.value)) {
        mistakes++;
        if (mistakes >= 3) {
            alert("You've made 3 mistakes");
            newGameButton.click();
        } else {
            alert("Incorrect");
            selectedCell.value = '';
        }
    }
}

function disableButtons() {
    const buttons = [newGameButton, solveGameButton, ...numberSelectorContainer.getElementsByTagName('button')];
    buttons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');
    });
}

function enableButtons() {
    const buttons = [newGameButton, solveGameButton, ...numberSelectorContainer.getElementsByTagName('button')];
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('disabled');
    });
}


function animateSolution(history) {
    if (isRunning) return;
    isRunning = true;
    disableButtons();

    let i = 0;
    const intervalId = setInterval(() => {
       if (i >= history.length) {
           clearInterval(intervalId);
           isRunning = false;
           newGameButton.disabled = false;
           newGameButton.classList.remove('disabled');
           return;
       }

       const board = history[i];
       for (let row = 0; row < 9; row++) {
           for (let col = 0; col < 9; col++) {
               document.getElementById(`cell-${row}-${col}`).value = board[row][col] || '';
           }
       }
       i++;
   }, 100);
}

async function fetchGame(url, options = {}) {
    const response = await fetch(url, options);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

newGameButton.onclick = async function() {
    const data = await fetchGame('/new_game');
    createGrid(data.board);
    solvedBoard = data.solved_board;
    mistakes = 0;
    selectedCell = null;
    enableButtons();
};

solveGameButton.onclick = async function() {
    const gridData = Array.from(document.getElementsByClassName('grid-cell'))
        .map((cell, i) => {
            return {
                row: Math.floor(i / 9),
                col: i % 9,
                value: parseInt(cell.value) || 0
            };
        })
        .reduce((rows, cell) => {
            if (!rows[cell.row]) rows[cell.row] = [];
            rows[cell.row][cell.col] = cell.value;
            return rows;
        }, []);

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({board: gridData})
    };

    const data = await fetchGame('/solve', options);
    animateSolution(data.history);
};

newGameButton.click();
createNumberSelector();
