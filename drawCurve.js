const pi = Math.PI;

onmessage = function(params) {
  //initialize internal variables
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

  //precalculate static values prior to curve loop
  let quadWidth = (imgWidth - 1)/2;
  let quadHeight = (imgHeight - 1)/2;
  let radFreqA = freqA*pi;
  let radFreqB = freqB*pi;
  let scaledWidth = scaleA*quadWidth;
  let scaledHeight = scaleB*quadWidth;

  //calculate curve
  wPlane_buff = new ArrayBuffer((imgWidth * imgHeight * 4));
  wPlane = new Uint8ClampedArray(wPlane_buff);
  for (let t = tMin; t <= tMax; t += tStep) {
    let x_lis = Math.floor(scaledWidth*Math.sin(radFreqA*t + d));
    let y_lis = Math.floor(scaledHeight*Math.sin(radFreqB*t));
    let pixelIndex = cToIndex(imgWidth, quadWidth, quadHeight, x_lis, y_lis);
    wPlane[pixelIndex] = 0;  //red
    wPlane[pixelIndex + 1] = 0;  //green
    wPlane[pixelIndex + 2] = 0;  //blue
    wPlane[pixelIndex + 3] = 255; //alpha
  }

  //return newly generated curve to main thread as buffer
  postMessage(wPlane_buff, [wPlane_buff]);
}

//convert from cartesian coordinates to an array index
//dimensions of image data must be odd & equal (for symmetry of quadrants)
function cToIndex (imgWidth, quadWidth, quadHeight, x, y) {
  //first, convert cartesian to normalized
  let x_n = quadWidth + x;
  let y_n = quadHeight - y;
  //next, convert from normalized to array index
  let index = (y_n * imgWidth * 4) + (x_n * 4);
  return index;
}
