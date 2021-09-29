'use strict';
// IMPORTS
import * as document from "document";


// VARIABLES
const clickFuncs = [];
const coordClickFuncs = [];


// FUNCTIONS
export function onTap(func) {
	clickFuncs.push(func);
}

export function onTapCoords(func, x1, y1, x2, y2) {
	if (x1 >= x2 || y1 >= y2) {
		throw new Error('onTapCoords first coordinates must be smaller than the second coordinates.');
	}
	coordClickFuncs.push([func, x1, x2, y1, y2]);
}

export function onTapRemove(func) {
	let checkVar = clickFuncs.indexOf(func);

	if (checkVar > -1) {
		clickFuncs.splice(checkVar, 1);
		return;
	}

	checkVar = coordClickFuncs.filter(item => item[0] == func);

	if (checkVar.length != 0) {
		coordClickFuncs.splice(coordClickFuncs.indexOf(checkVar[0]), 1);
	}
}


// MAIN
let button = document.getElementById('button-screenwide');

button.onclick = function(evt) {
	// Handle functions that are screenwide
	clickFuncs.forEach((item) => { item.call(this, evt) });

	// Handle functions with a given coordinate system
	coordClickFuncs.forEach((item) => {
		let func, x1, x2, y1, y2;
		[func, x1, x2, y1, y2] = item;

		// Check if the point is between the coordinates given
		if (x1 <= evt.screenX && evt.screenX <= x2 && y1 <= evt.screenY && evt.screenY <= y2) {
			func.call(this, evt);
		}
	});
}