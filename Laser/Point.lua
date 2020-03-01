Point = Object:extend()

function Point:new(x, y, dir, speed)
    self.x = x
    self.y = y
    self.dir = dir
    self.speed = {
        x = speed*math.cos(self.dir),
        y = speed*math.sin(self.dir)
    }
    self.collisionFlag = false
end

function Point:update(dt)
    self.x = self.x + self.speed.x*dt
    self.y = self.y + self.speed.y*dt
    self:boundaryDetect()
end

function Point:boundaryDetect()
  for i=1,#objects.boundaries do
    local boundary = objects.boundaries[i]
    local col = Collision.linePoint(boundary, self, 0.05)

    if col and (not self.collisionFlag) then
      self.collisionFlag = true

      local n = Vector.unit(Vector.normal(boundary))
      local dot = Vector.dot(self.speed, n)

      self.speed = Vector.sub(self.speed, Vector.mul(n, 2*dot))
      return true
    end
  end

  if self.collisionFlag == true then
    for i=1,#objects.boundaries do
      local boundary = objects.boundaries[i]
      local col = Collision.linePoint(boundary, self, 0.05)

      if col then
        return nil
      end
    end
    self.collisionFlag = false
  end

end

function Point:isColliding()
  for i=1,#objects.boundaries do
    local boundary = objects.boundaries[i]
    local col = Collision.linePoint(boundary, self, 0.05)
    if col then
      return true
    end
  end
  return false
end

function Point:draw()
    love.graphics.setColor(1, 1, 0)
    love.graphics.circle("line", self.x, self.y, 3)
end
