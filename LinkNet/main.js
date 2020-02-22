let winW, winH;
let groups, linkers;

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    groups = [
        new Group(winW/4-250, 15, 10, {radius : 20}), 
        new Group(winW*2/4-250, 15, 10, {radius : 20}),
        new Group(winW*3/4-250, 15, 10, {radius : 20}),
        new Group(winW-250, 15, 10, {radius : 20})
    ];
    linkers = [];
    for (let i = 0; i < groups.length-1; i++) 
    {
        linkers.push(new Linker(groups[i], groups[i+1]));
    }

    pos = {x : 0, y : 0};

    createCanvas(winW, winH);
}

function draw() {
    background(0);
    translate(pos.x, pos.y);

    for (let i = 0; i < linkers.length; i++) 
    {
        linkers[i].draw();
    }
    for (let i = 0; i < groups.length; i++) 
    {
        groups[i].draw();
    }

}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function mouseWheel(event)
{
    pos.y -= event.delta/7;
}
