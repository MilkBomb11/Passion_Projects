let winW, winH, renderer;
let cam = {x:0, y:0, speed:10};
let graphs = [
    new Graph((x)=>{ return 50*sin(1/100* x) }),
    new Graph((x)=>{ return 1/100*Math.pow(x, 2) - 300 }),
    new Graph((x)=>{ return 1/100*Math.pow(x, 3) }),
    new Graph((x)=>{ return x })
];

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    createCanvas(winW, winH);
}

function draw() {
    translate(cam.x, cam.y);
    background(0);
    for (let i = 0; i < graphs.length; i++)
    {
        graphs[i].update();
        graphs[i].draw();
    }

    if (keyIsDown(RIGHT_ARROW))
    {
        cam.x -= cam.speed;
    }
    else if (keyIsDown(LEFT_ARROW))
    {
        cam.x += cam.speed;
    }
    
    if (keyIsDown(UP_ARROW))
    {
        cam.y += cam.speed;
    }
    else if (keyIsDown(DOWN_ARROW))
    {
        cam.y -= cam.speed;
    }
    
    stroke("blue");
    strokeWeight(1);
    line(-cam.x, winH/2, -cam.x+winW, winH/2);
    line(winW/2, -cam.y, winW/2, -cam.y+winW/2);
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

