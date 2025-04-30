Bar = Object:extend();

function Bar:new(x, y, width, height)
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.text = "";
    self.text_display = love.graphics.newText(text_font, "");

    self.caret = {}
    self.caret.current_index = 1;
    self.caret.x = 0;
    self.caret.y = 0;
    self.caret.default_width = 4;
    self.caret.width = self.caret.default_width;
    self.caret.height = self.height;
    self.caret.hopped_char = love.graphics.newText(text_font, "");
    self.caret.overlapped_char = love.graphics.newText(text_font, "");
end

function Bar:update(dt)
    if self.caret.current_index <= #self.text then
        self.caret.overlapped_char:set(string.sub(self.text, self.caret.current_index, self.caret.current_index));
        self.caret.width = self.caret.overlapped_char:getWidth();
    else self.caret.width = self.caret.default_width; end
end

function Bar:draw()
    love.graphics.setColor(1, 1, 1);
    love.graphics.rectangle('fill', self.x, self.y, self.width, self.height)
    love.graphics.setColor(0, 0, 0);
    love.graphics.draw(self.text_display, self.x, self.y);
    love.graphics.setColor(0, 0, 0, 0.5);
    love.graphics.rectangle('fill', self.caret.x, self.caret.y, self.caret.width, self.caret.height);
end

function Bar:keypressed(key)
    if key == "backspace" then
        if self.caret.current_index > 1 then
            self.caret.hopped_char:set(string.sub(self.text, self.caret.current_index-1, self.caret.current_index-1));
            self.caret.x = self.caret.x - self.caret.hopped_char:getWidth();
            self.text = string.sub(self.text, 1, self.caret.current_index-2)..string.sub(self.text, self.caret.current_index);
            self.caret.current_index = self.caret.current_index - 1;
            self.text_display:set(self.text);
        end
    elseif key == "left" then
        if self.caret.current_index > 1 then
            self.caret.hopped_char:set(string.sub(self.text, self.caret.current_index-1, self.caret.current_index-1));
            self.caret.x = self.caret.x - self.caret.hopped_char:getWidth();
            self.caret.current_index = self.caret.current_index - 1;
        end
    elseif key == "right" then
        if self.caret.current_index <= #self.text then
            self.caret.hopped_char:set(string.sub(self.text, self.caret.current_index, self.caret.current_index));
            self.caret.x = self.caret.x + self.caret.hopped_char:getWidth();
            self.caret.current_index = self.caret.current_index + 1;
        end
    end
end

function Bar:text_input(t)
    self.text = string.sub(self.text, 1, self.caret.current_index-1)..t..string.sub(self.text, self.caret.current_index);
    self.caret.current_index = self.caret.current_index + 1;
    self.caret.hopped_char:set(t);
    self.caret.x = self.caret.x + self.caret.hopped_char:getWidth();
    self.text_display:set(self.text);
end