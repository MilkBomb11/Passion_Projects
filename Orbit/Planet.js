class Planet
{
    constructor(x, y, startVel, attr)
    {
        this.position = createVector(x, y);
        this.velocity = createVector(startVel.x, startVel.y);
        this.acceleration = createVector();

        this.mass = 5;
        this.forces = [];
        this.netForce = createVector();

        this.radius = 30;

        this.attrPos = createVector(attr.position.x, attr.position.y);
        this.attrMass = attr.mass;

        this.lines = [];
    }

    calcForce()
    {
        this.netForce = createVector();

        let gravitationalDirectionVector = p5.Vector.sub(this.attrPos, this.position);
        let r = gravitationalDirectionVector.mag();
        let gravitationalUnitVector = p5.Vector.div(gravitationalDirectionVector, r);
        let gravitationalForce = p5.Vector.mult(gravitationalUnitVector, (G*this.attrMass*this.mass)/(r*r));

        this.forces = [];
        this.forces.push(gravitationalForce)

        for (let i = 0; i < this.forces.length; i++)
        {
            this.netForce.add(this.forces[i]);
        }
    }

    distSqr(x1, y1, x2, y2)
    {
        return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
    }

    update()
    {
        this.calcForce();
        this.acceleration = p5.Vector.div(this.netForce, this.mass);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    draw()
    {
        noFill();
        stroke(0, 0, 255);
        strokeWeight(2);
        this.lines.push(createVector(this.position.x - this.attrPos.x, this.position.y - this.attrPos.y));
        if (this.lines.length >= 500)
            this.lines = [];
        beginShape();
        for (let i = 0; i < this.lines.length; i++)
        {
            vertex(this.lines[i].x, this.lines[i].y);
        }
        endShape();

        stroke(66, 188, 245);
        strokeWeight(2);
        ellipse(this.position.x - this.attrPos.x, this.position.y - this.attrPos.y, this.radius*2, this.radius*2);
    }


}