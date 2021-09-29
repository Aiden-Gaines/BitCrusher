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
const level = 4;
const levelscompleted = 0;
const score = 0;
const shownBricks = [[3, 8], [4, 8], [5, 8],[3, 7], [4, 7], [5, 7],[3, 6], [4, 6], [5, 6],[3, 5], [4, 5], [5, 5]];
export const activeBricks = [[3, 4], [4, 4], [5, 4]];


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

const lastHue1 = 50;
const lastHue2 = 150;

function shiftHue(amount) {
	console.log("Current Colors: " + lastHue1 + " and " + lastHue2);
	lastHue1 = lastHue1 - amount
	lastHue2 = lastHue2 - amount
	if (lastHue1 <= 0) {
		lastHue1 = lastHue1 + 360
	}
	if (lastHue2 <= 0) {
		lastHue2 = lastHue2 + 360
	}
	myGradient.gradient.colors.c1 = hslToHex(lastHue1,100,50);
	myGradient.gradient.colors.c2 = hslToHex(lastHue2,100,50);
}


function screenClick(evt) {
	// Shifting the background color gradient to give the illusion as if you were going up
	shiftHue(10)
	// Don't do this for the first level because they can be placed anywhere
	if (level > 1) {
		// Get the x values of the top shown bricks (the bricks that we want to "land" on)
		const platformXs = getBrickRow(level - 1).map(item => item[0]);
		// Hide the bricks that are not on the platform bricks
		activeBricks.filter(brick => -1 == platformXs.indexOf(brick[0])).forEach(utils.hide);
		// "Remove" the bricks that are not on the platform bricks
		activeBricks = activeBricks.filter(brick => -1 != platformXs.indexOf(brick[0]));
	}

	// Moving shown bricks downwards
	const oldShownBricks = shownBricks;
	shownBricks.forEach(utils.hide)
    shownBricks = utils.moveBricks(shownBricks, [shownBricks[0][0] * 1, 1]);
	const switchBricks = utils.arrSymDiff(oldShownBricks, shownBricks);

	for (const brick of switchBricks) {
		utils.flip(brick);
	}
	console.log("Done!")
	// Move active bricks into shown bricks
	activeBricks.forEach((item) => { shownBricks.push(item); });
	console.log("Active Bricks: " + activeBricks)

	// Create new active bricks
	activeBricks = utils.moveBricks(activeBricks, [activeBricks[0][0] * 0, 0]);
	// Show the newly created active bricks
	activeBricks.forEach(utils.show);
	
		// Add up score
	
	levelscompleted += 1

	score += level * activeBricks.length;
	console.log("Adding " + levelscompleted * activeBricks.length + " to score.")
	console.log("Score: " + score)

	// Finish up
	calculateCurrentSpeed();
}


export function gmInfiniteSetup(status, { rowCount }) {
	myGradient.gradient.colors.c1 = hslToHex(lastHue1,100,50);
	myGradient.gradient.colors.c2 = hslToHex(lastHue2,100,50);
	localRowCount = rowCount;
	shownBricks.forEach(utils.show);
	activeBricks.forEach(utils.show);
	calculateCurrentSpeed();
	
	controls.onTap(screenClick);
	status.progress++; 
}

export function gmInfinite(status, { colCount }) {
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

export function gmInfiniteGameEnd(status, {}) {
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