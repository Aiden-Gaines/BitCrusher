import document from "document";

// TODO: Bulk up Controls.js
// Ideally would be a central control center for user interaction
// Kinda like an api for it so that other files can just say something like 'Controls.onScreenTap(function)' and
// then it would be automatically hooked and this file would manage having a bunch of function that might need to
// be run at once from one tap

function button(){
    let button = document.getElementById("button");
    button.onactivate = function(evt) {
        button.text = "Clicked";
    }
}