class VertexHandlerManager
{
  constructor()
  {
    this.handlers = []
    for (let i = 0; i < table.n; i++)
    {
      for (let j = 0; j < table.n; j++)
      {
        this.handlers.push( new VertexHandler(i, j) )
      }
    }
  }

  update()
  {
    for (let i = 0; i < this.handlers.length; i++)
    {
      this.handlers[i].update()
    }
  }

  refresh()
  {
    for (let i = 0; i < this.handlers.length; i++)
    {
      this.handlers[i].refresh()
    }
  }

  draw()
  {
    for (let i = 0; i < this.handlers.length; i++)
    {
      this.handlers[i].draw()
    }
  }
}
