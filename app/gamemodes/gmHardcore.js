'use strict';
// IMPORTS
import * as utils from '../../common/utils';
import document from 'document';
import { gameoverTextElem } from '../gameover';


// VARIABLES
let flashingBricks;
let endFlashAmt = 7;
const speed = 10;
const direction = 1;
const localRowCount = 9;
const level = 1;
const shownBricks = [];
export const activeBricks = [[4, 8]];


// FUNCTIONS
function calculateCurrentSpeed() {
	// Stupidly complex math function to control the amount of frames to wait between screen updates...
	// also will make sure we never have a value for speed less than 1 (which just makes things weird)
	speed = Math.max(Math.round((localRowCount * 49) / ((level + 5) ** 2)) - 1, 1);
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
		if (curBrick[1] == (localRowCount - gameLevel)) {
			returnBricks.push(curBrick);
		} else {
			break;
		}
	}

	return returnBricks;
}

function screenClick(evt) {
	// Don't do this for the first level because they can be placed anywhere
	if (level > 1) {
		// Get the x values of the top shown bricks (the bricks that we want to "land" on)
		const platformXs = getBrickRow(level - 1).map(item => item[0]);
		// Hide the bricks that are not on the platform bricks
		activeBricks.filter(brick => -1 == platformXs.indexOf(brick[0])).forEach(utils.hide);
		// "Remove" the bricks that are not on the platform bricks
		activeBricks = activeBricks.filter(brick => -1 != platformXs.indexOf(brick[0]));
	// This is for the final row, when we don't want to move upwards anymore, and instead trigger the end animation
	}

	level++;

	if (level == localRowCount - 1) {
		activeBricks = [];
		return;
	}

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
		if (activeBricks.length == 0) {
			// Last thing ran before starting closing animation loop
			// Set some variables once before we begin
			console.log(level - 2);
			flashingBricks = getBrickRow(level - 2);
			status.progress++;
			return;
		}
		const newActiveBricks = getNewActiveBricks(colCount);
		const switchBricks = utils.arrSymDiff(activeBricks, newActiveBricks);

		for (const brick of switchBricks) {
			utils.flip(brick);
		}

		activeBricks = newActiveBricks;
	}
}

export function gmClassicGameEnd(status, {}) {
	if (status.frame % 3 == 0) {
		if (endFlashAmt != 0) {
			flashingBricks.forEach(utils.flip);
			endFlashAmt--;
		} else {
			if (shownBricks.length != 0) {
				utils.hide(shownBricks.pop());
			} else {
				gameoverTextElem.class = "hidden gameover test";
				status.progress++;
			}
		}
	}
}