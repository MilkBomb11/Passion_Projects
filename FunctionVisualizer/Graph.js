class Graph
{
    constructor(f)
    {
        this.vectors = [];
        this.dx = 0.1;
        this.f = f;
    }

    update()
    {
        this.vectors = [];
        for (let x = -winW/2 - cam.x; x <= winW/2 - cam.x; x += this.dx)
        {
            let y = this.f(x);
            this.vectors.push(new Vector(x, y));
        }
    }

    draw()
    {
        stroke("yellow");
        strokeWeight(1);
        noFill();

        beginShape();
        for (let i = 0; i < this.vectors.length; i++)
        {
            this.vectors[i].draw();
        }
        endShape();
    }
}