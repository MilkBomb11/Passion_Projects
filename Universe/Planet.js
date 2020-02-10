class Planet 
{
    constructor(x, y, radius, mass, initialVelocity, n, product) 
    {
        this.displacement = createVector(x, y);
        this.velocity = createVector(initialVelocity.x, initialVelocity.y);
        this.acceleration = createVector();
        
        this.radius = radius;
        this.mass = mass;
        this.n = n;

        this.resultant = createVector();

        if (!product)
        {
            this.mode = "setVelocity"; // setVelocity, pause, simulate
            this.initVeloctiyPoint = {x:0,y:0};
        }
        else
        {
            this.mode = "simulate";
        }

        
    }

    update() 
    {
        if (this.mode === "simulate")
        {
            this.calculateUniversalGravitionsOfOthers();
            this.acceleration = p5.Vector.div(this.resultant, this.mass);
            this.velocity.add(this.acceleration);
            this.displacement.add(this.velocity);
        }
        else if (this.mode === "setVelocity")
        {
            this.initVeloctiyPoint.x = mouseX;
            this.initVeloctiyPoint.y = mouseY;
        } 
    }

    calculateUniversalGravition(other)
    {
        let m1 = this.mass;
        let m2 = other.mass;
        let r1 = createVector(this.displacement.x, this.displacement.y);
        let r2 = createVector(other.displacement.x, other.displacement.y);
        let r12 = p5.Vector.sub(r2, r1);
        let distR12 = dist(r2.x, r2.y, r1.x, r1.y);
        let normalR12 = p5.Vector.div(r12, distR12);

        this.resultant.add( p5.Vector.mult(normalR12, G*(m1*m2)/(distR12*distR12)) );
    }

    calculateUniversalGravitionsOfOthers()
    {
        for (let i = 0; i < pm.planets.length; i++)
        {
            if (i !== this.n)
            {
                let other = pm.planets[i];
                this.calculateUniversalGravition(other);
            }
        }
    }

    isColliding(other)
    {
        return dist(this.displacement.x,
                    this.displacement.y, 
                    other.displacement.x, 
                    other.displacement.y) < this.radius+other.radius;
    }

    setVelocity()
    {
        this.velocity = createVector( this.initVeloctiyPoint.x - this.displacement.x, this.initVeloctiyPoint.y - this.displacement.y );
        this.velocity.div(10);
        this.mode = "pause";
    }

    draw() 
    {
        noFill();
        stroke(255);
        ellipse(this.displacement.x,  this.displacement.y,  this.radius*2);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(str(this.radius) + "m\n" + str(this.mass) + "kg", this.displacement.x, this.displacement.y, 20, 40);

        if (this.mode !== "simulate")
        {
            noFill();
            stroke(255, 255, 0);
            line(this.displacement.x, this.displacement.y, this.initVeloctiyPoint.x, this.initVeloctiyPoint.y);
        }
    }
}
