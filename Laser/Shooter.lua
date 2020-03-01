Shooter = Object:extend()

function Shooter:new(x, y, width, height, laserLength)
  self.x = x
  self.y = y
  self.width = width
  self.height = height

  self.dir = 0
  self.lasers = {}
  self.laserLength = laserLength
end

function Shooter:lookAtMouse()
  local base = love.mouse.getX() - self.x
  local height = love.mouse.getY() - (self.y+self.height/2)
  self.dir = math.atan2(height, base)
  --print(self.dir)
end

function Shooter:update(dt)
  self:lookAtMouse()
  for i,laser in ipairs(self.lasers) do
    laser:update(dt)
  end
end

function Shooter:shoot()
  local x = math.cos(self.dir)*self.width + self.x
  local y = math.sin(self.dir)*self.width + self.y+self.height/2
  table.insert(self.lasers, Laser(x, y, self.laserLength, self.dir, 200))
end

function Shooter:draw()
  love.graphics.setColor(1, 1, 1)
  love.graphics.push()
  love.graphics.translate(self.x, self.y+self.height/2)
  love.graphics.rotate(self.dir)
  love.graphics.rectangle("line", 0, -self.height/2, self.width, self.height)
  love.graphics.pop()

  for i,laser in ipairs(self.lasers) do
    laser:draw()
  end
end
