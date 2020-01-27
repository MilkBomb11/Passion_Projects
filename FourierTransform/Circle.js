class Circle{
  constructor(x, y, fourier, rotation, n)
  {
    this.x = x
    this.y = y
    this.radius = fourier.amplitude
    this.phase = fourier.phase
    this.frequency = fourier.frequency

    this.pointX = 0
    this.pointY = 0

    this.rotation = rotation

    this.n = n
    this.objectN = n+1
  }

  update(cycles)
  {
    this.pointX = this.radius * cos(this.frequency * time + this.phase + this.rotation) + this.x //point x , point y
    this.pointY = this.radius * sin(this.frequency * time + this.phase + this.rotation) + this.y

    if (this.n !== cycles.length - 1)
    {
      cycles[this.objectN].x = this.pointX
      cycles[this.objectN].y = this.pointY
    }
    else
    {
      vertexes.push({x : this.pointX, y : this.pointY})
    }
  }

  draw()
  {
    noFill()
    stroke(255, 255, 255, 125)
    strokeWeight(1/(scaleFactor/2))
    ellipse(this.x, this.y, this.radius*2)
    stroke(255,0,255)
    line(this.x, this.y, this.pointX, this.pointY)
  }
}
