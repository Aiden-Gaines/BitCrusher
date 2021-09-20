// Add zero in front of numbers < 10
export function zeroPad(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

// Find the difference between two sets
export function arrSymDiff(arr1, arr2) {
	return arr1
		// .filter(x => !arr2.includes(x))
		.filter(x => -1 == arr2.indexOf(x))
		.concat(arr2.filter(x => -1 == arr1.indexOf(x)));
}
