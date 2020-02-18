class Item
{
    constructor(x, y, num)
    {
        this.x = x;
        this.y = y;
        this.num = num;
    }

    scroll()
    {
        if (keyIsDown(UP_ARROW))
        {
            this.y += 5;
        }
        else if (keyIsDown(DOWN_ARROW))
        {
            this.y -= 5;
        }
        
        if (keyIsDown(RIGHT_ARROW))
        {
            this.x -= 5;
        }
        else if (keyIsDown(LEFT_ARROW))
        {
            this.x += 5;
        }
    }

    draw()
    {
        fill(255);
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.num, this.x, this.y);
    }
}