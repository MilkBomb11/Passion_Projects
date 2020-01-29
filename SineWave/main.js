let winW, winH;

function setup()
{
  winW = windowWidth
  winH = windowHeight

  W = new Wave(0, winH/2, 50, -200, 200, 30)

  createCanvas(winW, winH)
}

function draw()
{
  background(0,0,0)
  W.update()
  W.draw()
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
}
