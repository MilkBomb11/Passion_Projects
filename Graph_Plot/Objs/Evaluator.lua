Evaluator = Object:extend()

function Evaluator:new()
    self.codes = {};
    self.h = 0.0001;
end

function Evaluator:reset(codes)
    self.codes = codes;
    self.h = 0.0001;
end

function Evaluator:evaluate (codes, x, y)
    local stack = {};
    local ip = 1;

    function push(v) table.insert(stack, v); end
    function pop()
        local v = stack[#stack];
        table.remove(stack, #stack);
        return v;
    end

    while true do
        local code = codes[ip];
        ip = ip + 1;
        if code == opcode.END then return pop();
        elseif code == opcode.CONST then
            push(codes[ip]);
            ip = ip + 1;
        elseif code == opcode.ADD then push(pop()+pop());
        elseif code == opcode.SUB then push(-pop()+pop());
        elseif code == opcode.MUL then push(pop()*pop());
        elseif code == opcode.DIV then
            local right = pop();
            if math.abs(right) <= 0.00001 then return 2; end
            local left = pop();
            push(left/right);
        elseif code == opcode.POW then
            local right = pop();
            local left = pop();
            if left < 0 and math.fmod(right, 1) ~= 0 then return 2; end
            push(left^right);
        elseif code == opcode.EQUAL then
            local right = pop();
            local left = pop();
            if left > right then push(1);
            else push(0); end
        elseif code == opcode.GET_X then push(x);
        elseif code == opcode.GET_Y then push(y);
        elseif code == opcode.NEG then push(-pop());
        elseif code == opcode.SIN then push(math.sin(pop()));
        elseif code == opcode.COS then push(math.cos(pop()));
        elseif code == opcode.TAN then push (math.tan(pop()));
        elseif code == opcode.LOG then
            local operand = pop();
            if operand <= 0 then return 2; end
            local base = pop();
            if base <= 0 or math.abs(base) <= 0.001 then return 2; end
            push(math.log(operand, base));
        end
    end
end

function Evaluator:evaluate_grid(scale, translation, grid, iso_values)
    if parser.had_error then return; end
    if #parser.codes < 1 then return; end
    for i = 1, #grid do
        for j = 1, #grid[i] do
            grid[i][j] = 0;
        end
    end

    for i = 1, #grid do
        for j = 1, #grid[i] do
            local x = scale*((j-1)*resolution-translation.x-screen_width/2);
            local y = scale*(-(i-1)*resolution+translation.y+screen_height/2);
            local v = self:evaluate(parser.codes, x, y); -- F = f - g;
            grid[i][j] = v;
        end
    end

    for i = 1, #grid do
        local bit = 0;
        local flag = true;
        for j,v in ipairs(grid[i]) do
            if v == 0 then
                iso_values[i][j] = bit;
                flag = true;
            elseif v == 1 then
                iso_values[i][j] = 1-bit;
                flag = true;
            else
                iso_values[i][j] = 1-bit;
                if flag then
                    bit = 1-bit;
                    flag = false;
                end
            end
        end
    end
end