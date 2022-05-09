const table = document.getElementById("table");
const grid = 12;
const mine = 15;
const gridArray = [];

const getRandomInt = (max) => Math.floor(Math.random() * max);

const setValueCell = (cellTarget) => {
  if (cellTarget.v !== 9) cellTarget.v += 1;
};

// Build the array
for (let y = 0; y < grid; y++) {
  for (let x = 0; x < grid; x++) {
    gridArray.push({
      x,
      y,
      id: `${x}_${y}`,
      v: 0,
      w: false,
    });
  }
}

// Add mines
let NumberMineBuffer = mine;
while (NumberMineBuffer > 0) {
  let x = getRandomInt(grid);
  let y = getRandomInt(grid);
  let index = gridArray.findIndex((g) => g.x === x && g.y === y && g.v !== 9);
  if (index !== -1) {
    // Already exist ?
    gridArray[index].v = 9;
    NumberMineBuffer--;
  }
}

// Add clues
for (let y = 0; y < grid; y++) {
  for (let x = 0; x < grid; x++) {
    let index = gridArray.findIndex((g) => g.x === x && g.y === y);
    let cell = gridArray[index];
    // Mine ?
    if (cell.v === 9) {
      // Cell right -------------
      if (cell.x !== grid - 1) {
        let indexCell = gridArray.findIndex((g) => g.x === x + 1 && g.y === y);
        setValueCell(gridArray[indexCell]);
      }
      // Cell left -------------
      if (cell.x !== 0) {
        let indexCell = gridArray.findIndex((g) => g.x === x - 1 && g.y === y);
        setValueCell(gridArray[indexCell]);
      }
      // Cell top -------------
      if (cell.y !== 0) {
        let indexCell = gridArray.findIndex((g) => g.x === x && g.y === y - 1);
        setValueCell(gridArray[indexCell]);
      }
      // Cell Bottom -------------
      if (cell.y !== grid - 1) {
        let indexCell = gridArray.findIndex((g) => g.x === x && g.y === y + 1);
        setValueCell(gridArray[indexCell]);
      }
      // --------------------------------------------------------------------------
      // Cell top right -------------
      if (cell.y !== 0 && cell.x !== grid - 1) {
        let indexCell = gridArray.findIndex(
          (g) => g.x === x + 1 && g.y === y - 1
        );
        setValueCell(gridArray[indexCell]);
      }
      // Cell top left -------------
      if (cell.y !== 0 && cell.x !== 0) {
        let indexCell = gridArray.findIndex(
          (g) => g.x === x - 1 && g.y === y - 1
        );
        setValueCell(gridArray[indexCell]);
      }
      // Cell bottom right -------------
      if (cell.y !== grid - 1 && cell.x !== grid - 1) {
        let indexCell = gridArray.findIndex(
          (g) => g.x === x + 1 && g.y === y + 1
        );
        setValueCell(gridArray[indexCell]);
      }
      // Cell bottom left -------------
      if (cell.y !== grid - 1 && cell.x !== 0) {
        let indexCell = gridArray.findIndex(
          (g) => g.x === x - 1 && g.y === y + 1
        );
        setValueCell(gridArray[indexCell]);
      }
    }
  }
}

const discoverMine = (cellTarget) => {
  const cell = document.getElementById(cellTarget.id);
  cell.classList.add("mine");
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const index = gridArray.findIndex((g) => g.x === x && g.y === y);
      removeClass(gridArray[index]);
    }
  }
};

const removeClass = (cellTarget) => {
  cellTarget.w = true;
  const cellHtml = document.getElementById(cellTarget.id);
  cellHtml.classList.remove("grey");
  // Clue
  if (cellTarget.v !== 0) {
    cellHtml.innerText = cellTarget.v;
    if (cellTarget.v === 1) cellHtml.classList.add("blue");
    else if (cellTarget.v === 2) cellHtml.classList.add("green");
    else if (cellTarget.v === 9) {
      cellHtml.classList.add("mine");
      cellHtml.innerText = "";
    } else {
      cellHtml.classList.add("red");
    }
  }
};

const propagation = (cell) => {
  removeClass(cell);
  let x = cell.x;
  let y = cell.y;

  // Cell right -------------
  if (x !== grid - 1 && cell.v === 0) {
    let indexCell = gridArray.findIndex(
      (g) => g.x === x + 1 && g.y === y && g.w === false
    );
    if (indexCell !== -1) propagation(gridArray[indexCell]);
  }
  // Cell left -------------
  if (cell.x !== 0 && cell.v === 0) {
    let indexCell = gridArray.findIndex(
      (g) => g.x === x - 1 && g.y === y && g.w === false
    );
    if (indexCell !== -1) propagation(gridArray[indexCell]);
  }
  // Cell top -------------
  if (cell.y !== 0 && cell.v === 0) {
    let indexCell = gridArray.findIndex(
      (g) => g.x === x && g.y === y - 1 && g.w === false
    );
    if (indexCell !== -1) propagation(gridArray[indexCell]);
  }
  // Cell Bottom -------------
  if (cell.y !== grid - 1 && cell.v === 0) {
    let indexCell = gridArray.findIndex(
      (g) => g.x === x && g.y === y + 1 && g.w === false
    );
    if (indexCell !== -1) propagation(gridArray[indexCell]);
  }
};

const handleClick = (event) => {
  const idHtml = event.currentTarget.id;
  const x = parseInt(idHtml.split("_")[0]);
  const y = parseInt(idHtml.split("_")[1]);
  const index = gridArray.findIndex((g) => g.x === x && g.y === y);
  if (index === -1) {
    return;
  }
  let cell = gridArray[index];
  if (cell.v === 9) {
    discoverMine(gridArray[index]);
  } else if (cell.v === 0) {
    propagation(cell);
  } else {
    // only a clue
    removeClass(gridArray[index]);
  }
};

let numTr = -1;
let tr;
for (let g of gridArray) {
  if (numTr !== g.y) {
    if (numTr !== -1) table.append(tr);
    tr = document.createElement("tr");
    numTr = g.y;
  }
  let td = document.createElement("td");
  td.classList.add("grey");
  td.id = g.id;
  td.addEventListener("click", (event) => {
    handleClick(event);
  });
  tr.append(td);
}
// Bug last TR
table.append(tr);
