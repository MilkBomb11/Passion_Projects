class Scanner
{
    constructor(x, y, width, speed)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.speed = speed;
    }

    update()
    {
        this.x += this.speed;
        if (this.x >= winW)
        {
            this.x = 0;
        }
    }

    draw()
    {
        copy(cam, cam.elt.width/2, 0, this.width, cam.elt.height, this.x, 0, this.width, cam.elt.height);
    }
}