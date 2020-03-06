class Point
{
  float x, y, z;
  Point(float x, float y, float z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  void display()
  {
    noFill();
    stroke(255);
    strokeWeight(1);
    point(this.x, this.y, this.z);
  }
}
