Boundary = Object:extend()

function Boundary:new(x1, y1, x2, y2)
  self.x1 = x1
  self.y1 = y1
  self.x2 = x2
  self.y2 = y2

  local base = x2 - x1
  local height = y2 - y1
  self.dir = math.atan2(height, base)
end


function Boundary:draw()
  love.graphics.setColor(1, 0, 1)
  love.graphics.line(self.x1, self.y1, self.x2, self.y2)
end
