class Attractor
{
    constructor(x, y, mass)
    {
        this.position = createVector(x, y);
        this.mass = mass;
        this.radius = 50;
    }

    draw()
    {
        noFill();
        stroke(255, 255, 0);
        strokeWeight(2);
        ellipse(0, 0, this.radius*2, this.radius*2);
    }
}