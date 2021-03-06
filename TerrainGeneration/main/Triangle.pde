class Triangle
{
  Point[] points = new Point[3];
  Color c;
  float centerOfMassZ;
  Triangle(Point[] points)
  {
    for (int i = 0; i < 3; i++)
    {
      this.points[i] = new Point(points[i].x, points[i].y, points[i].z);
    }
    this.c = new Color(0, 0, 0, 0);
    this.centerOfMassZ = (this.points[0].z + this.points[1].z + this.points[2].z)/3;
  }

  void updateColor()
  {
    if (this.centerOfMassZ > 150)
    {
      this.c = WHITE;
    }
    else if (this.centerOfMassZ > 50)
    {
      this.c = GREY;
    }
    else if (this.centerOfMassZ > -100)
    {
      this.c = BROWN;
    }
    else if (this.centerOfMassZ > -150)
    {
      this.c = LIGHT_BLUE;
    }
    else
    {
      this.c = BLUE;
    }
  }

  void display()
  {
    beginShape();
    fill(this.c.r, this.c.g, this.c.b, this.c.a);
    noStroke();
    for (int i = 0; i < this.points.length; i++)
    {
      vertex(this.points[i].x, this.points[i].y, this.points[i].z);
    }
    vertex(this.points[0].x, this.points[0].y, this.points[0].z);
    endShape();
  }
}
