const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playOrPauseButton = document.getElementById("playOrPauseButton");
const stepButton = document.getElementById("stepButton");
const clearButton = document.getElementById("clearButton");
const gridVisibilityButton = document.getElementById("gridVisibilityButton");
const debugModeButton = document.getElementById("debugModeButton");
const cellSizeRangeSlider = document.getElementById("cellSizeRange");
// const drawButton = document.getElementById("drawButton");
// const eraseButton = document.getElementById("eraseButton");

// drawButton.addEventListener("click", () => {
//     console.log("Draw");
//     isDrawing = true;
//     drawButton.style.backgroundColor = "rgb(77, 84, 64)";
//     eraseButton.style.backgroundColor = "rgb(173, 11, 11)";
// });

// eraseButton.addEventListener("click", () => {
//     console.log("Erase");
//     isDrawing = false;
//     drawButton.style.backgroundColor = "rgb(20, 151, 26)";
//     eraseButton.style.backgroundColor = "rgb(77, 84, 64)";
// });

cellSizeRangeSlider.addEventListener("input", () => {
    cellSize = cellSizeRangeSlider.value;
    rows = Math.floor(canvasHeight / cellSize);
    columns = Math.floor(canvasWidth / cellSize);
    clearGrid();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

playOrPauseButton.addEventListener("click", () => {
    isPlaying = !isPlaying;
    playOrPauseButton.innerText = isPlaying ? "Pause" : "Play  ▶";
});

stepButton.addEventListener("click", () => {
    console.log("Step", isStepCount);
    isStepCount++;
});

clearButton.addEventListener("click", () => {
    console.log("Clear");
    clearGrid();
});

gridVisibilityButton.addEventListener("click", () => {
    console.log("Grid Visibility");
    isGridVisible = !isGridVisible;
    gridVisibilityButton.innerText = isGridVisible ? "Hide Grid" : "Show Grid";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

debugModeButton.addEventListener("click", () => {
    console.log("Debug Mode");
    isDebugMode = !isDebugMode;
    debugModeButton.innerText = isDebugMode ? "Hide Debug" : "Show Debug";
});

// let isDrawing = true;
let isPlaying = false;
let isDebugMode = false;
let isGridVisible = false;
let isStepCount = 0;
let pressedKey = null;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let cellSize = 20;
let rows = Math.floor(canvasHeight / cellSize);
let columns = Math.floor(canvasWidth / cellSize);
let grid = Array(rows)
    .fill()
    .map(() => Array(columns).fill(0));

let isMouseDown = false;
let isMouseLeftDown = 0;
canvas.addEventListener("click", (e) => {
    isMouseLeftDown = e.button === 0;

    if (pressedKey === "f" || pressedKey === "F") {
        floodFill(cordToCell(e.offsetX), cordToCell(e.offsetY), isMouseLeftDown);
    } else {
        cellClicked(cordToCell(e.offsetX), cordToCell(e.offsetY));
    }
});

canvas.addEventListener("contextmenu", (e) => {
    isMouseLeftDown = false;
    cellClicked(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    isMouseLeftDown = e.button === 0;

    if (pressedKey === "f" || pressedKey === "F") {
        floodFill(cordToCell(e.offsetX), cordToCell(e.offsetY), isMouseLeftDown);
    } else {
        cellClicked(cordToCell(e.offsetX), cordToCell(e.offsetY));
    }
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
        if (pressedKey === "f" || pressedKey === "F") {
            floodFill(cordToCell(e.offsetX), cordToCell(e.offsetY), isMouseLeftDown);
        } else {
            cellClicked(cordToCell(e.offsetX), cordToCell(e.offsetY));
        }
    }
});

addEventListener("keydown", (e) => {
    console.log("keydown ", e.key);
    pressedKey = e.key;
});

addEventListener("keyup", (e) => {
    console.log("keyup ", e.key);
    pressedKey = null;
});

function cordToCell(x) {
    return Math.floor(x / cellSize);
}

function cellClicked(cellColumn, cellRow) {
    if (cellRow < 0 || cellRow >= rows || cellColumn < 0 || cellColumn >= columns) return;
    if (isDebugMode) console.log(cellRow, cellColumn, isMouseLeftDown);

    if (isMouseLeftDown) {
        grid[cellRow][cellColumn] = 1;
    } else {
        grid[cellRow][cellColumn] = 0;
    }
}

function isValidCell(cellColumn, cellRow, isFill) {
    if (cellRow < 0 || cellRow >= rows || cellColumn < 0 || cellColumn >= columns) return false;
    if(isFill && grid[cellRow][cellColumn] === 0) return true;
    else if(!isFill && grid[cellRow][cellColumn] === 1) return true;
    else return false;
}

let directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];
function floodFill(cellColumn, cellRow, isFill = true) {
    if(!isValidCell(cellColumn, cellRow, isFill)) return;

    let stack = [{ cellColumn, cellRow }];

    while (stack.length > 0) {
        let current = stack.pop();
        
        if (isFill) {
            grid[current.cellRow][current.cellColumn] = 1;
        } else {
            grid[current.cellRow][current.cellColumn] = 0;
        }

        for (let i = 0; i < directions.length; i++) {
            let child = { cellColumn: current.cellColumn + directions[i][0], cellRow: current.cellRow + directions[i][1] };
            if(isValidCell(child.cellColumn, child.cellRow, isFill))
            {
                stack.push(child);
            }
        }
    }
}

// Causes stack overflow on small cell sizes or larger grids.
function floodFill2(cellColumn, cellRow, isFill = true) {
    if (cellRow < 0 || cellRow >= rows || cellColumn < 0 || cellColumn >= columns) return;

    if (isFill) {
        if (grid[cellRow][cellColumn] !== 0) return;
        grid[cellRow][cellColumn] = 1;
    } else {
        if (grid[cellRow][cellColumn] !== 1) return;
        grid[cellRow][cellColumn] = 0;
    }

    floodFill(cellColumn - 1, cellRow, isFill);
    floodFill(cellColumn + 1, cellRow, isFill);
    floodFill(cellColumn, cellRow - 1, isFill);
    floodFill(cellColumn, cellRow + 1, isFill);
}

function drawGrid() {
    ctx.strokeStyle = "rgba(100, 100, 100, 150)";
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
    if (isPlaying || isStepCount > 0) {
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

            if (isPlaying || isStepCount > 0) {
                if (grid[row][column] === 1) {
                    if (neighbourCount < 2 || neighbourCount > 3) newGrid[row][column] = 0;
                } else {
                    if (neighbourCount === 3) newGrid[row][column] = 1;
                }
            }
        }
    }

    if (isPlaying || isStepCount > 0) {
        grid = newGrid;
        isStepCount--;
    }

    if (isStepCount < 0) isStepCount = 0;
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

setInterval(draw, 70);
