Object = require "Libs.classic"
Camera = require "Libs.camera"
Timer = require "Libs.timer"
Screen = require "Libs.shack"
Bump = require "Libs.bump"
world = Bump.newWorld(50)

require "Objects.Player"
require "Objects.Platform"
require "Recorder"

winW = love.graphics.getWidth()
winH = love.graphics.getHeight()

function Restart()
  objects = {}
  objects.player = Player(winW/2, winH/2-200, 50, 50)
  objects.platforms = {
    Platform(winW/2-100, winH*(2/3), 200, 50),
    Platform(700, winH*(2/3), 100, 30),
    Platform(500, winH*(2/3)+70, 50, 20)
  }

  recorder = Recorder()
end

function love.load()
  Restart()
end

function love.update(dt)
  objects.player:update(world, dt)
  recorder:update()
end

function love.draw()
  objects.player:draw()
  for i=1,#objects.platforms do
    objects.platforms[i]:draw()
  end
  recorder:draw()
end

function love.keypressed(key, scancode, isrepeat)
  objects.player:jump(key == "up" or key == "space", 400)
  recorder:key(key == "x")
end
