'use strict';

//define constants and generate initital linspace
const pi = Math.PI;
importScripts("gpu-browser.min.js");
const gpu = new GPU();
var lissaCanvOff;
var lissaCanvOffCtx;

//execute whenever main thread posts message to worker
onmessage = function(msg) {
  //if offscreen canvas transfer
  if (!msg.data.transferState) {
    lissaCanvOff = msg.data.offscreenCanv;
    lissaCanvOffCtx = lissaCanvOff.getContext("2d");
  } else {
    let params = msg.data.params;
    let offscreen = msg.data.offscreen;

    //initialize internal parameter variables
    let scaleA = params[0];
    let scaleB = params[1];
    let freqA = params[2];
    let freqB = params[3];
    let d = params[4];
    let tMin = params[5];
    let tMax = params[6];
    let tStep = params[7];
    let imgWidth = params[8];
    let imgHeight = params[9];

    //precalculate static values
    var qWidth;
    var qHeight;
    var arraySize;

    //only calculate sizes once
    if (qWidth == undefined) {
      qWidth = (imgWidth - 1)/2;
      qHeight = (imgHeight - 1)/2;
      arraySize = (imgWidth * imgHeight * 4);
    }

    let radFreqA = freqA*pi;
    let radFreqB = freqB*pi;
    let sWidth = scaleA*qWidth;
    let sHeight = scaleB*qWidth;

    //define function to use GPU for multithreaded calculation of curve indeces
    const calcPos = gpu.createKernel(function(sWidth, sHeight,
    radFreqA, radFreqB, d, qWidth, qHeight, imgWidth, lCanv) {
      let x_lis = Math.floor(sWidth*Math.sin(radFreqA*(-1 + (this.thread.x/125000)) + d));
      let y_lis = Math.floor(sHeight*Math.sin(radFreqB*(-1 + (this.thread.x/125000))));
      let x_n = qWidth + x_lis;
      let y_n = qHeight - y_lis;
      let pixelIndex = (y_n * imgWidth * 4) + (x_n * 4);
      return pixelIndex;
    }, {
      precision: 'single',
      optimizeFloatMemory: true,
      tactic: 'speed',
      output: [250000],
      argumentTypes: {
        sWidth: 'Float', sHeight: 'Float', radFreqA: 'Float',
        radFreqB: 'Float', d: 'Float', qWidth: 'Float',
        qHeight: 'Float', imgWidth: 'Float', lCanv: 'HTMLCanvas'
      },
      returnType: 'Integer'
    });

    //use gpu to generate an array of curve indeces
    let posArray = calcPos(sWidth, sHeight, radFreqA, radFreqB, d,
      qWidth, qHeight, imgWidth, lissaCanvOff);

    //instantiate frame buffer & view
    let wPlane_buff = new ArrayBuffer(arraySize);
    let wPlane = new Uint8ClampedArray(wPlane_buff);

    //loop through array of pixel indeces & assign RGB values
    let prevIndex; //initialize previous index
    for (let pIndex = 0; pIndex < posArray.length; pIndex++) {
      if (prevIndex != posArray[pIndex]) {
        wPlane[posArray[pIndex]] = 0;  //red
        wPlane[posArray[pIndex] + 1] = 0;  //green
        wPlane[posArray[pIndex] + 2] = 0;  //blue
        wPlane[posArray[pIndex] + 3] = 255; //alpha
      }
      prevIndex = posArray[pIndex]; //save previous position
    }

    //clear instantiated kernel from memory
    calcPos.destroy();
    //transfer newly generated curve to main thread as buffer

    if (offscreen) {
      let wPlane_img = new ImageData(wPlane, imgWidth, imgHeight);
      lissaCanvOffCtx.putImageData(wPlane_img, 0, 0);
    } else {
      postMessage(wPlane_buff, [wPlane_buff]);
    }
  }
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
