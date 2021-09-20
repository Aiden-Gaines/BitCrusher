'use strict';
// IMPORTS
import * as utils from '../../common/utils';


// VARIABLES
const direction = 1;
const shownBricks = [];
export const activeBricks = [[3, 8], [4, 8], [5, 8]];


// FUNCTIONS
function getNewActiveBricks(colCount) {
	// Assumes the activeBricks is sorted low to high, creates a new activeBricks array based on the direction we are currently moving
	const newActiveBricks = [];

	// If we are at the end of the row, turn around
	if (activeBricks[activeBricks.length - 1][0] == colCount - 1) direction *= -1;
	if (activeBricks[0][0] == 0) direction *= -1;
	// Move the bricks in the selected direction
	for (const brick of activeBricks) {
		newActiveBricks.push([brick[0] + direction, brick[1]])
	}

	return newActiveBricks;
}

export function gmClassic(status, { colCount }) {
	if (status.frame % 10 == 0) {
		const newActiveBricks = getNewActiveBricks(colCount);
		const switchBricks = utils.arrSymDiff(activeBricks, newActiveBricks);

		for (const brick of switchBricks) {
			utils.flip(brick);
		}

		activeBricks = newActiveBricks;
	}
}
