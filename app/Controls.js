import document from "document";

function button(){
    let button = document.getElementById("button");
    button.onactivate = function(evt) {
        button.text = "Clicked";
    }
}