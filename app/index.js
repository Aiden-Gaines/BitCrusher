'use strict';
// IMPORTS
// Local files
import { setup } from "./setup";
import { startup } from "./startup";
// System/Fitbit modules
import { memory } from "system";
import { display } from "display";
// Gamemodes
import { gmClassic, gmClassicSetup } from "./gamemodes/gmClassic";


// VARIABLES
const status = {
	frame: 0,
	progress: 0,
	currentRAFFrame: -1,
}
const globals = {
	// Values based on SVG, will not automatically update when one is changed
	brickSize: 30,
	brickBorder: 2,
	brickOffset: 6,
	rowCount: 9,
	colCount: 9,
}


// FUNCTIONS
function animate() {
	// Call this function on the next frame to complete the loop.   -Must be first thing done, so that the other rAF call gets completed before this one on the next frame
	status.currentRafFrame = requestAnimationFrame(animate);
	// console.log(`Running progress: ${status.progress} frame: ${status.frame}`);
	switch (status.progress) {
		// 0- While this file is still running itself
		case (0): break;
		// 1- Setup the gameboard
		case (1):
			requestAnimationFrame(() => setup(status, globals));
			break;
		// 2- Run whatever startup animation we want to have
		case (2):
			requestAnimationFrame(() => startup(status, globals));
			break;
		// 3- Setup for the classic gamemode
		case (3):
			requestAnimationFrame(() => gmClassicSetup(status, globals));
		// 4- Main loop for the classic gamemode
		case (4):
			requestAnimationFrame(() => gmClassic(status, globals));
			break;
	}

	// if ( status.frame % 5 == 0 ) console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

	// Increment the frame
	status.frame++;
}


// MAIN
// Hook the display.change event to fix a weird memory leak that I literally don't know what is causing it, but this fixes it. I hate the Fitbit SDK
display.addEventListener("change", () => {
	if (display.on) {
		animate();
	} else if (!display.on) {
		cancelAnimationFrame(globals.currentRafFrame);
	}
});

// Edit built-in prototypes (Array.prototype.equals and Array.prototype.indexOf overrides are coming from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript more specifically here https://jsfiddle.net/SamyBencherif/8352y6yw/ )
// Warn if overriding existing method
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array) return false;

	// compare lengths - can save a lot of time 
	if (this.length != array.length) return false;

	for (let i = 0; i < this.length; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i])) return false;       
		}
		else if (this[i] != array[i]) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;   
		}
	}
	return true;
}

if (Array.prototype.indexOf) console.warn("Overriding existing Array.prototype.indexOf");
Array.prototype.indexOf = function (thing) {
    // if the other array is a falsy value, return -1
    if (!this) return -1;
    
    //start by assuming the array doesn't contain the thing
    var result = -1;
    for (let i = 0; i < this.length; i++) {
		//if anything in the array is the thing then change our mind from before
		if (this[i] instanceof Array) {
			if (this[i].equals(thing))
				result = i;
		} else {
			if (this[i] === thing) result = i;
		}
	}

	//return the decision we left in the variable, result
    return result;
}

status.progress++;
animate();
