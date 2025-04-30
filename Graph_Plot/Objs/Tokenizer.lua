Tokenizer = Object:extend()

function Tokenizer:new()
    self.source = "";
    self.tokens = {}
    self.current = 1;
    self.start = 1;
    self.had_error = false;

    self.keywords =
    {
        x = tok_type.VAR_X,
        y = tok_type.VAR_Y,
        sin = tok_type.SIN,
        cos = tok_type.COS,
        tan = tok_type.TAN,
        log = tok_type.LOG,
    };
end

function Tokenizer:reset(source)
    self.source = source;
    self.tokens = {}
    self.current = 1;
    self.start = 1;
    self.had_error = false;
end

function Tokenizer:scan_tokens()
    while not self:is_at_end() do
        self.start = self.current;
        self:scan_token();
        if self.had_error then return; end
    end
    self:push_token(tok_type.EOF);
end

function Tokenizer:scan_token()
    local c = self:advance();
    if c == '(' then self:push_token(tok_type.LEFT_PAREN);
    elseif c == ')' then self:push_token(tok_type.RIGHT_PAREN);
    elseif c == '+' then self:push_token(tok_type.PLUS);
    elseif c == '-' then self:push_token(tok_type.MINUS);
    elseif c == '*' then self:push_token(tok_type.STAR);
    elseif c == '/' then self:push_token(tok_type.SLASH);
    elseif c == '^' then self:push_token(tok_type.HAT);
    elseif c == '=' then self:push_token(tok_type.EQUAL);
    elseif c == ',' then self:push_token(tok_type.COMMA);
    elseif c == ' ' or c == '\t' or c == '\n' then
    elseif self:is_digit(c) then
        while self:is_digit(self:peek()) do self:advance(); end
        if self:peek() == '.' and self:is_digit(self:peek_next()) then
            self:advance();
            while self:is_digit(self:peek()) do self:advance(); end
        end
        self:push_token(tok_type.NUMBER);
    elseif self:is_alphabet(c) then
        while self:is_alphabet(self:peek()) do self:advance(); end
        local lexeme = string.sub(self.source, self.start, self.current-1);
        if not self:in_keywords(lexeme) then
            io.write(string.format("Unexpected token: [%s]\n", c));
            self.had_error = true;
        end
        local type = self.keywords[lexeme];
        self:push_token(type);
    else
        io.write(string.format("Unexpected token: [%s]\n", c));
        self.had_error = true;
    end
end

function Tokenizer:in_keywords(x)
    for key, _ in pairs(self.keywords) do
        if x == key then return true; end
    end
    return false;
end

function Tokenizer:is_at_end()
    return self.current > #self.source;
end

function Tokenizer:is_digit(c)
    return string.byte(c, 1, 1) >= string.byte('0', 1, 1) and string.byte(c, 1, 1) <= string.byte('9', 1, 1)
end

function Tokenizer:advance()
    self.current = self.current + 1;
    return string.sub(self.source, self.current-1, self.current-1);
end

function Tokenizer:peek()
    if self:is_at_end() then return '\0' end
    return string.sub(self.source, self.current, self.current);
end
function Tokenizer:peek_next()
    if self.current+1 > #self.source then return '\0' end
    return string.sub(self.source, self.current+1, self.current+1);
end

function Tokenizer:is_alphabet(c)
    return string.byte(c, 1, 1) >= string.byte("a", 1, 1) and string.byte(c, 1, 1) <= string.byte("z", 1, 1);
end

function Tokenizer:push_token(type)
    local lexeme = string.sub(self.source, self.start, self.current-1);
    table.insert(self.tokens, Token(type, lexeme))
end

function Tokenizer:print_tokens()
    io.write("===TOKENIZER===\n");
    for _, token in ipairs(self.tokens) do
        token:print();
    end
end
