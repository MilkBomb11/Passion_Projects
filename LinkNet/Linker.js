class Linker
{
    constructor(group1, group2)
    {
        this.links = [];
        for (let i = 0; i < group1.items.length; i++) 
        {
            for (let j = 0; j < group2.items.length; j++) 
            {
                this.links.push(
                    {
                        x1 : group1.items[i].x,
                        y1 : group1.items[i].y,
                        x2 : group2.items[j].x,
                        y2 : group2.items[j].y
                    }
                );
            }
        }
    }

    draw()
    {
        for (let i = 0; i < this.links.length; i++) 
        {
            noFill();
            stroke("yellow");
            line(this.links[i].x1, this.links[i].y1, this.links[i].x2, this.links[i].y2);
        }
    }
}