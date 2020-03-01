Laser = Object:extend()

function Laser:new(x, y, length, dir, speed)
  self.points = {
    Point(x, y, dir, speed),
    Point(x - math.cos(dir)*length, y - math.sin(dir)*length, dir, speed)
  }
end

function Laser:update(dt)
  for i,point in ipairs(self.points) do
    point:update(dt)
  end

  if self.points[1]:isColliding() then
    table.insert(self.points, 2, DummyPoint(self.points[1].x, self.points[1].y))
  end
  if #self.points > 2 then
    if self.points[3]:isColliding() then
      table.remove(self.points, 2)
    end
  end
end

function Laser:draw()
  for i,point in ipairs(self.points) do
    point:draw()
  end
  for i=1,#self.points-1 do
    --love.graphics.setColor(1, 1, 0) laser line color inherits its points' color
    love.graphics.line(self.points[i].x, self.points[i].y, self.points[i+1].x, self.points[i+1].y)
  end
end
