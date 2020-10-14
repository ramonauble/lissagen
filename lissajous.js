//define canvas reference
const lissaCanv = document.getElementById("lissaCanv");
const lissaCtx = lissaCanv.getContext("2d");

//define pi
const pi = Math.PI;
//initialize curve parameters
let scaleA = 1;     //scaling factor for x
let scaleB = 1;     //scaling factor for y
let freqA = 1;   //frequency of x
let freqB = 1;   //frequency of y
let d = 0;       //δ - phase shift of x
//initialize independent variable
let tMin = 0;       //starting pos. of independent variable t
let tMax = 1;       //ending pos. of t
let tStep = .00001; //step size of each calculation
//initialize curve color
let r = 80;   //red
let g = 6;    //green
let b = 85;   //blue
let a = 255;  //alpha (opacity)

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

//define imageData width & height and instantiate imageData object
const imgWidth = lissaCanv.width;
const imgHeight = lissaCanv.height;
var plane = new ImageData(imgWidth, imgHeight);

//resize title text
let title = document.getElementById("title");
title.width = lissaCanv.width;
let titleFont = (title.width/9) + "px";
title.style.fontSize = titleFont;

//size and style equations
let eqDiv = document.getElementById("eqDiv");
let xEq = document.getElementById("xEq");
let yEq = document.getElementById("yEq");
xEq.style.fontSize = (title.width/32) + "px";
yEq.style.fontSize = (title.width/32) + "px";
eqDiv.style.width = (title.width) + "px";
xEq.style.width = (title.width/2) + "px";
yEq.style.width = (title.width/2) + "px";

//initialize equation display
let xScale_disp = document.getElementById("xScale_disp");
let yScale_disp = document.getElementById("yScale_disp");
let xFreq_disp = document.getElementById("xFreq_disp");
let yFreq_disp = document.getElementById("yFreq_disp");
let d_disp = document.getElementById("d_disp");
xScale_disp.innerHTML = parseFloat(scaleA).toFixed(2);
yScale_disp.innerHTML = parseFloat(scaleB).toFixed(2);
xFreq_disp.innerHTML = parseFloat(freqA).toFixed(2);
yFreq_disp.innerHTML = parseFloat(freqB).toFixed(2);
d_disp.innerHTML = parseFloat(d).toFixed(2);

//resize parameter controls
let paramsDiv = document.getElementById("paramsDiv");
paramsDiv.width = lissaCanv.width;

//draw initial curve
drawLis(scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep);

//redraw the curve on input change
function drawLis (scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep) {
  plane = new ImageData(imgWidth, imgHeight);
  for (let t = tMin; t <= tMax; t += tStep) {
    let x_lis = Math.floor(scaleA*((imgWidth - 1)/2)*Math.sin(freqA*pi*t + d));
    let y_lis = Math.floor(scaleB*((imgHeight - 1)/2)*Math.sin(freqB*pi*t));
    let pixelIndex = cToIndex(imgWidth, imgHeight, x_lis, y_lis);
    plane.data[pixelIndex] = Math.floor(196*(freqA/250)*(scaleA/2));
    plane.data[pixelIndex + 1] = Math.floor(196*(freqB/250)*(scaleB/2));
    plane.data[pixelIndex + 2] = Math.floor(196*(d/(4*pi)));
    plane.data[pixelIndex + 3] = Math.floor(a);
  }
  lissaCtx.putImageData(plane, 0, -1);
}

//convert from cartesian coordinates to an array index
//dimensions of image data must be odd & equal (for symmetry of quadrants)
function cToIndex (imgWidth, imgHeight, x, y) {
  //first, convert cartesian to normalized
  let x_n = ((imgWidth - 1)/2) + x;
  let y_n = ((imgHeight - 1)/2) - y;
  //next, convert from normalized to array index
  let index = (y_n * imgWidth * 4) + (x_n * 4);
  return index;
}

function paramInput (param, value) {
  //0 to 250
  if (param == "xFreq") {
    freqA = parseFloat(value);
    xFreq_disp.innerHTML = parseFloat(freqA).toFixed(2);
  } else if (param == "yFreq") {
    freqB = parseFloat(value);
    yFreq_disp.innerHTML = parseFloat(freqB).toFixed(2);
  //0 to 1
  } else if (param == "xScale") {
    scaleA = parseFloat(value);
    xScale_disp.innerHTML = parseFloat(scaleA).toFixed(2);
  } else if (param == "yScale") {
    scaleB = parseFloat(value);
    yScale_disp.innerHTML = parseFloat(scaleB).toFixed(2);
  //0 to 2*pi
  } else if (param == "pShift") {
    d = parseFloat(value);
    d_disp.innerHTML = parseFloat(d).toFixed(2);
  }
  drawLis(scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep);
}
