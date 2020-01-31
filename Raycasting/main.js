let winW, winH;

let rm, bm;

function setup()
{
  winW = windowWidth
  winH = windowHeight

  rm = new RayManager(100)
  bm = new BoundaryManager()

  createCanvas(winW, winH)
}

function draw()
{
  background("black")
  bm.draw()
  rm.update()
  rm.draw()
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
  winW = windowWidth
  winH = windowHeight
}
