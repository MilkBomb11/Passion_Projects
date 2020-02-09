let winW, winH;
let pm;
let G = 10;
let currentRadius = 30;
let pause = "paused";

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    pm = new PlanetManager(30);
    pen = new Pen();

    createCanvas(winW, winH);
}

function draw() {
    background("black");

    noFill();
    stroke(255);
    ellipse(mouseX, mouseY, currentRadius*2);
    
    fill("yellow");
    textSize(20);
    textAlign(LEFT, TOP);
    text("status : " + pause, 5, 5)

    if (pause !== "paused")
    {
        pm.update();
    }
    pm.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function mouseCollision(x, y, w, h)
{
    return x < mouseX && x+w > mouseX && 
           y < mouseY && y+h > mouseY;
}

function mouseClicked()
{
    pen.placePlanet();
}

function mouseWheel(event)
{
    let changeRate = map(event.delta, -250, 250, -5, 5);
    currentRadius += changeRate;
    console.log(currentRadius);
}

function keyPressed()
{
    if (keyCode === 32) //space
    {
        if (pause === "paused")
        {
            pause = "simulation";
        }
        else
        {
            pause = "paused";
            pm.planets = [];
        }
    }
}