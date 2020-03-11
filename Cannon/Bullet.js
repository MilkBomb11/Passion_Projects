class Bullet
{
  constructor(x, y, radius, mass, dir, f)
  {
    this.displacement = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.mass = mass;
    this.radius = radius;

    this.dir = dir;
    this.resultant = createVector(cos(this.dir)*f, sin(this.dir)*f);
  }

  calculateAcceleration()
  {
    this.mass = sliders.mass.slider.value();
    this.resultant.add(0, this.mass*g);
    this.acceleration = this.resultant.div(this.mass);
  }

  update()
  {
    this.calculateAcceleration();
    this.velocity.add(this.acceleration);
    this.displacement.add(this.velocity);
  }

  draw()
  {
    noFill();
    stroke("magenta");
    ellipse(this.displacement.x, this.displacement.y, this.radius*2);
  }

}
