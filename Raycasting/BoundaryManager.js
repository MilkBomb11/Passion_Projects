class BoundaryManager
{
  constructor()
  {
    this.boundaries = [
      new Boundary(new Point(50, 800), new Point(200, 50)),
      new Boundary(new Point(200, 50), new Point(1200, 400)),
      new Boundary(new Point(50, 700), new Point(1200, 400)),
      new Boundary(new Point(200, 300), new Point(200, 600)),
      new Boundary(new Point(450, 300), new Point(200, 600)),
      new Boundary(new Point(450, 300), new Point(700, 300)),
      new Boundary(new Point(750, 400), new Point(700, 300)),

    ]
  }

  draw()
  {
    for (let i = 0; i < this.boundaries.length; i++)
    {
      this.boundaries[i].draw()
    }
  }
}
