#include<iostream>
#include<string>
#include<map>
#include<vector>
using namespace std;

enum Token_Type
{
    TOKEN_LEFT_PAREN, 
    TOKEN_RIGHT_PAREN,
    TOKEN_PLUS, 
    TOKEN_MINUS,
    TOKEN_STAR, 
    TOKEN_SLASH,
    TOKEN_HAT,
    TOKEN_EQUAL,
    TOKEN_SIN,
    TOKEN_COS,
    TOKEN_TAN,
    TOKEN_LN,
    TOKEN_NUMBER,
    TOKEN_IDENTIFIER,
    TOKEN_EOS,
    TOKEN_ERR,
};

enum Expression_Type
{
    EXPR_BINARY,
    EXPR_UNARY,
    EXPR_GROUPING,
    EXPR_NUMBER,
    EXPR_VARIABLE,
    EXPR_SUM,
    EXPR_PRODUCT,
};

map<Token_Type, string> token_type_to_string = 
{
    {TOKEN_LEFT_PAREN, "TOKEN_LEFT_PAREN"}, 
    {TOKEN_RIGHT_PAREN, "TOKEN_RIGHT_PAREN"},
    {TOKEN_PLUS, "TOKEN_PLUS"}, 
    {TOKEN_MINUS, "TOKEN_MINUS"},
    {TOKEN_STAR, "TOKEN_STAR"}, 
    {TOKEN_SLASH, "TOKEN_SLASH"},
    {TOKEN_HAT, "TOKEN_HAT"},
    {TOKEN_EQUAL, "TOKEN_EQUAL"},
    {TOKEN_SIN, "TOKEN_SIN"},
    {TOKEN_COS, "TOKEN_COS"},
    {TOKEN_TAN, "TOKEN_TAN"},
    {TOKEN_LN, "TOKEN_LN"},
    {TOKEN_IDENTIFIER, "TOKEN_IDENTIFIER"},
    {TOKEN_NUMBER, "TOKEN_NUMBER"},
    {TOKEN_EOS, "TOKEN_EOS"},
};

map<string, Token_Type> keywords =
{
    {"ln", TOKEN_LN},
    {"sin", TOKEN_SIN},
    {"cos", TOKEN_COS},
    {"tan", TOKEN_TAN},
};

struct Token
{
    Token_Type type;
    string lexeme;

    Token() {}
    Token(Token_Type type, string lexeme) 
    {
        this->type = type;
        this->lexeme = lexeme;
    }

    void print() {cout << "[" << token_type_to_string[type] << "] " << lexeme << "\n";}
};

struct Expression
{
    Expression_Type type;
    virtual void print() = 0;
    virtual void free() = 0;
    virtual Expression* deep_copy() = 0;
    virtual Token_Type get_operation() {return TOKEN_ERR;}
    virtual Expression* get_left() {return NULL;}
    virtual Expression* get_right() {return NULL;}
    virtual Expression* get_operand() {return NULL;}
    virtual Expression* get_operand(int index) {return NULL;}
    virtual vector<Expression*> get_operands() {return {};}
    virtual double get_value() {return 0;}
    virtual string get_lexeme() {return "";}
};

struct Binary : public Expression
{
    Expression* left;
    Expression* right;
    Token_Type operation;

    Binary(Expression* left, Token_Type operation, Expression* right)
    {
        this->left = left;
        this->operation = operation;
        this->right = right;
        this->type = EXPR_BINARY;
    }

    void print()
    {
        cout << "Binary(";
        left->print();
        cout << "," << token_type_to_string[operation] << ",";
        right->print();
        cout << ")";
    }

    void free()
    {
        left->free();
        right->free();
        delete left;
        delete right;
    }

    Expression* deep_copy() {return new Binary(left->deep_copy(), operation, right->deep_copy());}

    Token_Type get_operation() {return operation;}
    Expression* get_left() {return left;}
    Expression* get_right() {return right;}
};

struct Unary : public Expression
{
    Expression* operand;
    Token_Type operation;

    Unary(Token_Type operation, Expression* operand)
    {
        this->operation = operation;
        this->operand = operand;
        this->type = EXPR_UNARY;
    }

    void print()
    {
        cout << "Unary(";
        cout << token_type_to_string[operation] << ",";
        operand->print();
        cout << ")";
    }

    void free()
    {
        operand->free();
        delete operand;
    }

    Expression* deep_copy() {return new Unary(operation, operand->deep_copy());}

    Token_Type get_operation() {return operation;}
    Expression* get_operand() {return operand;}
};

struct Grouping : public Expression
{
    Expression* expression;

    Grouping(Expression* expression)
    {
        this->expression = expression;
        this->type = EXPR_GROUPING;
    }

    void print()
    {
        cout << "Grouping(";
        expression->print();
        cout << ")";
    }

    void free()
    {
        expression->free();
        delete expression;
    }

    Expression* deep_copy() {return new Grouping(expression->deep_copy());}

    Token_Type get_operation() {return TOKEN_ERR;}
    Expression* get_operand() {return expression;}
};

struct Number : public Expression
{
    double n;
    Number(double n) 
    {
        this->n = n;
        this->type = EXPR_NUMBER;
    }
    void print() {cout << n;}
    void free() {}
    Expression* deep_copy() {return new Number(n);}
    double get_value() {return n;}
};

struct Variable : public Expression
{
    string name;
    Variable(string name) 
    {
        this->name = name;
        this->type = EXPR_VARIABLE;
    }
    void print() {cout << name;}
    void free() {}
    Expression* deep_copy() {return new Variable(name);}
    string get_lexeme() {return name;}
};

struct Sum : public Expression
{
    vector<Expression*> operands;
    Sum() {}
    Sum(vector<Expression*> operands)
    {
        this->operands = operands;
        this->type = EXPR_SUM;
    }
    Expression* get_operand(int index) {return operands[index];}
    vector<Expression*> get_operands() {return operands;}
    Expression* deep_copy()
    {
        Sum* s = new Sum(vector<Expression*>());
        for (int i = 0; i < operands.size(); i++) 
        {s->operands.push_back(operands[i]->deep_copy());}
        return s;
    }
    void print()
    {
        cout << "Sum(";
        for (int i = 0; i < operands.size(); i++)
        {
            operands[i]->print();
            if (i < operands.size()-1) {cout << ",";}
            else {cout << ")";}
        }
    }

    void free()
    {
        for (int i = 0; i < operands.size(); i++)
        {
            operands[i]->free();
            delete operands[i];
        }
    }
};

struct Product : public Expression
{
    vector<Expression*> operands;
    Product() {}
    Product(vector<Expression*> operands)
    {
        this->operands = operands;
        this->type = EXPR_PRODUCT;
    }
    Expression* get_operand(int index) {return operands[index];}
    vector<Expression*> get_operands() {return operands;}
    Expression* deep_copy()
    {
        Sum* s = new Sum(vector<Expression*>());
        for (int i = 0; i < operands.size(); i++) 
        {s->operands.push_back(operands[i]->deep_copy());}
        return s;
    }
    void print()
    {
        cout << "Product(";
        for (int i = 0; i < operands.size(); i++)
        {
            operands[i]->print();
            if (i < operands.size()-1) {cout << ",";}
            else {cout << ")";}
        }
    }
    void free()
    {
        for (int i = 0; i < operands.size(); i++)
        {
            operands[i]->free();
            delete operands[i];
        }
    }
};
