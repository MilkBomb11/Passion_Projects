class Circle
{
  constructor() {}

  action(token)
  {
    let x = token.parameters[0]
    let y = token.parameters[1]
    let r = token.parameters[2]

    for (let i = 0; i < winW/cellSize; i++)
    {
      for (let j = 0; j < winH/cellSize; j++)
      {
        if ((x-i)*(x-i) + (y-j)*(y-j) < int(r*r))
        {
          cells[i][j].color = currentColor
        }
      }
    }
  }
}
