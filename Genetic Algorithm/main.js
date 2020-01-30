let winW, winH;
let targetWord = "the fast fox jumped over the lazy sheep".split("");
let alphabet = "abcdefghijklmnopqrstuvwxyz ".split("");
let population;

function setup()
{
  winW = windowWidth
  winH = windowHeight

  population = new Population(winW/2, 20, 1000, 1)

  createCanvas(winW, winH)
}

function draw()
{
  background("black")
  if (population.getBestEntityText() !== targetWord.join(""))
  {
    population.update()
  }
  else
  {
    console.log(population.getBestEntityText())
  }
  population.scroll(10)
  population.draw()
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
  winW = windowWidth
  winH = windowHeight
}
