//define canvas reference
const lissaCanv = document.getElementById("lissaCanv");
const lissaCtx = lissaCanv.getContext("2d");

//size the canvas according to innerWidth of window object
//capped at 421px;
if (window.innerWidth > 480) {
  lissaCanv.width = 421;
  lissaCanv.height = 421;
} else {
  if (window.innerWidth % 2 == 0) { //inner width even
    lissaCanv.width = (window.innerWidth - 61);
    lissaCanv.height = lissaCanv.width;
  } else {                          //inner width odd
    lissaCanv.width = (window.innerWidth - 60);
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
let paramsDiv = document.getElementById("paramsDiv");

//resize title text
let title = document.getElementById("title");
title.width = lissaCanv.width;
let titleFont = (title.width/9) + "px";
title.style.fontSize = titleFont;

//resize parameter controls
paramsDiv.width = lissaCanv.width;

//size and style equations
xEq.style.fontSize = (title.width/30) + "px";
yEq.style.fontSize = (title.width/30) + "px";
eqDiv.style.width = (title.width) + "px";
xEq.style.width = (title.width*.56) + "px";
yEq.style.width = (title.width*.44) + "px";

//initialize equation display
xScale_disp.innerHTML = "1.00";
yScale_disp.innerHTML = "1.00";
xFreq_disp.innerHTML = "1.00";
yFreq_disp.innerHTML = "1.00";
d_disp.innerHTML = "0.00";
xScale_disp.style.color = "#808080";
yScale_disp.style.color = "#1E1E1E";
xFreq_disp.style.color = "#501D66";
yFreq_disp.style.color = "#A42F2B";
d_disp.style.color = "#117536";
xScale_disp.style.fontWeight = "666";
yScale_disp.style.fontWeight = "666";
xFreq_disp.style.fontWeight = "666";
yFreq_disp.style.fontWeight = "666";
d_disp.style.fontWeight = "666";
