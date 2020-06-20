class Linear
{
    constructor(slope, vertexX, vertexY, n)
    {
        // y = m(x-a) + b;
        this.m = slope;
        this.a = vertexX;
        this.b = vertexY;

        if (n === 0) { this.color = color("red");}
        else { this.color = color("green");}
    }
    
    update()
    {
        this.a = mouseX-winW/2;
        this.b = winH/2-mouseY;
    }

    draw()
    {
        noFill();
        stroke(this.color);
        strokeWeight(1);
        beginShape();
        for (let x = -winW/2; x < winW; x += 0.1)
        {
            let y = this.m*(x-this.a) + this.b;
            vertex(x+winW/2, winH/2-y);
        }
        endShape();
    }
}