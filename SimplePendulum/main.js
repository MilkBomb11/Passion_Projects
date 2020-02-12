let winW, winH;
const g = 1;
let pendulums = [];

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    let pX = winW/2;
    let pY = 300;
    let pNum = int(random(2, 10));
    pendulums = [];
    for (let i = 0; i < pNum; i++)
    {
        let radius = int(random(10, 60));
        let initAngle = random(0, TAU);
        let length = int(random(200, 500));
        pendulums[i] = new Pendulum(pX, pY, radius, initAngle, length);
    }

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    for (let i = 0; i < pendulums.length; i++)
    {
        const p = pendulums[i];
        p.update();
        p.draw();
    }
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}
