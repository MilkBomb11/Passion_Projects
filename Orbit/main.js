let winW, winH;

let p, s;

let startButton, endButton, startVelXInput, startVelYInput, rInput;

let mode = "preparation"; // preparation, simulation

let G = 100;
let sf = 1;

function setup() {
    winW = windowWidth;
    winH = windowHeight;
    createCanvas(winW-1, winH-1);

    startVelXInput = createInput("0");
    startVelXInput.style('width', '100px');
    startVelXInput.style('height', '30px');
    startVelXInput.style('font-size', '20px');
    startVelXInput.position(130, 10);

    startVelYInput = createInput("-10");
    startVelYInput.style('width', '100px');
    startVelYInput.style('height', '30px');
    startVelYInput.style('font-size', '20px');
    startVelYInput.position(130, 45);

    rInput = createInput("400");
    rInput.style('width', '100px');
    rInput.style('height', '30px');
    rInput.style('font-size', '20px');
    rInput.position(100, 80);

    startButton = createButton("시작");
    startButton.style('width', '100px');
    startButton.style('height', '30px');
    startButton.style('font-size', '20px');
    startButton.position(10, 115);
    startButton.mousePressed(reset);

    endButton = createButton("종료");
    endButton.style('width', '100px');
    endButton.style('height', '30px');
    endButton.style('font-size', '20px');
    endButton.position(10, 150);
    endButton.mousePressed(terminate);

    //startButton = createButton("Start Simulation");
    //startButton.position()


    s = new Attractor(winW/2, winH/2, 400);
    p = new Planet(s.position.x+400, winH/2, createVector(0, -10), s);
}

function draw() {
    background(0);
    if (mode === "simulation")
        p.update();
    
    fill(255, 0, 255);
    stroke(255, 0, 255);
    textSize(20);
    text("시작속도", 10, 50);
    text("X:", 110, 30);
    text("Y:", 110, 65);
    text("시작거리", 10, 105);

    push();
    translate(s.position.x, s.position.y);
    scale(sf);
    p.draw();
    s.draw();
    pop();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function reset()
{
    s = new Attractor(winW/2, winH/2, 400);
    p = new Planet(s.position.x+float(rInput.value()), winH/2, createVector(float(startVelXInput.value()), float(startVelYInput.value())), s);
    mode = "simulation";
}

function terminate()
{
    mode = "preparation";
    sf = 1;
}

window.addEventListener("wheel", function(e) {
    if (e.deltaY > 0)
      sf *= 1.05;
    else
      sf *= 0.95;
  });