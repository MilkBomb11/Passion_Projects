import peasy.*;

Mesh mesh;
PeasyCam cam;

void setup()
{
  size(880, 880, P3D);
  mesh = new Mesh(-width/2, -height/2, 21, 21, 40, 0.3, 400);

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
