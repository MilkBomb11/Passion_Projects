class Group
{
    constructor(x, y, oN, oSize, oSpeed, oPeriod)
    {
        this.x = x;
        this.y = y;
        this.dir = 0;

        this.oscillators = [];
        for (let i = 0; i < oN; i++)
        {
            this.oscillators[i] = new Oscillator(0, 0, oSize, radians(180-(180*(oN-2)/oN))*i, oSpeed, oPeriod);
        }
    }

    update()
    {
        for (let i = 0; i < this.oscillators.length; i++)
        {
            this.oscillators[i].update();
        }
        //this.dir += 0.01;
    }

    draw()
    {
        push();
        translate(this.x, this.y);
        rotate(this.dir);
        for (let i = 0; i < this.oscillators.length; i++)
        {
            this.oscillators[i].draw();
        }
        pop();
    }
}