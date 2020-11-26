lissagen v.1
a parametric lissajous curve generator
by ramona a
10-11-20

────────────────────────────────────────────────────────────────────────
• lissagen is a web app for visualizing static lissajous curves
• two sinusoids are plotted using cartesian coordinates on a 2D plane
  (implemented as a canvas)
• the "=instantaneous" outputs of each sinusoid (A & B) at "time" t
  determine the x & y coordinates of each graphed pixel
• t, as a parameter, is iterated over the range [-1, 1] in steps of
  tStep (currently set at .000008)
• for each value of t, a unique pair of coordinates (x, y) is generated,
  representing the instantaneous amplitudes of sinusoids A & B at time t
• the sampled values for any given time t are determined by the parameters
  of each sinusoid
  • frequency is directly related to the width of the "gap" between each
    adjacent sample, expressed in radians
    • in other words, the number of radians "moved through" on each sample
      increases as the radial frequency is increased
  • phase introduces a linear phase offset into sinusoid A, between [0, 2π]
  • scale is applied after the calculation of each instantaneous amplitude,
    scaling the output by a factor between [0, 1]

────────────────────────────────────────────────────────────────────────
• this project currently uses GPU.JS to increase the speed of the calculations,
  offloading the bulk of the processing from the worker thread to the GPU
• the curve indeces are calculated in parallel, and are then iterated through
  to color & draw each pixel
• the curve is recalculated on each input parameter change event

────────────────────────────────────────────────────────────────────────
• future developments will include
  • recalculating the curve using a requestAnimationFrame loop, sampling
    the parameter values only when needed & redrawing the figure only once
    for each frame
  • generating the sinusoids with WebAudio API (instead of using the standard
    Math.sin() function) and sampling their instantaneous outputs to display
    on the canvas directly
  • parameter automation using WebAudio API, to allow for realtime modulation
    of the curve parameters (frequency, phase & scale)
  • image output and/or canvas record, to allow for direct saving of curve
    images & animations

────────────────────────────────────────────────────────────────────────
• always open to suggestions for improvement - if you see something you'd
  like changed, feel free to write me - ramona@rsyn.co - or just fork it and
  go buck wild ^-^
