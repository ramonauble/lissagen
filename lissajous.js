//define canvas reference
const lissaCanv = document.getElementById("lissaCanv");

//size the canvas according to innerWidth of window object
  //if innerWidth exceeds 480, width & height both set to max (481px)
  //else the canvas is sized to fit within the innermost div
    //additional test to ensure final width is always odd
if (window.innerWidth > 360) {
  lissaCanv.width = 361;
  lissaCanv.height = 361;
} else {
  if (window.innerWidth % 2 == 0) { //inner width even
    lissaCanv.width = (window.innerWidth - 61);
    lissaCanv.height = lissaCanv.width;
  } else {                          //inner width odd
    lissaCanv.width = (window.innerWidth - 60);
    lissaCanv.height = lissaCanv.width;
  }
}
const lissaCtx = lissaCanv.getContext("2d");
const imgWidth = lissaCanv.width;
const imgHeight = lissaCanv.height;
const plane = new ImageData(imgWidth, imgHeight);
const pi = Math.PI;
let d = pi/2;

for (let t = 0; t <= 1; t += .00001) {
  let x_lis = Math.floor(((imgWidth - 1)/2)*Math.sin(30763*pi*t + d));
  let y_lis = Math.floor(((imgHeight - 1)/2)*Math.sin(30757*pi*t));
  plane.data[cToIndex(imgWidth, imgHeight, x_lis, y_lis)] = 127;
  plane.data[cToIndex(imgWidth, imgHeight, x_lis, y_lis) + 1] = 63;
  plane.data[cToIndex(imgWidth, imgHeight, x_lis, y_lis) + 2] = 129;
  plane.data[cToIndex(imgWidth, imgHeight, x_lis, y_lis) + 3] = 255;
}
lissaCtx.putImageData(plane, 0, -1);

//converts from cartesian coordinates to an array index
//dimensions of image data must be odd & equal (for symmetry of quadrants)
function cToIndex (imgWidth, imgHeight, x, y) {
  //first, convert cartesian to normalized
  let x_n = ((imgWidth - 1)/2) + x;
  let y_n = ((imgHeight - 1)/2) - y;
  //next, convert from normalized to array index
  let index = (y_n * imgWidth * 4) + (x_n * 4);
  return index;
}
