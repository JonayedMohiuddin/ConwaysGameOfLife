const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playOrPauseButton = document.getElementById("playOrPauseButton");
const stepButton = document.getElementById("stepButton");
const clearButton = document.getElementById("clearButton");
const gridVisibilityButton = document.getElementById("gridVisibilityButton");
const debugModeButton = document.getElementById("debugModeButton");

playOrPauseButton.addEventListener("click", () => {
    if (isPlaying) {
        isPlaying = false;
        playOrPauseButton.innerText = "Play";
    } else {
        isPlaying = true;
        playOrPauseButton.innerText = "Pause";
    }
});

stepButton.addEventListener("click", () => {
    console.log("Step");
    isStep = true;
});

clearButton.addEventListener("click", () => {
    console.log("Clear");
    clearGrid();
});

gridVisibilityButton.addEventListener("click", () => {
    console.log("Grid Visibility");
    isGridVisible = !isGridVisible;
    if (isGridVisible) {
        gridVisibilityButton.innerText = "Hide Grid";
    }
    if (!isGridVisible) {
        gridVisibilityButton.innerText = "Show Grid";
    }
});

debugModeButton.addEventListener("click", () => {
    console.log("Debug Mode");
    isDebugMode = !isDebugMode;
    if (isDebugMode) {
        debugModeButton.innerText = "Hide Debug Mode";
    }
    if (!isDebugMode) {
        debugModeButton.innerText = "Show Debug Mode";
    }
});

let isPlaying = false;
let isStep = false;
let isDebugMode = false;
let isGridVisible = false;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let cellSize = 20;
let rows = Math.floor(canvasHeight / cellSize);
let columns = Math.floor(canvasWidth / cellSize);
let grid = Array(rows)
    .fill()
    .map(() => Array(columns).fill(0));

let isMouseDown = false;
canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const cellColumn = Math.floor(x / cellSize);
    const cellRow = Math.floor(y / cellSize);
    cellClicked(cellRow, cellColumn);
});

canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
});

canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
});

document.addEventListener("mouseup", (e) => {
    isMouseDown = false;
});

// canvas.addEventListener("mouseleave", (e) => {
//     isMouseDown = false;
// });

canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        const x = e.offsetX;
        const y = e.offsetY;
        const cellColumn = Math.floor(x / cellSize);
        const cellRow = Math.floor(y / cellSize);
        cellClicked(cellRow, cellColumn);
    }
});

function cellClicked(cellRow, cellColumn) {
    if (cellRow < 0 || cellRow >= rows || cellColumn < 0 || cellColumn >= columns) return;
    console.log(cellRow, cellColumn);
    grid[cellRow][cellColumn] = 1;
}

function drawGrid() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    for (let row = 1; row < rows; row++) {
        ctx.moveTo(0, row * cellSize);
        ctx.lineTo(canvasWidth, row * cellSize);
    }
    for (let collumn = 1; collumn < columns; collumn++) {
        ctx.moveTo(collumn * cellSize, 0);
        ctx.lineTo(collumn * cellSize, canvasHeight);
    }

    ctx.stroke();
}

let neighboursCord = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];
function drawCells() {
    let newGrid = [];
    if (isPlaying || isStep) {
        for (let row = 0; row < rows; row++) {
            newGrid.push(grid[row].slice());
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (grid[row][column] === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);
                ctx.fillStyle = "white";
            } else {
                ctx.clearRect(column * cellSize, row * cellSize, cellSize, cellSize);
                ctx.fillStyle = "black";
            }

            let neighbourCount = 0;
            neighboursCord.forEach((cord) => {
                neighbourCount += grid[(row + cord[0] + rows) % rows][(column + cord[1] + columns) % columns];
            });

            if (isDebugMode) {
                ctx.font = "20px serif";
                ctx.fillText(neighbourCount, cellSize * column + 5, cellSize * row + 17);
            }

            if (isPlaying || isStep) {
                if (grid[row][column] === 1) {
                    if (neighbourCount < 2 || neighbourCount > 3) newGrid[row][column] = 0;
                } else {
                    if (neighbourCount === 3) newGrid[row][column] = 1;
                }
            }
        }
    }

    if (isPlaying || isStep) {
        grid = newGrid;
    }

    isStep = false;
}

function clearGrid() {
    grid = Array(rows)
        .fill()
        .map(() => Array(columns).fill(0));
}

function draw() {
    drawCells();
    if (isGridVisible) {
        drawGrid();
    }
}

setInterval(draw, 100);
