class Pen
{
    constructor()
    {
        this.currentRadius = 30;
        this.mode = "createPlanet";
    }

    setRadius(event)
    {
        let changeRate = map(event.delta, -250, 250, -5, 5);
        this.currentRadius += changeRate;
    }

    draw()
    {
        if (this.mode === "createPlanet" && pause === "paused")
        {
            noFill();
            stroke(255);
            ellipse(mouseX, mouseY, this.currentRadius*2);
        }
    }

    placePlanet()
    {
        if (pause === "paused")
        {
            if (this.mode === "createPlanet")
            {
                let radius = this.currentRadius;
                let mass = radius*0.5;
                pm.planets.push(new Planet(mouseX, mouseY, radius, mass, createVector(0, 0), pm.planets.length, false));
                this.mode = "setVelocity";
            }
            else if (this.mode === "setVelocity")
            {
                pm.planets[pm.planets.length-1].setVelocity();
                this.mode = "createPlanet";
            }
            //console.log(this.mode);
        }
    }
}