#include <iostream>
#include <cstring>
#include <string>
#include <format>
#include <map>
#include <vector>
#include <fstream>
#include <sstream>
#include <stack>
#include <queue>
using namespace std;
typedef unsigned int u32;
typedef unsigned char u8;

enum Value_Type {VAL_NUMBER, VAL_BOOL, VAL_NIL, VAL_ERROR};

map <Value_Type, string> value_type_to_string =
{
    {VAL_NUMBER, "NUMBER"},
    {VAL_BOOL, "BOOL"},
    {VAL_NIL, "NIL"},
    {VAL_ERROR, "ERROR"},
};

struct Value
{
    Value_Type type;
    union
    {
        double n;
        bool b;
    } as;

    Value() {};

    Value(Value_Type type, auto v)
    {
        this->type = type;
        switch (this->type)
        {
            case VAL_NUMBER: this->as.n = v; break;
            case VAL_BOOL: this->as.b = v; break;
            default: break;
        }   
    }

    string to_string()
    {
        switch (type)
        {
            case VAL_NIL: return format("{}", value_type_to_string[type]);
            case VAL_BOOL: return format("{}({})", value_type_to_string[type], as.b);
            case VAL_NUMBER: return format("{}({})", value_type_to_string[type], as.n);
            default: return format("{}", value_type_to_string[VAL_ERROR]);
        }   
    }
};

enum Parse_Symbol
{
    TS_LEFT_PAREN, TS_RIGHT_PAREN,
    TS_PLUS, TS_MINUS, TS_STAR, TS_SLASH, TS_BANG, 
    TS_VERT_BAR_VERT_BAR, TS_AMPERSAN_AMPERSAN,
    TS_EQUAL,
    TS_EQUAL_EQUAL, TS_BANG_EQUAL,
    TS_GREATER, TS_GREATER_EQUAL, TS_LESS, TS_LESS_EQUAL,
    TS_NUMBER,
    TS_EOF,

    NTS_EXP,
    NTS_OR, NTS_AUX_OR,
    NTS_AND, NTS_AUX_AND,
    NTS_EQ, NTS_AUX_EQ,
    NTS_COMP, NTS_AUX_COMP,
    NTS_TERM, NTS_AUX_TERM,
    NTS_FACTOR, NTS_AUX_FACTOR,
    NTS_UNARY,
    NTS_PRIMARY,

    SPTS_NULL,
};

map <Parse_Symbol, string> parse_symbol_to_string =
{
    {TS_LEFT_PAREN,"TS_LEFT_PAREN"}, 
    {TS_RIGHT_PAREN,"TS_RIGHT_PAREN"},
    {TS_PLUS,"TS_PLUS"}, 
    {TS_MINUS,"TS_MINUS"}, 
    {TS_STAR,"TS_STAR"}, 
    {TS_SLASH,"TS_SLASH"},
    {TS_BANG,"TS_BANG"}, 
    {TS_VERT_BAR_VERT_BAR,"TS_VERT_BAR_VERT_BAR"}, 
    {TS_AMPERSAN_AMPERSAN,"TS_AMPERSAN_AMPERSAN"},
    {TS_EQUAL,"TS_EQUAL"},
    {TS_EQUAL_EQUAL,"TS_EQUAL_EQUAL"}, 
    {TS_BANG_EQUAL,"TS_BANG_EQUAL"},
    {TS_GREATER,"TS_GREATER"}, 
    {TS_GREATER_EQUAL,"TS_GREATER_EQUAL"}, 
    {TS_LESS,"TS_LESS"}, 
    {TS_LESS_EQUAL,"TS_LESS_EQUAL"},
    {TS_NUMBER,"TS_NUMBER"},
    {TS_EOF,"TS_EOF"},
    {NTS_EXP,"NTS_EXP"},
    {NTS_OR,"NTS_OR"},
    {NTS_AND,"NTS_AND"},
    {NTS_EQ,"NTS_EQ"},
    {NTS_COMP,"NTS_COMP"},
    {NTS_TERM,"NTS_TERM"},
    {NTS_FACTOR,"NTS_FACTOR"},
    {NTS_UNARY,"NTS_UNARY"},
    {NTS_PRIMARY, "NTS_PRIMARY"},
    {NTS_AUX_OR, "NTS_AUX_OR"},
    {NTS_AUX_AND, "NTS_AUX_AND"},
    {NTS_AUX_EQ, "NTS_AUX_EQ"},
    {NTS_AUX_COMP, "NTS_AUX_COMP"},
    {NTS_AUX_TERM, "NTS_AUX_TERM"},
    {NTS_AUX_FACTOR, "NTS_AUX_FACTOR"},
};

bool is_nts(Parse_Symbol symbol) {return symbol >= NTS_EXP && symbol <= NTS_PRIMARY;}

struct Token
{
    Parse_Symbol type;
    Value literal;
    string lexeme;
    u32 line;

    Token (Parse_Symbol type, Value literal, string lexeme, u32 line)
    {
        this->type = type;
        this->lexeme = lexeme;
        this->line = line;
        this->literal = literal;
    }

    string to_string() {return format("{} {} {} {}", parse_symbol_to_string[type], lexeme, literal.to_string(), line);}
};

struct AST_Node
{
    Parse_Symbol symbol;
    Value value;
    vector<AST_Node*> children = {};

    AST_Node(Parse_Symbol symbol) {this->symbol = symbol;}
    AST_Node(Parse_Symbol symbol, Value value) {this->symbol = symbol;this->value = value;}

    void new_child(Parse_Symbol symbol)
    {
        AST_Node* child = new AST_Node(symbol);
        children.push_back(child);
    }

    void new_child(Parse_Symbol symbol, Value value)
    {
        AST_Node* child = new AST_Node(symbol, value);
        children.push_back(child);
    }
};

struct Tokenizer
{
    u32 current;
    u32 start;
    u32 line;
    string source;
    vector<Token> tokens;

    Tokenizer(string source)
    {
        this->current = 0;
        this->start = 0;
        this->line = 0;
        this->source = source;
    }

    void scan_tokens()
    {
        while (!is_at_end()) 
        {
            start = current;
            scan_token();
        }
        push_token(TS_EOF);
    }

    void scan_token()
    {
        char c = advance();

        switch (c)
        {
            case '(': push_token(TS_LEFT_PAREN); break;
            case ')': push_token(TS_RIGHT_PAREN); break;
            case '+': push_token(TS_PLUS); break;
            case '-': push_token(TS_MINUS); break;
            case '*': push_token(TS_STAR); break;
            case '/': if (match('/'))  {while (peek() != '\n' && !is_at_end()) {advance();}} else {push_token(TS_SLASH);} break;
            case '!': match('=') ? push_token(TS_BANG_EQUAL) : push_token(TS_BANG); break;
            case '>': match('=') ? push_token(TS_GREATER_EQUAL) : push_token(TS_GREATER); break;
            case '<': match('=') ? push_token(TS_LESS_EQUAL) : push_token(TS_LESS); break;
            case '=': match('=') ? push_token(TS_EQUAL_EQUAL) : push_token(TS_EQUAL); break;
            case '|': match('|') ? push_token(TS_VERT_BAR_VERT_BAR) : error("Unrecognizable token '|'."); break;
            case '&': match('&') ? push_token(TS_AMPERSAN_AMPERSAN) : error("Unrecognizable token '&'."); break;
            case ' ':
            case '\r':
            case '\t': break;
            case '\n': line++; break;
            default:
                if (is_digit(c)) {number();}
                else {error(format("Unrecognizable token '{}'.", c).c_str());}
            break;
        }
    }

    void number()
    {
        while (is_digit(peek())) {advance();}

        if (peek() == '.') 
        {
            advance();
            while (is_digit(peek())) {advance();}
        }
        string lexeme = source.substr(start, current-start);
        Value v(VAL_NUMBER, stod(lexeme));
        push_token(TS_NUMBER, v);
    }

    char advance() {return source[current++];}
    bool is_at_end() {return current >= source.length();}
    char peek() {if (is_at_end()) {return '\0';}return source[current];}
    char peek_next() {if (current+1 >= source.length()) {return '\0';}return source[current+1];}
    bool match(char expected) {if (peek() == expected) {advance(); return true;}return false;}
    void eat(char expected) {if (peek() == expected) {advance(); return;} error(format("Expected '{}', got '{}'.", expected, peek()).c_str());}
    void error(const char* msg) {fprintf(stderr, "Tokenizer: line[%d] -> [%s]\n", line, msg);exit(1);}
    void push_token(Parse_Symbol type, Value literal)
    {
        string lexeme = source.substr(start, current-start);   
        tokens.push_back(Token(type, literal, lexeme, line));
    }
    void push_token(Parse_Symbol type)
    {
        string lexeme = source.substr(start, current-start);
        tokens.push_back(Token(type, Value(VAL_NIL, 0), lexeme, line));
    }
    bool is_digit(char c) {return c >= '0' && c <= '9';}
    void print_tokens() {for (Token& token : tokens) {cout << token.to_string() << "\n";}}
};

void print_stack(stack<Parse_Symbol>& s)
{
    stack<Parse_Symbol> tmp;
    while (!s.empty())
    {
        Parse_Symbol item = s.top();
        cout << '[' << parse_symbol_to_string[item] << ']';
        tmp.push(item);
        s.pop();
    }

    while (!tmp.empty())
    {
        Parse_Symbol item = tmp.top();
        s.push(item);
        tmp.pop();
    }
}

struct Parser
{
    vector<Token> tokens;
    map<Parse_Symbol, map<Parse_Symbol, u32>> table;
    stack<Parse_Symbol> symbol_stack;
    u32 current;

    vector<u32> rules;
    queue<Value> values;
    u32 rule_index;
    
    Parser(vector<Token>& tokens)
    {
        this->tokens = tokens;
        this->current = 0;
        this->rule_index = 0;
        symbol_stack.push(TS_EOF);
        symbol_stack.push(NTS_EXP);

        table[NTS_EXP][TS_NUMBER] = 1; // when you meet a number
        table[NTS_OR][TS_NUMBER] = 2;
        table[NTS_AND][TS_NUMBER] = 4;
        table[NTS_EQ][TS_NUMBER] = 6;
        table[NTS_COMP][TS_NUMBER] = 9;
        table[NTS_TERM][TS_NUMBER] = 14;
        table[NTS_FACTOR][TS_NUMBER] = 17;
        table[NTS_UNARY][TS_NUMBER] = 20;
        table[NTS_PRIMARY][TS_NUMBER] = 23;

        table[NTS_EXP][TS_LEFT_PAREN] = 1; // when you meet '('
        table[NTS_OR][TS_LEFT_PAREN] = 2;
        table[NTS_AND][TS_LEFT_PAREN] = 4;
        table[NTS_EQ][TS_LEFT_PAREN] = 6;
        table[NTS_COMP][TS_LEFT_PAREN] = 9;
        table[NTS_TERM][TS_LEFT_PAREN] = 14;
        table[NTS_FACTOR][TS_LEFT_PAREN] = 17;
        table[NTS_UNARY][TS_LEFT_PAREN] = 20;
        table[NTS_PRIMARY][TS_LEFT_PAREN] = 24;

        table[NTS_EXP][TS_MINUS] = 1; // when you meet '-'
        table[NTS_OR][TS_MINUS] = 2;
        table[NTS_AND][TS_MINUS] = 4;
        table[NTS_EQ][TS_MINUS] = 6;
        table[NTS_COMP][TS_MINUS] = 9;
        table[NTS_TERM][TS_MINUS] = 14;
        table[NTS_FACTOR][TS_MINUS] = 17;
        table[NTS_UNARY][TS_MINUS] = 21;

        table[NTS_EXP][TS_BANG] = 1; // when you meet '!'
        table[NTS_OR][TS_BANG] = 2;
        table[NTS_AND][TS_BANG] = 4;
        table[NTS_EQ][TS_BANG] = 6;
        table[NTS_COMP][TS_BANG] = 9;
        table[NTS_TERM][TS_BANG] = 14;
        table[NTS_FACTOR][TS_BANG] = 17;
        table[NTS_UNARY][TS_BANG] = 22;

        table[NTS_AUX_OR][TS_VERT_BAR_VERT_BAR] = 3; // aux match
        table[NTS_AUX_AND][TS_AMPERSAN_AMPERSAN] = 5;
        table[NTS_AUX_EQ][TS_EQUAL_EQUAL] = 7;
        table[NTS_AUX_EQ][TS_BANG_EQUAL] = 8;
        table[NTS_AUX_COMP][TS_GREATER] = 10;
        table[NTS_AUX_COMP][TS_GREATER_EQUAL] = 11;
        table[NTS_AUX_COMP][TS_LESS] = 12;
        table[NTS_AUX_COMP][TS_LESS_EQUAL] = 13;
        table[NTS_AUX_TERM][TS_PLUS] = 15;
        table[NTS_AUX_TERM][TS_MINUS] = 16;
        table[NTS_AUX_FACTOR][TS_STAR] = 18;
        table[NTS_AUX_FACTOR][TS_SLASH] = 19;

        table[NTS_AUX_OR][TS_RIGHT_PAREN] = 25; // aux epsilon when ')'
        table[NTS_AUX_AND][TS_RIGHT_PAREN] = 26;
        table[NTS_AUX_EQ][TS_RIGHT_PAREN] = 27;
        table[NTS_AUX_COMP][TS_RIGHT_PAREN] = 28;
        table[NTS_AUX_TERM][TS_RIGHT_PAREN] = 29;
        table[NTS_AUX_FACTOR][TS_RIGHT_PAREN] = 30;

        table[NTS_AUX_OR][TS_NUMBER] = 25; // aux epsilon when number
        table[NTS_AUX_AND][TS_NUMBER] = 26;
        table[NTS_AUX_EQ][TS_NUMBER] = 27;
        table[NTS_AUX_COMP][TS_NUMBER] = 28;
        table[NTS_AUX_TERM][TS_NUMBER] = 29;
        table[NTS_AUX_FACTOR][TS_NUMBER] = 30;

        table[NTS_AUX_OR][TS_MINUS] = 25; // aux epsilon when '-'
        table[NTS_AUX_AND][TS_MINUS] = 26;
        table[NTS_AUX_EQ][TS_MINUS] = 27;
        table[NTS_AUX_COMP][TS_MINUS] = 28;
        table[NTS_AUX_FACTOR][TS_MINUS] = 30;

        table[NTS_AUX_OR][TS_BANG] = 25; // aux epsilon when '!'
        table[NTS_AUX_AND][TS_BANG] = 26;
        table[NTS_AUX_EQ][TS_BANG] = 27;
        table[NTS_AUX_COMP][TS_BANG] = 28;
        table[NTS_AUX_TERM][TS_BANG] = 29;
        table[NTS_AUX_FACTOR][TS_BANG] = 30;

        table[NTS_AUX_OR][TS_EOF] = 25; // aux epsilon when '\0'
        table[NTS_AUX_AND][TS_EOF] = 26;
        table[NTS_AUX_EQ][TS_EOF] = 27;
        table[NTS_AUX_COMP][TS_EOF] = 28;
        table[NTS_AUX_TERM][TS_EOF] = 29;
        table[NTS_AUX_FACTOR][TS_EOF] = 30;

        table[NTS_AUX_AND][TS_VERT_BAR_VERT_BAR] = 26; // aux epsilon based on operator precedence

        table[NTS_AUX_EQ][TS_AMPERSAN_AMPERSAN] = 27;
        table[NTS_AUX_EQ][TS_VERT_BAR_VERT_BAR] = 27;

        table[NTS_AUX_COMP][TS_EQUAL_EQUAL] = 28;
        table[NTS_AUX_COMP][TS_BANG_EQUAL] = 28;
        table[NTS_AUX_COMP][TS_AMPERSAN_AMPERSAN] = 28;
        table[NTS_AUX_COMP][TS_VERT_BAR_VERT_BAR] = 28;


        table[NTS_AUX_TERM][TS_GREATER] = 29;
        table[NTS_AUX_TERM][TS_GREATER_EQUAL] = 29;
        table[NTS_AUX_TERM][TS_LESS] = 29;
        table[NTS_AUX_TERM][TS_LESS_EQUAL] = 29;
        table[NTS_AUX_TERM][TS_EQUAL_EQUAL] = 29;
        table[NTS_AUX_TERM][TS_BANG_EQUAL] = 29;
        table[NTS_AUX_TERM][TS_AMPERSAN_AMPERSAN] = 29;
        table[NTS_AUX_TERM][TS_VERT_BAR_VERT_BAR] = 29;

        table[NTS_AUX_FACTOR][TS_PLUS] = 30;
        table[NTS_AUX_FACTOR][TS_MINUS] = 30;
        table[NTS_AUX_FACTOR][TS_GREATER] = 30;
        table[NTS_AUX_FACTOR][TS_GREATER_EQUAL] = 30;
        table[NTS_AUX_FACTOR][TS_LESS] = 30;
        table[NTS_AUX_FACTOR][TS_LESS_EQUAL] = 30;
        table[NTS_AUX_FACTOR][TS_EQUAL_EQUAL] = 30;
        table[NTS_AUX_FACTOR][TS_BANG_EQUAL] = 30;
        table[NTS_AUX_FACTOR][TS_AMPERSAN_AMPERSAN] = 30;
        table[NTS_AUX_FACTOR][TS_VERT_BAR_VERT_BAR] = 30;
    }

    bool is_at_end() {return tokens[current].type == TS_EOF;}
    Token peek() {return tokens[current];}
    Token advance() {return tokens[current++];}

    void parse()
    {
        while (!symbol_stack.empty())
        {
            if (peek().type == symbol_stack.top())
            {
                cout << "Matched symbol: " << parse_symbol_to_string[peek().type] << "\n";
                symbol_stack.pop();
                if (peek().type == TS_NUMBER) {values.push(peek().literal);}
                advance();
                continue;
            }

            u32 rule = table[symbol_stack.top()][peek().type];
            cout << "Rule: " << rule << "|";
            print_stack(symbol_stack);
            cout << "\n";
            rules.push_back(rule);

            switch (rule)
            {
                case 1:
                symbol_stack.pop();
                symbol_stack.push(NTS_OR);
                break;
                
                case 2:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_OR);
                symbol_stack.push(NTS_AND);
                break;

                case 3:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_OR);
                symbol_stack.push(NTS_AND);
                symbol_stack.push(TS_VERT_BAR_VERT_BAR);
                break;

                case 4:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_AND);
                symbol_stack.push(NTS_EQ);
                break;

                case 5:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_AND);
                symbol_stack.push(NTS_EQ);
                symbol_stack.push(TS_AMPERSAN_AMPERSAN);
                break;

                case 6:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_EQ);
                symbol_stack.push(NTS_COMP);
                break;

                case 7:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_EQ);
                symbol_stack.push(NTS_COMP);
                symbol_stack.push(TS_EQUAL_EQUAL);
                break;

                case 8:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_EQ);
                symbol_stack.push(NTS_COMP);
                symbol_stack.push(TS_BANG_EQUAL);
                break;

                case 9:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_COMP);
                symbol_stack.push(NTS_TERM);
                break;

                case 10:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_COMP);
                symbol_stack.push(NTS_TERM);
                symbol_stack.push(TS_GREATER);
                break;

                case 11:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_COMP);
                symbol_stack.push(NTS_TERM);
                symbol_stack.push(TS_GREATER_EQUAL);
                break;

                case 12:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_COMP);
                symbol_stack.push(NTS_TERM);
                symbol_stack.push(TS_LESS);
                break;

                case 13:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_COMP);
                symbol_stack.push(NTS_TERM);
                symbol_stack.push(TS_LESS_EQUAL);
                break;

                case 14:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_TERM);
                symbol_stack.push(NTS_FACTOR);
                break;

                case 15:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_TERM);
                symbol_stack.push(NTS_FACTOR);
                symbol_stack.push(TS_PLUS);
                break;

                case 16:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_TERM);
                symbol_stack.push(NTS_FACTOR);
                symbol_stack.push(TS_MINUS);
                break;

                case 17:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_FACTOR);
                symbol_stack.push(NTS_UNARY);
                break;

                case 18:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_FACTOR);
                symbol_stack.push(NTS_UNARY);
                symbol_stack.push(TS_STAR);
                break;

                case 19:
                symbol_stack.pop();
                symbol_stack.push(NTS_AUX_FACTOR);
                symbol_stack.push(NTS_UNARY);
                symbol_stack.push(TS_SLASH);
                break;

                case 20:
                symbol_stack.pop();
                symbol_stack.push(NTS_PRIMARY);
                break;

                case 21:
                symbol_stack.pop();
                symbol_stack.push(NTS_UNARY);
                symbol_stack.push(TS_MINUS);
                break;

                case 22:
                symbol_stack.pop();
                symbol_stack.push(NTS_UNARY);
                symbol_stack.push(TS_BANG);
                break;

                case 23:
                symbol_stack.pop();
                symbol_stack.push(TS_NUMBER);
                break;

                case 24:
                symbol_stack.pop();
                symbol_stack.push(TS_RIGHT_PAREN);
                symbol_stack.push(NTS_EXP);
                symbol_stack.push(TS_LEFT_PAREN);
                break;

                case 25: symbol_stack.pop(); break;
                case 26: symbol_stack.pop(); break;
                case 27: symbol_stack.pop(); break;
                case 28: symbol_stack.pop(); break;
                case 29: symbol_stack.pop(); break;
                case 30: symbol_stack.pop(); break;

                default:
                error(format("Parser defaulted. Stack top: {} | Immediate symbol: {}", 
                parse_symbol_to_string[symbol_stack.top()], parse_symbol_to_string[peek().type]).c_str());
                return;
            }
        }
    }

    void generate_AST(AST_Node* here)
    {
        if (!is_nts(here->symbol)) {return;}

        switch (rules[rule_index])
        {
            case 1: here->new_child(NTS_OR);break;
            case 2: here->new_child(NTS_AND);here->new_child(NTS_AUX_OR);break;
            case 3: here->new_child(TS_VERT_BAR_VERT_BAR);here->new_child(NTS_AND);here->new_child(NTS_AUX_OR);break;
            case 4: here->new_child(NTS_EQ);here->new_child(NTS_AUX_AND);break;
            case 5: here->new_child(TS_AMPERSAN_AMPERSAN);here->new_child(NTS_EQ);here->new_child(NTS_AUX_AND);break;
            case 6: here->new_child(NTS_COMP);here->new_child(NTS_AUX_EQ);break;
            case 7: here->new_child(TS_EQUAL_EQUAL);here->new_child(NTS_COMP);here->new_child(NTS_AUX_EQ);break;
            case 8: here->new_child(TS_BANG_EQUAL);here->new_child(NTS_COMP);here->new_child(NTS_AUX_EQ);break;
            case 9: here->new_child(NTS_TERM);here->new_child(NTS_AUX_COMP);break;
            case 10: here->new_child(TS_GREATER);here->new_child(NTS_TERM);here->new_child(NTS_AUX_COMP);break;
            case 11: here->new_child(TS_GREATER_EQUAL);here->new_child(NTS_TERM);here->new_child(NTS_AUX_COMP);break;
            case 12: here->new_child(TS_LESS);here->new_child(NTS_TERM);here->new_child(NTS_AUX_COMP);break;
            case 13: here->new_child(TS_LESS_EQUAL);here->new_child(NTS_TERM);here->new_child(NTS_AUX_COMP);break;
            case 14: here->new_child(NTS_FACTOR);here->new_child(NTS_AUX_TERM);break;
            case 15: here->new_child(TS_PLUS);here->new_child(NTS_FACTOR);here->new_child(NTS_AUX_TERM);break;
            case 16: here->new_child(TS_MINUS);here->new_child(NTS_FACTOR);here->new_child(NTS_AUX_TERM);break;
            case 17: here->new_child(NTS_UNARY);here->new_child(NTS_AUX_FACTOR);break;
            case 18: here->new_child(TS_STAR);here->new_child(NTS_UNARY);here->new_child(NTS_AUX_FACTOR);break;
            case 19: here->new_child(TS_SLASH);here->new_child(NTS_UNARY);here->new_child(NTS_AUX_FACTOR);break;
            case 20: here->new_child(NTS_PRIMARY);break;
            case 21: here->new_child(TS_MINUS);here->new_child(NTS_UNARY);break;
            case 22: here->new_child(TS_BANG);here->new_child(NTS_UNARY);break;
            case 23: here->new_child(TS_NUMBER, values.front());values.pop(); break;
            case 24: here->new_child(NTS_EXP);break;
            case 25: break;
            case 26: break;
            case 27: break;
            case 28: break;
            case 29: break;
            case 30: break;
            default: break;
        }
        rule_index++;
        for (AST_Node* next : here->children) {generate_AST(next);}
    }

    void error(const char* msg)
    {
        fprintf(stderr, "Parser: line[%d] -> [%s]\n", peek().line, msg);
        exit(1);
    }

    void print_rules()
    {
        for (u32 rule : rules)
        {
            cout << rule << " ";
        }
        cout << "\n";
    }

    void print_values()
    {
        while (!values.empty())
        {
            Value& t = values.front();
            cout << t.to_string() << " ";
            values.pop();
        }
        cout << "\n";
    }
};

struct Evaluator
{
    typedef vector<pair<Parse_Symbol,Value>> vp;
    vp evaluate(AST_Node* expression)
    {
        //cout << parse_symbol_to_string[expression->symbol] << "\n";
        switch (expression->symbol)
        {
            case TS_NUMBER:
            {
                vp v = {{SPTS_NULL, expression->value}};
                return v;
            }
            case NTS_PRIMARY: return evaluate(expression->children[0]);
            case NTS_UNARY:
            {
                if (expression->children.size() == 1) {return evaluate(expression->children[0]);}
                Parse_Symbol symbol = expression->children[0]->symbol;
                Value v = evaluate(expression->children[1])[0].second;
                switch (symbol)
                {
                    case TS_MINUS: v.as.n = -v.as.n; break;
                    case TS_BANG: v.as.b = !v.as.b; break;
                    default: error("Symbol for unary operator cannot be identified."); break;
                }
                return vp({{SPTS_NULL,v}});
            }
            case NTS_AUX_FACTOR:
            {
                if (expression->children.size() == 0) {return vp({{SPTS_NULL, Value()}});}
                Parse_Symbol symbol = expression->children[0]->symbol;
                vp v_unary = evaluate(expression->children[1]);
                vp v_aux = evaluate(expression->children[2]);
                if (v_aux[0].first == SPTS_NULL) {return vp({{symbol,v_unary[0].second}});}
                v_aux.push_back({symbol,v_unary[0].second});
                return v_aux;
            }
            case NTS_FACTOR:
            {
                vp v_unary = evaluate(expression->children[0]);
                vp v_aux = evaluate(expression->children[1]);
                if (v_aux[0].first == SPTS_NULL) {return v_unary;}
                Value v = v_unary[0].second;
                for (int i = v_aux.size()-1; i >= 0; i--)
                {
                    switch (v_aux[i].first)
                    {
                        case TS_STAR: v.as.n *= v_aux[i].second.as.n; break;
                        case TS_SLASH: v.as.n /= v_aux[i].second.as.n; break;
                        default: error("Symbol for binary operator factor cannot be identified."); break;
                    }
                }
                return vp({{SPTS_NULL, v}});
            }
            case NTS_AUX_TERM:
            {
                if (expression->children.size() == 0) {return vp({{SPTS_NULL, Value()}});}
                Parse_Symbol symbol = expression->children[0]->symbol;
                vp v_factor = evaluate(expression->children[1]);
                vp v_aux = evaluate(expression->children[2]);
                if (v_aux[0].first == SPTS_NULL) {return vp({{symbol,v_factor[0].second}});}
                v_aux.push_back({symbol,v_factor[0].second});
                return v_aux;
            }
            case NTS_TERM:
            {
                vp v_factor = evaluate(expression->children[0]);
                vp v_aux = evaluate(expression->children[1]);
                if (v_aux[0].first == SPTS_NULL) {return v_factor;}
                Value v = v_factor[0].second;
                for (int i = v_aux.size()-1; i >= 0; i--)
                {
                    switch (v_aux[i].first)
                    {
                        case TS_PLUS: v.as.n += v_aux[i].second.as.n; break;
                        case TS_MINUS: v.as.n -= v_aux[i].second.as.n; break;
                        default: error("Symbol for binary operator term cannot be identified."); break;
                    }
                }
                return vp({{SPTS_NULL, v}});
            }
            case NTS_AUX_COMP:
            {
                if (expression->children.size() == 0) {return vp({{SPTS_NULL, Value()}});}
                Parse_Symbol symbol = expression->children[0]->symbol;
                vp v_term = evaluate(expression->children[1]);
                vp v_aux = evaluate(expression->children[2]);
                if (v_aux[0].first == SPTS_NULL) {return vp({{symbol,v_term[0].second}});}
                v_aux.push_back({symbol,v_term[0].second});
                return v_aux;
            }
            case NTS_COMP:
            {
                vp v_term = evaluate(expression->children[0]);
                vp v_aux = evaluate(expression->children[1]);
                if (v_aux[0].first == SPTS_NULL) {return v_term;}
                Value v;
                v.type = VAL_BOOL;
                switch (v_aux[0].first)
                {
                    case TS_GREATER: v.as.b = v_term[0].second.as.n > v_aux[0].second.as.n; break;
                    case TS_GREATER_EQUAL: v.as.b = v_term[0].second.as.n >= v_aux[0].second.as.n; break;
                    case TS_LESS: v.as.b = v_term[0].second.as.n < v_aux[0].second.as.n; break;
                    case TS_LESS_EQUAL: v.as.b = v_term[0].second.as.n <= v_aux[0].second.as.n; break;
                    default: error("Symbol for binary operator comp cannot be identified."); break;
                }
                return vp({{SPTS_NULL, v}});
            }
            case NTS_AUX_EQ:
            {
                if (expression->children.size() == 0) {return vp({{SPTS_NULL, Value()}});}
                Parse_Symbol symbol = expression->children[0]->symbol;
                vp v_comp = evaluate(expression->children[1]);
                vp v_aux = evaluate(expression->children[2]);
                if (v_aux[0].first == SPTS_NULL) {return vp({{symbol,v_comp[0].second}});}
                v_aux.push_back({symbol,v_comp[0].second});
                return v_aux;
            }
            case NTS_EQ:
            {
                vp v_comp = evaluate(expression->children[0]);
                vp v_aux = evaluate(expression->children[1]);
                if (v_aux[0].first == SPTS_NULL) {return v_comp;}
                Value v = v_comp[0].second;
                v.type = VAL_BOOL;
                for (int i = v_aux.size()-1; i >= 0; i--)
                {
                    switch (v_aux[i].first)
                    {
                        case TS_EQUAL_EQUAL: v.as.b = (v.as.n == v_aux[i].second.as.n); break;
                        case TS_BANG_EQUAL: v.as.b = (v.as.n != v_aux[i].second.as.n); break;
                        default: error("Symbol for binary operator eq cannot be identified."); break;
                    }
                }
                return vp({{SPTS_NULL, v}});
            }
            case NTS_AUX_AND:
            {
                if (expression->children.size() == 0) {return vp({{SPTS_NULL, Value()}});}
                Parse_Symbol symbol = expression->children[0]->symbol;
                vp v_eq = evaluate(expression->children[1]);
                vp v_aux = evaluate(expression->children[2]);
                if (v_aux[0].first == SPTS_NULL) {return vp({{symbol,v_eq[0].second}});}
                v_aux.push_back({symbol,v_eq[0].second});
                return v_aux;
            }
            case NTS_AND:
            {
                vp v_eq = evaluate(expression->children[0]);
                vp v_aux = evaluate(expression->children[1]);
                if (v_aux[0].first == SPTS_NULL) {return v_eq;}
                Value v = v_eq[0].second;
                v.type == VAL_BOOL;
                for (int i = v_aux.size()-1; i >= 0; i--)
                {
                    switch (v_aux[i].first)
                    {
                        case TS_AMPERSAN_AMPERSAN: v.as.b = v.as.b && v_aux[i].second.as.b; break;
                        default: error("Symbol for binary operator and cannot be identified."); break;
                    }
                }
                return vp({{SPTS_NULL, v}});
            }
            case NTS_AUX_OR:
            {
                if (expression->children.size() == 0) {return vp({{SPTS_NULL, Value()}});}
                Parse_Symbol symbol = expression->children[0]->symbol;
                vp v_and = evaluate(expression->children[1]);
                vp v_aux = evaluate(expression->children[2]);
                if (v_aux[0].first == SPTS_NULL) {return vp({{symbol,v_and[0].second}});}
                v_aux.push_back({symbol,v_and[0].second});
                return v_aux;
            }
            case NTS_OR:
            {
                vp v_and = evaluate(expression->children[0]);
                vp v_aux = evaluate(expression->children[1]);
                if (v_aux[0].first == SPTS_NULL) {return v_and;}
                Value v = v_and[0].second;
                v.type == VAL_BOOL;
                for (int i = v_aux.size()-1; i >= 0; i--)
                {
                    switch (v_aux[i].first)
                    {
                        case TS_VERT_BAR_VERT_BAR: v.as.b = v.as.b || v_aux[i].second.as.b; break;
                        default: error("Symbol for binary operator and cannot be identified."); break;
                    }
                }
                return vp({{SPTS_NULL, v}});
            }
            case NTS_EXP:
            {
                vp v = evaluate(expression->children[0]);
                return v;
            }
            default: error("Parser tried to evaluate an unenvaluatable node(terminal symbol that is not a number)");
        }
    }

    void error(const char* msg)
    {
        fprintf(stderr, "Runtime: Error ->[%s]\n", msg);
        exit(1);
    }
};

int cnt = 0;
void debug_dfs(AST_Node* ast)
{
    cout << cnt++ << ". ";
    cout << parse_symbol_to_string[ast->symbol] << " " << ast->children.size() << "\n";
    for (AST_Node* next : ast->children)
    {debug_dfs(next);}
}

int main(int argc, char* argv[])
{
    if (argc > 2 || argc < 2) {fprintf(stderr, "Usage: ./main [path_to_source]\n"); exit(1);}
    ifstream in_file(argv[1]);
    stringstream ss;
    ss << in_file.rdbuf();
    string source = ss.str();
    Tokenizer tokenizer(source);
    tokenizer.scan_tokens();
    tokenizer.print_tokens();
    Parser parser(tokenizer.tokens);
    parser.parse();
    AST_Node* root = new AST_Node(NTS_EXP);
    parser.generate_AST(root);
    debug_dfs(root);
    Evaluator evaluator;
    Value v = evaluator.evaluate(root)[0].second;
    cout << v.to_string() << "\n";
    return 0;
}