class Circle
{
  constructor(x, y, r, minY, maxY, offset)
  {
    this.x = x
    this.y = y
    this.originY = y
    this.r = r
    this.minYOffset = minY
    this.maxYOffset = maxY

    this.seta = 0
    this.offset = offset
  }

  update()
  {
    this.y = map(sin(-1/2*this.seta + this.offset), -1, 1, this.minYOffset+this.originY, this.maxYOffset+this.originY)
    this.seta += 0.1
  }

  draw()
  {
    stroke("yellow")
    noFill()
    ellipse(this.x, this.y, this.r*2)
  }
}
