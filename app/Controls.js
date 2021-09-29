'use strict';
// IMPORTS
import * as document from "document";


// TODO: Bulk up Controls.js
// Ideally would be a central control center for user interaction
// Kinda like an api for it so that other files can just say something like 'Controls.onScreenTap(function)' and
// then it would be automatically hooked and this file would manage having a bunch of function that might need to
// be run at once from one tap


// VARIABLES
const clickFuncs = [];


// FUNCTIONS
export function onTap(func) {
	clickFuncs.push(func);
	console.log(clickFuncs);
}

export function onTapRemove(func) {
	const index = clickFuncs.indexOf(func);
	if (index > -1) {
		clickFuncs.splice(index, 1);
	}
	console.log(clickFuncs);
}


// MAIN
let button = document.getElementById('button-screenwide');
button.onclick = function(evt) {
	clickFuncs.forEach((item) => { item.call(this, evt) });
}
