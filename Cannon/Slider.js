class Slider
{
  constructor(x, y, width, minVal, maxVal, defaultValue, step, name)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.value = defaultValue;
    this.name = name;

    this.slider = createSlider(minVal, maxVal, this.value, step);
    this.slider.style("width", this.width.toString() + "px");
    this.slider.position(this.x, this.y);
  }

  draw()
  {
    noStroke();
    fill("white");
    textSize(15);
    text(this.name, this.x, this.y-5);
    text(this.slider.value(), this.x+this.width+10, this.y+15);
  }
}
