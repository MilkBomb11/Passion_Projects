class Pyramid
{
    constructor(x, y, floors, indentWidth, indentHeight)
    {
        this.floors = floors;
        this.items = [];

        this.currentX = x;
        this.currentY = y;
        this.indentWidth = indentWidth;
        this.indentHeight = indentHeight;
        for (let i = 1; i <= floors; i++)
        {
            this.items[i-1] = [];
            for (let j = 1; j <= i; j++)
            {
                // An+1 = An + (n-1)*i
                // Aj = i + (j-1)*i
                this.items[i-1][j-1] = new Item(this.currentX, this.currentY, i + (j-1)*i)
                this.currentX += this.indentWidth;
            }
            this.currentY = this.items[i-1][0].y + this.indentHeight;
            this.currentX = this.items[i-1][0].x - this.indentWidth/2;
        }
    }

    update()
    {
        for (let i = 0; i < this.items.length; i++)
        {
            for (let j = 0; j < this.items[i].length; j++)
            {
                this.items[i][j].scroll();
            }
        }
    }

    draw()
    {
        for (let i = 0; i < this.items.length; i++)
        {
            for (let j = 0; j < this.items[i].length; j++)
            {
                this.items[i][j].draw();
            }
        }
    }
}