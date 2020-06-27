Recorder = Object:extend()

function Recorder:new()
  self.record = true
  self.frame = 1

  self.playerCoords = {}
end

function Recorder:update()
  if self.record then
    table.insert(self.playerCoords, {x = objects.player.x, y = objects.player.y})
  else
    if self.frame == #self.playerCoords then
      self.frame = 1
    else
      self.frame = self.frame + 1
    end
  end
end

function Recorder:draw()
  love.graphics.setColor(1, 0, 0)
  love.graphics.print("Recording : "..tostring(self.record), 0, 0, 0, 2, 2)

  if not self.record then
    love.graphics.setColor(1, 1, 0)
    love.graphics.rectangle("line", self.playerCoords[self.frame].x, self.playerCoords[self.frame].y, objects.player.w, objects.player.h)
  end
end

function Recorder:key(condition)
  if condition then
    if self.record then
      self.record = false
    else
      self.frame = 1
      self.playerCoords = {}
      self.record = true
    end
  end
end
