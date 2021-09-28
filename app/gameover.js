// IMPORTS
import * as document from 'document';
import * as controls from './controls';

//VARIABLES
const endScreenElems = document.getElementsByClassName('endScreen')[0];
const clicked = false;
const firstRun = true;
//export var myImage = document.getElementById("MainScreen");
//export const button = document.getElementById("homebutton");

function screenClick(evt){
    //console.log("pls work")
    clicked = true;

}

//FUNCTIONS
export function gameover(status, {}){
    if (firstRun){
        endScreenElems.children.forEach((item) => { item.class = ""; });
    //use other contols button
        controls.addFuncOnTap(screenClick);
        firstRun = false;
    }
    if (clicked){
        endScreenElems.children.forEach((item) => { item.class = "hidden"; });
        status.progress=1;
    }
}