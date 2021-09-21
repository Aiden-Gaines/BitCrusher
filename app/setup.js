'use strict';
// IMPORTS
import * as document from 'document';


// VARIABLES
const brickArr = [];


// FUNCTIONS
export function getBrick(brickCoords) {
	return brickArr[brickCoords[1]][brickCoords[0]];
}

export function setup(status, { rowCount, colCount, brickSize, brickBorder, brickOffset }) {
	// Get each brick
	for (let y = 0; y < rowCount; y++) {
		const tempRowArr = [];

		for (let x = 0; x < colCount; x++) {
			tempRowArr.push(document.getElementById(`r${y}c${x}`))
		}

		brickArr.push(tempRowArr);
	}

	// Set each brick to the correct position
	for (let y = 0; y < rowCount; y++) {
		for (let x = 0; x < colCount; x++) {
			let brick = brickArr[y][x];
			brick.x = ((brickSize + brickBorder) * x) + brickOffset;
			brick.y = ((brickSize + brickBorder) * y) + brickOffset;
		}
	}

	status.progress++;
}
