let winW, winH, world, gameState, pen;

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    world = new World(77, 36, 20);
    pen = new Pen();

    gameState = "set" // set, game;

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    if (gameState === "game")
    {
        frameRate(5);
        world.update();
    }
    else
    {
        frameRate(60);
    }
    world.draw();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function mousePressed()
{
    if (gameState === "set")
    {
        pen.mouse();
    }
}

function keyPressed()
{
    if (gameState === "set")
    {
        gameState = "game";
    }
    else
    {
        gameState = "set";
    }
    console.log("Current state : " + gameState);
}

