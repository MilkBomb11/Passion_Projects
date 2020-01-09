class Cell
{
  constructor(i, j, size)
  {
    this.i = i
    this.j = j
    this.size = size

    this.color = color(255, 255, 255)
  }

  draw()
  {
    noStroke()
    fill(this.color)
    rect(this.i*this.size, this.j*this.size, this.size, this.size)
  }
}
