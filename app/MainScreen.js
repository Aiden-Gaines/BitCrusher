// IMPORTS
import * as document from 'document';
import * as controls from './controls';
import * as utils from '../common/utils';


//VARIABLES
const mainScreenElems = document.getElementsByClassName('mainmenu-screen')[0];
let rowOffset = 0;
let clicked = false;
let firstRunMain = true;
let firstRunSetup = true;


//FUNCTIONS
function screenClick(evt) { clicked = true; }

// Sets the dynamic file variables to the value they had at the start of the program
function resetVariables() {
	clicked = false;
	firstRunMain = true;
	firstRunSetup = true;
	rowOffset = 0;
}

export function mainMenuSetup(status, { rowCount, colCount }) {
	if (firstRunSetup) {
		const myGradient = document.getElementById('bgGradient');
		myGradient.gradient.colors.c1 = 'yellow';
		myGradient.gradient.colors.c2 = 'lime';
        mainScreenElems.children.forEach((item) => { item.class = ""; });
		firstRunSetup = false;
	}

	// Show a row of bricks
	for (let x = colCount; x--;) {
		utils.show(utils.convert1Dto2D((rowOffset * colCount) + x));
	}

	rowOffset++;

	// If we have shown all the bricks
	if (rowCount <= rowOffset) { status.progress++; }
}

export function mainMenu(status, {}) {
    if (firstRunMain){
        controls.onTap(screenClick);
        firstRunMain = false;
    }
    if (clicked){
		mainScreenElems.children.forEach((item) => { item.class = "hidden"; });
		controls.onTapRemove(screenClick);
		resetVariables();
        status.progress++;
    }
}
