let winW, winH;

function setup()
{
  winW = windowWidth
  winH = windowHeight

  initAngle = 0
  baseSpeed = 0.02
  table = new Table(  80, 80, 40, initAngle, baseSpeed, 5  )
  vhm = new VertexHandlerManager()

  createCanvas(winW, winH)
}

function draw()
{
  background("black")
  table.update()
  table.draw()
  vhm.update()
  vhm.draw()
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
  winW = windowWidth
  winH = windowHeight
}
