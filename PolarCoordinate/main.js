let winW, winH;
let points = [];
let scaleFactor = 1
let i;

function setup() {
    winW = windowWidth;
    winH = windowHeight;


    for (i = 0; i < 1500; i++) 
    {
        points[i] = new Vector(i, i);
    }

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    translate(winW/2, winH/2);

    if (scaleFactor < 0)
    {
        scaleFactor = 0;
    }
    scale(scaleFactor);

    for (let i = 0; i < points.length; i++) 
    {
        points[i].draw()
    }
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function mouseWheel(event)
{
    scaleFactor += map(event.delta, -258, 258, -0.015, 0.015);
}
