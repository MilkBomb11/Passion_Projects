class VertexHandler
{
  constructor(rowNum, columnNum)
  {
    this.rowNum = rowNum
    this.columnNum = columnNum
    this.vertexes = []
  }

  update()
  {
    let xPos = table.circles.columns[this.columnNum].point.x
    let yPos = table.circles.rows[this.rowNum].point.y
    this.vertexes.push({x : xPos, y : yPos})
  }

  refresh()
  {
    this.vertexes = []
  }

  draw()
  {
    noFill()
    stroke("magenta")
    strokeWeight(1)
    beginShape()
    for (let i = 0; i < this.vertexes.length; i++)
    {
      vertex(this.vertexes[i].x, this.vertexes[i].y)
    }
    endShape()
  }
}
