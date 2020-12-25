let winW, winH, em;

let reproduceButton, selectionButton;


function setup() {
    winW = windowWidth;
    winH = windowHeight;

    reproduceButton = createButton("Reproduce");
    reproduceButton.position(5, 5);
    reproduceButton.style('width', '80px');
    reproduceButton.style('height', '20px');
    reproduceButton.style('font-size', '12px');

    selectionButton = createButton("Natural Selection");
    selectionButton.position(5, 30);
    selectionButton.style('width', '110px');
    selectionButton.style('height', '20px');
    selectionButton.style('font-size', '12px');


    em = new EntityManager(50);

    createCanvas(winW, winH);
    reproduceButton.mousePressed(() => { em.reproduceEntities(); });
    selectionButton.mousePressed(() => { em.naturalSelection(); });
}

function draw() {
    background(0);
    em.drawEntities();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}
