var data = [];
var time;
var defaultColor = 'cyan';
var selectedColor = 'red';
var specialColor = 'purple';
var specialColor2 = 'black';
var specialColor3 = 'orange';
var confirmedColor = 'green';
var isRunning = false;
var width;
var numberSelector;
var windowWidth;
var methodSelector;
var speedSelector;
var dataDiv;
var svg;
var algorithm = `sorting`;
var originInput;
var targetInput;

//#region main

window.onload = () => {
	numberSelector = document.getElementById('number');
	windowWidth = window.innerWidth;
	methodSelector = document.getElementById('methods');
	speedSelector = document.getElementById('speed');
	dataDiv = document.getElementById('data');
	svg = document.getElementById('svg');
	updateSpeed();
	refresh();
};

function setAlgo(string) {
	algorithm = string;
	switch (string) {
		case 'sorting':
			methodSelector.innerHTML = `
				<option value="quick">Quick</option>
				<option value="merge">Merge</option>
				<option value="insertion">Insertion</option>
				<option value="bubble">Bubble</option>
				<option value="selection">Selection</option>`;
			numberSelector.min = 25;
			numberSelector.max = 200;
			numberSelector.value = 25;
			break;
		case 'searching':
			methodSelector.innerHTML = `
				<option value="depth">Depth First</option>
				<option value="breadth">Breadth First</option>`;
			numberSelector.min = 5;
			numberSelector.max = 50;
			numberSelector.value = 10;
			break;
	}
	refresh();
}

function updateSpeed() {
	time = (100 - speedSelector.value) / 100;
	time *= 2500;
	time += 1;
}

function refresh() {
	if (!isRunning) {
		switch (algorithm) {
			case 'sorting':
				width = (windowWidth - numberSelector.value) / numberSelector.value;
				data = createRandomArray(numberSelector.value, 1, 100);
				initialRender(data);
				updateRender(data);
				break;
			case 'searching':
				data = generateGraph(numberSelector.value);
				initialRender(data);
				addEdges(data);
		}
	}
}

async function run() {
	if (isRunning) {
		return;
	}
	isRunning = true;
	let func = methodSelector.options[methodSelector.selectedIndex].value;
	switch (algorithm) {
		case 'sorting':
			switch (func) {
				case 'bubble':
					data = bubbleSort(data);
					break;

				case 'selection':
					data = selectionSort(data);
					break;

				case 'insertion':
					data = insertionSort(data);
					break;
				case 'quick':
					data = quickSort(data, 0, data.length);
					break;
				case 'merge':
					data = mergeSort(data);
					break;
			}
			break;
		case 'searching':
			switch (func) {
				case 'depth':
					data = depthFirst(data, origin, target);
					break;

				case 'breadth':
					data = breadthFirst(data, origin, target);
					break;
			}
			break;
	}
}

function updateRender(arr) {
	let total = arr.length * width;
	let remainder = windowWidth - total;
	for (let i = 0; i < arr.length; i++) {
		arr[i].view.style.left = `${i * width + remainder / 2}px`;
	}
}

function clearScreen() {
	dataDiv.innerHTML = '';
	svg.innerHTML = '';
}

async function sleep(time) {
	await new Promise((resolve) =>
		setTimeout(() => {
			resolve();
		}, time)
	);
}

function initialRender(arr) {
	clearScreen();
	for (let i = 0; i < arr.length; i++) {
		dataDiv.appendChild(arr[i].view);
	}
}

function changeOneStyle(arr, index, colorString) {
	arr[index].view.style.background = colorString;
}

function changeAllStyles(arr, colorString) {
	for (i = 0; i < arr.length; i++) {
		changeOneStyle(arr, i, colorString);
	}
}

//#endregion

//#region sorting

async function bubbleSort(arr) {
	let swapped = true;
	while (swapped) {
		swapped = false;
		for (let i = 1; i < arr.length; i++) {
			changeOneStyle(arr, i, selectedColor);
			changeOneStyle(arr, i - 1, selectedColor);
			await sleep(time);
			if (arr[i].value < arr[i - 1].value) {
				swapped = true;
				arr = swap(arr, i, i - 1);
				updateRender(arr);
				await sleep(time);
			}
			changeOneStyle(arr, i, defaultColor);
			changeOneStyle(arr, i - 1, defaultColor);
		}
	}
	changeAllStyles(arr, confirmedColor);
	isRunning = false;
	return arr;
}

async function selectionSort(arr) {
	let minIndex;
	for (let i = 0; i < arr.length - 1; i++) {
		changeOneStyle(arr, i, selectedColor);
		await sleep(time);
		minIndex = i;
		for (let j = i + 1; j < arr.length; j++) {
			changeOneStyle(arr, j, selectedColor);
			await sleep(time);
			if (arr[j].value < arr[minIndex].value) {
				if (arr[minIndex] !== arr[i] && arr[minIndex] !== arr[j]) {
					changeOneStyle(arr, minIndex, defaultColor);
				}
				minIndex = j;
				changeOneStyle(arr, minIndex, specialColor);
				await sleep(time);
			}
			if (arr[j] !== arr[minIndex]) {
				changeOneStyle(arr, j, defaultColor);
				await sleep(time);
			}
		}
		if (minIndex !== i) {
			arr = swap(arr, i, minIndex);
			updateRender(arr);
			await sleep(time);
		}
		changeAllStyles(arr, defaultColor);
		await sleep(time);
	}
	changeAllStyles(arr, confirmedColor);
	isRunning = false;
	return arr;
}

async function insertionSort(arr) {
	for (i = 1; i < arr.length; i++) {
		changeOneStyle(arr, i, confirmedColor);
		await sleep(time);
		let removed = arr[i];
		arr = remove(arr, i);
		await sleep(time);
		for (let j = i - 1; j >= 0; j--) {
			changeOneStyle(arr, j, selectedColor);
			await sleep(time);
			if (removed.value > arr[j].value) {
				arr = insert(arr, removed, j + 1);
				updateRender(arr);
				changeOneStyle(arr, j + 1, defaultColor);
				changeOneStyle(arr, j, defaultColor);
				break;
			} else if (j === 0) {
				arr = insert(arr, removed, 0);
				updateRender(arr);
				changeOneStyle(arr, j + 1, defaultColor);
				changeOneStyle(arr, j, defaultColor);
				break;
			}
			changeOneStyle(arr, j, defaultColor);
			await sleep(time);
		}
	}
	changeAllStyles(arr, confirmedColor);
	isRunning = false;
	return arr;
}

async function mergeSort(arr) {
	let color;
	if (arr.length < 2) {
		return arr;
	}

	let leftArr;
	let rightArr;
	let half;

	half = Math.ceil(arr.length / 2);
	leftArr = await mergeSort(arr.splice(0, half));
	color1 = Math.floor(Math.random() * 255 + 1);
	color2 = Math.floor(Math.random() * 255 + 1);
	color3 = Math.floor(Math.random() * 255 + 1);
	leftArr.forEach((e) => {
		e.view.style.background = `rgb(${color1}, ${color2}, ${color3})`;
	});
	await sleep(time);
	rightArr = await mergeSort(arr.splice(-half));
	color1 = Math.random() * 255 + 1;
	color2 = Math.random() * 255 + 1;
	color3 = Math.random() * 255 + 1;
	rightArr.forEach((e) => {
		e.view.style.background = `rgb(${color1}, ${color2}, ${color3})`;
	});
	await sleep(time);

	let result = [],
		i = 0,
		j = 0;

	while (i < leftArr.length && j < rightArr.length) {
		if (leftArr[i].value < rightArr[j].value) {
			result.push(leftArr[i++]);
		} else {
			result.push(rightArr[j++]);
		}
		updateRender(result);
		await sleep(time);
	}

	let res = result.concat(leftArr.slice(i)).concat(rightArr.slice(j));
	isRunning = false;
	changeAllStyles(res, confirmedColor);
	updateRender(res);
	await sleep(time);
	return res;
}

async function quickSort(arr, start, end) {
	for (i = start; i < end; i++) {
		arr[i].view.style.background = specialColor3;
	}
	if (start >= end) return arr;
	let pivotIndex = start;
	let pivotValue = arr[pivotIndex].value;
	changeOneStyle(arr, pivotIndex, specialColor);
	await sleep(time);
	let pointer = start;

	for (let i = start; i < end; i++) {
		if (i !== pivotIndex) {
			changeOneStyle(arr, i, selectedColor);
			await sleep(time);
		}
		if (arr[i].value < pivotValue) {
			pointer++;
			arr = swap(arr, i, pointer);
			changeOneStyle(arr, pointer, defaultColor);
			await sleep(time);
			updateRender(arr);
		}
		if (i !== pivotIndex) {
			changeOneStyle(arr, i, defaultColor);
			await sleep(time);
		}
	}
	arr = swap(arr, start, pointer);
	changeOneStyle(arr, pointer, defaultColor);
	await sleep(time);
	updateRender(arr);
	arr = await quickSort(arr, start, pointer);
	arr = await quickSort(arr, pointer + 1, end);
	isRunning = false;
	return arr;
}

function remove(arr, index) {
	let newArr = [ ...arr ];
	newArr.splice(index, 1);
	return newArr;
}

function insert(arr, value, index) {
	let newArr = [ ...arr ];
	newArr.splice(index, 0, value);
	return newArr;
}

function swap(arr, i, j) {
	let newArr = [ ...arr ];
	let temp = newArr[i];
	newArr[i] = newArr[j];
	newArr[j] = temp;
	return newArr;
}

function isSorted(arr) {
	let sorted = true;
	for (i = 0; i < arr.length - 1; i++) {
		if (arr[i].value > arr[i + 1].value) {
			sorted = false;
		}
	}
	return sorted;
}

function createRandomArray(length, min, max) {
	let newArray = [];
	let value;
	let view;
	for (i = 0; i < length; i++) {
		value = Math.floor(Math.random() * max + min);
		view = document.createElement('div');
		view.classList = 'element center';
		view.style.height = `${value * 7}px`;
		view.style.width = `${width}px`;
		view.style.left = `${width * i}px`;
		newArray = [ ...newArray, { value: value, view: view } ];
	}
	return newArray;
}

//#endregion

//#region searching

function setSearchParams() {}

function addEdges(nodes) {
	svg.innerHTML = `
	<defs>
		<marker id="mid" markerWidth="10" markerHeight="10" viewBox="-1 -1 2 2" orient="auto">
			<path fill="blue" d="M-1,-1 L1,0 -1,1 z" />
    	</marker>
	</defs>`;
	nodes.forEach((node) => {
		node.links.forEach((link) => {
			drawLine(
				parseInt(node.view.style.left.split('p')[0]) + parseInt(node.view.style.width.split('p')[0]) / 2,
				parseInt(node.view.style.top.split('p')[0]) + parseInt(node.view.style.height.split('p')[0]) / 2,
				parseInt(nodes[link].view.style.left.split('p')[0]) +
					parseInt(nodes[link].view.style.width.split('p')[0]) / 2,
				parseInt(nodes[link].view.style.top.split('p')[0]) +
					parseInt(nodes[link].view.style.height.split('p')[0]) / 2
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
		let view = document.createElement('div');
		width = 50;
		view.style.width = `${width}px`;
		height = 50;
		view.style.height = `${height}px`;
		view.style.borderRadius = `50%`;
		view.style.left = `${Math.floor(Math.random() * window.innerWidth - width * 2) + width * 2}px`;
		view.style.top = `${Math.floor(Math.random() * window.innerHeight * 0.8)}px`;
		view.classList = 'element center';
		view.innerHTML = i;
		let node = { links: [], visited: false, view: view };
		newArray = [ ...newArray, node ];
	}

	newArray.forEach((node, i) => {
		let numLinks = Math.floor(Math.random() * (newArray.length / 3));
		while (node.links.length < numLinks) {
			let connection = Math.floor(Math.random() * newArray.length);
			if (node.links.indexOf(connection) === -1 && connection !== i) {
				node.links.push(connection);
			}
		}
	});
	return newArray;
}

async function breadthFirst(graph, origin, target) {
	console.log(graph);
	if (origin >= graph.length) {
		console.log(`Origin: ${origin} too foocken big`);
		isRunning = false;
		return false;
	}
	let queue = [ origin ];
	graph[origin].visited = true;

	while (queue.length > 0) {
		let index = queue.shift();
		changeOneStyle(graph, index, selectedColor);
		await sleep(time);
		if (index === target) {
			isRunning = false;
			changeOneStyle(graph, index, confirmedColor);
			await sleep(time);
			return true;
		}
		graph[index].visited = true;
		graph[index].links.forEach((childIndex) => {
			if (graph[childIndex].visited === false) {
				queue.push(childIndex);
			}
		});
		changeOneStyle(graph, index, defaultColor);
		await sleep(time);
	}
	console.log(`No path to index: ${target}`);
	isRunning = false;
	return false;
}

async function depthFirst(graph, origin, target) {
	console.log(graph);
	if (origin >= graph.length) {
		console.log(`Origin: ${origin} too foocken big`);
		isRunning = false;
		return false;
	}
	let stack = [ origin ];
	graph[origin].visited = true;

	while (stack.length > 0) {
		let index = stack.pop();
		changeOneStyle(graph, index, selectedColor);
		await sleep(time);
		if (index === target) {
			changeOneStyle(graph, index, confirmedColor);
			await sleep(time);
			console.log(`Found index: ${target}`);
			isRunning = false;
			return true;
		}
		graph[index].visited = true;
		graph[index].links.forEach((child) => {
			if (graph[child].visited === false) {
				stack.push(child);
			}
		});
		changeOneStyle(graph, index, defaultColor);
		await sleep(time);
	}
	console.log(`Could not find index: ${target}`);
	isRunning = false;
	return false;
}

//#endregion
