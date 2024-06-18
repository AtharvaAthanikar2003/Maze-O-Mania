let mazeWidth, mazeHeight, mazeGrid;

function adjustMazeSize() {
    const availableHeight = window.innerHeight * 0.6;
    const availableWidth = window.innerWidth * 0.6;
    const smallerDimension = Math.min(availableHeight, availableWidth);
    const cellSize = 20; 
    mazeWidth = Math.floor(smallerDimension / cellSize);
    mazeHeight = Math.floor(smallerDimension / cellSize);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function carvePath(x, y, complexity) {
    mazeGrid[y][x] = 0; // Mark as path

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    shuffleArray(directions); // Randomize direction order

    for (const [dx, dy] of directions) {
        const nx = x + 2 * dx;
        const ny = y + 2 * dy;
        if (nx >= 0 && nx < mazeWidth && ny >= 0 && ny < mazeHeight && mazeGrid[ny][nx] === 1) {
            mazeGrid[y + dy][x + dx] = 0; // Carve path
            if (Math.random() >= complexity) { // Add wall based on complexity
                carvePath(nx, ny, complexity);
            }
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateMaze() {
    document.getElementById('maze').innerHTML = '';
    movesCount = 0;
    updateMoves();
    adjustMazeSize();
    mazeGrid = [];
    for (let i = 0; i < mazeHeight; i++) {
      mazeGrid[i] = [];
      for (let j = 0; j < mazeWidth; j++) {
        mazeGrid[i][j] = 0; // Initialize all cells as path (0)
      }
    }

    const wallDensity = {
        easy: 0.3,
        medium: 0.4,
        hard: 0.5
    }   [difficultyLevel];
    entryPoint = { row: 0, col: 0 };
    let exitOptions = [];
    exitOptions.push({ row: 0, col: mazeWidth - 1 }); // Top right
    exitOptions.push({ row: mazeHeight - 1, col: 0 }); // Bottom left
    if (difficultyLevel !== "easy") {
      exitOptions.push({ row: mazeHeight - 1, col: mazeWidth - 1 }); // Bottom right
    }
    exitPoint = exitOptions[Math.floor(Math.random() * exitOptions.length)];
    carvePath(1, 1, complexity); 
    displayMaze();

    for (let i = 0; i < mazeHeight; i++) {
        for (let j = 0; j < mazeWidth; j++) {
          if (i === 0 || i === mazeHeight - 1 || j === 0 || j === mazeWidth - 1) {
            mazeGrid[i][j] = 1; // Ensure outer edges are walls
          } else if (
            (i <= 2 || i >= mazeHeight - 3) && (j <= 2 || j >= mazeWidth - 3)
          ) {
            continue; // Skip generating walls near corners
          } else {
            mazeGrid[i][j] = Math.random() < wallDensity ? 1 : 0;
          }
        }
    }

    // Set entry point as movable
    document.getElementById('entry-point').addEventListener('keydown', function(event) {
        const key = event.key;
        const currentCell = document.getElementById('entry-point');
        let nextRow, nextCol;

        switch (key) {
            case 'ArrowUp':
                nextRow = currentCell.parentNode.rowIndex - 1;
                nextCol = currentCell.cellIndex;
                break;
            case 'ArrowDown':
                nextRow = currentCell.parentNode.rowIndex + 1;
                nextCol = currentCell.cellIndex;
                break;
            case 'ArrowLeft':
                nextRow = currentCell.parentNode.rowIndex;
                nextCol = currentCell.cellIndex - 1;
                break;
            case 'ArrowRight':
                nextRow = currentCell.parentNode.rowIndex;
                nextCol = currentCell.cellIndex + 1;
                break;
            default:
                return;
        }
        
        if (nextRow >= 0 && nextRow < mazeHeight && nextCol >= 0 && nextCol < mazeWidth && !document.getElementById('maze').rows[nextRow].cells[nextCol].classList.contains('wall')) {
            currentCell.removeAttribute('id');
            currentCell.classList.remove('entry-point');
            const nextCell = document.getElementById('maze').rows[nextRow].cells[nextCol];
            nextCell.id = 'entry-point';
            nextCell.classList.add('entry-point');

            if (nextCell.classList.contains('exit-point')) {
                alert("Congratulations! You solved the maze!");
            }
        }
    });
}
 
function displayMaze() {
    const maze = document.getElementById('maze');
    for (let i = 0; i < mazeHeight; i++) {
      const row = maze.insertRow();
      for (let j = 0; j < mazeWidth; j++) {
        const cell = row.insertCell();
        cell.className = mazeGrid[i][j] ? 'cell wall' : 'cell';
        if (i === entryPoint.row && j === entryPoint.col) {
          cell.id = 'entry-point';
        }
        if (i === exitPoint.row && j === exitPoint.col) {
          cell.classList.add('exit-point');
        }
      }
    }
}

generateMaze();