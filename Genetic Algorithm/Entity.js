class Entity
{
  constructor(text)
  {
    this.text = text
    this.arr = this.text.split("")
    this.fitness = 0
  }

  getFitness()
  {
    this.fitness = 0
    for (let i = 0; i < this.arr.length; i++)
    {
      if (this.arr[i] === targetWord[i])
      {
        this.fitness++
      }
    }
  }

  mutate(rate)
  {
    this.arr = this.text.split("")
    for (let i = 0; i < rate; i++)
    {
      this.arr[Math.floor(random(0, this.arr.length))] = random(alphabet)
    }
    this.text = this.arr.join("")
  }

  draw(x, y)
  {
    fill("white")
    textSize(20)
    text(this.text, x, y)
  }
}
