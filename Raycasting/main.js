let winW, winH;

let rm, bm, pen, range;
let state = "set" // set, ray

function setup()
{
  winW = windowWidth
  winH = windowHeight

  pen = new Pen()
  rm = new RayManager(0, TAU, 360)
  bm = new BoundaryManager()

  state = "set"

  range = createSlider(0, 360, 360)
  range.id("range")
  createCanvas(winW, winH)
}

function draw()
{
  background("black")
  bm.draw()
  if (state === "ray")
  {
    rm.update()
    rm.draw()
  }
  else
  {
    pen.draw()
  }
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
  winW = windowWidth
  winH = windowHeight
}

function mousePressed()
{
  if (state === "set")
  {
    pen.input()
  }
}

function keyPressed()
{
  if (keyCode === 32)
  {
    if (state === "set") {state = "ray"}
    else if (state === "ray") (state ="set")
  }
}
