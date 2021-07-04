Contraption c;
void setup()
{
  size(800, 600);
  c = new Contraption(width/2, height/2, 10, 300, 0);
}

void draw()
{
  background(0);
  c.update();
  c.display();
  c.dir += 0.01;
}
