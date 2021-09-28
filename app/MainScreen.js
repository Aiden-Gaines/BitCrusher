// IMPORTS
import * as document from 'document';
import * as controls from './controls';


//VARIABLES
const mainScreenElems = document.getElementsByClassName('MainScreen')[0];
let clicked = false;
let firstRun = true;


//FUNCTIONS
function screenClick(evt) { clicked = true; }

export function MainScreen(status, {}) {
    if (firstRun){
        mainScreenElems.children.forEach((item) => { item.class = ""; });
    //console.log(mainScreenElems);
    //use other contols button
        controls.addFuncOnTap(screenClick);
        firstRun = false;
    }
    if (clicked){
        mainScreenElems.children.forEach((item) => { item.class = "hidden"; });
        status.progress++;
    }
}