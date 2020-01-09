class Circle{
  constructor(traits)
  {
    this.x = traits.x
    this.y = traits.y
    this.r = traits.r
  }

  draw()
  {
    noStroke()
    fill(50, 168, 82, 255/2)
    ellipse(this.x, this.y, this.r*2, this.r*2)
  }
}
