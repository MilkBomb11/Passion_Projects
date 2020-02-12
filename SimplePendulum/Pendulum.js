class Pendulum
{
    constructor(x, y, radius, initAngle, length)
    {
        this.x = x;
        this.y = y;

        this.angle = initAngle; // angle = PI - seta
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.length = length;

        this.displacement = createVector();
        this.displacement.x = cos(this.angle)*this.length + this.x;
        this.displacement.y = sin(this.angle)*this.length + this.y;

        this.radius = radius;
        this.mass = this.radius*2;
        this.resultant = createVector();

    }

    update()
    {
        this.calculateAngularMotion();
        this.displacement.x = cos(this.angle)*this.length + this.x;
        this.displacement.y = sin(this.angle)*this.length + this.y;
    }

    calculateAngularMotion()
    {
        this.angularAcceleration = g/this.length*cos(this.angle);
        this.angularVelocity += this.angularAcceleration;
        this.angle += this.angularVelocity;
    }

    draw()
    {
        noFill();
        stroke("magenta");
        strokeWeight(1);
        line(this.x, this.y, this.displacement.x, this.displacement.y);
        strokeWeight(5);
        point(this.x, this.y);

        strokeWeight(1);
        stroke("yellow");
        ellipse(this.displacement.x, this.displacement.y, this.radius*2);
    }
}