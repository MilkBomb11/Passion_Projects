let winW, winH, field;
let mode = "excavate" //excavate, mark
let gameState = "game"

function setup()
{
  winW = windowWidth
  winH = windowHeight
  createCanvas(winW, winH)
  field = new Plane(0, 0, 15, 15, 40, 2)
}

function draw()
{
  background(0,0,0)
  if (gameState === "game")
  {
    field.update()
  }
  field.draw()

  textSize(30)
  fill(255)
  text("MODE : " + mode, 40*16+2, 32)
  text("MARK COUNT : " + field.markCount, 40*16+2, 64)
  text("BOMB COUNT : " + field.bombCount, 40*16+2, 96)
  if (gameState === "win")
  {
    text("You won!", 40*16+2, 128)
  }
  else if (gameState === "lose")
  {
    text("You lost!", 40*16+2, 128)
  }
}

function mouseClicked()
{
  if (gameState === "game")
  {
    field.clickEvent()
  }
}

function keyPressed()
{
  if (gameState === "game")
  {
    if (keyCode === 32)
    {
      if (mode === "excavate") {mode = "mark"}
      else {mode = "excavate"}
    }
  }
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
  winW = windowWidth
  winH = windowHeight
}
