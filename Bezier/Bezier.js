class Bezier
{
    constructor(p, q, r, accuracy)
    {
        this.pqr = [p, q, r];
        this.accuracy = accuracy;
        this.grabbed = false;
    }

    update()
    {
        for (let i = 0; i < this.pqr.length; i++)
        {
            let current = this.pqr[i];
            if (mouseIsPressed)
            {
                if (!current.grabbed && !this.grabbed)
                {
                    if (dist(current.x, current.y, mouseX, mouseY) <= 10)
                    {
                        current.grabbed = true;
                        this.grabbed = true;
                    }
                }
            }
            else
            {
                current.grabbed = false;
                this.grabbed = false;
            }
            current.update();
        }
    }

    draw()
    {
        let step = 1/this.accuracy;

        stroke("yellow");
        strokeWeight(1);
        noFill();
        beginShape();
        for (let u = 0; u <= 1; u += step)
        {
            let s = internalDivision(this.pqr[0], this.pqr[1], u, 1-u);
            let t = internalDivision(this.pqr[1], this.pqr[2], u, 1-u);
            let pX = internalDivision(s, t, u, 1-u);
            vertex(pX.x, pX.y);
        }
        endShape();

        strokeWeight(1);
        stroke("orange");
        line(this.pqr[0].x, this.pqr[0].y, this.pqr[1].x, this.pqr[1].y);
        line(this.pqr[1].x, this.pqr[1].y, this.pqr[2].x, this.pqr[2].y);

        for (let i = 0; i < this.pqr.length; i++)
        {
            this.pqr[i].draw();
        }
    }
}