var aspect = 0.75
var totalRows;
var totalCols;
var grid;

function buildGrid(rows, cols) {
    totalRows = rows;
    totalCols = cols;
    cellWidth = (dataDivHeight * aspect) / cols;
    cellHeight = (dataDivHeight * aspect) / rows;
    var grid = [];
    for (let row = 0; row <= rows - 1; row++){
        grid[row] = [];
        for (let col = 0; col <= cols - 1; col++) {
            grid[row][col] = createCell(row, col, cellWidth, cellHeight);
        }
    }
    return grid
}

function createCell(row, col, cellWidth, cellHeight) {
    view = document.createElement('button');
    view.style.width = `${cellWidth}px`;
    view.style.height = `${cellHeight}px`;

    view.style.left = `${(col * cellWidth) + ((dataDivWidth - (totalCols * cellWidth)) / 2)}px`;
    view.style.top = `${(row * cellHeight)}px`;
    view.style.fontSize = '0.5em';

    view.classList = 'mazeElement element center';
    view.onclick = function() {
        console.log(gridData[row][col]);
    }

    cell = {visited: false, links: [], row: row, col: col, view: view, prev: undefined}

    return cell
}

function getUnvisitedNeighbours(grid, currentCell) {
    directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    unvisNeighbours = []
    directions.forEach(direction => {
        x = direction[0];
        y = direction[1];
        if ((currentCell.row + x) >= 0 && (currentCell.col + y) >= 0 && (currentCell.row + x) < grid.length && (currentCell.col + y) < grid[0].length) {
            if (grid[currentCell.row + x][currentCell.col + y].visited === false) {
                unvisNeighbours.push(grid[currentCell.row + x][currentCell.col + y]);
            }    
        }   
    })
    return unvisNeighbours
}

function removeWall(currentCell, nextCell) {
    yDirection = nextCell.row - currentCell.row;
    xDirection = nextCell.col - currentCell.col;
    if (yDirection === 0) {
        switch (xDirection) {
            case 1:
                currentCell.view.style.borderRight = 'none';
                nextCell.view.style.borderLeft = 'none';
                break;
            case -1:
                currentCell.view.style.borderLeft = 'none';
                nextCell.view.style.borderRight = 'none';
                break;
        }
    }

    else if (xDirection === 0) {
        switch (yDirection) {
            case 1:
                currentCell.view.style.borderBottom = 'none';
                nextCell.view.style.borderTop = 'none';
                break;
            case -1:
                currentCell.view.style.borderTop = 'none';
                nextCell.view.style.borderBottom = 'none';
                break;
        }
    }
}

function setAllVisited(grid, value) {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.visited = value;
        })
    })
}

function removeColor(grid) {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.view.style.background = 'white';
        })
    })
}

async function generateMaze(grid, origin, simulating) {
    let stack = [ origin ];

	while (stack.length > 0) {
		let currentCell = stack.pop();
		currentCell.visited = true;
        if (simulating) {
            await sleep(timeToPause/100)
        }
		let unvisitedNeighbours = getUnvisitedNeighbours(grid, currentCell);
        if (unvisitedNeighbours.length) {
            let random = Math.floor(Math.random() * unvisitedNeighbours.length);
            nextCell = unvisitedNeighbours[random]
            stack.push(currentCell);
            stack.push(nextCell)
            removeWall(currentCell, nextCell);
            currentCell.links.push(nextCell);
            nextCell.links.push(currentCell);
        }
	}
    setAllVisited(grid, false);
	return false;
}

async function traverseDepthFirst(origin, target) {
    let stack = [ origin ];
    target.view.style.background = 'red';
    

	while (stack.length > 0) {
		let currentCell = stack.pop();
        currentCell.view.style.background = specialColor3;
		await sleep(timeToPause);
		if (currentCell === target) {
            removeColor(gridData)
            origin.view.style.background = 'green';
            while (currentCell.prev != undefined || currentCell.prev != null) {
                currentCell.view.style.background = 'green';
                currentCell = currentCell.prev;
                await sleep(timeToPause);
            }
            return true;
		}
		currentCell.visited = true;
        if (currentCell.links.length) {
            currentCell.links.forEach(link => {
                if (link.visited === false) {
                    link.prev = currentCell;
                    stack.push(link);
                }
            });
        }
	}
	return false;
}

async function traverseBreadthFirst(origin, target) {
	let queue = [ origin ];
	origin.visited = true;

	while (queue.length > 0) {
		let currentCell = queue.shift();
		origin.view.style.zIndex = 100;
        currentCell.view.style.background = specialColor3;
		await sleep(timeToPause);
		if (currentCell === target) {
            removeColor(gridData)
            origin.view.style.background = 'green';
            while (currentCell.prev != undefined || currentCell.prev != null) {
                currentCell.view.style.background = 'green';
                currentCell = currentCell.prev;
                await sleep(timeToPause);
            }
            return true;
		}
		currentCell.visited = true;
		currentCell.links.forEach((link) => {
			if (link.visited === false) {
                link.prev = currentCell;
				queue.push(link);
			}
		});
	}
	return false;
}