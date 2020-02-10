let winW, winH;
let pm;
let pen;
let G = 10;
let pause = "paused";

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    pm = new PlanetManager();
    pen = new Pen();

    createCanvas(winW, winH);
}

function draw() {
    background("black");
    pen.draw();
    
    fill("yellow");
    textSize(20);
    textAlign(LEFT, TOP);
    text("status : " + pause, 5, 5)

    pm.update();
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
    pen.setRadius(event);
}

function keyPressed()
{
    if (keyCode === 32) //space
    {
        if (pause === "paused")
        {
            for (let i = 0; i < pm.planets.length; i++)
            {
                pm.planets[i].mode = "simulate"
            }
            pause = "simulation";
        }
        else
        {
            pause = "paused";
            pm.planets = [];
        }
    }
}