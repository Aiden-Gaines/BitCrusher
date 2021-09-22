'use strict';
// IMPORTS
import * as document from 'document';


// VARIABLES
const gameoverElems = document.getElementsByClassName('gameover');
export const gameoverTextElem = document.getElementsByClassName('gameover-text');


// FUNCTIONS
export function gameover(status, {}) {
	gameoverElems.forEach((item) => { item.class = item.class.slice(6); });
	// Permanently kill the animation loop
	status.progress = -1;
}
