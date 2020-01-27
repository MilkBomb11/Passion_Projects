class Epicycle{
  constructor(x, y, fourier, rotation)
  {
    this.x = x
    this.y = y
    this.fourier = fourier
    this.rotation = rotation

    this.cycles = []
    for (let i = 0; i < this.fourier.length; i++)
    {
      this.cycles.push(new Circle(this.x, this.y, this.fourier[i], this.rotation, i))
    }

  }

  update()
  {
    for(let i = 0; i < this.cycles.length; i++)
    {
      this.cycles[i].update(this.cycles)
    }
  }

  draw()
  {
    for(let i = 0; i < this.cycles.length; i++)
    {
      this.cycles[i].draw()
    }
  }
}
