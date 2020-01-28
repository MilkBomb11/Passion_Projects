class Cell{
  constructor(rowNum, columnNum, size, cellBuffer, type)
  {
    this.rowNum = rowNum
    this.columnNum = columnNum
    this.size = size
    this.cellBuffer = cellBuffer
    this.type = type // bomb, normal
    this.state = "hidden" // hidden, show

    this.bombsAroundCount = 0
    this.checkFinished = false

    this.x = 0
    this.y = 0

    this.color = color(255, 255, 255)
  }

  checkMouseCollision()
  {
    return mouseX > this.x &&
           mouseX < this.x+this.size &&
           mouseY > this.y &&
           mouseY < this.y+this.size
  }

  checkForBombs()
  {
    for (let rowNum = this.rowNum-1; rowNum <= this.rowNum+1; rowNum++)
    {
      for (let columnNum = this.columnNum-1; columnNum <= this.columnNum+1; columnNum++)
      {
        if (!(rowNum === this.rowNum && columnNum === this.columnNum))
        {
          if (field.cells[rowNum][columnNum].type === "bomb")
          {
            this.bombsAroundCount++
          }
        }
      }
    }
    this.checkFinished = true
  }

  update()
  {
    this.x = (this.columnNum-1)*this.size + this.cellBuffer*(this.columnNum+1)
    this.y = (this.rowNum-1)*this.size + this.cellBuffer*(this.rowNum+1)
    if( this.checkMouseCollision() )
      this.color = color(172, 172, 172)
    else
      this.color = color(255, 255, 255)

    if (!this.checkFinished)
    {
      this.checkForBombs()
    }
  }

  draw()
  {
    noStroke()
    fill(this.color)
    rect(this.x, this.y, this.size, this.size)

    fill(0)
    textSize(20)
    if (this.state === "show")
    {
      this.color = color(255, 255, 255)
      if (this.type === "bomb")
        ellipse(this.x + this.size/2, this.y + this.size/2, this.size/2)
      else
        text(this.bombsAroundCount.toString(), this.x+this.size/3, this.y+this.size*(2/3))
    }
    else if (this.state === "marked")
      rect(this.x + 5, this.y +5, this.size-10, this.size-10)
    else
      this.color = color(255, 255, 255)
    //text(this.type.charAt(0) + " " + this.bombsAroundCount.toString(), this.x, this.y+20)
  }
}
