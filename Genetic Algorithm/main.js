let winW, winH;
let targetWord = "the fast fox jumped over the lazy sheep".split("");
let alphabet = "abcdefghijklmnopqrstuvwxyz ".split("");
let population;
let mode = "Autopilot";
let restartButton, inp, autoPilotButton, manualButton;

function setup()
{
  winW = windowWidth;
  winH = windowHeight;

  population = new Population(winW/2, 20, 1000, 1);

  restartButton = createButton("Restart");
  restartButton.elt.style.width = "100px";
  restartButton.elt.style.height = "30px";
  restartButton.position(10, 150);
  restartButton.mousePressed( ()=> { 
    population = new Population(winW/2, 20, 1000, 1);
  } );

  autoPilotButton = createButton("Autopilot");
  autoPilotButton.elt.style.width = "100px";
  autoPilotButton.elt.style.height = "30px";
  autoPilotButton.position(10, 190);
  autoPilotButton.mousePressed (
    () => { mode = "Autopilot"; }
  );

  manualButton = createButton("Generation by Generation");
  manualButton.elt.style.width = "100px";
  manualButton.elt.style.height = "30px";
  manualButton.position(120, 190);
  manualButton.mousePressed (
    () => { mode = "Generation by Generation"; }
  );

  inp = createInput("the fast fox jumped over the lazy sheep");
  inp.elt.style.width = "600px";
  inp.elt.style.height = "50px";
  inp.elt.style.fontSize = "30px";
  inp.position(10, winH-50);

  createCanvas(winW, winH)
}

function draw()
{
  background("black");

  if (mode === "Autopilot")
  {
    if (population.getBestEntityText() !== targetWord.join(""))
    {
      population.update();
    }
    else
    {
      console.log(population.getBestEntityText());
    }
  }
  
  fill("green");
  textSize(20);
  text("Target sentence: " + str(targetWord.join("")), 200, 40);  
  population.scroll(10);
  population.draw();

  fill("magenta");
  textSize(20);
  text("Mode: " + mode, 10, 250);
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
  winW = windowWidth;
  winH = windowHeight;
}

function keyPressed()
{
  if (keyCode === 13)
  {
    targetWord = inp.value().split("");
    population = new Population(winW/2, 20, 1000, 1);
  }
  else if (keyCode === 32)
  {
    if (population.getBestEntityText() !== targetWord.join(""))
      population.update();
  }
}
