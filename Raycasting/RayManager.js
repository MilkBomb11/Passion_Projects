class RayManager
{
  constructor(startAngle, range, n)
  {
    this.x = 0
    this.y = 0
    this.n = n

    this.rays = []

    this.startAngle = startAngle
    this.range = range


  }

  update()
  {
    this.x = mouseX
    this.y = mouseY
    this.range = radians(range.value())

    let angle = this.startAngle
    for (let i = 0; i < this.n; i++)
    {
      this.rays[i] = new Ray(new Point(this.x, this.y), angle)
      angle += this.range/this.n
    }

    for (let i = 0; i < this.n; i++)
    {
      this.rays[i].start.x = this.x
      this.rays[i].start.y = this.y
      this.rays[i].update()
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))// D
    {
      this.startAngle += 0.1
    }
    else if(keyIsDown(LEFT_ARROW) || keyIsDown(65)) // A
    {
      this.startAngle -= 0.1
    }
  }
  draw()
  {
    for (let i = 0; i < this.rays.length; i++)
    {
      this.rays[i].draw()
    }
  }
}
