class Pen{
  constructor()
  {
    this.x = mouseX
    this.y = mouseY
  }

  update()
  {
    this.x = mouseX
    this.y = mouseY
    if(mouseIsPressed)
    {
      drawing.push(new Complex(this.x, this.y))
    }
  }

  draw()
  {
    strokeWeight(1/scaleFactor)
    stroke(255)
    if(mouseIsPressed)
    {
      line(this.x, this.y, pmouseX, pmouseY)
    }
  }
}
