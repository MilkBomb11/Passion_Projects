let winW, winH, groups;
let t = 0;

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    groups = 
    [
        new Group(winW/4, winH/4, 3, 50, 5, 8), // x, y, oN, oSize, oSpeed, oPeriod
        new Group(winW*(3/4), winH/4, 4, 50, 5, 8),
        new Group(winW/4, winH*(3/4), 5, 50, 5, 8),
        new Group(winW*(3/4), winH*(3/4), 6, 50, 5, 8)
    ]

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    for (let i = 0; i < groups.length; i++)
    {
        groups[i].update();
        groups[i].draw();
    }
    t += 0.01;
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}
