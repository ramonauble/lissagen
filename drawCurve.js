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

  //calculate curve
  wPlane = new ImageData(imgWidth, imgHeight);
  for (let t = tMin; t <= tMax; t += tStep) {
    let x_lis = Math.floor(scaleA*((imgWidth - 1)/2)*Math.sin(freqA*pi*t + d));
    let y_lis = Math.floor(scaleB*((imgHeight - 1)/2)*Math.sin(freqB*pi*t));
    let pixelIndex = cToIndex(imgWidth, imgHeight, x_lis, y_lis);
    wPlane.data[pixelIndex] = Math.floor(128*(freqA/333)*(scaleA/2));  //red
    wPlane.data[pixelIndex + 1] = Math.floor(128*(freqB/333)*(scaleB/2));  //green
    wPlane.data[pixelIndex + 2] = Math.floor(128*(d/(4*pi)));  //blue
    wPlane.data[pixelIndex + 3] = Math.floor(255); //alpha
  }

  //return newly generated curve to main program
  postMessage(wPlane);
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
