class Plain
{
  int rows, columns, cellSize;
  float x, y, tx, ty, flying;
  float[][] points;
  Plain(float x, float y, int rows, int columns, int cellSize)
  {
    this.x = x;
    this.y = y;
    
    this.rows = rows;
    this.columns = columns;
    this.cellSize = cellSize;
    this.points = new float[this.rows][this.columns];
    
    this.tx = 0;
    this.ty = 0;
    this.flying = 0;
    
    for (int i = 0; i < this.points.length; i++)
    {
      this.tx = 0;
      for (int j = 0; j < this.points[i].length; j++)
      {
        this.points[i][j] = map(noise(this.tx, this.ty), 0, 1, -200, 200);
        this.tx += 0.2;
      }
      this.ty += 0.2;
    }
  }
  
  void update()
  {
    this.flying -= 0.05;
    
    this.ty = this.flying;
    for (int i = 0; i < this.points.length; i++)
    {
      this.tx = 0;
      for (int j = 0; j < this.points[i].length; j++)
      {
        this.points[i][j] = map(noise(this.tx, this.ty), 0, 1, -100, 100);
        this.tx += 0.1;
      }
      this.ty += 0.1;
    }
  }
  
  void show()
  {
    noFill();
    stroke(255);
    for (int i = 0; i < this.points.length-1; i++)
    {
      for (int j = 0; j < this.points[i].length-1; j++)
      {
        beginShape();
        vertex(this.x + j*this.cellSize, this.y + i*this.cellSize, this.points[i][j]);
        vertex(this.x + (j+1)*this.cellSize, this.y + i*this.cellSize, this.points[i][j+1]);
        vertex(this.x + j*this.cellSize, this.y + (i+1)*this.cellSize, this.points[i+1][j]);
        vertex(this.x + j*this.cellSize, this.y + i*this.cellSize, this.points[i][j]);
        endShape();
      }
    }
    
    for (int i = 0; i < this.points.length-1; i++)
    {
      beginShape();
      vertex(this.x + this.columns*this.cellSize, this.y + i*this.cellSize);
      vertex(this.x + this.columns*this.cellSize, this.y + (i+1)*this.cellSize);
      endShape();
    }
    
    for (int i = 0; i < this.points.length-1; i++)
    {
      beginShape();
      vertex(this.x + i*this.cellSize, this.y + this.rows*this.cellSize);
      vertex(this.x + (i+1)*this.cellSize, this.y + this.rows*this.cellSize);
      endShape();
    }
    
  }
  
}
