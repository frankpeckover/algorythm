var aspect = 0.75
var totalRows;
var totalCols;
var grid;

function buildGrid(rows, cols) {
    totalRows = rows;
    totalCols = cols;
    cellWidth = (dataDivHeight * aspect) / cols;
    cellHeight = (dataDivHeight * aspect) / rows;
    var arr = [];
    for (let row = 0; row <= rows - 1; row++){
        arr[row] = [];
        for (let col = 0; col <= cols - 1; col++) {
            arr[row][col] = createCell(row, col, cellWidth, cellHeight);
        }
    }
    return arr
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
        console.log(data[row][col]);
    }

    cell = {visited: false, links: [], row: row, col: col, view: view}

    return cell
}

function getUnvisitedNeighbours(grid, currentCell) {
    directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    tempArr = []
    directions.forEach(direction => {
        x = direction[0];
        y = direction[1];
        if ((currentCell.row + x) >= 0 && (currentCell.col + y) >= 0 && (currentCell.row + x) < grid.length && (currentCell.col + y) < grid[0].length) {
            if (grid[currentCell.row + x][currentCell.col + y].visited === false) {
                tempArr.push(grid[currentCell.row + x][currentCell.col + y]);
            }    
        }   
    })
    return tempArr
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

function setVisited(grid, value) {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.visited = value;
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
    setVisited(grid, false);
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
			alert(`Found index: ${target} from ${origin}`);
			return true;
		}
		currentCell.visited = true;
        if (currentCell.links.length) {
            currentCell.links.forEach(link => {
                if (link.visited === false) {
                    stack.push(link);
                }
            });
        }
        currentCell.view.style.background = defaultColor;
	}
    alert(`could not find end`)
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
			alert(`Found index: ${target} from ${origin}`);
			return true;
		}
		currentCell.visited = true;
		currentCell.links.forEach((childIndex) => {
			if (childIndex.visited === false) {
				queue.push(childIndex);
			}
		});
	}
	alert(`No path to index: ${target} from ${origin}`);
	return false;
}