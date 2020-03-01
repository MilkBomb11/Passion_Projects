Pen = Object:extend()

function Pen:new()
  self.x1 = nil
  self.y1 = nil
  self.x2 = nil
  self.y2 = nil

  self.state = 0
end

function Pen:input()
  if self.state == 0 then
    self.x1 = love.mouse.getX()
    self.y1 = love.mouse.getY()
    self.state = 1
  else
    self.x2 = love.mouse.getX()
    self.y2 = love.mouse.getY()
    self.state = 0
    table.insert(objects.boundaries, Boundary(self.x1, self.y1, self.x2, self.y2))
  end
end

function Pen:draw()
  if self.state == 1 and self.x1 ~= nil and self.y1 ~= nil then
    love.graphics.setColor(1, 1, 0)
    love.graphics.line(self.x1, self.y1, love.mouse.getX(), love.mouse.getY())
  end
end
