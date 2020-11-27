'use strict';

//define pi
const pi = Math.PI;
//initialize curve parameters
var scaleA = 1.0;     //scaling factor for x
var scaleB = 1.0;     //scaling factor for y
var freqA = 1.0;   //frequency of x
var freqB = 1.0;   //frequency of y
var d = 0.0;       //δ - phase shift of x
//initialize independent variable
var tMin = -1.0;       //starting pos. of independent variable t
var tMax = 1.0;       //ending pos. of t
var tStep = .00001; //step size of each calculation
//initialize curve color
let r = 0;   //red
let g = 0;    //green
let b = 0;   //blue
let a = 255;  //alpha (opacity)

//instantiate imageData object
var plane = new ImageData(imgWidth, imgHeight);
var wPlane_arr = null;
var wPlane_img = null;

var lastUpdate;
var updateTime = 16.67;
var supportsOffscreen;

var lissaCanvOff;
var lissaCtx;
var transferState;

//test for offscreen canvas support
if (typeof lissaCanv.transferControlToOffscreen === "function") {
  supportsOffscreen = true;
  lissaCanvOff = lissaCanv.transferControlToOffscreen();
  transferState = false;
} else {
  supportsOffscreen = false;
  lissaCtx = lissaCanv.getContext("2d");
  transferState = true;
}

//instantiate worker to calculate curves
var drawCurve = new Worker('drawCurve.js');
drawCurve.onmessage = function(wPlane) {
  wPlane_arr = new Uint8ClampedArray(wPlane.data);
  wPlane_img = new ImageData(wPlane_arr, imgWidth, imgHeight);
  lissaCtx.putImageData(wPlane_img, 0, 0);
}

//tests to determine if offscreen canvas needs sent to worker
if (transferState == false) {
  //hasn't yet been transferred - send offscreen canvas
  drawCurve.postMessage(
    {
      offscreen: supportsOffscreen,
      transferState: transferState,
      offscreenCanv: lissaCanvOff
    },
    [
      lissaCanvOff
    ]
  );
  transferState = true;
}

//begin drawing curve
window.requestAnimationFrame(drawLis);

//redraw the curve on input change
function drawLis (timestamp) {
  if (lastUpdate == undefined || (timestamp - lastUpdate) >= updateTime) {
    lastUpdate = timestamp;
    if (window.Worker) {
      let paramsArr = [scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep,
      imgWidth, imgHeight];
      drawCurve.postMessage(
        {
          offscreen: supportsOffscreen,
          transferState: transferState,
          params: paramsArr
        }
      );
    } else {
      plane = new ImageData(imgWidth, imgHeight);
      for (let t = tMin; t <= tMax; t += tStep) {
        let x_lis = Math.floor(scaleA*((imgWidth - 1)/2)*Math.sin(freqA*pi*t + d));
        let y_lis = Math.floor(scaleB*((imgHeight - 1)/2)*Math.sin(freqB*pi*t));
        let pixelIndex = cToIndex(imgWidth, imgHeight, x_lis, y_lis);
        plane.data[pixelIndex] = 0;  //red
        plane.data[pixelIndex + 1] = 0;  //green
        plane.data[pixelIndex + 2] = 0;  //blue
        plane.data[pixelIndex + 3] = a; //alpha
      }
      lissaCtx.putImageData(plane, 0, 0);
    }
  }
  window.requestAnimationFrame(drawLis);
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
    xFreq_disp.innerHTML = parseFloat(freqA).toFixed(2);
  } else if (param == "yFreq") {
    freqB = parseFloat(value);
    yFreq_disp.innerHTML = parseFloat(freqB).toFixed(2);
  } else if (param == "xScale") {
    scaleA = parseFloat(value);
    xScale_disp.innerHTML = parseFloat(scaleA).toFixed(2);
  } else if (param == "yScale") {
    scaleB = parseFloat(value);
    yScale_disp.innerHTML = parseFloat(scaleB).toFixed(2);
  } else if (param == "pShift") {
    d = parseFloat(value);
    d_disp.innerHTML = parseFloat(d).toFixed(2);
  }
}
