class Landscape
{
    constructor(x, y, rows, columns, cellSize)
    {
        this.x = x;
        this.y = y;

        this.points = [];
        this.cellSize = cellSize;
        
        this.tx = 0;
        this.ty = 0;
        this.flying = 0;
        this.smoothness = 0.2;

        for (let i = 0; i < rows; i++) 
        {
            this.points[i] = [];
            this.tx = 0;
            for (let j = 0; j < columns; j++) 
            {
                let z = map(noise(this.tx, this.ty), 0, 1, -100, 100);
                this.points[i][j] = new Point(this.x + i*this.cellSize, this.y + j*this.cellSize, z);
                this.tx += this.smoothness;
            }
            this.ty += this.smoothness;
        }
    }

    update()
    {
        this.flying += 0.1;

        this.ty = this.flying;
        for (let i = 0; i < this.points.length; i++) 
        {
            this.tx = 0;
            for (let j = 0; j < this.points[i].length; j++) 
            {
                let z = map(noise(this.tx, this.ty), 0, 1, -50, 50);
                this.points[i][j] = new Point(this.x + i*this.cellSize, this.y + j*this.cellSize, z);
                this.tx += 0.5;
            }
            this.ty += 0.5;
        }
    }

    draw()
    {
        stroke(255);
        for (let i = 0; i < this.points.length-1; i++) 
        {
            for (let j = 0; j < this.points[i].length-1; j++) 
            {
                beginShape();
                fill(255);
                vertex(this.points[i][j].x, this.points[i][j].y, this.points[i][j].z);
                vertex(this.points[i+1][j].x, this.points[i+1][j].y, this.points[i+1][j].z);
                vertex(this.points[i][j+1].x, this.points[i][j+1].y, this.points[i][j+1].z);
                vertex(this.points[i][j].x, this.points[i][j].y, this.points[i][j].z);
                endShape();
            }
        }
        for (let i = 0; i < this.points.length-1; i++)
        {
            beginShape();
            fill(255);
            vertex(this.points[i][this.points[i].length-1].x, this.points[i][this.points[i].length-1].y, this.points[i][this.points[i].length-1].z);
            vertex(this.points[i+1][this.points[i].length-1].x, this.points[i+1][this.points[i].length-1].y, this.points[i+1][this.points[i].length-1].z);
            endShape();
        }
        for (let i = 0; i < this.points.length-1; i++)
        {
            beginShape();
            fill(255);
            vertex(this.points[this.points.length-1][i].x, this.points[this.points.length-1][i].y, this.points[this.points.length-1][i].z);
            vertex(this.points[this.points.length-1][i+1].x, this.points[this.points.length-1][i+1].y, this.points[this.points.length-1][i+1].z);
            endShape();
        }
    }
}