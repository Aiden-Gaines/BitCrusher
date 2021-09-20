import document from "document";

var myImage = document.getElementById("MainScreen");

myImage.x=80;
myImage.y=20;

function startbutton(){
    let button = document.getElementById("homebutton");
    button.onactivate = function(evt) {
        button.text = "Clicked";
    }
}