var data = [];
var time;
var defaultColor = 'cyan';
var selectedColor = 'red';
var minColor = 'purple';
var confirmedColor = 'green';
var badColor = 'black';
var isSorting = false;
var width;
var number;
var slider;
var windowWidth;
var numberSelector;
var speedSelector;
var parent;

var TESTARRAY = [
	25,
	123,
	1423,
	4,
	52,
	6,
	354,
	73,
	7
];

window.onload = () => {
	slider = document.getElementById('number');
	windowWidth = window.innerWidth;
	numberSelector = document.getElementById('sorts');
	speedSelector = document.getElementById('speed');
	parent = document.getElementById('data');
	updateSpeed();
	refresh();
};

function updateSpeed() {
	time = (100 - speedSelector.value) / 100;
	time *= 2500;
	time += 1;
}

function refresh() {
	if (!isSorting) {
		number = slider.value;
		width = (windowWidth - number) / number;
		data = createRandomArray(number, 1, 100);
		initialRender(data);
		updateRender(data);
	}
}

function sort() {
	if (isSorting) {
		return;
	}
	isSorting = true;
	let func = numberSelector.options[numberSelector.selectedIndex].value;
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
			data = quickSort(data);
			console.log(data);
			break;
	}
}

async function bubbleSort(data) {
	let swapped = true;
	while (swapped) {
		swapped = false;
		for (let i = 1; i < data.length; i++) {
			changeOneStyle(data, i, selectedColor);
			changeOneStyle(data, i - 1, selectedColor);
			await sleep(time);
			if (data[i].value < data[i - 1].value) {
				swapped = true;
				data = swap(data, i, i - 1);
				updateRender(data);
				await sleep(time);
			}
			changeOneStyle(data, i, defaultColor);
			changeOneStyle(data, i - 1, defaultColor);
		}
	}
	if (isSorted(data)) {
		changeAllStyles(data, confirmedColor);
	} else {
		changeAllStyles(data, badColor);
	}
	isSorting = false;
	return data;
}

async function selectionSort(data) {
	let minIndex;
	for (let i = 0; i < data.length - 1; i++) {
		changeOneStyle(data, i, selectedColor);
		await sleep(time);
		minIndex = i;
		for (let j = i + 1; j < data.length; j++) {
			changeOneStyle(data, j, selectedColor);
			await sleep(time);
			if (data[j].value < data[minIndex].value) {
				if (data[minIndex] !== data[i] && data[minIndex] !== data[j]) {
					changeOneStyle(data, minIndex, defaultColor);
				}
				minIndex = j;
				changeOneStyle(data, minIndex, minColor);
				await sleep(time);
			}
			if (data[j] !== data[minIndex]) {
				changeOneStyle(data, j, defaultColor);
				await sleep(time);
			}
		}
		if (minIndex !== i) {
			data = swap(data, i, minIndex);
			updateRender(data);
			await sleep(time);
		}
		changeAllStyles(data, defaultColor);
		await sleep(time);
	}

	if (isSorted(data)) {
		changeAllStyles(data, confirmedColor);
	} else {
		changeAllStyles(data, badColor);
	}
	isSorting = false;
	return data;
}

async function insertionSort(data) {
	for (i = 1; i < data.length; i++) {
		changeOneStyle(data, i, confirmedColor);
		await sleep(time);
		let removed = data[i];
		data = remove(data, i);
		await sleep(time);
		for (let j = i - 1; j >= 0; j--) {
			changeOneStyle(data, j, selectedColor);
			await sleep(time);
			if (removed.value > data[j].value) {
				data = insert(data, removed, j + 1);
				updateRender(data);
				changeOneStyle(data, j + 1, defaultColor);
				changeOneStyle(data, j, defaultColor);
				break;
			} else if (j === 0) {
				data = insert(data, removed, 0);
				updateRender(data);
				changeOneStyle(data, j + 1, defaultColor);
				changeOneStyle(data, j, defaultColor);
				break;
			}
			changeOneStyle(data, j, defaultColor);
			await sleep(time);
		}
	}
	if (isSorted(data)) {
		changeAllStyles(data, confirmedColor);
	} else {
		changeAllStyles(data, badColor);
	}
	isSorting = false;
	return data;
}

function quickSort(data) {
	console.log('IMPLEMENT ME!');
	data.forEach((element) => {
		element.view.style.innerHTML = 'IMPLEMENT ME';
	});
}

function remove(arr, index) {
	let newArr = [
		...arr
	];
	newArr.splice(index, 1);
	return newArr;
}

function insert(arr, value, index) {
	let newArr = [
		...arr
	];
	newArr.splice(index, 0, value);
	return newArr;
}

function swap(arr, i, j) {
	let newArr = [
		...arr
	];
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
		view.style.transition = `all ${time}`;
		newArray = [
			...newArray,
			{ value: value, view: view }
		];
	}
	return newArray;
}

function changeOneStyle(array, index, colorString) {
	array[index].view.style.background = colorString;
}

function changeAllStyles(arr, colorString) {
	for (i = 0; i < arr.length; i++) {
		changeOneStyle(arr, i, colorString);
	}
}

function initialRender(data) {
	clearScreen();
	for (let i = 0; i < data.length; i++) {
		parent.appendChild(data[i].view);
	}
}

function updateRender(data) {
	let total = data.length * width;
	let remainder = windowWidth - total;
	for (let i = 0; i < data.length; i++) {
		data[i].view.style.left = `${i * width + remainder / 2}px`;
	}
}

function clearScreen() {
	parent.innerHTML = '';
}

async function sleep(time) {
	await new Promise((resolve) =>
		setTimeout(() => {
			resolve();
		}, time)
	);
}
