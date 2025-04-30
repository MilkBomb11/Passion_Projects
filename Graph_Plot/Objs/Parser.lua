Parser = Object:extend()

function Parser:new()
    self.tokens = {};
    self.current = 1;
    self.codes = {};
    self.had_error = false;
end

function Parser:reset(tokens)
    self.tokens = tokens;
    self.current = 1;
    self.codes = {};
    self.had_error = false;
end

function Parser:parse()
    self:equality();
    self:emit_opcode(opcode.END);
end

function Parser:equality()
    if self.had_error then return; end
    self:expression();
    while self:match(tok_type.EQUAL) do
        local type = self:peek_previous().type;
        self:expression();
        self:emit_binary(type);
    end
end

function Parser:expression()
    if self.had_error then return; end
    self:term();
end

function Parser:term()
    if self.had_error then return; end
    self:factor();
    while self:match(tok_type.PLUS) or self:match(tok_type.MINUS) do
        local type = self:peek_previous().type;
        self:factor();
        self:emit_binary(type);
    end
end

function Parser:factor()
    if self.had_error then return; end
    self:power();
    while self:match(tok_type.STAR) or self:match(tok_type.SLASH) do
        local type = self:peek_previous().type;
        self:power();
        self:emit_binary(type);
    end
end

function Parser:power()
    if self.had_error then return; end
    self:unary();
    while self:match(tok_type.HAT) do
        local type = self:peek_previous().type;
        self:unary();
        self:emit_binary(type);
    end
end

function Parser:unary()
    if self.had_error then return; end
    if self:match(tok_type.MINUS) then
        local type = self:peek_previous().type;
        self:unary();
        self:emit_unary(type);
        return;
    end
    self:func();
end

function Parser:func()
    if self.had_error then return; end
    if self:match(tok_type.COS) or self:match(tok_type.SIN) or self:match(tok_type.TAN) then
        local type = self:peek_previous().type;
        self:func();
        self:emit_func(type);
        return;
    elseif self:match(tok_type.LOG) then
        local type = self:peek_previous().type;
        self:eat(tok_type.LEFT_PAREN);
        self:expression();
        self:eat(tok_type.COMMA, "Expected ','.");
        self:expression();
        self:eat(tok_type.RIGHT_PAREN, "Expected ')'.");
        self:emit_func(type);
        return;
    end
    self:primary();
end

function Parser:primary()
    if self.had_error then return; end
    if self:match(tok_type.NUMBER) then self:emit_constant(tonumber(self:peek_previous().lexeme));
    elseif self:match(tok_type.VAR_X) then self:emit_opcode(opcode.GET_X);
    elseif self:match(tok_type.VAR_Y) then self:emit_opcode(opcode.GET_Y);
    elseif self:match(tok_type.LEFT_PAREN) then
        self:expression();
        self:eat(tok_type.RIGHT_PAREN, "Expected ')'.");
    end
end

function Parser:advance()
    self.current = self.current + 1;
    return self.tokens[self.current-1];
end

function Parser:peek()
    return self.tokens[self.current];
end

function Parser:peek_previous()
    return self.tokens[self.current-1];
end

function Parser:match(expected)
    if self:peek().type == expected then 
        self:advance();
        return true;
    end
    return false;
end

function Parser:eat(expected, msg)
    if self:peek().type == expected then self:advance(); return; end
    print(msg);
    self.had_error = true;
end

function Parser:emit_opcode(op)
    table.insert(self.codes, op);
end

function Parser:emit_constant(arg)
    table.insert(self.codes, opcode.CONST);
    table.insert(self.codes, arg);
end

function Parser:emit_binary(type)
    if type == tok_type.PLUS then self:emit_opcode(opcode.ADD);
    elseif type == tok_type.MINUS then self:emit_opcode(opcode.SUB);
    elseif type == tok_type.STAR then self:emit_opcode(opcode.MUL);
    elseif type == tok_type.SLASH then self:emit_opcode(opcode.DIV);
    elseif type == tok_type.HAT then self:emit_opcode(opcode.POW);
    elseif type == tok_type.EQUAL then self:emit_opcode(opcode.EQUAL);
    end
end

function Parser:emit_unary(type)
    if type == tok_type.MINUS then self:emit_opcode(opcode.NEG);
    end
end

function Parser:emit_func(type)
    if type == tok_type.COS then self:emit_opcode(opcode.COS);
    elseif type == tok_type.SIN then self:emit_opcode(opcode.SIN);
    elseif type == tok_type.TAN then self:emit_opcode(opcode.TAN);
    elseif type == tok_type.LOG then self:emit_opcode(opcode.LOG);
    end
end

function Parser:print_opcodes()
    io.write("===OPCODES===\n");
    local i = 1;
    while i <= #self.codes do
        local code = self.codes[i];
        io.write(string.format("[OPCODE] %s", opcode_to_string[code]));
        if code == opcode.CONST then
            i = i + 1;
            io.write(string.format("(%d)", self.codes[i]));
        end
        i = i + 1;
        io.write("\n");
    end
end