class BoundaryManager
{
  constructor()
  {
    this.boundaries = []
  }

  draw()
  {
    for (let i = 0; i < this.boundaries.length; i++)
    {
      this.boundaries[i].draw()
    }
  }
}
