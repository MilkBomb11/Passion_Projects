class Entity
{
    constructor(x, y, radius, speed, i)
    {
        this.displacement = createVector(x, y);
        this.velocity = createVector();
        this.radius = radius;

        this.speed = speed;
        this.initDir = random(0, TAU);
        this.dir = this.initDir;
        this.velocity.x = cos(this.initDir)*this.speed;
        this.velocity.y = sin(this.initDir)*this.speed;

        this.i = i;
    }

    update()
    {
        if (this.displacement.x < this.radius)
        {
            this.velocity.x *= -1;
            this.displacement.x = this.radius;
        }
        else if (this.displacement.x > winW - this.radius)
        {
            this.velocity.x *= -1;
            this.displacement.x = winW - this.radius;
        }
        if (this.displacement.y < this.radius) 
        {
            this.velocity.y *= -1;
            this.displacement.y = this.radius;
        }
        else if (this.displacement.y > winH - this.radius)
        {
            this.velocity.y *= -1;
            this.displacement.y = winH - this.radius;
        }

        this.displacement.add(this.velocity);
        this.dir = atan2(this.velocity.y, this.velocity.x);
        
        this.collide();
    }

    draw()
    {
        noFill();
        strokeWeight(1);
        stroke("yellow");
        ellipse(this.displacement.x, this.displacement.y, this.radius*2);

        stroke("blue");
        let lineSight = createVector(this.displacement.x + cos(this.dir)*this.radius, this.displacement.y + sin(this.dir)*this.radius);
        line(this.displacement.x, this.displacement.y, lineSight.x, lineSight.y);
    }

    checkCollision(other)
    {
        return dist(this.displacement.x, this.displacement.y, other.displacement.x, other.displacement.y) < this.radius + other.radius
    }

    collide()
    {
        for (let i = 0; i < entityManager.entities.length; i++)
        {
            if (i === this.i) {continue;}
            else
            {
                let other = entityManager.entities[i];
                if ( this.checkCollision(other))
                {
                    let thisNewVelocity = createVector
                    (
                        (this.velocity.x * (this.radius - other.radius) + (2*other.radius*other.velocity.x)) / (this.radius + other.radius),
                        (this.velocity.y * (this.radius - other.radius) + (2*other.radius*other.velocity.y)) / (this.radius + other.radius)
                    );
                    let otherNewVeloctiy = createVector
                    (
                        (other.velocity.x * (other.radius - this.radius) + (2*this.radius*this.velocity.x)) / (other.radius + this.radius),
                        (other.velocity.y * (other.radius - this.radius) + (2*this.radius*this.velocity.y)) / (other.radius + this.radius)
                    );

                    this.velocity = createVector(thisNewVelocity.x, thisNewVelocity.y);
                    other.velocity = createVector(otherNewVeloctiy.x, otherNewVeloctiy.y);
                    this.displacement.add(this.velocity);
                    other.displacement.add(other.velocity);
                }
            }
        }
    }
}
