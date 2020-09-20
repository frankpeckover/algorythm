var data = [];
var time;
var defaultColor = 'cyan';
var selectedColor = 'red';
var specialColor = 'purple';
var specialColor2 = 'black';
var specialColor3 = 'orange';
var confirmedColor = 'green';
var isSorting = false;
var width;
var number;
var slider;
var windowWidth;
var numberSelector;
var speedSelector;
var parent;

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

async function sort() {
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
			data = quickSort(data, 0, data.length);
			break;
		case 'merge':
			data = mergeSort(data);
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
	changeAllStyles(data, confirmedColor);
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
				changeOneStyle(data, minIndex, specialColor);
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
	changeAllStyles(data, confirmedColor);
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
	changeAllStyles(data, confirmedColor);
	isSorting = false;
	return data;
}

async function mergeSort(data) {
	let color;
	if (data.length < 2) {
		return data;
	}

	let leftArr;
	let rightArr;
	let half;

	half = Math.ceil(data.length / 2);
	leftArr = await mergeSort(data.splice(0, half));
	color1 = Math.floor(Math.random() * 255 + 1);
	color2 = Math.floor(Math.random() * 255 + 1);
	color3 = Math.floor(Math.random() * 255 + 1);
	leftArr.forEach((e) => {
		e.view.style.background = `rgb(${color1}, ${color2}, ${color3})`;
	});
	await sleep(time);
	rightArr = await mergeSort(data.splice(-half));
	color1 = Math.random() * 255 + 1;
	color2 = Math.random() * 255 + 1;
	color3 = Math.random() * 255 + 1;
	console.log(color);
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
	isSorting = false;
	changeAllStyles(res, confirmedColor);
	updateRender(res);
	await sleep(time);
	return res;
}

async function quickSort(data, start, end) {
	for (i = start; i < end; i++) {
		data[i].view.style.background = specialColor3;
	}
	if (start >= end) return data;
	let pivotIndex = start;
	let pivotValue = data[pivotIndex].value;
	changeOneStyle(data, pivotIndex, specialColor);
	await sleep(time);
	let pointer = start;

	for (let i = start; i < end; i++) {
		if (i !== pivotIndex) {
			changeOneStyle(data, i, selectedColor);
			await sleep(time);
		}
		if (data[i].value < pivotValue) {
			pointer++;
			data = swap(data, i, pointer);
			changeOneStyle(data, pointer, defaultColor);
			await sleep(time);
			updateRender(data);
		}
		if (i !== pivotIndex) {
			changeOneStyle(data, i, defaultColor);
			await sleep(time);
		}
	}
	data = swap(data, start, pointer);
	changeOneStyle(data, pointer, defaultColor);
	await sleep(time);
	updateRender(data);
	data = await quickSort(data, start, pointer);
	data = await quickSort(data, pointer + 1, end);
	isSorting = false;
	return data;
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
	console.log(newArray);
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
