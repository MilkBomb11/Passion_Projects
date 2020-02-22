class Item
{
    constructor(x, y, radius, text)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.text = text;
    }

    draw()
    {
        fill(0);
        stroke(255);
        strokeWeight(1);
        ellipse(this.x, this.y, this.radius*2);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(this.text, this.x, this.y);
    }
}