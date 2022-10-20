var data = [];
var timeToPause;
var maximumPause = 500;

var defaultColor = '#8C6183';
var selectedColor = 'red';
var specialColor = 'purple';
var specialColor2 = 'black';
var specialColor3 = 'orange';
var confirmedColor = 'green';

var numberSlider;
var methodSelector;
var speedSlider;

var numberLabel;
var speedLabel;

var dataDiv;
var dataDivWidth;
var dataDivHeight;

var svg;
var algorithm = `sorting`;
//#region main

window.onload = () => {
	numberSlider = document.getElementById('number');
	numberLabel = document.getElementById("numberLabel");
	methodSelector = document.getElementById('methods');
	speedSlider = document.getElementById('speed');
	speedLabel = document.getElementById("speedLabel");
	svg = document.getElementById('svg');
	dataDiv = document.getElementById('data');

	dataDivWidth = dataDiv.offsetWidth;
	dataDivHeight = dataDiv.offsetHeight;

	speedSlider.addEventListener('input', function() {
		showSliderValue(speedLabel, speedSlider)
	}, false)
	showSliderValue(speedLabel, speedSlider)
	numberSlider.addEventListener('input', function() {
		showSliderValue(numberLabel, numberSlider)}
		, false)
	showSliderValue(numberLabel, numberSlider)

	updateSpeed();
	refresh();
};

function showSliderValue(labelToChange, rangeSlider) {
	labelToChange.innerHTML = rangeSlider.value;
}

function setAlgorithm(string) {
	algorithm = string;
	switch (string) {
		case 'sorting':
			methodSelector.innerHTML = `
				<option value="quick">Quick</option>
				<option value="merge">Merge</option>
				<option value="insertion">Insertion</option>
				<option value="bubble">Bubble</option>
				<option value="selection">Selection</option>`;
			numberSlider.min = 25;
			numberSlider.max = 200;
			numberSlider.value = 25;
			break;
		case 'searching':
			methodSelector.innerHTML = `
				<option value="depth">Depth First</option>
				<option value="breadth">Breadth First</option>`;
			numberSlider.min = 5;
			numberSlider.max = 25;
			numberSlider.value = 10;
			break;
		case 'maze':
			methodSelector.innerHTML = `
				<option value="build">Build Maze</option>
				<option value="solveBreadth">Solve Breadth First</option>;
				<option value="solveDepth">Solve Depth First</option>`;
			numberSlider.min = 100;
			numberSlider.max = 1000;
			numberSlider.value = 250;
			break;
	}
	refresh();
}

function updateSpeed() {
	timeToPause = (1 - (speedSlider.value / 100)) * maximumPause;
}

function refresh() {
	clearScreen();
	switch (algorithm) {
		case 'sorting':
			width = (dataDivWidth - numberSlider.value) / numberSlider.value;
			data = createRandomArray(numberSlider.value, 1, 100);
			initialRender(data);
			updateRender(data);
			break;
		case 'searching':
			data = generateGraph(numberSlider.value);
			data = createConnections(data);
			initialRender(data);
			addEdges(data);
			origin = 1;
			target = data[data.length - 1];
			break;
		case 'maze':
			squares = Math.floor(Math.sqrt(numberSlider.value));
			data = buildGrid(squares, squares);
			data.forEach(arr => {
				initialRender(arr)
			});
			break;
	}
}

async function run() {
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
		case 'maze':
			refresh()
			switch (func) {
				case 'build':
					generateMaze(data, data[Math.floor(data.length / 2)][Math.floor(data[0].length / 2)], true)
					break;
				case 'solveBreadth':
					generateMaze(data, data[Math.floor(data.length / 2)][Math.floor(data[0].length / 2)], false)
					traverseBreadthFirst(data[0][0], data[data.length - 1][data[0].length - 1]);
					break;
				case 'solveDepth':
					generateMaze(data, data[Math.floor(data.length / 2)][Math.floor(data[0].length / 2)], false)
					traverseDepthFirst(data[0][0], data[data.length - 1][data[0].length - 1]);
					break;
				}
			}

}

function updateRender(arr) {
	let totalWidth = arr.length * width;
	let remainderWidth = dataDivWidth - totalWidth;
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