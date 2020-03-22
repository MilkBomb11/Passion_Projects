class Cell
{
    constructor(i, j, x, y, size, initState)
    {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        this.size = size;
        this.state = initState; // un/populated
        this.nextState = "populated";
    }

    chooseNextState()
    {
        let aliveCount = this.checkSurrounding();

        if (this.state === "populated")
        {
            if (aliveCount < 2) {this.nextState = "unpopulated";}
            else if (aliveCount === 2 || aliveCount === 3) {this.nextState = "populated";}
            else {this.nextState = "unpopulated";}
        }
        else
        {
            if (aliveCount === 3) {this.nextState = "populated";}
            else {this.nextState = "unpopulated";}
        }
    }

    update()
    {
        this.state = this.nextState;
    }

    draw()
    {
        //noStroke();
        strokeWeight(0.5);
        if (this.state === "populated") { fill("black"); }
        else { fill("white"); }
        rect(this.x, this.y, this.size, this.size);
    }

    checkSurrounding()
    {
        let rows = world.cells.length;
        let cols = world.cells[0].length;
        let aliveCount = 0;
        let currentIndex = {i:0, j:0};
        for (let i = -1; i < 2; i++)
        {
            for (let j = -1; j < 2; j++)
            {
                currentIndex.i = this.i + i;
                currentIndex.j = this.j + j;
                if (
                    (currentIndex.i >= rows || currentIndex.j >= cols) 
                    || (currentIndex.i < 0 || currentIndex.j < 0)
                    || (currentIndex.i === this.i && currentIndex.j === this.j)
                    ) {}
                else if ( world.cells[currentIndex.i][currentIndex.j].state === "populated")
                {
                    aliveCount++;
                }
            }
        }
        return aliveCount;
    }

    mouseCol()
    {
        return this.x < mouseX &&
               this.x+this.size > mouseX &&
               this.y < mouseY &&
               this.y+this.size > mouseY;
    }
}