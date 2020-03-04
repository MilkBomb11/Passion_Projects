class Vector
{
    constructor(r, seta)
    {
        this.r = r;
        this.seta = seta;
        
        this.x = cos(this.seta)*this.r;
        this.y = sin(this.seta)*this.r;
    }

    draw()
    {
        noFill();
        stroke("yellow");
        strokeWeight(2);
        point(this.x, this.y);
    }
}