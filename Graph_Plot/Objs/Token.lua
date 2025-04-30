Token = Object:extend()

tok_type =
{
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",
    PLUS = "PLUS",
    MINUS = "MINUS",
    STAR = "STAR",
    SLASH = "SLASH",
    HAT = "HAT",
    EQUAL = "EQUAL",
    NUMBER = "NUMBER",
    VAR_X = "VAR_X",
    VAR_Y = "VAR_Y",
    COMMA = "COMMA",
    LOG = "LOG",
    SIN = "SIN",
    COS = "COS",
    TAN = "TAN",
    EOF = "EOF",
}

function Token:new(type, lexeme)
    self.type = type;
    self.lexeme = lexeme;
end

function Token:print()
    io.write(string.format("[TOKEN] %s %s\n", self.type, self.lexeme));
end