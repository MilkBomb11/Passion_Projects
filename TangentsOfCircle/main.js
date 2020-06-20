/* 
 default x, y means cartesian coords
 cartesian to screen:
 screenX = cartX + winW/2,
 screenY = winH/2 - cartY
*/

let winW, winH, circle, linear, cal;

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    circle = new Circle(0, 0, 200, 10);
    cal = new Cal(circle);

    createCanvas(winW, winH);
}

function draw() {

    background(0);
    circle.update();
    circle.draw();
    cal.update();
    cal.draw();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function mouseWheel(event)
{
    event.delta = map(event.delta, -259, 259, -5, 5);
    circle.r += event.delta;
}
