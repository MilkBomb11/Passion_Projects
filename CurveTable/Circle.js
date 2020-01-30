class Circle
{
  constructor(x, y, radius, angle, rotationSpeed, type)
  {
    this.x = x
    this.y = y
    this.radius = radius

    this.angle = angle
    this.rotationSpeed = rotationSpeed
    this.point = {x:0,y:0}

    this.type = type // row column
  }

  update()
  {
    this.angle += this.rotationSpeed
    this.point.x = this.x + cos(this.angle) * this.radius
    this.point.y = this.y + sin(this.angle) * this.radius

    if (this.rotationSpeed === baseSpeed)
    {
      if (this.angle >= TAU)
      {
        table.resetAngles()
        vhm.refresh()
      }
    }
  }

  resetAngle()
  {
    this.angle = 0
  }

  draw()
  {
    stroke("white")
    strokeWeight(1)
    noFill()
    ellipse(this.x, this.y, this.radius*2)

    stroke("blue")
    line(this.x, this.y, this.point.x, this.point.y)

    stroke("white")
    strokeWeight(10)
    point(this.point.x, this.point.y)

    stroke("yellow")
    strokeWeight(1)
    if(this.type === "row")
    {
      line(this.point.x, this.point.y, winW, this.point.y)
    }
    else
    {
      line(this.point.x, this.point.y, this.point.x, winH)
    }
  }
}
