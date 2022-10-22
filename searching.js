var origin;
var target;
var toggleSearchable = 'origin';

width = 50
height = 50

function addEdges(nodes) {
	ctx.clearRect(0, 0, canvas.width + canvas.left, canvas.height + canvas.top)
	nodes.forEach((node) => {
		node.links.forEach((connection) => {

			link = connection.connectionNode;

			nodeLeft = parseInt(node.view.style.left);
			nodeTop = parseInt(node.view.style.top);
			nodeWidth = parseInt(node.view.offsetWidth)
			nodeHeight = parseInt(node.view.offsetHeight)
			
			linkLeft = parseInt(nodes[link].view.style.left);
			linkTop = parseInt(nodes[link].view.style.top);
			linkWidth = parseInt(nodes[link].view.offsetWidth)
			linkHeight = parseInt(nodes[link].view.offsetHeight)

			drawLine(nodeLeft + (nodeWidth / 2), nodeTop + (nodeHeight / 2), linkLeft + (linkWidth / 2), linkTop + (linkHeight / 2)
			);
		});
	});
}

async function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	//ctx.fillText('text', (x2 - x1) / 2, (y2 - y1) / 2)
}

function generateGraph(numNodes) {
	let newArray = [];
	for (let i = 0; i < numNodes; i++) {
		let view = document.createElement('button');
        view.onclick = function() {setSearchable(i)};
		view.style.left = `${Math.floor(Math.random() * dataDivWidth * 0.75)}px`;
		view.style.top = `${Math.floor(Math.random() * dataDivHeight * 0.75)}px`;
		view.classList = 'searchingElement element center';
		view.innerHTML = i;
		let node = { links: [], visited: false, view: view };
		newArray = [ ...newArray, node ];
	}
	return newArray;
}

function createConnections(arr) {
	newArray = arr
	newArray.forEach((node, i) => {
		let numLinks = Math.floor(Math.random() * (newArray.length / 3));
		while (node.links.length < numLinks) {
			let connectionNode = Math.floor(Math.random() * newArray.length);
			let connectionWeight = Math.floor(Math.random() * 10);
			if (node.links.indexOf(connectionNode) === -1 && connectionNode !== i) {
				connection = {connectionNode: connectionNode, connectionWeight: connectionWeight}
				node.links.push(connection);
			}
		}
	});
	return newArray
}

function setSearchable(i) {
    switch (toggleSearchable) {
        case 'origin':
            origin = i;
            toggleSearchable  = 'target';
            break;
        case 'target':
            target = i;
            toggleSearchable = 'origin';
            break;
    }

    changeAllStyles(searchingData, defaultColor);
    if (origin !== undefined) {
        changeOneStyle(searchingData, origin, specialColor);
    }
    if (target !== undefined) {
        changeOneStyle(searchingData, target, specialColor3);
    }
}

async function breadthFirst(graph, origin, target) {
	let queue = [ origin ];
	graph[origin].visited = true;

	while (queue.length > 0) {
		let index = queue.shift();
		graph[origin].view.style.zIndex = 100;
		graph[origin].view.style.transform = `translate(
			${graph[index].view.offsetLeft - graph[origin].view.offsetLeft}px,
			${graph[index].view.offsetTop - graph[origin].view.offsetTop}px)`;
		await sleep(1000);
		if (index === target) {
			alert(`Found index: ${target} from ${origin}`);
			return true;
		}
		graph[index].visited = true;
		graph[index].links.forEach((link) => {
			if (graph[link].visited === false) {
				queue.push(link.connectionNode);
			}
		});
		await sleep(timeToPause);
	}
	alert(`No path to index: ${target} from ${origin}`);
	return false;
}

async function depthFirst(graph, origin, target) {
	let stack = [ origin ];
	graph[origin].visited = true;

	while (stack.length > 0) {
		let currentNode = stack.pop();
		graph[origin].view.style.zIndex = 100;
		graph[origin].view.style.transform = `translate(
			${graph[currentNode].view.offsetLeft - graph[origin].view.offsetLeft}px,
			${graph[currentNode].view.offsetTop - graph[origin].view.offsetTop}px)`;
		await sleep(1000);
		if (currentNode === target) {
			alert(`Found index: ${target} from ${origin}`);
			return true;
		}
		graph[currentNode].visited = true;
		graph[currentNode].links.forEach((link) => {
			console.log(link)
			if (link.visited === false) {
				stack.push(link.connectionNode);
			}
		});
		await sleep(timeToPause);
	}
	alert(`No path to index: ${target} from ${origin}`);
	return false;
}