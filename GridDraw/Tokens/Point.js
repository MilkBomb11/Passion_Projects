class Point
{
  constructor() {}

  action(token)
  {
    cells[token.parameters[0]][token.parameters[1]].color = currentColor
  }
}
