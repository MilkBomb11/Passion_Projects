let winW, winH;
let g = 0.8;

let sliders = {};

function setup() {
  winW = windowWidth;
  winH = windowHeight;

  sliders  = {
    g : new Slider(50, winH-50, 110, 0.3, 2, 0.8, 0.1, "gravity"),
    mass : new Slider(200, winH-50, 110, 5, 15, 5, 0.5, "mass"),
    power : new Slider(350, winH-50, 110, 100, 200, 120, 1, "power")
  }

  cannon = new Cannon(60, winH/2, 200, 50, sliders.power.slider.value());

  createCanvas(winW, winH);
}

function draw() {
  g = sliders.g.slider.value();

  background(0);
  cannon.update();
  cannon.draw();

  for (key in sliders)
  {
    sliders[key].draw();
  }
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
  winW = windowWidth;
  winH = windowHeight;
}

function mouseClicked()
{
  cannon.shoot();
}
