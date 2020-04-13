let winW, winH, be;

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    be = new Bezier(new Point(400, winH/2), new Point(500, winH/2-300), new Point(800, winH/2), 100);

    createCanvas(winW, winH);
}

function draw() {
    background(0);

    //let x1 = 400;
    //let x2 = 800;
    //b(new Point(x1, winH/2), new Point(mouseX, mouseY), new Point(x2, winH/2), 100);

    be.update();
    be.draw();
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}



function internalDivision(v1, v2, m, n)
{
    let x = (v2.x*m+v1.x*n) / (m+n);
    let y = (v2.y*m+v1.y*n) / (m+n);

    return createVector(x, y);
}   





function b(p, q, r, accuracy)
{   
    let step = 1/accuracy;

    stroke("yellow");
    strokeWeight(1);
    noFill();
    beginShape();
    for (let u = 0; u <= 1; u += step)
    {
        let s = internalDivision(p, q, u, 1-u);
        let t = internalDivision(q, r, u, 1-u);
        let pX = internalDivision(s, t, u, 1-u);
        vertex(pX.x, pX.y);
    }
    endShape();

    strokeWeight(5);
    stroke("magenta");
    point(p.x, p.y);
    point(q.x, q.y);
    point(r.x, r.y);

    strokeWeight(1);
    stroke("orange");
    line(p.x, p.y, q.x, q.y);
    line(q.x, q.y, r.x, r.y);
}
