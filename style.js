'use strict';

//define canvas reference
const lissaCanv = document.getElementById("lissaCanv");
const lissaCtx = lissaCanv.getContext("2d");

//size the canvas according to innerWidth of window object
//capped at 421px;
if (window.innerWidth > 572) {
  lissaCanv.width = 511;
  lissaCanv.height = 511;
} else {
  if (window.innerWidth % 2 == 0) { //inner width even
    lissaCanv.width = (window.innerWidth - 17);
    lissaCanv.height = lissaCanv.width;
  } else {                          //inner width odd
    lissaCanv.width = (window.innerWidth - 16);
    lissaCanv.height = lissaCanv.width;
  }
}

//declare canvas size & DOM element references
const imgWidth = lissaCanv.width;
const imgHeight = lissaCanv.height;
let eqDiv = document.getElementById("eqDiv");
let xEq = document.getElementById("xEq");
let yEq = document.getElementById("yEq");
let xScale_disp = document.getElementById("xScale_disp");
let yScale_disp = document.getElementById("yScale_disp");
let xFreq_disp = document.getElementById("xFreq_disp");
let yFreq_disp = document.getElementById("yFreq_disp");
let d_disp = document.getElementById("d_disp");
let paramsDiv1 = document.getElementById("paramsDiv1");
let paramsDiv2 = document.getElementById("paramsDiv2");
let modDiv = document.getElementById("modDiv");

//resize title text
let title = document.getElementById("title");
title.width = lissaCanv.width;
let titleFont = (title.width/10.5) + "px";
title.style.fontSize = titleFont;
title.style.display = "none"; //temp. hide title text

//resize parameter controls
paramsDiv1.style.width = lissaCanv.width + "px";
paramsDiv2.style.width = lissaCanv.width + "px";
modDiv.style.width = lissaCanv.width + "px";
paramsDiv2.style.display = "none";  //init hide params2
modDiv.style.display = "none"; //init hide mod params

//size and style equations
xEq.style.fontSize = (lissaCanv.width/31) + "px";
yEq.style.fontSize = (lissaCanv.width/31) + "px";
eqDiv.style.width = (lissaCanv.width) + "px";
xEq.style.width = (lissaCanv.width*.57) + "px";
yEq.style.width = (lissaCanv.width*.43) + "px";

//initialize equation display
xScale_disp.innerHTML = "1.00";
yScale_disp.innerHTML = "1.00";
xFreq_disp.innerHTML = "1.00";
yFreq_disp.innerHTML = "1.00";
d_disp.innerHTML = "0.00";
xScale_disp.style.color = "#777777";
yScale_disp.style.color = "#1E1E1E";
xFreq_disp.style.color = "#6A4086";
yFreq_disp.style.color = "#A42F2B";
d_disp.style.color = "#117536";
xScale_disp.style.fontWeight = "666";
yScale_disp.style.fontWeight = "666";
xFreq_disp.style.fontWeight = "666";
yFreq_disp.style.fontWeight = "666";
d_disp.style.fontWeight = "666";
