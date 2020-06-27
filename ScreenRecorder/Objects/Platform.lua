Platform = Object:extend()

function Platform:new(x, y, w, h)
  self.x = x
  self.y = y
  self.w = w
  self.h = h
  world:add(self, self.x, self.y, self.w, self.h)
end

function Platform:draw()
  love.graphics.setColor(1, 0, 1)
  love.graphics.rectangle("line", self.x, self.y, self.w, self.h)
end
