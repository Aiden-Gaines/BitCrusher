import * as document from "document";

// Get a handle on the cycleview
const statsCyle = document.getElementById("scrollview");

// Get an array of cycle-items
const items = statsCyle.getElementsByClassName("scrollview-item");

// How many items
console.log(items.length);

// Select a specific item by index
statsCyle.value = 3;

// Get the current selected item index
console.log(statsCyle.value);

// Hide a specific item by index
items[2].style.display = "none";