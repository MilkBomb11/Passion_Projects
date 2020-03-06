class Quad
{
  Triangle[] triangles = new Triangle[2];
  Quad(Triangle[] triangles)
  {
    for (int i = 0; i < 2; i++)
    {
      this.triangles[i] = new Triangle(triangles[i].points);
    }
  }

  void update()
  {
    for (int i = 0; i < 2; i++)
    {
      this.triangles[i].updateColor();
    }
  }

  void display()
  {
    for (int i = 0; i < 2; i++)
    {
      this.triangles[i].display();
    }
  }
}
