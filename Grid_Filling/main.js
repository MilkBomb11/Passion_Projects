let winW, winH;
let grid;

function setup() {
    winW = windowWidth;
    winH = windowHeight;
    createCanvas(winW, winH);

    grid = new Grid(400, 50, 25);
}

function draw() {
    background(0);
    grid.update();
    grid.draw();
}

function mousePressed()
{
    grid.mouse();
}

function keyPressed()
{
    if (keyCode == 82)
    {
        grid.reset();
    }
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}
