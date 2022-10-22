var sortingData = [];
var gridData = [];
var searchingData = [];

var timeToPause;
var maximumPause = 500;

var defaultColor = '#8C6183';
var selectedColor = 'red';
var specialColor = 'purple';
var specialColor2 = 'black';
var specialColor3 = 'orange';
var confirmedColor = 'green';

var itemsSlider;
var methodSelector;
var speedSlider;

var itemsLabel;
var speedLabel;

var dataDiv;
var dataDivWidth;
var dataDivHeight;

var svg;
var canvas;
var ctx;

var algorithm;

window.onload = () => {
	setElements();
	fitCanvas();
	updateSpeed();
};

function setElements() {
	itemsSlider = document.getElementById('number');
	itemsLabel = document.getElementById("numberLabel");
	methodSelector = document.getElementById('methods');
	speedSlider = document.getElementById('speed');
	speedLabel = document.getElementById("speedLabel");
	svg = document.getElementById('svg');
	dataDiv = document.getElementById('data');
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	dataDivWidth = dataDiv.offsetWidth;
	dataDivHeight = dataDiv.offsetHeight;
}

function fitCanvas() {
	canvas.width = canvas.offsetWidth;
	canvas.left = canvas.offsetLeft;
	canvas.top = canvas.offsetTop;
	canvas.height = canvas.offsetHeight;
}

function showSliderValue(labelToChange, rangeSlider) {
	labelToChange.innerHTML = rangeSlider.value;
}

function setItemSliderValues(min, max) {
	itemsSlider.min = min;
	itemsSlider.max = max;
	if (itemsSlider.value < min || itemsSlider.value > max) {
		itemsSlider.value = min;
	}
	showSliderValue(itemsLabel, itemsSlider);
}

function initialiseSorting(items) {
	console.log(items)
	clearScreen();
	algorithm = 'sorting';
	methodSelector.innerHTML = ` 
		<option value="quick">Quick</option>
		<option value="merge">Merge</option>
		<option value="insertion">Insertion</option>
		<option value="bubble">Bubble</option>
		<option value="selection">Selection</option>`;
	setItemSliderValues(25, 250);

	width = (dataDivWidth - items) / items;
	sortingData = createRandomArray(items, 1, 100);
	initialRender(sortingData);
	updateSortingRender(sortingData);
}

function initialiseSearching(items) {
	clearScreen();
	algorithm = 'searching';
	methodSelector.innerHTML = `
		<option value="depth">Depth First</option>
		<option value="breadth">Breadth First</option>`;
	setItemSliderValues(5, 25)

	searchingData = generateGraph(items);
	searchingData = createConnections(searchingData);
	initialRender(searchingData);
	addEdges(searchingData);
	origin = 1;
	target = searchingData[searchingData.length - 1];

}

function initialiseMaze(items) {
	clearScreen();
	algorithm = 'maze';
	methodSelector.innerHTML = `
		<option value="build">Build Maze</option>
		<option value="solveBreadth">Solve Breadth First</option>;
		<option value="solveDepth">Solve Depth First</option>`;
	setItemSliderValues(100, 4225);

	squareSize = Math.floor(Math.sqrt(items));
	gridData = buildGrid(squareSize, squareSize);
	gridData.forEach(arr => {
		initialRender(arr)
	});

}

function updateSpeed() {
	timeToPause = (1 - (speedSlider.value / 100)) * maximumPause;
}

function updateItems() {
	switch(algorithm) {
		case 'sorting':
			initialiseSorting(itemsSlider.value)
			break;
		case 'searching':
			initialiseSearching(itemsSlider.value)
			break;
		case 'maze':
			initialiseMaze(itemsSlider.value)
			break;
	}
}


async function run() {
	let func = methodSelector.options[methodSelector.selectedIndex].value;
	switch (algorithm) {
		case 'sorting':
			switch (func) {
				case 'bubble':
					sortingData = bubbleSort(sortingData);
					break;
				case 'selection':
					sortingData = selectionSort(sortingData);
					break;
				case 'insertion':
					sortingData = insertionSort(sortingData);
					break;
				case 'quick':
					sortingData = quickSort(sortingData, 0, sortingData.length);
					break;
				case 'merge':
					data = mergeSort(sortingData);
					break;
			}
			break;
		case 'searching':
			switch (func) {
				case 'depth':
					searchingData = depthFirst(searchingData, origin, target);
					break;

				case 'breadth':
					searchingData = breadthFirst(searchingData, origin, target);
					break;
			}
			break;
		case 'maze':
			switch (func) {
				case 'build':
					generateMaze(gridData, gridData[Math.floor(gridData.length / 2)][Math.floor(gridData[0].length / 2)], true)
					break;
				case 'solveBreadth':
					generateMaze(gridData, gridData[Math.floor(gridData.length / 2)][Math.floor(gridData[0].length / 2)], false)
					traverseBreadthFirst(gridData[0][0], gridData[gridData.length - 1][gridData[0].length - 1]);
					break;
				case 'solveDepth':
					generateMaze(gridData, gridData[Math.floor(gridData.length / 2)][Math.floor(gridData[0].length / 2)], false)
					traverseDepthFirst(gridData[0][0], gridData[gridData.length - 1][gridData[0].length - 1]);
					break;
				}
			}

}

function updateSortingRender(arr) {
	let totalWidth = arr.length * width;
	let remainderWidth = dataDivWidth - totalWidth;
	for (let i = 0; i < arr.length; i++) {
		arr[i].view.style.left = `${i * width + remainderWidth / 2}px`;
	}
}

function clearScreen() {
	dataDiv.innerHTML = '';
	svg.innerHTML = '';
	ctx.clearRect(0, 0, canvas.width + canvas.left, canvas.height + canvas.top)
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