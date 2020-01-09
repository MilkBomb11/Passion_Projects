

var winW = 600;
var winH = 600;
var cellSize = 20;

var cells = []

var input;

var inpVal = "";
var funcs = []
var tokens = []

var currentColor;

function setup() {
  createCanvas(650, 650);
  strokeWeight(1);
  currentColor = color(0, 0, 0)

  loadCells()

  input = createInput("")
  input.id("input")
  input.elt.focus()
}

function draw() {
  background(255,255,255)
  drawCells()

  // draw grid
  stroke(0,0,0);
  for (var i = 1; i < winW/cellSize; i++)
  {
    line(i*cellSize, 0, i*cellSize, winH);
  }
  for (var i = 1; i < winH/cellSize; i++)
  {
    line(0, i*cellSize, winW, i*cellSize);
  }

  //draw nums
  fill(0)
  for (let i = 0; i < winH/cellSize; i++)
  {
    text(i, 610, cells[0][i].j * cellSize + 15)
  }
  for (let i = 0; i < winW/cellSize; i++)
  {
    text(i, cells[i][0].i * cellSize + 5, 615)
  }
}

function keyPressed()
{
  if ((keyCode === ENTER || keyCode === RETURN))
  {
    if (input.value() !== "")
    {
      inpVal = input.value()
      funcs = []
      tokens = []
      currentColor = color(0, 0, 0)
      resetGrid()
      parse()
      run()
    }
  }
}

function loadCells()
{
  for (var i = 0; i < winW/cellSize; i++)
  {
    cells.push([])
    for (var j = 0; j < winH/cellSize; j++)
    {
      cells[i].push(new Cell(i, j, cellSize))
    }
  }
}

function drawCells()
{
  for (var i = 0; i < cells.length; i++)
  {
    for (var j = 0; j < cells[i].length; j++)
    {
      cells[i][j].draw()
    }
  }
}

function parse()
{
  let inpTrimmed = inpVal.trim().replace(/ /g, "")
  let lastBreakPoint = 0

  for (let i = 0; i < inpTrimmed.length; i++) { //functionization
    if (inpTrimmed.charAt(i) === ")")
    {
      let func = inpTrimmed.slice(lastBreakPoint, i+1)
      lastBreakPoint = i+1
      funcs.push(func)
    }
  }

  for (let i = 0; i < funcs.length; i++) { //tokenization
    let func = funcs[i]
    let nameBreakPoint = func.indexOf("(")

    let tokenName = func.slice(0, nameBreakPoint) //get name
    let tokenParameters = []

    let lastBreakPoint = nameBreakPoint

    for (let i = nameBreakPoint; i < func.length; i++) //get parameters
    {
      if (func.charAt(i) === "," || func.charAt(i) === ")")
      {
        let breakPoint = i
        let parameter = int(func.slice(lastBreakPoint+1, breakPoint))
        tokenParameters.push(parameter)
        lastBreakPoint = breakPoint
      }
    }

    tokens.push({ name : tokenName, parameters : tokenParameters })
  }

  console.log(funcs)
  console.log(tokens)

}

function run()
{
  for (var i = 0; i < tokens.length; i++)
  {
    let token = tokens[i]
    tokenActionHandler[token.name].action(token)
  }
}

function resetGrid()
{
  for (let i = 0; i < winW/cellSize; i++)
  {
    for (let j = 0; j < winH/cellSize; j++)
    {
      cells[i][j].color = color(255, 255, 255)
    }
  }
}
