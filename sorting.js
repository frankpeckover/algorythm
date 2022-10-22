var width;

async function bubbleSort(arr) {
	let swapped = true;
	while (swapped) {
		swapped = false;
		for (let i = 1; i < arr.length; i++) {
			changeOneStyle(arr, i, selectedColor);
			changeOneStyle(arr, i - 1, selectedColor);
			await sleep(timeToPauseToPause);
			if (arr[i].value < arr[i - 1].value) {
				swapped = true;
				arr = swap(arr, i, i - 1);
				updateSortingRender(arr);
				await sleep(timeToPauseToPause);
			}
			changeOneStyle(arr, i, defaultColor);
			changeOneStyle(arr, i - 1, defaultColor);
		}
	}
	changeAllStyles(arr, confirmedColor);
	return arr;
}

async function selectionSort(arr) {
	let minIndex;
	for (let i = 0; i < arr.length - 1; i++) {
		changeOneStyle(arr, i, selectedColor);
		await sleep(timeToPause);
		minIndex = i;
		for (let j = i + 1; j < arr.length; j++) {
			changeOneStyle(arr, j, selectedColor);
			await sleep(timeToPause);
			if (arr[j].value < arr[minIndex].value) {
				if (arr[minIndex] !== arr[i] && arr[minIndex] !== arr[j]) {
					changeOneStyle(arr, minIndex, defaultColor);
				}
				minIndex = j;
				changeOneStyle(arr, minIndex, specialColor);
				await sleep(timeToPause);
			}
			if (arr[j] !== arr[minIndex]) {
				changeOneStyle(arr, j, defaultColor);
				await sleep(timeToPause);
			}
		}
		if (minIndex !== i) {
			arr = swap(arr, i, minIndex);
			updateSortingRender(arr);
			await sleep(timeToPause);
		}
		changeAllStyles(arr, defaultColor);
		await sleep(timeToPause);
	}
	changeAllStyles(arr, confirmedColor);
	return arr;
}

async function insertionSort(arr) {
	for (i = 1; i < arr.length; i++) {
		changeOneStyle(arr, i, confirmedColor);
		await sleep(timeToPause);
		let removed = arr[i];
		arr = remove(arr, i);
		await sleep(timeToPause);
		for (let j = i - 1; j >= 0; j--) {
			changeOneStyle(arr, j, selectedColor);
			await sleep(timeToPause);
			if (removed.value > arr[j].value) {
				arr = insert(arr, removed, j + 1);
				updateSortingRender(arr);
				changeOneStyle(arr, j + 1, defaultColor);
				changeOneStyle(arr, j, defaultColor);
				break;
			} else if (j === 0) {
				arr = insert(arr, removed, 0);
				updateSortingRender(arr);
				changeOneStyle(arr, j + 1, defaultColor);
				changeOneStyle(arr, j, defaultColor);
				break;
			}
			changeOneStyle(arr, j, defaultColor);
			await sleep(timeToPause);
		}
	}
	changeAllStyles(arr, confirmedColor);
	return arr;
}

async function mergeSort(arr) {
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
	await sleep(timeToPause);
	rightArr = await mergeSort(arr.splice(-half));
	color1 = Math.random() * 255 + 1;
	color2 = Math.random() * 255 + 1;
	color3 = Math.random() * 255 + 1;
	rightArr.forEach((e) => {
		e.view.style.background = `rgb(${color1}, ${color2}, ${color3})`;
	});
	await sleep(timeToPause);

	let result = [],
		i = 0,
		j = 0;

	while (i < leftArr.length && j < rightArr.length) {
		if (leftArr[i].value < rightArr[j].value) {
			result.push(leftArr[i++]);
		} else {
			result.push(rightArr[j++]);
		}
		updateSortingRender(result);
		await sleep(timeToPause);
	}

	let res = result.concat(leftArr.slice(i)).concat(rightArr.slice(j));
	changeAllStyles(res, confirmedColor);
	updateSortingRender(res);
	await sleep(timeToPause);
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
	await sleep(timeToPause);
	let pointer = start;

	for (let i = start; i < end; i++) {
		if (i !== pivotIndex) {
			changeOneStyle(arr, i, selectedColor);
			await sleep(timeToPause);
		}
		if (arr[i].value < pivotValue) {
			pointer++;
			arr = swap(arr, i, pointer);
			changeOneStyle(arr, pointer, defaultColor);
			await sleep(timeToPause);
			updateSortingRender(arr);
		}
		if (i !== pivotIndex) {
			changeOneStyle(arr, i, defaultColor);
			await sleep(timeToPause);
		}
	}
	arr = swap(arr, start, pointer);
	changeOneStyle(arr, pointer, defaultColor);
	await sleep(timeToPause);
	updateSortingRender(arr);
	arr = await quickSort(arr, start, pointer);
	arr = await quickSort(arr, pointer + 1, end);
	if (isSorted(arr)) {
		changeAllStyles(arr, confirmedColor);
	}
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
		view.classList = 'sortingElement element center';
		view.style.height = `${value * 7}px`;
		view.style.width = `${width}px`;
		view.style.left = `${width * i}px`;
		newArray = [ ...newArray, { value: value, view: view } ];
	}
	return newArray;
}