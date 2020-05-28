let winW, winH, cam, scanner;


function setup() {
    winW = 800;
    winH = 600;
    createCanvas(winW, winH);
    cam = createCapture(VIDEO);
    cam.hide();

    scanner = new Scanner(0, 0, 1, 1);
    background(0);
}

function draw() {

    scanner.update();
    scanner.draw();
    //image(cam, 0, 0, cam.elt.width, cam.elt.height);
}
