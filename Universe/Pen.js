class Pen
{
    constructor()
    {

    }

    placePlanet()
    {
        let radius = currentRadius;
        let mass = radius*0.5;
        pm.planets.push(new Planet(mouseX, mouseY, radius, mass, createVector(0, 0), pm.planets.length));
    }
}