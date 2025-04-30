Button = Object:extend();

function Button:new(x, y, width, height)
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.text_display = love.graphics.newText(text_font, "Go!");
    self.alpha = 1;
end

function Button:hover()
    local x = love.mouse.getX();
    local y = love.mouse.getY();
    if x >= self.x and x <= self.x+self.width and y >= self.y and y <= self.y+self.height then
        self.alpha = 0.5;
    else
        self.alpha = 1;
    end
end

function Button:on_click(x, y, callback)
    if x >= self.x and x <= self.x+self.width and y >= self.y and y <= self.y+self.height then
        callback();
    end
end

function Button:draw()
    love.graphics.setColor(0.2, 0.3, 0.1, self.alpha);
    love.graphics.rectangle('fill', self.x, self.y, self.width, self.height);
    love.graphics.setColor(1, 1, 1, self.alpha);
    love.graphics.draw(
    self.text_display,
    self.x+self.width/2-self.text_display:getWidth()/2,
    self.y+self.height/2-self.text_display:getHeight()/2);
end