class Population
{
  constructor(x, y, n, mutationRate)
  {
    this.x = x
    this.y = y
    this.entities = []
    this.populationNum = n
    this.mutationRate = mutationRate
    this.generation = 0
    this.createPopulation()
  }

  update()
  {
    this.calculateFitness()
    //this.createParentCandidates()
    this.recreatePopulation()
    this.generation++
  }


  // setup functions
  createRandomWord(len)
  {
    let word = []
    for (let i = 0; i < len; i++)
    {
      let c = random(alphabet)
      word[i] = c
    }
    return word.join("")
  }

  createPopulation()
  {
    for (let i = 0; i < this.populationNum; i++)
    {
      this.entities[i] = new Entity(this.createRandomWord(targetWord.length))
    }
  }



  // update functions
  calculateFitness()
  {
    for (let i = 0; i < this.entities.length; i++)
    {
      this.entities[i].getFitness()
    }
  }

  recreatePopulation()
  {
    let p1 = this.getBestEntityText()
    for (let i = 0; i < this.entities.length; i++)
    {
      this.entities[i].text = p1
      this.entities[i].mutate(this.mutationRate)
    }
  }

  getBestEntityText()
  {
    this.entities.sort( (a, b) => b.fitness - a.fitness)
    return this.entities[0].text
  }



  scroll(speed)
  {
    if (keyIsDown(UP_ARROW))
    {
      this.y += speed
    }
    else if (keyIsDown(DOWN_ARROW))
    {
      this.y -= speed
    }
  }

  draw()
  {
    for (let i = 0; i < this.entities.length; i++)
    {
      this.entities[i].draw(this.x, this.y + i*25)
    }
    textSize(20);
    text("Generation: " + str(this.generation), 10, 40)

    textSize(30);
    fill("magenta");
    text("Fittest Entity ⇩", 10, 90);
    fill("yellow");
    textSize(40);
    text(this.getBestEntityText(), 10, 140);
  }
}
