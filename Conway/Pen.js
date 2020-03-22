class Pen
{
    constructor() {}

    mouse()
    {
        for (let i = 0; i < world.cells.length; i++) 
        {
            for (let j = 0; j < world.cells[i].length; j++) 
            {
                if (world.cells[i][j].mouseCol()) 
                {
                    if (world.cells[i][j].state === "unpopulated")
                    {
                        world.cells[i][j].state = "populated";
                    }
                    else
                    {
                        world.cells[i][j].state = "unpopulated";
                    }
                }
            }    
        }
    }
}