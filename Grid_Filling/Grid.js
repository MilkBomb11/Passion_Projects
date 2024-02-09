class Grid
{
    constructor(x, y, n)
    {
        this.x = x;
        this.y = y;
        this.n = n;
        this.tileSize = 20;
        this.padding = 5;
        this.tiles = [];
        this.grid = [];
        this.visited = [];
        this.di = [0, -1, 0, 1];
        this.dj = [-1, 0, 1, 0];

        this.reset();
    }

    reset()
    {
        this.tiles = [];
        this.grid = [];
        this.visited = [];

        for (let i = 0; i < this.n; i++)
        {
            this.grid.push([]);
            this.visited.push([]);
            for (let j = 0; j < this.n; j++)
            {
                this.grid[i].push(1);
                this.visited[i].push(0);
                this.tiles.push(new Tile(this.x + j*(this.tileSize+this.padding), this.y + i*(this.tileSize+this.padding), i, j, this.tileSize));
            }
        }
    }

    mouse()
    {
        for (let i = 0; i < this.tiles.length; i++) 
        {
            this.tiles[i].mouse(this);
        }
    }

    update()
    {
        for (let i = 0; i < this.tiles.length; i++) 
        {
            this.tiles[i].update(this.grid);
        }
    }

    draw()
    {
        for (let i = 0; i < this.tiles.length; i++) 
        {
            this.tiles[i].draw();
        }
    }

    dfs(_i, _j)
    {
        this.visited[_i][_j] = 1;
        this.grid[_i][_j] = 2;

        let ni, nj;
        for (let k = 0; k < this.di.length; k++)
        {
            ni = _i+this.di[k];
            nj = _j+this.dj[k];
            if (ni >= 0 && ni < this.n && nj >= 0 && nj < this.n)
            {
                if (this.grid[ni][nj] != 0 && this.visited[ni][nj] === 0)
                {
                    this.dfs(ni, nj);
                }
            }
        }
    }
};