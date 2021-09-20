// IMPORTS
import * as document from "document";


// VARIABLES
const brickArr = [];
// Values based on SVG, will not automatically update when one is changed
// const brickSize = 30;
// const brickBorder = 2;
// const brickOffset = 6;
// const rowCount = 9;
// const colCount = 9;


// FUNCTIONS
export function getBrick(brickCoords) {
	return brickArr[brickCoords[1]][brickCoords[0]];
}

export function setup(status, setupInfo) {
	// Get each brick
	for (let y = 0; y < setupInfo.rowCount; y++) {
		const tempArr = [];
		
		for (let x = 0; x < setupInfo.colCount; x++) {
			tempArr.push(document.getElementById(`r${y}c${x}`))
		}
		
		brickArr.push(tempArr);
	}
	
	// Set each brick to the correct position
	for (let y = 0; y < setupInfo.rowCount; y++) {
		for (let x = 0; x < setupInfo.colCount; x++) {
			let brick = brickArr[y][x];
			brick.x = ((setupInfo.brickSize + setupInfo.brickBorder) * x) + setupInfo.brickOffset;
			brick.y = ((setupInfo.brickSize + setupInfo.brickBorder) * y) + setupInfo.brickOffset;
		}
	}
	
	status.progress++;
}