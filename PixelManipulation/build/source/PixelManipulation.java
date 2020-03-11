import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class PixelManipulation extends PApplet {


Image[] imgs;

public void setup()
{
  

  imgs = new Image[] {new Image("in.png", 10, 10, 0.4f), new Image("in.png", 10, 400, 0.4f)};
}

public void draw()
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
class Image
{
  PImage source, destination;
  float x, y, scale;
  Image(String url, float x, float y, float scale)
  {
    this.x = x;
    this.y = y;
    this.scale = scale;

    this.source  = loadImage(url);
    this.destination = createImage(this.source.width, this.source.height, RGB);
  }

  public void monochrome()
  {
    this.source.loadPixels();
    this.destination.loadPixels();
    for (int x = 0; x < this.source.width; x++)
    {
      for (int y = 0; y < this.source.height; y++)
      {
        int location = x + y*this.source.width;
        float r = red(this.source.pixels[location]);
        float g = green(this.source.pixels[location]);
        float b = blue(this.source.pixels[location]);

        float avg = (r + g + b)/3;

        this.destination.pixels[location] = color(avg);
      }
    }
    this.destination.updatePixels();
  }

  public void horizontalEdgeTracing(float intensity)
  {
    this.source.loadPixels();
    this.destination.loadPixels();
    for (int x = 1; x < this.source.width; x++)
    {
      for (int y = 0; y < this.source.height; y++)
      {
        int location = x + y*this.source.width;
        int leftLocation = (x-1) + y*this.source.width;
        int pixel = this.source.pixels[location];
        int leftPixel = this.source.pixels[leftLocation];
        float diff = abs(brightness(pixel) - brightness(leftPixel))*intensity;
        this.destination.pixels[location] = color(diff);
      }
    }
    this.destination.updatePixels();
  }

  public void vincentVanGoghDisplay(float radius)
  {
    this.source.loadPixels();
    float x = floor(random(0, this.source.width));
    float y = floor(random(0, this.source.height));

    int location = PApplet.parseInt(x + y*this.source.width);
    int pixelColor = this.source.pixels[location];

    pushMatrix();
    translate(this.x, this.y);
    scale(this.scale);
    noStroke();
    fill(pixelColor);
    ellipse(x,y,radius*2,radius*2);
    popMatrix();
  }

  public void display()
  {
    pushMatrix();
    translate(this.x, this.y);
    scale(this.scale);
    image(this.destination, 0, 0);
    popMatrix();
  }

}
  public void settings() {  size(800, 800); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "PixelManipulation" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
