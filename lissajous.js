//define canvas reference
const lissaCanv = document.getElementById("lissaCanv");
const lissaCtx = lissaCanv.getContext("2d");

//define pi
const pi = Math.PI;
//initialize curve parameters
let scaleA = 1;     //scaling factor for x
let scaleB = 1;     //scaling factor for y
let freqA = 677*pi;   //frequency of x
let freqB = 679*pi;   //frequency of y
let d = pi/8;       //δ - phase shift of x
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

//resize title text
let title = document.getElementById("title");
title.width = lissaCanv.width;
title.height = lissaCanv.height;
let titleWidth = (title.width/5.2) + "px";
title.style.fontSize = titleWidth;

//define imageData width & height and instantiate imageData object
const imgWidth = lissaCanv.width;
const imgHeight = lissaCanv.height;
var plane = new ImageData(imgWidth, imgHeight);

//draw initial curve
drawLis(scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep);

//redraw the curve on input change
function drawLis (scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep) {
  plane = new ImageData(imgWidth, imgHeight);
  for (let t = tMin; t <= tMax; t += tStep) {
    let x_lis = Math.floor(scaleA*((imgWidth - 1)/2)*Math.sin(freqA*pi*t + d));
    let y_lis = Math.floor(scaleB*((imgHeight - 1)/2)*Math.sin(freqB*pi*t));
    let pixelIndex = cToIndex(imgWidth, imgHeight, x_lis, y_lis);
    plane.data[pixelIndex] = r;
    plane.data[pixelIndex + 1] = g;
    plane.data[pixelIndex + 2] = b;
    plane.data[pixelIndex + 3] = a;
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
  if (param == "xFreq") {
    freqA = parseFloat(value);
  } else if (param == "yFreq") {
    freqB = parseFloat(value);
  } else if (param == "xScale") {
    scaleA = parseFloat(value);
  } else if (param == "yScale") {
    scaleB = parseFloat(value);
  } else if (param == "pShift") {
    d = parseFloat(value);
  }
  drawLis(scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep);
}
