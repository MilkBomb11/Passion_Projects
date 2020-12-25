class EntityManager
{
    constructor(n)
    {
        this.n = n;
        this.entities = [];
        this.temp = [];
        this.generateEntities();
        //this.reproduceEntities();
    }

    createEntity(resistance, toTemp)
    {
        let r = Math.floor(random(20, 50));
        let x = Math.floor(random(r, winW-r));
        let y = Math.floor(random(r, winH-r));
        let flag = true;
        
        if (toTemp)
        {
            for (let j = 0; j < this.temp.length; j++)
            {
                if (dist(this.temp[j].x, this.temp[j].y, x, y) < r+this.temp[j].r)
                {
                    flag = false;
                    break;
                }
            }
    
            if (flag) { this.temp.push(new Entity(x, y, r, resistance)); }
            else { this.createEntity(resistance, toTemp); }  
        }

        else
        {
            for (let j = 0; j < this.entities.length; j++)
            {
                if (dist(this.entities[j].x, this.entities[j].y, x, y) < r+this.entities[j].r)
                {
                    flag = false;
                    break;
                }
            }
    
            if (flag) { this.entities.push(new Entity(x, y, r, resistance)); }
            else { this.createEntity(resistance, toTemp); }          
        }

        
    }
    
    generateEntities()
    {
        this.entities = [];
        for (let i = 0; i < this.n; i++)
        {
            let randNum = round(random()*100) / 100;
            this.createEntity(randNum, false);
        }
    }

    reproduceEntities()
    {
        this.temp = [];
        for (let i = 0; i < this.entities.length; i++) // every entity reproduces and their babies go to temp
        {
            for (let j = 0; j < 2; j++)
            {
                let randNum = random();
                let mutationAmount = 0;
                if (randNum <= this.entities[i].mutationRate)
                {
                    mutationAmount = round(random(-1, 1)*100) / 100
                }
                this.createEntity(round( (constrain(this.entities[i].resistance + mutationAmount, 0, 1)) * 100) / 100, true);
            }
        }

        this.entities = [];
        for (let i = 0; i < this.temp.length; i++) // hard copying temp to entites
        {
            this.entities.push(new Entity(this.temp[i].x, this.temp[i].y, this.temp[i].r, this.temp[i].resistance));
        }
    }

    naturalSelection()
    {
        for (let i = 0; i < this.entities.length; i++)
        {
            let randNum = random();
            if (randNum > this.entities[i].resistance)
            {
                this.entities.splice(i, 1);
            }
        }
    }

    drawEntities()
    {
        for (let i = 0; i < this.entities.length; i++)
        {
            this.entities[i].draw();
        }
    }

}