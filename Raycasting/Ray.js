class Ray
{
  constructor(start, dir)
  {
    this.start = start
    this.dir = dir
    this.length = 2000
    this.dists = []

    this.arbitraryLine =
    {
      start : this.start,
      end : new Point( cos(this.dir)*this.length + this.start.x, sin(this.dir)*this.length + this.start.y )
    }
  }

  update()
  {
    this.arbitraryLine =
    {
      start : this.start,
      end : new Point( cos(this.dir)*this.length + this.start.x, sin(this.dir)*this.length + this.start.y )
    }

    let x1 = this.arbitraryLine.start.x
    let y1 = this.arbitraryLine.start.y
    let x2 = this.arbitraryLine.end.x
    let y2 = this.arbitraryLine.end.y

    let hitPoints = []
    for (let i = 0; i < bm.boundaries.length; i++)
    {
      let x3 = bm.boundaries[i].point1.x
      let y3 = bm.boundaries[i].point1.y
      let x4 = bm.boundaries[i].point2.x
      let y4 = bm.boundaries[i].point2.y
      let hit = collideLineLine(x1,y1,x2,y2, x3,y3,x4,y4, true)

      if (hit.x !== false)
      {
        hitPoints.push( {x: hit.x, y: hit.y} )
      }
    }

    let dists = []
    for (let i = 0; i < hitPoints.length; i++)
    {
      dists[i] = dist(this.arbitraryLine.start.x,this.arbitraryLine.start.y, hitPoints[i].x,hitPoints[i].y)
    }

    if (dists.length > 0)
    {
      let closestBoundaryIndex = dists.indexOf(Math.min(...dists))
      this.arbitraryLine.end.x = hitPoints[closestBoundaryIndex].x
      this.arbitraryLine.end.y = hitPoints[closestBoundaryIndex].y
    }
    else
    {
      this.arbitraryLine =
      {
        start : this.start,
        end : new Point( cos(this.dir)*this.length + this.start.x, sin(this.dir)*this.length + this.start.y )
      }
    }

  }

  draw()
  {
    noFill()
    stroke("white")
    strokeWeight(1)
    line(this.arbitraryLine.start.x, this.arbitraryLine.start.y, this.arbitraryLine.end.x, this.arbitraryLine.end.y)
  }


}
