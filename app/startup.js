'use strict';
// IMPORTS
import * as utils from '../common/utils';


// VARIABLES
let setupIndex = 0;


// FUNCTIONS
export function startup(status, { rowCount, colCount }) {
	// Hide all bricks
	if (status.frame % 1 == 0) {
		utils.hide(utils.convert1Dto2D(setupIndex));
		setupIndex++;
	}

	// If we have hidden all the bricks
	if (setupIndex >= rowCount * colCount) status.progress = status.currentGamemode;
}
