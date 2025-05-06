#include "common.h"

struct Tokenizer
{
    int current;
    int start;
    string source;
    vector<Token> tokens;

    Tokenizer() {}

    Tokenizer(string source)
    {
        this->source = source;
        this->current = 0;
        this->start = 0;
    }

    void reset(string source)
    {
        this->source = source;
        this->current = 0;
        this->start = 0;
        tokens.clear();
    }

    void scan_tokens()
    {
        while (!is_at_end())
        {
            start = current;
            scan_token();
        }
        push_token(TOKEN_EOS);
    }

    void scan_token()
    {
        char c = advance();
        switch (c)
        {
            case '(': push_token(TOKEN_LEFT_PAREN); break;
            case ')': push_token(TOKEN_RIGHT_PAREN); break;
            case '+': push_token(TOKEN_PLUS); break;
            case '-': push_token(TOKEN_MINUS); break;
            case '*': push_token(TOKEN_STAR); break;
            case '/': push_token(TOKEN_SLASH); break;
            case '^': push_token(TOKEN_HAT); break;
            case '=': push_token(TOKEN_EQUAL); break;
            case ' ': break;
            case '\n': break;
            case '\t': break;
            case '\r': break;
            default:
                if (is_numerical(c))
                {
                    while (is_numerical(peek())) {advance();}
                    if (peek() == '.' && is_numerical(peek_next())) {advance();}
                    while (is_numerical(peek())) {advance();}
                    push_token(TOKEN_NUMBER);
                }
                else if (is_alphabet(c))
                {
                    while (is_alphabet(peek())) {advance();}
                    string lexeme = source.substr(start, current-start);
                    if (keywords.find(lexeme) != keywords.end()) {push_token(keywords[lexeme]);}
                    else {push_token(TOKEN_IDENTIFIER);}
                }
                else {error("Unexpected token.");}
            break;
        }
    }

    char advance() {return source[current++];}
    bool is_at_end() {return current >= source.length();}
    char peek() {return is_at_end()? '\0' : source[current];}
    char peek_next() {return current+1 >= source.length()? '\0' : source[current+1];}
    bool is_numerical(char c) {return c >= '0' && c <= '9';}
    bool is_alphabet(char c) {return c >= 'a' && c <= 'z';}
    
    void eat(char expected, const char* msg)
    {
        if (peek() == expected) {advance(); return;}
        error(msg);
    }

    void push_token(Token_Type type)
    {
        string lexeme = source.substr(start, current-start);
        tokens.push_back(Token(type, lexeme));
    }

    void print()
    {
        cout << "<<TOKENIZER>>\n";
        for (Token& token : tokens) {token.print();}
    }

    void error(const char* msg)
    {
        fprintf(stderr, "Tokenizer -> [%s]\n", msg);
        exit(1);
    }
};

struct Parser
{
    vector<Token> tokens;
    Binary* equation;
    int current;

    Parser() {}
    
    Parser(vector<Token> tokens)
    {
        this->tokens = tokens;
        this->current = 0;
    }

    void reset(vector<Token> tokens)
    {
        this->tokens = tokens;
        this->current = 0;
    }

    void free() {this->equation->free();}

    void parse()
    {
        Expression* lhs = expression();
        eat(TOKEN_EQUAL, "Expected '='.");
        Expression* rhs = expression();
        equation = new Binary(lhs, TOKEN_MINUS, rhs);
    }

    Expression* expression() {return term();}

    Expression* term()
    {
        Expression* expr = factor();
        while (match(TOKEN_PLUS) || match(TOKEN_MINUS))
        {
            Token_Type op = peek_previous().type;
            expr = new Binary(expr, op, factor());
        }
        return expr;
    }

    Expression* factor()
    {
        Expression* expr = exponentiation();
        while (match(TOKEN_STAR) || match(TOKEN_SLASH))
        {
            Token_Type op = peek_previous().type;
            expr = new Binary(expr, op, exponentiation());
        }
        return expr;
    }

    Expression* exponentiation()
    {
        Expression* expr = unary();
        while (match(TOKEN_HAT))
        {
            Token_Type op = peek_previous().type;
            expr = new Binary(expr, op, unary());
        }
        return expr;
    }

    Expression* unary()
    {
        if (match(TOKEN_MINUS) || match(TOKEN_SIN) || match(TOKEN_COS) || match(TOKEN_TAN) || match(TOKEN_LN))
        {
            Token_Type op = peek_previous().type;
            Expression* expr = new Unary(op, unary());
            return expr;
        }
        return primary();
    }

    Expression* primary()
    {
        if (match(TOKEN_NUMBER)) 
        {
            Number* number = new  Number(stod(peek_previous().lexeme));
            return number;
        }
        else if (match(TOKEN_IDENTIFIER))
        {
            Variable* variable = new Variable(peek_previous().lexeme);
            return variable;
        }
        else if (match(TOKEN_LEFT_PAREN))
        {
            Grouping* grouping = new Grouping(expression());
            eat(TOKEN_RIGHT_PAREN, "Expected ')'.");
            return grouping;
        }
        else 
        {
            error("Unexpected token.");
            return NULL;
        }
    }

    Token advance() {return tokens[current++];}
    Token peek() {return tokens[current];}
    Token peek_previous() {return tokens[current-1];}
    bool match(Token_Type expected)
    {
        if (peek().type == expected) {advance(); return true;}
        return false;
    }
    void eat(Token_Type expected, const char* msg)
    {
        if (peek().type == expected) {advance(); return;}
        error(msg);
    }
    void error(const char* msg)
    {
        fprintf(stderr, "Parser -> [%s]\n", msg);
        exit(1);
    }

    void print_tree() 
    {
        cout << "<<ABSTRACT SYNTAX TREE>>\n";
        equation->print();
        cout << "\n";
    }
};

Expression* differentiate(Expression* expression, string variable)
{
    switch (expression->type)
    {
        case EXPR_BINARY:
        switch (expression->get_operation())
        {
            
            case TOKEN_PLUS:
            {
                Expression* left = expression->get_left()->deep_copy();
                Expression* right = expression->get_right()->deep_copy();
                Expression* dleft = differentiate(left, variable);
                Expression* dright = differentiate(right, variable);
                left->free();
                right->free();
                return new Binary(dleft, TOKEN_PLUS, dright);
            } 
            case TOKEN_MINUS:
            {
                Expression* left = expression->get_left()->deep_copy();
                Expression* right = expression->get_right()->deep_copy();
                Expression* dleft = differentiate(left, variable);
                Expression* dright = differentiate(right, variable);
                left->free();
                right->free();
                return new Binary(dleft, TOKEN_MINUS, dright);
            }
            case TOKEN_STAR:
            {
                Expression* left = expression->get_left()->deep_copy();
                Expression* right = expression->get_right()->deep_copy();
                Expression* dleft = differentiate(left, variable);
                Expression* dright = differentiate(right, variable);   
                Expression* left_factor = new Binary(dleft, TOKEN_STAR, right);
                Expression* right_factor = new Binary(left, TOKEN_STAR, dright);
                return new Binary(left_factor, TOKEN_PLUS, right_factor);
            }
            case TOKEN_SLASH:
            {
                Expression* left = expression->get_left()->deep_copy();
                Expression* right_dividend = expression->get_right()->deep_copy();
                Expression* right_divisor = expression->get_right()->deep_copy();
                Expression* dleft = differentiate(left, variable);
                Expression* dright = differentiate(right_dividend, variable);
                Expression* divisor = new Binary(right_divisor, TOKEN_HAT, new Number(2));
                Expression* left_factor = new Binary(dleft, TOKEN_STAR, right_dividend);
                Expression* right_factor = new Binary(left, TOKEN_STAR, dright);
                Expression* dividend = new Binary(left_factor, TOKEN_MINUS, right_factor);
                return new Binary(dividend, TOKEN_SLASH, divisor);
            }
            case TOKEN_HAT:
            {
                Expression* left1 = expression->get_left()->deep_copy();
                Expression* left2 = expression->get_left()->deep_copy();
                Expression* left3 = expression->get_left()->deep_copy();
                Expression* right1 = expression->get_right()->deep_copy();
                Expression* right2 = expression->get_right()->deep_copy();
                Expression* dleft = differentiate(left2, variable);
                Expression* dright = differentiate(right2, variable);
                Expression* left_group = new Binary(left1, TOKEN_HAT, right1);
                Expression* left_factor = new Binary(new Binary(right2, TOKEN_STAR, dleft), TOKEN_SLASH, left2);
                Expression* right_factor = new Binary(dright, TOKEN_STAR, new Unary(TOKEN_LN, left3));
                Expression* right_group = new Grouping(new Binary(left_factor, TOKEN_PLUS, right_factor));
                return new Binary(left_group, TOKEN_STAR, right_group);
            }
            default: return NULL;
        }
        break;
        case EXPR_UNARY: 
        switch (expression->get_operation())
        {
            case TOKEN_LN:
            {
                Expression* divisor = expression->get_operand()->deep_copy();
                Expression* dividend = differentiate(divisor, variable);
                return new Binary(dividend, TOKEN_SLASH, divisor);
            }
            case TOKEN_MINUS:
            {
                Expression* operand = expression->get_operand()->deep_copy();
                Expression* doperand = differentiate(operand, variable);
                operand->free();
                return new Unary(TOKEN_MINUS, doperand);
            }
            case TOKEN_SIN:
            {
                Expression* operand = expression->get_operand()->deep_copy();
                Expression* doperand = differentiate(operand, variable);
                return new Binary(doperand, TOKEN_STAR, new Unary(TOKEN_COS, operand));
            }
            case TOKEN_COS:
            {
                Expression* operand = expression->get_operand()->deep_copy();
                Expression* doperand = differentiate(operand, variable);
                return new Binary(new Unary(TOKEN_MINUS, doperand), TOKEN_STAR, new Unary(TOKEN_SIN, operand));
            }
            case TOKEN_TAN:
            {
                Expression* operand = expression->get_operand()->deep_copy();
                Expression* doperand = differentiate(operand, variable);
                Expression* divisor = new Binary(new Unary(TOKEN_SIN, operand), TOKEN_HAT, new Number(2));
                return new Binary(doperand, TOKEN_SLASH, divisor);
            }
            default: return NULL;
        }
        break;

        case EXPR_GROUPING: return differentiate(expression->get_operand(), variable);
        case EXPR_NUMBER: return new Number(0);
        case EXPR_VARIABLE:
        {
            if (expression->get_lexeme() == variable) 
            {return new Number(1);}
            return new Number(0);
        }
        default: return NULL;
    }
}

Expression* remove_unnecessary(Expression* expression)
{
    switch (expression->type)
    {
        case EXPR_BINARY:
        switch (expression->get_operation())
        {   
            case TOKEN_MINUS:
            {
                Expression* left = remove_unnecessary(expression->get_left());
                Expression* right = remove_unnecessary(expression->get_right());
                return new Binary(left, TOKEN_PLUS, new Binary(new Number(-1), TOKEN_STAR, right));
            }
            case TOKEN_SLASH:
            {
                Expression* left = remove_unnecessary(expression->get_left());
                Expression* right = remove_unnecessary(expression->get_right());
                return new Binary(left, TOKEN_STAR, new Binary(right, TOKEN_HAT, new Number(-1)));
            }
            default:
            {
                Expression* left = remove_unnecessary(expression->get_left());
                Expression* right = remove_unnecessary(expression->get_right());
                return new Binary(left, expression->get_operation(), right);
            }
        }
        break;
        case EXPR_UNARY:
        switch (expression->get_operation())
        {
            case TOKEN_MINUS: 
            {
                Expression* operand = remove_unnecessary(expression->get_operand());
                return new Binary(new Number(-1), TOKEN_STAR, operand);
            }
            default:
            {
                Expression* operand = remove_unnecessary(expression->get_operand());
                return new Unary(expression->get_operation(), operand);
            }
        }
        case EXPR_GROUPING: return remove_unnecessary(expression->get_operand());
        case EXPR_NUMBER: return new Number(expression->get_value());
        case EXPR_VARIABLE: return new Variable(expression->get_lexeme());
        default: return NULL;
    }
}

Expression* flatten(Expression* expression)
{
    switch (expression->type)
    {
        case EXPR_BINARY:
        switch (expression->get_operation())
        {
            case TOKEN_PLUS:
            {
                Expression* left = flatten(expression->get_left());
                Expression* right = flatten(expression->get_right());
                if (left->type == EXPR_SUM && right->type == EXPR_SUM)
                {
                    vector<Expression*> operands = left->get_operands();
                    for (int i = 0; i < right->get_operands().size(); i++) {operands.push_back(right->get_operands()[i]);}
                    return new Sum(operands);
                }
                else if (left->type == EXPR_SUM)
                {
                    vector<Expression*> operands = left->get_operands();
                    operands.push_back(right);
                    return new Sum(operands);
                }
                else if (right->type == EXPR_SUM)
                {
                    vector<Expression*> operands = right->get_operands();
                    operands.push_back(left);
                    return new Sum(operands);
                }
                else
                {
                    vector<Expression*> operands;
                    operands.push_back(left);
                    operands.push_back(right);
                    return new Sum(operands);
                }
            }
            break;
            case TOKEN_STAR:
            {
                Expression* left = flatten(expression->get_left());
                Expression* right = flatten(expression->get_right());
                if (left->type == EXPR_PRODUCT && right->type == EXPR_PRODUCT)
                {
                    vector<Expression*> operands = left->get_operands();
                    for (int i = 0; i < right->get_operands().size(); i++) 
                    {operands.push_back(right->get_operands()[i]);}
                    return new Product(operands);
                }
                else if (left->type == EXPR_PRODUCT)
                {
                    vector<Expression*> operands = left->get_operands();
                    operands.push_back(right);
                    return new Product(operands);
                }
                else if (right->type == EXPR_PRODUCT)
                {
                    vector<Expression*> operands = right->get_operands();
                    operands.push_back(left);
                    return new Product(operands);
                }
                else
                {
                    vector<Expression*> operands;
                    operands.push_back(left);
                    operands.push_back(right);
                    return new Product(operands);
                }
            }
            case TOKEN_HAT:
            {
                Expression* left = flatten(expression->get_left());
                Expression* right = flatten(expression->get_right());
                return new Binary(left, TOKEN_HAT, right);
            }
            default: return NULL;
        }
        break;
        case EXPR_UNARY: return new Unary(expression->get_operation(), flatten(expression->get_operand()));
        case EXPR_GROUPING: return flatten(expression->get_operand());
        case EXPR_VARIABLE: return new Variable(expression->get_lexeme());
        case EXPR_NUMBER: return new Number(expression->get_value());
        default: return NULL;
    }
}

int main()
{
    Tokenizer tokenizer;
    Parser parser;
    for (;;)
    {
        cout << "Enter equation > ";
        string source;
        getline(cin, source);
        if (source.length() <= 0) {return 0;}
        tokenizer.reset(source);
        tokenizer.scan_tokens();
        tokenizer.print();
        parser.reset(tokenizer.tokens);
        parser.parse();
        cout << "Enter variable > ";
        string variable_name;
        getline(cin, variable_name);
        if (variable_name.length() <= 0) {return 0;}
        Expression* dexp = differentiate(parser.equation, variable_name);
        Expression* removed_dexp= remove_unnecessary(dexp);
        Expression* flattened_dexp = flatten(removed_dexp);
        parser.print_tree();
        dexp->print();
        cout << "\n";
        removed_dexp->print();
        cout << "\n";
        flattened_dexp->print();
        cout << "\n";
        parser.free();
        dexp->free();
        flattened_dexp->free();
        removed_dexp->free();
    }
    return 0;
}
