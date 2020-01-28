class Plane{
  constructor(x, y, rows, columns, cellSize, cellBuffer)
  {
    this.x = x
    this.y = y
    this.rows = rows
    this.columns = columns
    this.cellSize = cellSize
    this.cellBuffer = cellBuffer
    this.cellTypes = ["bomb", "normal", "normal"]

    this.bombCount = 0
    this.markCount = 0

    this.cells = []
    for (let rowNum = 0; rowNum < this.rows+2; rowNum++)
    {
      this.cells.push([])
      for (let columnNum = 0; columnNum < this.columns+2; columnNum++)
      {
        this.cells[rowNum][columnNum] = 0
      }
    }

    for (let rowNum = 0; rowNum < this.cells.length; rowNum++)
    {
      for (let columnNum = 0; columnNum < this.cells[rowNum].length; columnNum++)
      {
        let edge = ((rowNum === 0 || columnNum === 0) || (rowNum === this.cells.length-1 || columnNum === this.cells[rowNum].length-1))
        if (edge)
          this.cells[rowNum][columnNum] = {type : "bound"}
        else
        {
          let type = random(this.cellTypes)
          this.cells[rowNum][columnNum] = new Cell(rowNum, columnNum, this.cellSize, this.cellBuffer, type)
          if (type === "bomb") { this.bombCount++ }
        }
      }
    }
  }

  update()
  {
    for (let rowNum = 1; rowNum <= this.rows; rowNum++)
    {
      for (let columnNum = 1; columnNum <= this.columns; columnNum++)
      {
        this.cells[rowNum][columnNum].update()
      }
    }

    if (this.markCount === this.bombCount)
    {
      if (this.checkIfWon())
      {
        gameState = "win"
      }
    }
  }

  clickEvent()
  {
    for (let rowNum = 1; rowNum <= this.rows; rowNum++)
    {
      for (let columnNum = 1; columnNum <= this.columns; columnNum++)
      {
        if (this.cells[rowNum][columnNum].checkMouseCollision())
        {
          if (mode === "excavate")
          {
            if (this.cells[rowNum][columnNum].state === "marked") { this.markCount-- }
            this.cells[rowNum][columnNum].state = "show"
            if (this.cells[rowNum][columnNum].type === "bomb")
            {
              this.showAll()
              gameState = "lose"
            }
          }
          else if (mode === "mark")
          {
            if (this.cells[rowNum][columnNum].state === "hidden")
            {
              this.cells[rowNum][columnNum].state = "marked";
              this.markCount++;
            }
            else if(this.cells[rowNum][columnNum].state === "marked")
            {
              this.cells[rowNum][columnNum].state = "hidden";
              this.markCount--;
            }
          }
        }
      }
    }
  }

  showAll()
  {
    for (let rowNum = 1; rowNum <= this.rows; rowNum++)
    {
      for (let columnNum = 1; columnNum <= this.columns; columnNum++)
      {
        if (this.cells[rowNum][columnNum].type === "bomb")
        {
          this.cells[rowNum][columnNum].state = "show"
        }
      }
    }
  }

  checkIfWon()
  {
    for (let rowNum = 1; rowNum <= this.rows; rowNum++)
    {
      for (let columnNum = 1; columnNum <= this.columns; columnNum++)
      {
        if (this.cells[rowNum][columnNum].state === "marked" && this.cells[rowNum][columnNum].type === "normal")
        {
          return false
        }
      }
    }
    return true
  }

  draw()
  {
    push()
    translate(this.x, this.y)
    for (let rowNum = 1; rowNum <= this.rows; rowNum++)
    {
      for (let columnNum = 1; columnNum <= this.columns; columnNum++)
      {
        this.cells[rowNum][columnNum].draw()
      }
    }
    pop()
  }

}
