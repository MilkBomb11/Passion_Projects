let winW, winH;
let pyramid;

function setup() {
    winW = windowWidth;
    winH = windowHeight;
    pyramid = new Pyramid(winW/2, 50, 30, 100, 50); // x, y, floors, indentWidth, indentHeight

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    pyramid.update();
    pyramid.draw();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}
