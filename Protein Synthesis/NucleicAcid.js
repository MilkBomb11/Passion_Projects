class NucleicAcid
{
    constructor(nSequenceStr, y)
    {
        this.nSequence = nSequenceStr.split("");
        this.baseSequence = [];
        this.x = 0;
        this.y = y;
        this.baseWidth = winW/this.nSequence.length;
    }

    update()
    {
        this.baseWidth = winW/this.nSequence.length;
        for (let i = 0; i < this.nSequence.length; i++)
        {
            this.baseSequence[i] = new Base(this.nSequence[i], i*this.baseWidth + this.x, this.y, this.baseWidth, 150);
        }
        for (let i = 0; i < this.nSequence.length; i++)
        {
            this.baseSequence[i].x = i*this.baseWidth + this.x;
            this.baseSequence[i].y = this.y;
        }
    }

    transcript()
    {
        let temp = [];
        for (let i = 0; i < this.nSequence.length; i++)
        {
            if (this.nSequence[i] === 'A') { temp[i] = 'U'; }
            else if (this.nSequence[i] === 'T') { temp[i] = 'A'; }
            else if (this.nSequence[i] === 'G') { temp[i] = 'C'; }
            else if (this.nSequence[i] === 'C') { temp[i] = 'G'; }
        }
        return temp.join("");
    }

    draw()
    {
        for (let i = 0; i < this.baseSequence.length; i++)
        {
            this.baseSequence[i].draw();
        }
    }
}