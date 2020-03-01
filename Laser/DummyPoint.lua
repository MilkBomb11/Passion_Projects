DummyPoint = Object:extend()

function DummyPoint:new(x, y)
  self.x = x
  self.y = y
end

function DummyPoint:update(dt)

end

function DummyPoint:isColliding()
  return true
end

function DummyPoint:draw()
    love.graphics.setColor(1, 1, 0)
    love.graphics.circle("line", self.x, self.y, 3)
end
