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
        this.zIndexes[i][j] = map(noise(xoff, yoff), 0, 1, -this.maxHeight, this.maxHeight);
        xoff += this.octave;
      }
      yoff += this.octave;
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

  void update()
  {
    for (int i = 0; i < this.quads.length; i++)
    {
      for (int j = 0; j < this.quads[i].length; j++)
      {
        this.quads[i][j].update();
      }
    }
  }

  void display()
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
