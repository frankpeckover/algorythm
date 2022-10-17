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
var windowHeight;
var methodSelector;
var speedSelector;
var dataDiv;
var svg;
var algorithm = `sorting`;
//#region main

window.onload = () => {
	numberSelector = document.getElementById('number');
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	methodSelector = document.getElementById('methods');
	speedSelector = document.getElementById('speed');
	dataDiv = document.getElementById('data');
	svg = document.getElementById('svg');
	updateSpeed();
	refresh();
};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min)
}

function shuffle(array) {
	array.sort(() => Math.random() - 0.5);
  }

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
		case 'maze':
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
	clearScreen();
	if (!isRunning) {
		switch (algorithm) {
			case 'sorting':
				width = (windowWidth - numberSelector.value) / numberSelector.value;
				data = createRandomArray(numberSelector.value, 1, 100);
				initialRender(data);
				updateRender(data);
				break;
			case 'searching':
				data = createConnections(generateGraph(numberSelector.value));
				initialRender(data);
				addEdges(data);
				origin = undefined;
				target = undefined;
				break;
			case 'maze':
				data = buildGrid(35, 55);
				data.forEach(arr => {
					initialRender(arr)
				});
				//generateMaze(data, data[0][0])
				generateMaze(data, data[Math.floor(data.length / 2)][Math.floor(data[0].length / 2)])
				traverseMaze(data, data[0][0], data[Math.floor(data.length / 2)][Math.floor(data[0].length / 2)])
				break;
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
	isRunning = false;
}

function updateRender(arr) {
	let totalWidth = arr.length * width;
	let remainderWidth = windowWidth - totalWidth;
	for (let i = 0; i < arr.length; i++) {
		arr[i].view.style.left = `${i * width + remainderWidth / 2}px`;
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
	arr.forEach(element => {
		dataDiv.appendChild(element.view);
	})
}

function changeOneStyle(arr, index, colorString) {
	arr[index].view.style.background = colorString;
}

function changeAllStyles(arr, colorString) {
	for (i = 0; i < arr.length; i++) {
		changeOneStyle(arr, i, colorString);
	}
}