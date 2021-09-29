'use strict';
// IMPORTS
import * as utils from '../../common/utils';
import * as controls from '../controls';
import document from 'document';


// VARIABLES
let flashingBricks;
let endFlashAmt = 7;
let speed = 15;
let direction = 1;
let level = 1;
let score = 0;
let shownBricks = [];
const localRowCount = 9;
export let activeBricks = [[3, 8], [4, 8], [5, 8]];


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

function hslToHex(h, s, l) {
	h /= 360;
	s /= 100;
	l /= 100;
	let r, g, b;
	if (s === 0) {
	  r = g = b = l; // achromatic
	} else {
	  const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	  };
	  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	  const p = 2 * l - q;
	  r = hue2rgb(p, q, h + 1 / 3);
	  g = hue2rgb(p, q, h);
	  b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = x => {
	  const hex = Math.round(x * 255).toString(16);
	  return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


const myGradient = document.getElementById('bgGradient');
const scoreText = document.getElementById("current-score-text");
const finalScoreText = document.getElementById("final-score-text");
const lastHue1 = 0;
const lastHue2 = 50;

function shiftHue(amount) {
	//console.log("Current Colors: " + lastHue1 + " and " + lastHue2);
	lastHue1 = lastHue1 + amount
	lastHue2 = lastHue2 + amount
	if (lastHue1 >= 360) {
		lastHue1 = lastHue1 - 360
	}
	if (lastHue2 >= 360) {
		lastHue2 = lastHue2 - 360
	}
	myGradient.gradient.colors.c1 = hslToHex(lastHue1,100,50);
	myGradient.gradient.colors.c2 = hslToHex(lastHue2,100,50);
}

function resetVariables() {
	flashingBricks;
	endFlashAmt = 7;
	speed = 15;
	direction = 1;
	level = 1;
	score = 0;
	shownBricks = [];
	activeBricks = [[3, 8], [4, 8], [5, 8]];
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
	}


	// Add up score
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


export function gmDrunkSetup(status, { rowCount }) {
	myGradient.gradient.colors.c1 = "red";
	myGradient.gradient.colors.c2 = "lime";
	localRowCount = rowCount;
	
	activeBricks.forEach(utils.show);
	calculateCurrentSpeed();
	scoreText.text = "Score: 0"
	controls.onTap(screenClick);
	status.progress++; 
}

export function gmDrunk(status, { colCount }) {
	status.score = score;
	shiftHue(7);
	// Aiden's special formula thing that makes the movement random but also following the speed increase
	if (status.frame % Math.ceil(Math.random() * speed) == 0) {
		// Shifting the background color gradient
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

export function gmDrunkGameEnd(status, {}) {
	if (status.frame % 3 == 0) {
		if (endFlashAmt != 0) {
			flashingBricks.forEach(utils.flip);
			endFlashAmt--;
		} else {
			if (shownBricks.length != 0) {
				utils.hide(shownBricks.pop());
			} else {
				controls.onTapRemove(screenClick);
				resetVariables();
				status.progress = 100;
			}
		}
	}
}