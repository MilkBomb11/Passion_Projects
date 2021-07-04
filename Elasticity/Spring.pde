class Spring
{
  int dotCount;
  float interval, l, amp;
  PVector v1, v2;
  
  Spring(float x1, float y1, float x2, float y2, int dotCount, float amp)
  {
    this.dotCount = dotCount;
    this.l = dist(x1, y1, x2, y2);
    this.interval = this.l/this.dotCount;
    this.v1 = new PVector(x1, y1);
    this.v2 = new PVector(x2, y2);
    this.amp = amp;
  }
  
  void update(float x1, float y1, float x2, float y2)
  {
    this.l = x1 - x2;
    this.interval = this.l/this.dotCount;
  }
  
  void display(float x1, float y1, float x2, float y2)
  {
    float x = 0;
    float y = 0;
    
    beginShape();
    noFill();
    strokeWeight(1);
    stroke(0, 255, 255);
    curveVertex(x1, y1);
    for (int i = 0; i < this.dotCount+1; i++)
    {
      x = -this.interval*i;
      if ((i+1)%4 == 1) { y = 0; }
      else if ((i+1)%4 == 2) { y = -amp; }
      else if ((i+1)%4 == 3) { y = 0; }
      else if ((i+1)%4 == 0) { y = amp; }
      
      curveVertex(x + x1, y + y1);
    }
    vertex(x2, y2);
    endShape();
    
    for (int i = 0; i < this.dotCount; i++)
    {
      x = -this.interval*i;
      if ((i+1)%4 == 1) { y = 0; }
      else if ((i+1)%4 == 2) { y = -amp; }
      else if ((i+1)%4 == 3) { y = 0; }
      else if ((i+1)%4 == 0) { y = amp; }
      
      noFill();
      strokeWeight(5);
      stroke(255, 0, 255);
      point(x + this.v1.x, y + this.v1.y);
    }
  }
}
