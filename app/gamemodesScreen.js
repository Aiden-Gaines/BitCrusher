// IMPORTS
import * as document from 'document';
import * as controls from './controls';


//VARIABLES
const gameScreenElems = document.getElementsByClassName('gamemode-screen')[0];
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
		gameScreenElems.children.forEach((item) => { item.class = ""; });
		controls.onTapCoords(selectClassic, 0, 0, 300, 75);
		controls.onTapCoords(selectHardcode, 0, 75, 300, 150);
		controls.onTapCoords(selectInfinite, 0, 150, 300, 225);
		controls.onTapCoords(selectDrunk, 0, 225, 300, 300);
        firstRun = false;
    }
    if (clicked){
		gameScreenElems.children.forEach((item) => { item.class = "hidden"; });
		controls.onTapRemove(selectClassic);
		controls.onTapRemove(selectHardcode);
		controls.onTapRemove(selectInfinite);
		controls.onTapRemove(selectDrunk);
		resetVariables();
		status.currentGamemode = selectedMode;
        status.progress++;
    }
}
