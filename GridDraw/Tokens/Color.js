class Color
{
  constructor() {}

  action(token)
  {
    currentColor = color(token.parameters[0], token.parameters[1], token.parameters[2])
  }
}
