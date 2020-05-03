class Vector
{
    constructor(x, y)
    {
        this.cartesian = createVector(x, y);
    }

    draw()
    {
        vertex(this.cartesian.x+winW/2, -this.cartesian.y+winH/2);
    }
}