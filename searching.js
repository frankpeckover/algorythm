var origin;
var target;
var toggleSearchable = 'origin';

width = 50
height = 50

function addEdges(nodes) {
	svg.innerHTML = `
	<defs>
		<marker id="mid" markerWidth="10" markerHeight="10" viewBox="-1 -1 2 2" orient="auto">
			<path fill="blue" d="M-1,-1 L1,0 -1,1 z" />
    	</marker>
	</defs>`;
	nodes.forEach((node) => {
		node.links.forEach((link) => {

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

function drawLine(x1, y1, x2, y2) {
	var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	line.setAttribute('points', `${x1},${y1} ${(x2 + x1) / 2},${(y2 + y1) / 2} ${x2},${y2}`);
	line.setAttribute('stroke', 'black');
	line.setAttribute('marker-mid', 'url(#mid)');
	svg.appendChild(line);
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
			let connection = Math.floor(Math.random() * newArray.length);
			if (node.links.indexOf(connection) === -1 && connection !== i) {
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

    changeAllStyles(data, defaultColor);
    if (origin !== undefined) {
        changeOneStyle(data, origin, specialColor);
    }
    if (target !== undefined) {
        changeOneStyle(data, target, specialColor3);
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
		graph[index].links.forEach((childIndex) => {
			if (graph[childIndex].visited === false) {
				queue.push(childIndex);
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
		let index = stack.pop();
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
		graph[index].links.forEach((child) => {
			if (graph[child].visited === false) {
				stack.push(child);
			}
		});
		await sleep(timeToPause);
	}
	alert(`No path to index: ${target} from ${origin}`);
	return false;
}

//#endregion
