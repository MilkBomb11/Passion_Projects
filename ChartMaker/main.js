var canvasWidth;
var canvasHeight;

var inputBar;

var items = [];
var total = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  canvasWidth = windowWidth
  canvasHeight = windowHeight

  inputBar = createInput("")
  inputBar.id("input-bar")
}

function draw() {
  background(0,0,0)
  for (let i = 0; i < items.length; i++) {
    items[i].update()
    items[i].draw()
  }

  fill(150)
  textSize(20)
  textAlign(RIGHT, TOP)
  text("total : " + str(total), canvasWidth-5, 5)
}

function keyPressed()
{
  if (keyCode === ENTER || keyCode === RETURN)
  {
    parse()
  }
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight)
  canvasWidth = windowWidth
  canvasHeight = windowHeight
}

function delWhiteSpace(str)
{
  let string = str.trim()
  string = string.replace(/ /g, "")
  return string
}

function parse()
{
  items = []
  total = 0
  let inpVal = delWhiteSpace(inputBar.value())
  let items_str = inpVal.split(",")
  let items_arr = []
  let startDeg = 0

  for (let i = 0; i < items_str.length; i++) {
    let item_arr = items_str[i].split(":")
    items_arr.push(item_arr)
  }

  for (let i = 0; i < items_arr.length; i++) {
    items_arr[i][1] = int(items_arr[i][1])
    total = total + items_arr[i][1]
  }

  for (let i = 0; i < items_arr.length; i++) {
    let item_arr = items_arr[i]
    let itemName = item_arr[0]
    let itemValue = int(item_arr[1])
    let itemColor = color(item_arr[2])
    items.push( new Item(itemName, itemValue, startDeg, total, itemColor) )

    let deg = itemValue / total * 360
    startDeg = startDeg + deg
  }

  console.log(items)
}
