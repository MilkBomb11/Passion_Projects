var winW = 0;
var winH = 0;
var scaleFactor = 1;

var epicycle;
var fourier;
var vertexes = []
var drawing = []

var time = 0
var pen;
var state = "draw"

function restart()
{
  fourier = []
  epicycle = new Epicycle(0, 0, fourier, 0)
  vertexes = []
  drawing = []
  time = 0
  background(0,0,0)
}

function reset()
{
  vertexes = []
  fourier = dft(drawing)
  epicycle = new Epicycle(winW/2, winH/2, fourier, 0)
}

function setup() {
  winW = windowWidth
  winH = windowHeight
  createCanvas(winW, winH)
  pen = new Pen()
  background(0,0,0)
}

function draw() {
  if (state === "draw")
  {
    pen.update()
    pen.draw()
  }
  else
  {
    scale(scaleFactor/2)
    background(0,0,0)
    epicycle.update()
    epicycle.draw()

    stroke(255,255,0)
    beginShape()
    for (let i = 0; i < vertexes.length; i++)
    {
      vertex(vertexes[i].x, vertexes[i].y)
    }
    endShape()

    const dt = TAU / epicycle.fourier.length
    time = time + dt
  }
}

function keyPressed()
{
  if (keyCode === 32 ) // space
  {
    if (state === "draw")
    {
      reset()
      state = "compute"
    }
    else
    {
      restart()
      state = "draw"
    }
  }
}

function windowResized()
{
  winW = windowWidth
  winH = windowHeight
  resizeCanvas(winW, winH)
}
