aspect = 0.75

function buildGrid(rows, cols) {
    cellWidth = (windowWidth * aspect) / cols;
    cellHeight = (windowHeight * aspect) / rows;
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

    view.style.left = `${col * cellWidth}px`;
    view.style.top = `${row * cellHeight}px`;
    view.style.fontSize = '0.5em';

    view.classList = 'mazeElement center';
    view.onclick = function() {
        this.style.background = 'black';
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

async function generateMaze(grid, origin) {
    let stack = [ origin ];
	grid[origin.row][origin.col].visited = true;

	while (stack.length > 0) {
		let currentCell = stack.pop();
		//grid[currentCell.row][currentCell.col].view.style.background = specialColor;
		currentCell.visited = true;
        //await sleep(time/100000)
		currentCell.links = getUnvisitedNeighbours(grid, currentCell);
        if (currentCell.links.length) {
            let random = Math.floor(Math.random() * currentCell.links.length);
            nextCell = currentCell.links[random]
            stack.push(currentCell);
            stack.push(nextCell)
            removeWall(currentCell, nextCell);
        }
	}
	return false;
}

async function traverseMaze(grid, origin, target) {
    let stack = [ origin ];

	while (stack.length > 0) {
		let currentCell = stack.pop();
		currentCell.view.style.background = specialColor;
		//await sleep(time);
		if (currentCell === target) {
			alert(`Found index: ${target} from ${origin}`);
			return true;
		}
		currentCell.visited = true;
	    currentCell.links.forEach(link => {
			if (link.visited === false) {
				stack.push(link);
			}
		});
		//await sleep(time);
        currentCell.style.background = 'none'
	}
    alert(`could not find end`)
	return false;
}