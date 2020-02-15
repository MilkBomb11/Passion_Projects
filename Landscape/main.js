let winW = 20*24-4;
let winH = 20*24-4;

function setup() {

    landscape = new Landscape(-winW/2-10, -winH/2, 20, 20, 30);
    
    createCanvas(winW, winH, WEBGL);
}

function draw() {
    background(0);
    translate(0, 0);
    rotateX(-PI/3);
    //landscape.update();
    landscape.draw();
}
