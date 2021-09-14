import * as document from "document";
// import clock from "clock";
// import { preferences } from "user-settings";
import * as utils from "../common/utils";

let progress = 0;
let frame = 0;
let direction = 1;
const brickArr = [];
const shownBricks = [];
const activeBricks = [[0, 8], [1, 8], [2, 8]];
// Values based on SVG, will not automatically update when one is changed
const brickSize = 30;
const brickBorder = 2;
const brickOffset = 6;
const rowCount = 9;
const colCount = 9;

// Functions
function getBrick(brickCoord) {
	return brickArr[brickCoord[1]][brickCoord[0]];
}

function show(brick) {
	if (brick.class == undefined) {
		getBrick(brick).class = "";
	} else {
		brick.class = "";
	}
}

function hide(brick) {
	if (brick.class == undefined) {
		getBrick(brick).class = "hide";
	} else {
		brick.class = "hide";
	}
}

function flip(brick) {
	switch (brick.class) {
		case ("hide"):
			show(brick);
			break;
		case (""):
			hide(brick);
			break;
	}
}

function getNewActiveBricks() {
	const newActiveBricks = [];
	for (const brick of activeBricks) {
		newActiveBricks.push([brick[0] + direction, brick[1]])
	}
	return newActiveBricks;
}

function mainAnim() {
	if (frame % 10 == 0) {
		const newActiveBricks = getNewActiveBricks();
		console.log(newActiveBricks);
		const switchBricks = utils.arrSymDiff(activeBricks, newActiveBricks);
		console.log(utils.arrSymDiff([1, 2, 3], [2, 3, 4]));
		console.log([[1, 8], [2, 8]].indexOf([1, 8]));
		for (const brick of switchBricks) {
			flip(brick);
		}
	}
	animate();
}

function convert1Dto2D(index) {
	return [index % 9, Math.floor(index / 9)];
}

let setupIndex = 0;

function setup() {
	// hide all bricks
	if (frame % 1 == 0) {
		hide(convert1Dto2D(setupIndex));
		setupIndex++;
	}
	if (setupIndex >= rowCount * colCount) {
		activeBricks.forEach(show);
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
// Get each brick
for (let y = 0; y < rowCount; y++) {
  let tempArr = [];
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
