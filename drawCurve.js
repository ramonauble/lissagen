'use strict';

//define constants and generate initital linspace
const pi = Math.PI;
importScripts("gpu-browser.min.js");
const gpu = new GPU();

//execute whenever main thread posts message to worker
onmessage = function(params) {
  //initialize internal parameter variables
  let scaleA = params.data[0];
  let scaleB = params.data[1];
  let freqA = params.data[2];
  let freqB = params.data[3];
  let d = params.data[4];
  let tMin = params.data[5];
  let tMax = params.data[6];
  let tStep = params.data[7];
  let imgWidth = params.data[8];
  let imgHeight = params.data[9];

  //precalculate static values
  let qWidth = (imgWidth - 1)/2;
  let qHeight = (imgHeight - 1)/2;
  let radFreqA = freqA*pi;
  let radFreqB = freqB*pi;
  let sWidth = scaleA*qWidth;
  let sHeight = scaleB*qWidth;
  let arraySize = (imgWidth * imgHeight * 4);

  //define function to use GPU for multithreaded calculation of curve indeces
  const calcPos = gpu.createKernel(function(sWidth, sHeight,
  radFreqA, radFreqB, d, qWidth, qHeight, imgWidth) {
    let x_lis = Math.floor(sWidth*Math.sin(radFreqA*(-1 + (this.thread.x/100000)) + d));
    let y_lis = Math.floor(sHeight*Math.sin(radFreqB*(-1 + (this.thread.x/100000))));
    let x_n = qWidth + x_lis;
    let y_n = qHeight - y_lis;
    let pixelIndex = (y_n * imgWidth * 4) + (x_n * 4);
    return pixelIndex;
  })
    .setPipeline(true)
    .setOutput([200000]);

  //use previously defined function to generate an array of curve indeces
  let posArray = calcPos(sWidth, sHeight, radFreqA, radFreqB, d,
    qWidth, qHeight, imgWidth).toArray();

  //instantiate frame buffer & view
  let wPlane_buff = new ArrayBuffer(arraySize);
  let wPlane = new Uint8ClampedArray(wPlane_buff);

  //loop through array of pixel indeces & assign RGB values
  let prevIndex = posArray[0]; //initialize previous index
  for (let pIndex = 0; pIndex < posArray.length; pIndex++) {
    if (prevIndex != posArray[pIndex] || pIndex == 0) {
      wPlane[posArray[pIndex]] = 0;  //red
      wPlane[posArray[pIndex] + 1] = 0;  //green
      wPlane[posArray[pIndex] + 2] = 0;  //blue
      wPlane[posArray[pIndex] + 3] = 255; //alpha
    }
    prevIndex = posArray[pIndex]; //save previous position
  }

  calcPos.destroy();
  //transfer newly generated curve to main thread as buffer
  postMessage(wPlane_buff, [wPlane_buff]);
}

//function to calculate an array of linearly spaced values
//running from [start, end), in steps of res
function linspace (start, end, res) {
  let linspace = new Float32Array(Math.ceil(Math.abs(start - end)/res));
  let lindex = 0;
  for (t = start; t <= end; t+= res) {
    linspace[lindex] = t;
    lindex++;
  }
  return linspace;
}
