class Ball
{
  PVector pos, vel, acc, netForce;
  float r, mass;
  
  Ball(float x, float y, float r, float mass)
  {
    this.pos = new PVector(x, y);
    this.vel = new PVector(0, 0);
    this.acc = new PVector(0, 0);
    this.netForce = new PVector(0, 0);
    this.r = r;
    this.mass = mass;
  }
  
  void update()
  {
    this.acc = this.netForce.div(this.mass);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  
  void display()
  {
    noFill();
    strokeWeight(1);
    stroke(255, 255, 0);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    strokeWeight(5);
    stroke(255, 0, 255);
    point(this.pos.x, this.pos.y);
  }
}
