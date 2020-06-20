class Cal
{
    constructor(circle)
    {
        this.circle = circle;

        this.linears = [
            new Linear(1, 0, 0, 0),
            new Linear(-1, 0, 0, 1)
        ];
    }

    update()
    {
        let t = this.circle.x;
        let k = this.circle.y;
        let r = this.circle.r;
        let a = mouseX-winW/2;
        let b = winH/2-mouseY;

        let denominator = sq(a) - 2*a*t + sq(t) - sq(r);
        let sqrtPart = sq(a)*sq(r) - 2*a*t*sq(r) + sq(b)*sq(r) - 2*b*k*sq(r) + sq(k)*sq(r) + sq(t)*sq(r) - sq(sq(r));
        let nontSqrtPart = a*b - a*k - b*t + k*t;

        let m = [(-sqrt(sqrtPart) + nontSqrtPart)/denominator, (sqrt(sqrtPart) + nontSqrtPart)/denominator];

        for (let i = 0; i < this.linears.length; i++)
        {
            this.linears[i].m = m[i];
            this.linears[i].update();
        }
    }

    draw()
    {
        let textPlaces =
        [
            {x : mouseX, y : mouseY+30},
            {x : mouseX, y : mouseY+50}
        ]

        textSize(15);
        for (let i = 0; i < this.linears.length; i++)
        {
            this.linears[i].draw();
            let b = -this.linears[i].a*this.linears[i].m + this.linears[i].b
            if (b >= 0)
            {
                text("y = "+str(this.linears[i].m)+"x + "+str(b), textPlaces[i].x, textPlaces[i].y);
            }
            else
            {
                text("y = "+str(this.linears[i].m)+"x - "+str(abs(b)), textPlaces[i].x, textPlaces[i].y);
            }
        }
        
    }
}