class EntityManager
{
    constructor(n)
    {
        this.entities = [];
        for (let i = 0; i < n; i++)
        {
            let x = random(30, winW-40);
            let y = random(30, winH-40);
            this.entities[i] = new Entity(x, y, 40, 3, i);
            for (let j = 0; j < this.entities.length; j++)
            {
                if (j === i) {continue;}
                else
                {
                    let other = this.entities[j];
                    if (this.checkCollision(this.entities[i], other)) 
                    {
                        this.entities.pop();
                        i--;
                    }
                }
            }
        }
    }

    update()
    {
        for (let i = 0; i < this.entities.length; i++)
        {
            this.entities[i].update();
        }
    }

    draw()
    {
        for (let i = 0; i < this.entities.length; i++)
        {
            this.entities[i].draw();
        }
    }

    checkCollision(a, b)
    {
        return dist(a.displacement.x, a.displacement.y, b.displacement.x, b.displacement.y) < a.radius + b.radius;
    }
}