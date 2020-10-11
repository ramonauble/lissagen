parametric lissajous generator
by ramona a
10-11-20
------------------------------------------------------------------------

a lissajous curve comes to be when two separate sinusoids are taken
as x & y coordinates; these are then graphed to a 2 dimensional plane
& are defined by the set of parametric equations:
  • x = Asin(at + δ)
  • y = Bsin(bt)

in this case, the following parameters are defined:
  • A & B
    • these act as scaling factors, stretching or compressing the
      corresponding x or y coordinates on the plane
      • a change in A affects the horizontal scaling (x)
      • a change in B affects the vertical scaling (y)
    • A/B expresses the overall width to height ratio of the curve
  • a & b
    • these parameters control the frequencies of their respective
      sinusoids, expressed in radians
      • a change in a modifies the horizontal frequency (left-right)
      • a change in b modifies the vertical frequency (up-down)
    • if a/b is rational, the curve will have a definite number of
      horizontal and vertical "lobes", and will be closed
    • if a/b is irrational, the curve will be open, and potentially
      very complex (beautiful :])
  • δ
    • this parameter controls the amount of phase shift (in radians)
      between the horizontal and vertical sinusoids
    • visually, modifying this parameter "rotates" the viewing angle
      of the curve, as if the curve itself is a 2 dimensional cross
      section of a 3 dimensional solid
    • to understand this intuitively, consider a very simple curve
      with a & b == 2π, A & B == 1, and δ == 0
      • this appears as a straight line, with a slope of exactly 1
      • sweeping δ from 0 to 2π smoothly changes the curve from
        a line (δ == 0), to an ellipse (δ == (0, π/2)), to a circle
        (δ == π/2), to an ellipse (δ == (π/2, π)), back to a line
        (δ == π); then again to an ellipse (δ == (π, 3π/2)), to
        another circle (δ == 3π/2), to an ellipse (δ == (3π/2, 2π)),
        and finally back to a line (δ == 2π)
      • taken as one contiguous motion, this entire sweep defines a
        sphere, expressed as a series of 2 dimensional cross sections
  • t (the independent variable) is swept from 0 to 1 in steps of
    .00001, thus allowing the curve itself to be graphed on the plane
      • the boundaries of t, as well as the resolution of the sweep,
        can also be considered as "parameters", in that changing them
        affects the ultimate appearance of the curve

the point of this project is multifold:
  • to allow anyone to interactively explore the complex beauty of the
    lissajous curve, without necessarily understanding it in full
    • in this regard, i believe that mathematical comprehension can be
      "seeded" in anyone, by spending time appreciating its facets
      intuitively (looking at the curve and observing how it changes
      as its parameters are changed)
  • to develop a method of plotting cartesian coordinates on the canvas
    element natively
    • the function cToIndex takes the width & height of an arbitrary
      imageData object, as well as the coordinates to be plotted, and
      returns the starting index (R) of the corresponding pixel in the
      imageData array, in RGBA format
    • this allows the canvas to be addressed as a signed coordinate
      plane, spanning the inclusive range:
        • x = +/-(width - 1)/2, y = +/-(height - 1)/2
    • present restriction is that the image data object must be of odd
      and equal dimension, for the quadrants to retain symmetry across
      both axes
  • for my own enjoyment - i love synthesis (both audio & visual), and
    never cease to be charmed by the emergent beauty of mathematics <3
