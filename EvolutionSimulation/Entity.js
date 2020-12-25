class Entity
{
    constructor(x, y, r, resistance)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.mutationRate = 0.5;
        this.resistance = resistance;

        this.color = color(Math.floor(random(150, 255)), Math.floor(random(150, 255)), Math.floor(random(150, 255)));
    }

    draw()
    {
        noFill();
        strokeWeight(1);
        stroke(this.color);
        ellipse(this.x, this.y, this.r*2, this.r*2);

        fill(255, 255, 255);
        noStroke();
        textSize(Math.floor(this.r/2));
        textAlign(CENTER, CENTER);
        text("res: " + str(this.resistance), this.x, this.y);
    }
}