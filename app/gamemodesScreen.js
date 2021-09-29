// IMPORTS
import * as document from 'document';
import * as controls from './controls';


//VARIABLES
const gameScreenElems = document.getElementsByClassName('gamemode-screen')[0];
let clicked = false;
let firstRun = true;


//FUNCTIONS
function screenClick(evt) { clicked = true; }

// Sets the dynamic file variables to the value they had at the start of the program
function resetVariables() {
	clicked = false;
	firstRun = true;
}

export function GameScreen(status, {}) {
    if (firstRun){
        gameScreenElems.children.forEach((item) => { item.class = ""; });
        controls.onTap(screenClick);
        firstRun = false;
    }
    if (clicked){
		gameScreenElems.children.forEach((item) => { item.class = "hidden"; });
		controls.onTapRemove(screenClick);
		resetVariables();
        status.progress++;
    }
}
