Coord = Object:extend();

function Coord:new()
    self.translation = {x=0,y=0};
    self.scale = 1;
end

function Coord:update(translation, scale, dt)
    self.translation.x = translation.x+screen_width/2;
    self.translation.y = translation.y+screen_height/2;
    self.scale = scale;
end

function Coord:draw()
    love.graphics.push();
    love.graphics.translate(self.translation.x, self.translation.y);
    love.graphics.setLineWidth(1);
    love.graphics.line(-self.translation.x,0, -self.translation.x+screen_width, 0);
    love.graphics.line(0, -self.translation.y, 0, -self.translation.y+screen_height);
    love.graphics.pop();
end