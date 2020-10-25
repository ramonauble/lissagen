//define pi
const pi = Math.PI;
//initialize curve parameters
let scaleA = 1;     //scaling factor for x
let scaleB = 1;     //scaling factor for y
let freqA = 1;   //frequency of x
let freqB = 1;   //frequency of y
let d = 0;       //δ - phase shift of x
//initialize independent variable
let tMin = -1;       //starting pos. of independent variable t
let tMax = 1;       //ending pos. of t
let tStep = .000005; //step size of each calculation
//initialize curve color
let r = 0;   //red
let g = 0;    //green
let b = 0;   //blue
let a = 255;  //alpha (opacity)

//instantiate imageData object
var plane = new ImageData(imgWidth, imgHeight);

//instantiate worker to calculate curves
var drawCurve = new Worker('drawCurve.js');
var isDrawing = 1; //bool to represent draw state
drawCurve.onmessage = function(wPlane) {
  lissaCtx.putImageData(wPlane.data, 0, -1);
  isDrawing = 0; //clear draw state - ready for next curve
}

//draw initial curve
drawLis(scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep);

//redraw the curve on input change
function drawLis (scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep) {
  if (window.Worker) {
    drawCurve.postMessage([scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep,
    imgWidth, imgHeight]);
  } else {
    plane = new ImageData(imgWidth, imgHeight);
    for (let t = tMin; t <= tMax; t += tStep) {
      let x_lis = Math.floor(scaleA*((imgWidth - 1)/2)*Math.sin(freqA*pi*t + d));
      let y_lis = Math.floor(scaleB*((imgHeight - 1)/2)*Math.sin(freqB*pi*t));
      let pixelIndex = cToIndex(imgWidth, imgHeight, x_lis, y_lis);
      plane.data[pixelIndex] = Math.floor(128*(freqA/333)*(scaleA/2));  //red
      plane.data[pixelIndex + 1] = Math.floor(128*(freqB/333)*(scaleB/2));  //green
      plane.data[pixelIndex + 2] = Math.floor(128*(d/(4*pi)));  //blue
      plane.data[pixelIndex + 3] = Math.floor(a); //alpha
    }
    lissaCtx.putImageData(plane, 0, -1);
  }
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
  //1 to 128
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
  if (!isDrawing) {
    isDrawing = 1;
    drawLis(scaleA, scaleB, freqA, freqB, d, tMin, tMax, tStep);
  }
}
