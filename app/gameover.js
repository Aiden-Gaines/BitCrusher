// IMPORTS
import * as document from 'document';
import * as controls from './controls';


//VARIABLES
const endScreenElems = document.getElementsByClassName('gameover-screen')[0];
let clicked = false;
let firstRun = true;


//FUNCTIONS
function screenClick(evt) { clicked = true; }

export function gameover(status, { progressStates }) {
	if (firstRun){
		endScreenElems.children.forEach((item) => { item.class = ''; });
		//use other contols button
		controls.onTap(screenClick);
		firstRun = false;
	}
	if (clicked) {
		endScreenElems.children.forEach((item) => { item.class = 'hidden'; });
		controls.onTapRemove(screenClick);
		status.progress = progressStates.mainMenuScreen;
	}
}