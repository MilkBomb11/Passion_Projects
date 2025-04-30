-- press ctrl+alt+r while cursor is on editor to run love2d
Object = require "Libs.classic";
Camera = require "Libs.camera";

require "Objs.Bar";
require "Objs.Button";
require "Objs.Coord";
require "Objs.Token";
require "Objs.Tokenizer";
require "Objs.Opcode";
require "Objs.Parser";
require "Objs.Evaluator";

function love.load()
    screen_width = love.graphics.getWidth();
    screen_height = love.graphics.getHeight();
    love.graphics.setDefaultFilter('nearest', 'nearest');
    text_font = love.graphics.newFont("Fonts/PTSerif-Regular.ttf", 16);

    input_bar = Bar(0, 0, screen_width*(11/12), 20);
    go_button = Button(screen_width*(11/12), 0, screen_width*(1/12), 20);

    grid = {};
    resolution = 2;
    for i = 1, (screen_height/resolution+1) do
        table.insert(grid, {});
        for _ = 1, (screen_width/resolution+1) do
            table.insert(grid[i], 0);
        end
    end

    iso_values = {};
    for i = 1, (screen_height/resolution+1) do
        table.insert(iso_values, {});
        for _ = 1, (screen_width/resolution+1) do
            table.insert(iso_values[i], 0);
        end
    end

    ctrl_pressed = false;
    scale = 0.5;
    scale_speed = 0.05;
    translation = {x = 0, y = 0};
    coord = Coord();

    tokenizer = Tokenizer();
    parser = Parser();
    evaluator = Evaluator();

    love.graphics.setBackgroundColor(0, 0, 0, 0);
end

function love.update(dt)
    input_bar:update(dt)
    coord:update(translation, scale, dt)
    go_button:hover()
    if love.keyboard.isDown('lctrl') or love.keyboard.isDown('rctrl') then ctrl_pressed = true;
    else ctrl_pressed = false; end 
end

function convert_to_binary(a3, a2, a1, a0)
    return a3*8 + a2*4 + a1*2 + a0;
end

function love.draw()
    love.graphics.setColor(1.0, 1.0, 1.0, 1.0);
    love.graphics.rectangle('fill', 0, 20, screen_width, screen_height-20);
    love.graphics.setColor(0, 0, 0, 1);
    love.graphics.setLineWidth(1);

    function line(p1, p2)
        love.graphics.line(p1[1], p1[2], p2[1], p2[2]);
    end

    function is_err(a, b, c, d)
        return a==2 or b==2 or c==2 or d==2
    end

    for i = 1, #iso_values-1 do
        for j = 1, #iso_values[i]-1 do
            if is_err(iso_values[i][j], iso_values[i][j+1], iso_values[i+1][j+1], iso_values[i+1][j]) then goto cont; end
            local conf_num = convert_to_binary(iso_values[i][j], iso_values[i][j+1], iso_values[i+1][j+1], iso_values[i+1][j]);

            local mx = resolution*(2*j-1)/2;
            local my = resolution*(2*i-1)/2;
            --if iso_values[i][j] == 1 then love.graphics.circle('fill', mx, my, 1); end

            local left = {resolution*(j-1), my};
            local right = {resolution*j, my};
            local up = {mx, resolution*(i-1)};
            local down = {mx, resolution*i};
            if conf_num == 1 then
                line(left, down);
            elseif conf_num == 2 then
                line(down, right);
            elseif conf_num == 3 then
                line(left, right);
            elseif conf_num == 4 then
                line(right, up);
            elseif conf_num == 5 then
                line(up, left);
                line(right, down);
            elseif conf_num == 6 then
                line(up, down);
            elseif conf_num == 7 then
                line(up, left);
            elseif conf_num == 8 then
                line(up, left);
            elseif conf_num == 9 then
                line(up, down);
            elseif conf_num == 10 then
                line(up, right);
                line(left, down);
            elseif conf_num == 11 then
                line(up, right);
            elseif conf_num == 12 then
                line(left, right);
            elseif conf_num == 13 then
                line(down, right);
            elseif conf_num == 14 then
                line(left, down)
            end

            ::cont::
        end
    end
    coord:draw();
    input_bar:draw();
    go_button:draw();
end

function love.keypressed(key, scancode, isrepeat)
    if key == "escape" then love.event.quit(); end
    if key == 'r' and ctrl_pressed then
        scale = 0.5;
        translation = {x = 0, y = 0};
        evaluator:evaluate_grid(scale, translation, grid, iso_values);
    end
    input_bar:keypressed(key);
end

function love.textinput(t)
    input_bar:text_input(t);
end

function love.mousepressed(x, y, button, istouch, presses)
    if button == 1 then
        go_button:on_click(x, y, function()
            tokenizer:reset(input_bar.text);
            tokenizer:scan_tokens();
            if not tokenizer.had_error then
                parser:reset(tokenizer.tokens);
                parser:parse();
                evaluator:reset(parser.codes);
                evaluator:evaluate_grid(scale, translation, grid, iso_values);
            end
            tokenizer:print_tokens();
            parser:print_opcodes();
        end)
    end
end

function love.mousemoved(x, y, dx, dy)
    if love.mouse.isDown(1) then
        translation.x = translation.x + dx;
        translation.y = translation.y + dy;
        evaluator:evaluate_grid(scale, translation, grid, iso_values);
    end
end

function love.wheelmoved(x, y)
    if y > 0 then scale = scale*(1-scale_speed);
    elseif y < 0 then scale = scale*(1+scale_speed); end
    if scale < 0.001 then scale = 0.001; end
    evaluator:evaluate_grid(scale, translation, grid, iso_values);
end
