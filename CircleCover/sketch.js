var circles = []

var canvasWidth = 1000
var canvasHeight = 700

function setup() {
  createCanvas(canvasWidth, canvasHeight)

  btn = createButton("shuffle!")
  btn.mousePressed(addCircles)

  addCircles()
}

function draw() {
  background(0,0,0)
  for (let i = 0; i < circles.length; i++) {
    circles[i].draw()
  }
}

function checkCircleCollision(a, b)
{
  let d = dist(a.x,a.y,b.x,b.y)
  return d - 5 < a.r + b.r
}

function addCircle()
{
  let possibleToAdd = true

  let newX = int(random(0, canvasWidth))
  let newY = int(random(0, canvasHeight))
  let newR = int(random(10, 50))
  let newCircle = {x : newX, y : newY, r : newR}

  for (let j = 0; j < circles.length; j++)
  {
    if ( checkCircleCollision(newCircle, circles[j]) )
    {
      possibleToAdd = false
    }
  }
  if (possibleToAdd)
    circles.push(new Circle({x:newX, y:newY, r:newR}))
  else
    addCircle()
}

function addCircles()
{
  circles = []
  for (let i = 0; i < 100; i++)
  {
    addCircle()
  }
}
