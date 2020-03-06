import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import peasy.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class main extends PApplet {



Mesh mesh;
PeasyCam cam;

public void setup()
{
  
  mesh = new Mesh(-width/2, -height/2, 21, 21, 40, 0.3f, 400);

  cam = new PeasyCam(this, (height/2)/tan(PI/6));
  cam.setActive(true);
  cam.setWheelScale(0.5f);
  cam.setMinimumDistance((height/2)/tan(PI/6));
  cam.setMaximumDistance((height/2)/tan(PI/6) * 2);
}

public void draw()
{
  mesh.update();

  lights();
  directionalLight(200,200,200, 0,-1,-1);
  background(0);
  mesh.display();
}
class Color
{
  float r, g, b, a;
  Color(float r, float g, float b, float a)
  {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  Color(float r, float g, float b)
  {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;
  }
}
class Mesh
{
  float x, y, cellSize, octave, maxHeight;
  int rows, cols;

  float[][] zIndexes;
  Quad[][] quads;
  Mesh(float x, float y, int rows, int cols, float cellSize, float octave, float maxHeight)
  {
    this.x = x;
    this.y = y;
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.octave = octave;
    this.maxHeight = maxHeight;

    this.zIndexes = new float[this.rows][this.cols];
    this.quads = new Quad[this.rows-1][this.cols-1];

    float xoff = 0;
    float yoff = 0;
    for (int i = 0; i < this.rows; i++)
    {
      for (int j = 0; j < this.cols; j++)
      {
        this.zIndexes[i][j] = noise(xoff, yoff)*this.maxHeight;
        xoff += octave;
      }
      yoff += octave;
      xoff = 0;
    }

    for (int i = 0; i < this.rows-1; i++)
    {
      for (int j = 0; j < this.cols-1; j++)
      {
        Point[] points1 = new Point[] {
          new Point(j*this.cellSize, i*this.cellSize, this.zIndexes[i][j]),
          new Point((j+1)*this.cellSize, i*this.cellSize, this.zIndexes[i][j+1]),
          new Point(j*this.cellSize, (i+1)*this.cellSize, this.zIndexes[i+1][j])
        };
        Point[] points2 = new Point[] {
          new Point((j+1)*this.cellSize, i*this.cellSize, this.zIndexes[i][j+1]),
          new Point((j+1)*this.cellSize, (i+1)*this.cellSize, this.zIndexes[i+1][j+1]),
          new Point(j*this.cellSize, (i+1)*this.cellSize, this.zIndexes[i+1][j])
        };
        Triangle[] triangles = new Triangle[] {
          new Triangle(points1),
          new Triangle(points2)
        };
        this.quads[i][j] = new Quad(triangles);
      }
    }
  }

  public void update()
  {
    for (int i = 0; i < this.quads.length; i++)
    {
      for (int j = 0; j < this.quads[i].length; j++)
      {
        this.quads[i][j].update();
      }
    }
  }

  public void display()
  {
    translate(this.x, this.y);
    for (int i = 0; i < this.quads.length; i++)
    {
      for (int j = 0; j < this.quads[i].length; j++)
      {
        this.quads[i][j].display();
      }
    }
  }

}
class Point
{
  float x, y, z;
  Point(float x, float y, float z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public void display()
  {
    noFill();
    stroke(255);
    strokeWeight(1);
    point(this.x, this.y, this.z);
  }
}
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

  public void update()
  {
    for (int i = 0; i < 2; i++)
    {
      this.triangles[i].updateColor();
    }
  }

  public void display()
  {
    for (int i = 0; i < 2; i++)
    {
      this.triangles[i].display();
    }
  }
}
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

  public void updateColor()
  {
    if (this.centerOfMassZ > 250)
    {
      this.c = new Color(255, 255, 255, 255);
    }
    else if (this.centerOfMassZ > 200)
    {
      this.c = new Color(133, 133, 133, 255);
    }
    else if (this.centerOfMassZ > 150)
    {
      this.c = new Color(222, 163, 100, 255);
    }
    else if (this.centerOfMassZ > 100)
    {
      this.c = new Color(126, 137, 214);
    }
    else
    {
      this.c = new Color(67, 72, 176);
    }
  }

  public void display()
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
class Vector
{
  float x, y, z;
  Vector()
  {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
  
  Vector(float x, float y, float z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
  public void settings() {  size(880, 880, P3D); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "main" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
