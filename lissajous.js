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

//instantiate imageData object
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
