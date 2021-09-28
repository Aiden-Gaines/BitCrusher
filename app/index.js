'use strict';
// IMPORTS
// Local files
import { setup } from "./setup";
import { startup } from "./startup";
// System/Fitbit modules
// import { memory } from "system";
import { display } from "display";
// Gamemodes
import { gmClassic, gmClassicSetup, gmClassicGameEnd } from "./gamemodes/gmClassic";
import { gmHardcore, gmHardcoreSetup, gmHardcoreGameEnd } from "./gamemodes/gmHardcore";
import { gmDrunk, gmDrunkSetup, gmDrunkGameEnd } from "./gamemodes/gmDrunk";
import { gmInfinite, gmInfiniteSetup, gmInfiniteGameEnd } from "./gamemodes/gmInfinite";

import { gameover } from "./gameover";
import { MainScreen } from "./MainScreen";


// VARIABLES
const status = {
	frame: 0,
	progress: 0,
	currentRAFFrame: -1,
	currentGamemode: 40,
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
		// -1- This case is used when we want to permanently kill the animation loop until a full restart
		case (-1): cancelAnimationFrame(status.currentRAFFrame);
		// 0- While this file is still running itself
		case (0): break;
		// 1- Setup the gameboard
		case (1):
			requestAnimationFrame(() => setup(status, globals));
			break;
		// 1- Main screen
		case (2):
			requestAnimationFrame(() => MainScreen(status, globals));
			break;
		// 2- Run whatever startup animation we want to have
		case (3):
			requestAnimationFrame(() => startup(status, globals));
			break;
		// 10- Setup for the classic gamemode
		case (10):
			requestAnimationFrame(() => gmClassicSetup(status, globals));
		// 11- Main loop for the classic gamemode
		case (11):
			requestAnimationFrame(() => gmClassic(status, globals));
			break;
		// 12- Game end for classic gamemode
		case (12):
			requestAnimationFrame(() => gmClassicGameEnd(status, globals));
			break;
		// 20- Setup loop for the hardcore gamemode
		case (20):
			requestAnimationFrame(() => gmHardcoreSetup(status, globals));
		// 21- Main loop for the hardcore gamemode
		case (21):
			requestAnimationFrame(() => gmHardcore(status, globals));
			break;
		// 22- Game end for hardcore gamemode
		case (22):
			requestAnimationFrame(() => gmHardcoreGameEnd(status, globals));
			break;
		// 30- Setup loop for the infinite gamemode
		case (30):
			requestAnimationFrame(() => gmInfiniteSetup(status, globals));
		// 31- Main loop for the infinite gamemode
		case (31):
			requestAnimationFrame(() => gmInfinite(status, globals));
			break;
		// 32- Game end for infinite gamemode
		case (32):
			requestAnimationFrame(() => gmInfiniteGameEnd(status, globals));
			break;
		// 40- Setup loop for the drunk gamemode
		case (40):
			requestAnimationFrame(() => gmDrunkSetup(status, globals));
		// 41- Main loop for the drunk gamemode
		case (41):
			requestAnimationFrame(() => gmDrunk(status, globals));
			break;
		// 42- Game end for drunk gamemode
		case (42):
			requestAnimationFrame(() => gmDrunkGameEnd(status, globals));
			break;
		// 100- Game over screen
		case (100):
			requestAnimationFrame(() => gameover(status, globals));
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
