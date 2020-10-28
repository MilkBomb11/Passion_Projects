class Base
{
    constructor(type, x, y, width, height)
    {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw()
    {
        strokeWeight(1);
        stroke(0);
        switch (this.type) {
            case "A":
                fill(255, 0, 0);
                break;
            case "T":
            case "U":
                fill(0, 0, 255);
                break;
            case "G":
                fill(2, 194, 66);
                break;
            case "C":
                fill(252, 186, 3);
                break;
            default:
                break;
        }
        rect(this.x, this.y, this.width, this.height);

        fill(255, 255, 255);
        noStroke();
        textSize(constrain(this.width/2, 5, 50));
        text(this.type, this.x+this.width/2 - this.width/2/3, this.y+this.height/2);
    }
}