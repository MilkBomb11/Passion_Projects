class Cannon
{
  constructor(x, y, width, height, power)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.dir = 0;
    this.power = power;

    this.bullets = [];
  }

  update()
  {
    this.power = sliders.power.slider.value();

    let base = mouseX - this.x;
    let height = mouseY - (this.y+this.height/2);
    this.dir = atan2(height, base);

    for (let i = 0; i < this.bullets.length; i++)
    {
      this.bullets[i].update();
      if (this.bullets[i].displacement.y >= winH + this.bullets[i].radius)
      {
        this.bullets.splice(i, 1);
      }
    }
  }

  shoot()
  {
    let spawnPoint = createVector(this.x + cos(this.dir)*this.width, this.y + this.height/2 + sin(this.dir)*this.width);
    this.bullets.push(new Bullet(spawnPoint.x, spawnPoint.y, 20, 5, this.dir, this.power));
  }

  draw()
  {
    noFill();
    stroke("yellow");
    push();
    translate(this.x, this.y+this.height/2);
    rotate(this.dir);
    rect(0, -this.height/2, this.width, this.height);
    pop();

    for (let i = 0; i < this.bullets.length; i++)
    {
      this.bullets[i].draw();
    }
  }
}
