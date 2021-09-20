// IMPORTS
import * as document from "document";
import * as utils from "../common/utils";

/*
	I think if we want to seperate everything out, we need to even put setup in another file,
	and only use this file as the one that manages the animate function. Then, just import everything into this file.
	Cause I don't think you can export from this file. Either that, or the circular dependancy I currently have
	is causing issues. Which is not unlikely.
*/


// VARIABLES
// Set up constant and global variables
let progress = 0;
let frame = 0;
let direction = 1;
let setupIndex = 0;
const brickArr = [];
const shownBricks = [];
const activeBricks = [[0, 8], [1, 8], [2, 8]];
// Values based on SVG, will not automatically update when one is changed
const brickSize = 30;
const brickBorder = 2;
const brickOffset = 6;
const rowCount = 9;
const colCount = 9;

// FUNCTIONS
export function getBrick(brickCoords) {
	return brickArr[brickCoords[1]][brickCoords[0]];
}

function getNewActiveBricks() {
	// Assumes the activeBricks is sorted low to high, creates a new activeBricks array based on the direction we are currently moving
	const newActiveBricks = [];

	// If we are at the end of the row, turn around
	if (activeBricks[activeBricks.length - 1][0] == colCount - 1) direction *= -1;
	if (activeBricks[0][0] == 0) direction *= -1;
	// Move the bricks in the selected direction
	for (const brick of activeBricks) {
		newActiveBricks.push([brick[0] + direction, brick[1]])
	}

	return newActiveBricks;
}

function mainAnim() {
	if (frame % 10 == 0) {
		const newActiveBricks = getNewActiveBricks();
		const switchBricks = utils.arrSymDiff(activeBricks, newActiveBricks);
		for (const brick of switchBricks) {
			utils.flip(brick);
		}
		activeBricks = newActiveBricks;
	}
	animate();
}

function setup() {
	// hide all bricks
	if (frame % 1 == 0) {
		utils.hide(utils.convert1Dto2D(setupIndex));
		setupIndex++;
	}
	if (setupIndex >= rowCount * colCount) {
		activeBricks.forEach(utils.show);
		progress++;
	}
	animate();
}

function animate() {
	switch (progress) {
		case (0): break;
		case (1):
			requestAnimationFrame(setup);
			break;
		case (2):
			requestAnimationFrame(mainAnim);
			break;
	}

	frame++;
}

// MAIN
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

// Get each brick
for (let y = 0; y < rowCount; y++) {
  const tempArr = [];
  for (let x = 0; x < colCount; x++) {
    tempArr.push(document.getElementById(`r${y}c${x}`))
  }
  brickArr.push(tempArr);
}

// Set each brick to the correct position
for (let y = 0; y < rowCount; y++) {
  for (let x = 0; x < colCount; x++) {
    let brick = brickArr[y][x];
    brick.x = ((brickSize + brickBorder) * x) + brickOffset;
    brick.y = ((brickSize + brickBorder) * y) + brickOffset;
  }
}

progress++;
animate();
