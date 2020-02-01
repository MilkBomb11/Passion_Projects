class Pen
{
  constructor()
  {

    this.point1 = new Point(0,0)
    this.point2 = new Point(0,0)
    this.state = 0
  }

  input()
  {
    if (mouseY >= 0)
    {
      if (this.state === 0)
      {
        this.state = 1
        this.point1 = new Point(mouseX, mouseY)
      }
      else if (this.state === 1)
      {
        this.state = 0
        this.point2 = new Point(mouseX, mouseY)
        bm.boundaries.push(new Boundary(this.point1, this.point2))
        this.point1 = new Point(0,0)
        this.point2 = new Point(0,0)
      }
    }
  }

  draw()
  {
    noFill()
    strokeWeight(1)
    stroke("yellow")
    if (this.point1.x !== 0 && this.point2.x !== 0)
    {
      line(this.point1.x, this.point1.y, this.point2.x, this.point2.y)
    }
    else if (this.point1.x !== 0 && this.point2.x === 0)
    {
      line(this.point1.x, this.point1.y, mouseX, mouseY)
    }
  }
}
