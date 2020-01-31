class Boundary
{
  constructor(point1 , point2)
  {
    this.point1 = point1
    this.point2 = point2
  }

  draw()
  {
    noFill()
    stroke("yellow")
    strokeWeight(1)
    line(this.point1.x ,this.point1.y, this.point2.x, this.point2.y)
  }
}
