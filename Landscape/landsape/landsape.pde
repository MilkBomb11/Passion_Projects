Plain plain = new Plain(-150, -350, 40, 40, 25);

void setup()
{
  size(600, 700, P3D);
}

void draw()
{
  plain.update();
  
  background(0);
  translate(0, height/2);
  rotateX(PI/3);
  plain.show();
}
