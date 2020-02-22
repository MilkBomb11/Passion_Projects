class Group
{
    constructor(x, y, length, itemInfo)
    {
        this.x = x;
        this.y = y;
        this.items = [];
        this.itemInfo = itemInfo;
        this.interval = 10;

        this.width = this.itemInfo.radius*2 + this.interval*2
        this.height = (this.itemInfo.radius*2 + this.interval) * length;

        let currentY = this.y + itemInfo.radius + this.interval;
        for (let i = 0; i < length; i++)
        {
            this.items[i] = new Item(this.x+this.width/2, currentY, itemInfo.radius, i);
            currentY += itemInfo.radius*2 + this.interval;
        }
    }

    draw()
    {
        stroke("magenta");
        line(this.x, this.y, this.x+this.width, this.y);
        line(this.x, this.y, this.x, this.y + 20);
        line(this.x+this.width, this.y, this.x+this.width, this.y + 20);
        
        for (let i = 0; i < this.items.length; i++)
        {
            this.items[i].draw();
        }

        stroke("magenta");
        line(this.x, this.y+this.height + this.interval, this.x, this.y+this.height + this.interval - 20);
        line(this.x, this.y+this.height + this.interval, this.x+this.width, this.y+this.height + this.interval);
        line(this.x+this.width, this.y+this.height + this.interval, this.x+this.width, this.y+this.height + this.interval - 20);
    }
}
