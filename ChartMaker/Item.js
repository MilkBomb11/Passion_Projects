class Item{
  constructor(name, value, start, total, colour)
  {
    this.x = canvasWidth/2
    this.y = canvasHeight/2
    this.r = 200
    this.name = name
    this.total = total
    this.value = radians(value/total * 360)
    this.start = radians(start)
    this.ratio = value/total * 100
    this.halfPoint = this.start + this.value/2
    this.color = colour

    this.pointA = {
      x : cos(this.halfPoint) * this.r + this.x,
      y : sin(this.halfPoint) * this.r + this.y
    }

    this.pointB = {
      x : cos(this.halfPoint) * this.r * 1.25 + this.x,
      y : sin(this.halfPoint) * this.r * 1.25 + this.y
    }
  }

  update()
  {
    this.x = canvasWidth/2
    this.y = canvasHeight/2
    
    this.pointA = {
      x : cos(this.halfPoint) * this.r + this.x,
      y : sin(this.halfPoint) * this.r + this.y
    }

    this.pointB = {
      x : cos(this.halfPoint) * this.r * 1.25 + this.x,
      y : sin(this.halfPoint) * this.r * 1.25 + this.y
    }
  }

  draw()
  {
    stroke(255)
    strokeWeight(2)
    line(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y)

    noStroke()
    fill(150)
    textSize(20)
    if (this.halfPoint > 0 && this.halfPoint <= HALF_PI)
      textAlign(LEFT, TOP)
    else if (this.halfPoint > HALF_PI && this.halfPoint <= PI)
      textAlign(RIGHT, TOP)
    else if (this.halfPoint > PI && this.halfPoint <= PI + HALF_PI)
      textAlign(RIGHT, BOTTOM)
    else
      textAlign(LEFT, BOTTOM)
    text(this.name + " " + str(int(this.ratio)) + "%", this.pointB.x, this.pointB.y)

    noStroke()
    fill(this.color)
    arc(this.x, this.y, this.r*2, this.r*2, this.start, this.start + this.value)
  }
}
