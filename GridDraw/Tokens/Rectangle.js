class Rectangle
{
  constructor() {}

  action(token)
  {
    let x = token.parameters[0]
    let y = token.parameters[1]
    let w = token.parameters[2]
    let h = token.parameters[3]

    for (let i = 0; i < w; i++)
    {
      for (let j = 0; j < h; j++)
      {
        if (x+i < winW/cellSize && y+j < winH/cellSize)
        {
          cells[x+i][y+j].color = currentColor
        }
      }
    }
  }
}
