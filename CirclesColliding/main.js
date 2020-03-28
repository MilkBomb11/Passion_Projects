let winW, winH, entityManager;

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    entityManager = new EntityManager(30);

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    entityManager.update();
    entityManager.draw();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}
