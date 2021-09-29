// IMPORTS
import * as document from 'document';
import * as controls from './controls';


//VARIABLES
// const gameScreenElems = document.getElementsByClassName('gamemode-screen')[0];
let clicked = false;
let firstRun = true;
let selectedMode = 0;


//FUNCTIONS
function selectClassic() {
	clicked = true;
	selectedMode = 10;
}
function selectHardcode() {
	clicked = true;
	selectedMode = 20;
}
function selectInfinite() {
	clicked = true;
	selectedMode = 30;
}
function selectDrunk() {
	clicked = true;
	selectedMode = 40;
}

// Sets the dynamic file variables to the value they had at the start of the program
function resetVariables() {
	clicked = false;
	firstRun = true;
}

export function gameScreen(status, {}) {
	if (firstRun){
		// gameScreenElems.children.forEach((item) => { item.class = ""; });
		controls.onTapCoords(selectClassic, 0, 0, 150, 150);
		controls.onTapCoords(selectHardcode, 151, 0, 300, 150);
		controls.onTapCoords(selectInfinite, 0, 150, 150, 300);
		controls.onTapCoords(selectDrunk, 151, 151, 300, 300);
        firstRun = false;
    }
    if (clicked){
		// gameScreenElems.children.forEach((item) => { item.class = "hidden"; });
		controls.onTapRemove(selectClassic);
		resetVariables();
		status.currentGamemode = selectedMode;
        status.progress++;
    }
}
