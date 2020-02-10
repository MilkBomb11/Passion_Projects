class PlanetManager
{
    constructor()
    {
        this.planets = [];
    }

    recalculateIndexes()
    {
        for (let i = 0; i < this.planets.length; i++)
        {
            this.planets[i].n = i;
        }
    }

    update()
    {
        for (let i = 0; i < this.planets.length; i++) 
        {
            let planet = this.planets[i];
            planet.update();
        }

        if (pause === "simulation")
        {
            this.recalculateIndexes();
            for (let i = 0; i < this.planets.length; i++)
            {
                let planet = this.planets[i];
                for (let j = 0; j < this.planets.length; j++)
                {
                    if (j !== i)
                    {
                        let other = this.planets[j];
                        if (planet.isColliding(other))
                        {
                            //console.log(str(i) + " " + str(j) + " " + "hit");
                            this.planets.splice(j, 1);
                            this.planets.splice(i, 1);
    
                            let contactPoint = createVector((planet.displacement.x + other.displacement.x)/2,
                                                            (planet.displacement.y + other.displacement.y)/2);
                   
                            let planetMomentum = p5.Vector.mult(planet.velocity, planet.mass);
                            let otherMomentum = p5.Vector.mult(other.velocity, other.mass);
                            let totalMomentum = p5.Vector.add(planetMomentum, otherMomentum);
    
                            let newRadius = planet.radius + other.radius;
                            let newMass = planet.mass + other.mass;
                            let newVelocity = p5.Vector.div(totalMomentum, newMass);
    
                            this.planets.push( new Planet(contactPoint.x, contactPoint.y, newRadius, newMass, newVelocity, this.planets.length, true));
                        }
                    }
                }
            }
        }
    }

    draw()
    {
        for (let i = 0; i < this.planets.length; i++) 
        {
            const planet = this.planets[i];
            planet.draw();
        }
    }


}