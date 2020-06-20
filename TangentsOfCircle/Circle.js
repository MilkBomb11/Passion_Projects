class Circle
{
    constructor(x, y, r, speed)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = speed;
    }

    update()
    {
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {this.y += this.speed;}
        else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {this.y -= this.speed;}
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {this.x += this.speed;}
        else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {this.x -= this.speed;}

        this.r = constrain(this.r, 5, 300);
    }

    draw()
    {
        noFill();
        stroke("yellow");
        strokeWeight(1);
        ellipse(this.x+winW/2, winH/2-this.y, this.r*2);

        fill("white");
        stroke("white");
        textSize(15);
        text("r = " + str(this.r), this.x+winW/2, winH/2-this.y)
    }
}