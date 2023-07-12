const gridContainer = document.getElementById('grid-container');
const newGameButton = document.getElementById('new-game');
const solveGameButton = document.getElementById('solve-game');

function createGrid(gridData) {
   gridContainer.innerHTML = ''; // clear existing grid
   for(let i = 0; i < 9; i++) {
       for(let j = 0; j < 9; j++) {
           const cell = document.createElement('input');
           cell.type = 'text';
           cell.id = `cell-${i}-${j}`;
           cell.className = 'grid-cell';
           cell.value = gridData[i][j] !== 0 ? gridData[i][j] : '';
           cell.disabled = gridData[i][j] !== 0;  // disable input for pre-filled cells
           gridContainer.appendChild(cell);
       }
   }
}

function animateSolution(history) {
   console.log(history)
   let i = 0;
   const intervalId = setInterval(() => {
       if (i >= history.length) {
           clearInterval(intervalId);
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

newGameButton.onclick = function() {
    fetch('/new_game')
        .then(response => response.json())
        .then(data => createGrid(data));
};

solveGameButton.onclick = function() {
    const gridData = Array.from(document.getElementsByClassName('grid-cell'))
        .map((cell, i) => {
            return {
                row: Math.floor(i / 9),
                col: i % 9,
                value: parseInt(cell.value) || 0
            };
        })
        .reduce((rows, cell) => {
            if (!rows[cell.row]) {
                rows[cell.row] = [];
            }
            rows[cell.row][cell.col] = cell.value;
            return rows;
        }, []);

    fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({board: gridData})
    })
    .then(response => response.json())
    .then(data => {animateSolution(data.history);});
};

// Load a new game when the page loads
newGameButton.click();
