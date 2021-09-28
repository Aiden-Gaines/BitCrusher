// IMPORTS
import * as document from 'document';
import * as controls from './controls';

//VARIABLES
const mainScreenElems = document.getElementsByClassName('MainScreen')[0];
const clicked = false;
const firstRun = true;
//export var myImage = document.getElementById("MainScreen");
//export const button = document.getElementById("homebutton");

function screenClick(evt){
    //console.log("pls work")
    clicked = true;

}

//FUNCTIONS
export function MainScreen(status, {}){
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