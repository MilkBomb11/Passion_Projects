class Contraption
{
  PVector pos;
  Ball ball;
  Spring spring;
  float l, k, dir;
  Contraption(float x, float y, float k, float innitL, float dir)
  {
    this.pos = new PVector(x, y);
    this.k = k;
    this.l = innitL;
    this.ball = new Ball(this.l, 0, 80, 5000);
    this.spring = new Spring(0, 0, this.l, 0, 17, 30);
    this.dir = dir;
  }
  
  void update()
  {
    this.l = this.ball.pos.x;
    this.ball.netForce = new PVector(-this.k*this.l, 0);
    this.ball.update();
    this.spring.update(0, 0, this.ball.pos.x, this.ball.pos.y);
  }
  
  void display()
  {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.dir);
    strokeWeight(10);
    stroke(255, 0, 255);
    point(0, 0);
    
    //strokeWeight(1);
    //line(this.pos.x, this.pos.y, this.ball.pos.x, this.ball.pos.y);
    this.spring.display(0, 0, this.ball.pos.x, this.ball.pos.y);
    this.ball.display();
    pop();
  }
  
}
