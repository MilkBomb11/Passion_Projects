class Wave
{
  constructor(x, y, barWidth, minH, maxH, n)
  {
    this.x = x
    this.y = y
    this.buffer = 5

    this.bars = []
    this.circles = []
    this.vertexes = []
    for (let i = 0; i < n; i++)
    {
      this.bars[i] = new Bar(i*barWidth+this.x + this.buffer*i, this.y, barWidth, minH, maxH, i)
    }
    for (let i = 0; i < n; i++)
    {
      this.circles[i] = new Circle(i*barWidth+this.x + this.buffer*i, this.y, 5, minH, maxH, i)
    }
  }

  update()
  {
    for (let i = 0; i < this.bars.length; i++)
    {
      this.bars[i].update()
      this.circles[i].update()
    }
  }

  draw()
  {
    for (let i = 0; i < this.bars.length; i++)
    {
      this.bars[i].draw()
      this.circles[i].draw()
    }
  }


}
