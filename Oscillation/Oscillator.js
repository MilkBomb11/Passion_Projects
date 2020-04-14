class Oscillator
{
    constructor(x, y, size, dir, speed, period)
    {
        this.displacement = createVector(x, y);
        this.size = size;
        this.dir = dir;

        this.speed = speed;
        this.velocity = createVector();
        this.period = period
    }

    update()
    {
        let k = sin(t*this.period);
        this.velocity = createVector(cos(this.dir)*k*this.speed, sin(this.dir)*k*this.speed);
        this.displacement.add(this.velocity);
    }

    draw()
    {
        noFill();
        stroke("yellow");
        strokeWeight(1);
        push();
        translate(this.displacement.x, this.displacement.y);
        rotate(this.dir);
        //rect(-this.size/2, -this.size/2, this.size, this.size);
        rect(0, 0, this.size, this.size);
        pop();
    }


}