class World
{
    constructor(cols, rows, cellSize)
    {
        this.cellSize = cellSize;
        this.cols = cols;
        this.rows = rows;
        this.cells = [];    
        for (let i = 0; i < this.rows; i++)
        {
            this.cells.push([]);
            for (let j = 0; j < this.cols; j++) 
            {
                this.cells[i].push(new Cell(i, j, j*this.cellSize, i*this.cellSize, this.cellSize, "unpopulated"));
            }
        }
    }

    update()
    {
        for (let i = 0; i < this.cells.length; i++) 
        {
            for (let j = 0; j < this.cells[i].length; j++)
            {
                this.cells[i][j].chooseNextState();
            }
        }
        for (let i = 0; i < this.cells.length; i++) 
        {
            for (let j = 0; j < this.cells[i].length; j++)
            {
                this.cells[i][j].update();
            }   
        }
    }

    draw()
    {
        for (let i = 0; i < this.cells.length; i++) 
        {
            for (let j = 0; j < this.cells[i].length; j++)
            {
                this.cells[i][j].draw();
            }   
        }
    }
}