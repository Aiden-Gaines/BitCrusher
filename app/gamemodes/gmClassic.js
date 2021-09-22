'use strict';
// IMPORTS
import * as utils from '../../common/utils';
import document from 'document';


// VARIABLES
const speed = 10;
const direction = 1;
const localRowCount = 9;
const level = 1;
const shownBricks = [];
export const activeBricks = [[3, 8], [4, 8], [5, 8]];


// FUNCTIONS
function calculateCurrentSpeed() {
	// Stupidly complex math function to control the amount of frames to wait between screen updates...
	// also will make sure we never have a value for speed less than 1 (which just makes things weird)
	speed = Math.max(Math.round((localRowCount * 49) / ((level + 5) ** 2)) - 1, 1);
	console.log(`speed is ${speed}`);
}

function getNewActiveBricks(colCount) {
	// Assumes the activeBricks is sorted low to high, creates a new activeBricks array based on the direction we are currently moving
	// If we are at the end of the row, turn around
	if (activeBricks[activeBricks.length - 1][0] == colCount - 1) direction = -1;
	if (activeBricks[0][0] == 0) direction = 1;

	return utils.moveBricks(activeBricks, [direction, 0]);
}

function getBrickRow(gameLevel) {
	const returnBricks = [];
	const shownIndex = shownBricks.length;
	while (shownIndex--) {
		const curBrick = shownBricks[shownIndex];
		if (curBrick[1] == (localRowCount - (gameLevel))) {
			returnBricks.push(curBrick);
		} else {
			break;
		}
	}

	return returnBricks;
}

function screenClick(evt) {
	if (level > 1) {
		const platformXs = getBrickRow(level - 1);
		// const platformXs = getBrickRow(level - 1).map(item => item[0]);
		console.log(platformXs);
		console.log(shownBricks);
		// activeBricks = activeBricks.filter(() => {
			
		// })
	}
	
	level++;
	// Move active bricks into shown bricks
	activeBricks.forEach((item) => { shownBricks.push(item); });
	// Create new active bricks in the new row
	activeBricks = utils.moveBricks(activeBricks, [activeBricks[0][0] * -1, -1]);
	// Show the newly created active bricks
	activeBricks.forEach(utils.show);
	
	// Finish up
	calculateCurrentSpeed();
}

export function gmClassicSetup(status, { rowCount }) {
	const myButton = document.getElementById('button-screenwide');
	localRowCount = rowCount;
	myButton.onclick = screenClick;

	activeBricks.forEach(utils.show);
	calculateCurrentSpeed();

	status.progress++; 
}

export function gmClassic(status, { colCount }) {
	if (status.frame % speed == 0) {
		const newActiveBricks = getNewActiveBricks(colCount);
		const switchBricks = utils.arrSymDiff(activeBricks, newActiveBricks);

		for (const brick of switchBricks) {
			utils.flip(brick);
		}

		activeBricks = newActiveBricks;
	}
}
