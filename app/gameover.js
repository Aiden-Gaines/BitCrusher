// IMPORTS
import * as document from 'document';
import * as controls from './controls';


//VARIABLES
const endScreenElems = document.getElementsByClassName('gameover-screen')[0];
const scoreText = document.getElementById("current-score-text");
const finalScoreText = document.getElementById("final-score-text");
let clicked = false;
let firstRun = true;


//FUNCTIONS
function screenClick(evt) { clicked = true; }

function resetVariables() {
	clicked = false;
	firstRun = true;
}

export function gameover(status, { progressStates }) {
	if (firstRun){
		//Hide top score text and show final score
		scoreText.text = ""
		finalScoreText.text = "Score: " + status.score;
		endScreenElems.children.forEach((item) => { item.class = ''; });
		//use other contols button
		controls.onTap(screenClick);
		firstRun = false;
	}
	if (clicked) {
		//Remove final score text
		finalScoreText.text = "";
		endScreenElems.children.forEach((item) => { item.class = 'hidden'; });
		controls.onTapRemove(screenClick);
		resetVariables();
		status.progress = progressStates.mainMenuSetupScreen;
	}
}