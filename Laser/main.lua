Object = require "Libs.classic"
Camera = require "Libs.camera"
Timer = require "Libs.timer"
Screen = require "Libs.shack"
Bump = require "Libs.bump"
Collision = require "Libs.collision"
Vector = require "Libs.vector"

winW = love.graphics.getWidth()
winH = love.graphics.getHeight()

require "Point"
require "Shooter"
require "Boundary"
require "Pen"
require "Laser"
require "DummyPoint"
boundaryManager = require "BoundaryManager"

function love.load()
  objects = {}
  objects.shooter = Shooter(winW/2, winH/2, 100, 25, 50)
  boundaryManager.reset()
  pen = Pen()
  state = "make" -- make, simulate
end

function love.update(dt)
  if state == "simulate" then
    objects.shooter:update(dt)
  end
end

function love.draw()
  if state == "simulate" then
    objects.shooter:draw(dt)
  else
    pen:draw()
  end
  boundaryManager.draw()
end

function love.mousepressed(x, y, button, isTouch)
  if state == "simulate" then
    objects.shooter:shoot()
  else
    pen:input()
  end
end

function love.keypressed(key, scancode, isrepeat)
  if key == "space" then
    if state == "make" then
      state = "simulate"
    else
      state = "make"
    end
  end
end
