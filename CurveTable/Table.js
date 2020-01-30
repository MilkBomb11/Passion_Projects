class Table
{
  constructor(x, y, circleRadius, circleInitAngle, circleSpeed, n)
  {
    this.x = x
    this.y = y
    this.n = n

    this.circleRadius = circleRadius // int
    this.interval = this.circleRadius*3
    this.baseCircleSpeed = circleSpeed
    this.circleInitAngle = circleInitAngle
    this.circles = { rows : [], columns : [] }

    this.circleSpeeds = []
    for (let i = 0; i < this.n; i++)
    {
      this.circleSpeeds[i] = this.baseCircleSpeed*(i+1)
    }

    for (let i = 0; i < n; i++)
    {
      this.circles.columns.push( new Circle(this.x+this.circleRadius*2 + this.interval*i, this.y, this.circleRadius, this.circleInitAngle, this.circleSpeeds[i], "column") )
    }

    for (let i = 0; i < n; i++)
    {
      this.circles.rows.push( new Circle(this.x, this.y+this.circleRadius*2 + this.interval*i, this.circleRadius, this.circleInitAngle, this.circleSpeeds[i], "row") )
    }

    this.w = this.interval*this.circles.rows.length
    this.h = this.interval*this.circles.rows.length
  }

  update()
  {
    for (let i = 0; i < this.n; i++)
    {
      this.circles.rows[i].update()
      this.circles.columns[i].update()
    }
  }

  resetAngles()
  {
    for (let i = 0; i < this.n; i++)
    {
      this.circles.rows[i].resetAngle()
      this.circles.columns[i].resetAngle()
    }
  }

  draw()
  {
    for (let i = 0; i < this.n; i++)
    {
      this.circles.rows[i].draw()
      this.circles.columns[i].draw()
    }

    strokeWeight(1)
    stroke("white")
    for (let i = 0; i < this.n-1; i++)
    {
      line((this.circles.columns[i].x+this.circles.columns[i+1].x)/2, this.y, (this.circles.columns[i].x+this.circles.columns[i+1].x)/2, this.y+this.h)
      line(this.x, (this.circles.rows[i].y+this.circles.rows[i+1].y)/2, this.x+this.w, (this.circles.rows[i].y+this.circles.rows[i+1].y)/2)
    }
  }
}
