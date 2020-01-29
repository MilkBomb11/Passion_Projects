class Bar
{
  constructor(x, y, w, minH, maxH, offset)
  {
    this.x = x
    this.y = y
    this.w = w
    this.h = minH
    this.minH = minH
    this.maxH = maxH

    this.seta = 0
    this.offset = offset
  }

  update()
  {
    this.h = map(sin(-this.seta + this.offset), -1, 1, this.minH, this.maxH)
    this.seta += 0.1
  }

  draw()
  {
    noStroke()
    fill(255)
    rectMode(CENTER)
    rect(this.x, this.y, this.w, this.h)
  }
}
