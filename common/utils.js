'use strict';
// IMPORTS
import { getBrick } from "../app/setup";


// FUNCTIONS
// Find the difference between two sets
export function arrSymDiff(arr1, arr2) {
	return arr1
		.filter(x => -1 == arr2.indexOf(x))
		.concat(arr2.filter(x => -1 == arr1.indexOf(x)));
}

// Used to get the brick object from the brick array, if given a brick object already, does nothing
export function getCheckBrick(brick) {
	return ((brick.class == undefined) ? getBrick(brick) : brick);
}

// Ensures the passed in brick is an object then sets its class to "" (showing it)
export function show(brick) {
	getCheckBrick(brick).class = "";
}

// Ensures the passed in brick is an object then sets its class to "hide" (hiding it)
export function hide(brick) {
	getCheckBrick(brick).class = "hide";
}

// Ensures the passed in brick is an object then flipping its classed based on the current class
export function flip(brick) {
	brick = getCheckBrick(brick);
	switch (brick.class) {
		case ('hide'):
			show(brick);
			break;
		case (''):
			hide(brick);
			break;
		default:
			console.warn(`Tried to flip brick (${brick}), but could not determine current class!`);
	}
}

// Convert index for 1D array to the equivalent in a 2D array [x, y]
export function convert1Dto2D(index) {
	return [index % 9, Math.floor(index / 9)];
}
