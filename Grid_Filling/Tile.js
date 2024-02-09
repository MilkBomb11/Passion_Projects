class Tile
{
    constructor(x, y, i, j, size)
    {
        this.x = x;
        this.y = y;
        this.size = size;

        this.i = i;
        this.j = j;
        this.alpha = 1
        this.mode = 1;

    }

    update(grid)
    {
        if (this.x < mouseX && this.x+this.size > mouseX && this.y < mouseY && this.y+this.size > mouseY)
        {
            this.alpha = 0.75;
        }
        else
        {
            this.alpha = 1;
        }

        this.mode = grid[this.i][this.j];
    }

    mouse(grid)
    {
        if (mouseButton == LEFT)
        {
            if (this.x < mouseX && this.x+this.size > mouseX && this.y < mouseY && this.y+this.size > mouseY)
            {
                if (this.mode === 1) { grid.grid[this.i][this.j] = 0; }
                else if (this.mode ===  0) { grid.grid[this.i][this.j] = 1; }
            }
        }
        else if (mouseButton == RIGHT)
        {
            if (this.x < mouseX && this.x+this.size > mouseX && this.y < mouseY && this.y+this.size > mouseY)
            {
                if (this.mode === 1)
                {
                    grid.dfs(this.i, this.j);
                }
            }
        }
    }

    draw()
    {
        noStroke();
        if (this.mode === 1)
        {
            fill(255, 255, 0, 255*this.alpha);
        }
        else if (this.mode === 0)
        {
            fill(0, 255, 255, 255*this.alpha);
        }
        else if (this.mode === 2)
        {
            fill(0, 255, 0, 255*this.alpha);
        }


        rect(this.x, this.y, this.size, this.size);
    }
};