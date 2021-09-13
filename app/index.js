import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

const brickArr = [];
// Values based on SVG, will not automatically update when one is changed
const brickSize = 30;
const brickBorder = 2;
const brickOffset = 6;
const rowCount = 5;
const colCount = 9;
// const shownBricks = [];
// const activeBricks = [[8, 8]];


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
    brick.class = "";
  }
}

