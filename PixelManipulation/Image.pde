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

  void monochrome()
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

  void horizontalEdgeTracing(float intensity)
  {
    this.source.loadPixels();
    this.destination.loadPixels();
    for (int x = 1; x < this.source.width; x++)
    {
      for (int y = 0; y < this.source.height; y++)
      {
        int location = x + y*this.source.width;
        int leftLocation = (x-1) + y*this.source.width;
        color pixel = this.source.pixels[location];
        color leftPixel = this.source.pixels[leftLocation];
        float diff = abs(brightness(pixel) - brightness(leftPixel))*intensity;
        this.destination.pixels[location] = color(diff);
      }
    }
    this.destination.updatePixels();
  }

  void vincentVanGoghDisplay(float radius)
  {
    this.source.loadPixels();
    float x = floor(random(0, this.source.width));
    float y = floor(random(0, this.source.height));

    int location = int(x + y*this.source.width);
    color pixelColor = this.source.pixels[location];

    pushMatrix();
    translate(this.x, this.y);
    scale(this.scale);
    noStroke();
    fill(pixelColor);
    ellipse(x,y,radius*2,radius*2);
    popMatrix();
  }

  void display()
  {
    pushMatrix();
    translate(this.x, this.y);
    scale(this.scale);
    image(this.destination, 0, 0);
    popMatrix();
  }

}
