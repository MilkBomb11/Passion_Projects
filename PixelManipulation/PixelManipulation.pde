
Image[] imgs;

void setup()
{
  size(800, 800);

  imgs = new Image[] {new Image("in.png", 10, 10, 0.4), new Image("in.png", 10, 400, 0.4)};
}

void draw()
{
  background(0);

  imgs[0].horizontalEdgeTracing(20);
  imgs[1].monochrome();
  for (int i = 0; i < imgs.length; i++)
  {
    //imgs[i].vincentVanGoghDisplay(10);
    imgs[i].display();
  }
}
