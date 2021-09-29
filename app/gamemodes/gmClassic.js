'use strict';
// IMPORTS
import * as utils from '../../common/utils';
import * as controls from '../controls';
import document from 'document';


// VARIABLES
let flashingBricks;
let endFlashAmt = 7;
const speed = 10;
const direction = 1;
const localRowCount = 9;
const level = 1;
const score = 0;
const shownBricks = [];
export const activeBricks = [[3, 8], [4, 8], [5, 8]];


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
	const found = false;
	const returnBricks = [];
	const shownIndex = shownBricks.length;

	while (shownIndex--) {
		// Current brick we are on in the shownBrick array
		const curBrick = shownBricks[shownIndex];
		// If the current bricks index is 
		if (curBrick[1] == (localRowCount - gameLevel)) {
			returnBricks.push(curBrick);
			found = true;
		} else if (found) {
			break;
		}
	}

	return returnBricks;
}

const scoreText = document.getElementById("current-score-text");
const finalScoreText = document.getElementById("final-score-text");

function screenClick(evt) {
	// Don't do this for the first level because they can be placed anywhere
	if (level > 1) {
		// Get the x values of the top shown bricks (the bricks that we want to "land" on)
		const platformXs = getBrickRow(level - 1).map(item => item[0]);
		// Hide the bricks that are not on the platform bricks
		activeBricks.filter(brick => -1 == platformXs.indexOf(brick[0])).forEach(utils.hide);
		// "Remove" the bricks that are not on the platform bricks
		activeBricks = activeBricks.filter(brick => -1 != platformXs.indexOf(brick[0]));
	}
	// Add up & update score
	score += level * activeBricks.length;
	console.log("Adding " + level * activeBricks.length + " to score.")
	console.log("Score: " + score)

	scoreText.text = "Score: " + String(score);

	level++;

	// Move active bricks into shown bricks
	activeBricks.forEach((item) => { shownBricks.push(item); });

	// This checks if we are done with the top row and then ends the game
	if (level > localRowCount) {
		level++;
		activeBricks = [];
		return;
	}

	// Create new active bricks in the new row
	activeBricks = utils.moveBricks(activeBricks, [activeBricks[0][0] * -1, -1]);
	// Show the newly created active bricks
	activeBricks.forEach(utils.show);
	// Finish up
	calculateCurrentSpeed();
}

export function gmClassicSetup(status, { rowCount }) {
	const myGradient = document.getElementById('bgGradient');
	myGradient.gradient.colors.c1 = "red";
	myGradient.gradient.colors.c2 = "lime";
	scoreText.style.fill = "white";
	localRowCount = rowCount;
	
	activeBricks.forEach(utils.show);
	calculateCurrentSpeed();

	scoreText.text = "Score: 0"
	controls.onTap(screenClick);
	status.progress++; 
}

export function gmClassic(status, { colCount }) {
	status.score = score;
	if (status.frame % speed == 0) {
		if (activeBricks.length == 0) {
			// Last thing ran before starting closing animation loop
			// Set some variables once before we begin
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
				controls.onTapRemove(screenClick);
				status.progress = 100;
			}
		}
	}
}