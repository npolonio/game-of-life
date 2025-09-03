import { useState, useEffect, useRef } from "react";
import "./index.css";

const cellSize = 10;
const cols = 80;
const rows = 60;

function App() {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(createGrid());
  const [running, setRunning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const newGrid = createGrid();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        newGrid[y][x] = Math.random() > 0.8 ? 1 : 0;
      }
    }
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    drawGrid(grid, canvasRef.current);
  }, [grid]);

  const nextGeneration = () => {
    setGrid((prevGrid) => {
      const newGrid = createGrid();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const neighbors = countNeighbors(prevGrid, x, y);
          if (prevGrid[y][x] === 1) {
            newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
          } else {
            newGrid[y][x] = neighbors === 3 ? 1 : 0;
          }
        }
      }
      return newGrid;
    });
  };

  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(nextGeneration, 200);
    }
  };

  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const clear = () => {
    setGrid(createGrid());
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const drawCell = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);
        newGrid[y][x] = 1;
        return newGrid;
      });
    }
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    drawCell(e);
  };

  const handleMouseMove = (e) => {
    if (isDrawing) drawCell(e);
  };

  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseLeave = () => setIsDrawing(false);

  return (
    <div>
      <h1>Game of Life</h1>
      <canvas
        ref={canvasRef}
        width={cols * cellSize}
        height={rows * cellSize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      ></canvas>
      <div className="controls">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={clear}>Clear</button>
      </div>
    </div>
  );
}

function createGrid() {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid(grid, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "#39FF14";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const nx = x + j;
      const ny = y + i;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        sum += grid[ny][nx];
      }
    }
  }
  return sum;
}

export default App;
