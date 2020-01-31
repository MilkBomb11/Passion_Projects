class RayManager
{
  constructor(n)
  {
    this.x = 0
    this.y = 0
    this.n = n

    this.rays = []
    let angle = 0
    for (let i = 0; i < this.n; i++)
    {
      this.rays[i] = new Ray(new Point(this.x, this.y), angle)
      angle += TAU/this.n
    }
  }

  update()
  {
    this.x = mouseX
    this.y = mouseY
    for (let i = 0; i < this.n; i++)
    {
      this.rays[i].start.x = this.x
      this.rays[i].start.y = this.y
      this.rays[i].update()
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
