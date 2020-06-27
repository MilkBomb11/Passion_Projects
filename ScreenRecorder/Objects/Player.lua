Player = Object:extend()

function Player:new(x, y, w, h)
  self.x = x
  self.y = y
  self.w = w
  self.h = h
  self.xv = 0
  self.yv = 0
  self.onGround = false
  world:add(self, self.x, self.y, self.w, self.h)
end

function Player:update(world, dt)
  self:move(20, 0.925, dt)
  self:gravity(895, dt)
  self:collide(world, dt)
end

function Player:move(speed, friction, dt)
  if love.keyboard.isDown("left") or love.keyboard.isDown("a") then
    self.xv = self.xv - speed
  elseif love.keyboard.isDown("right") or love.keyboard.isDown("d") then
    self.xv = self.xv + speed
  end
  self.xv = self.xv * friction
end

function Player:gravity(grv, dt)
  self.yv = self.yv + grv*dt
end

function Player:collide(world, dt)
  self.onGround = false
  local goalX = self.x + self.xv*dt
  local goalY = self.y + self.yv*dt
  local nextX, nextY, cols, len = world:move(self, goalX, goalY)

  for i=1,len do
    local col = cols[i]
    if col.normal.y == 1 or col.normal.y == -1 then
      self.yv = 0
    end
    if col.normal.x == 1 or col.normal.x == -1 then
      self.xv = 0
    end
    if col.normal.y == -1 then
      self.onGround = true
    end
  end

  self.x = nextX
  self.y = nextY
end

function Player:jump(condition, jumpSpeed)
  if condition and self.onGround then
    print("yay")
    self.yv = -jumpSpeed
  end
end

function Player:draw()
  love.graphics.setColor(1, 1, 0)
  if recorder.record then
    love.graphics.rectangle("line", self.x, self.y, self.w, self.h)
  end
end
