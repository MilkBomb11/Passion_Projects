class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.grabbed = false;
    }

    update()
    {
        if (this.grabbed)
        {
            this.x = mouseX;
            this.y = mouseY;
        }
    }

    draw()
    {
        strokeWeight(10);
        stroke("magenta");
        point(this.x, this.y);
    }
}