import peasy.*;

Mesh mesh;
PeasyCam cam;

Color BLUE = new Color(67, 72, 176);
Color LIGHT_BLUE = new Color(126, 137, 214);
Color BROWN = new Color(222, 163, 100, 255);
Color GREY = new Color(133, 133, 133, 255);
Color WHITE = new Color(255, 255, 255, 255);

void setup()
{
  size(880, 880, P3D);
  mesh = new Mesh(-width/2, -height/2, 42, 42, 20, 0.08, 400);

  cam = new PeasyCam(this, (height/2)/tan(PI/6));
  cam.setActive(true);
  cam.setWheelScale(0.5);
  cam.setMinimumDistance((height/2)/tan(PI/6));
  cam.setMaximumDistance((height/2)/tan(PI/6) * 2);
}

void draw()
{
  mesh.update();

  lights();
  directionalLight(200,200,200, 0,-1,-1);
  background(0);
  mesh.display();
}
