#include<iostream>
#include<vector>
#include<cstring>
using namespace std;

typedef struct transition
{
    struct fsm_node* next;
    char meta; // ' ' = no meta char, '.' = any char, 'e' = epsilon 
    char condition;
} transition;

typedef struct fsm_node
{
    bool is_end;
    vector<transition> transitions;
} fsm_node;

void initialize_fsm_node (struct fsm_node* node)
{
    node->is_end = false;
    node->transitions = {};
}

transition make_transition(char meta, char condition, struct fsm_node* next)
{
    transition t = {next, meta, condition};
    return t;
}

typedef struct finite_state_machine
{
    struct fsm_node* start;
    struct fsm_node* end;
} finite_state_machine;

finite_state_machine* exp_any_char();
finite_state_machine* exp_empty_char();
finite_state_machine* exp_single_char(char c);
finite_state_machine* exp_zero_or_more(finite_state_machine* operand);
finite_state_machine* exp_concat(finite_state_machine* left, finite_state_machine* right);
finite_state_machine* exp_union(finite_state_machine* left, finite_state_machine* right);
finite_state_machine* exp_zero_or_one(finite_state_machine* operand);
finite_state_machine* psr_expression();
finite_state_machine* psr_union();
finite_state_machine* psr_concatenation();
finite_state_machine* psr_duplication();
finite_state_machine* psr_primary();

enum token_type
{
    TOKEN_NORMAL,
    TOKEN_EPSILON,
    TOKEN_ANY_CHAR,
    TOKEN_STAR,
    TOKEN_QUESTION_MARK,
    TOKEN_VERTICAL_BAR,
    TOKEN_LEFT_PAREN,
    TOKEN_RIGHT_PAREN,
    TOKEN_EOF,
};

typedef struct token
{
    token_type type;
    char* start;
    char* end;
    char lexeme[2];
    void print() {printf("%d %s\n", type, lexeme);}
} token;

typedef struct scanner
{
    char* current;
    char* start;
    char* source;
} scanner;
scanner sc;

typedef struct parser
{
    struct token current;
    struct token previous;
} parser;
parser psr;

token make_token(token_type type)
{
    token t = {type, sc.start, sc.current, false};
    if (*t.start == '\\') {t.start++;}
    strncpy(t.lexeme, t.start, t.end-t.start);
    t.lexeme[t.end-t.start] = '\0';
    //t.print();
    return t;
}

void init_scanner(char* source)
{
    sc.source = source;
    sc.current = source;
    sc.start = source;
}

bool sc_is_at_end(){return sc.current-sc.source >= strlen(sc.source);}
char sc_advance() {return *(sc.current)++;}
char sc_peek() 
{
    if (sc_is_at_end()) {return '\0';}
    return *sc.current;
}
bool sc_match(char expected) 
{
    if (sc_peek() == expected) {sc_advance();return true;}
    return false;
}
void sc_eat(char expected)
{
    if (sc_peek() == expected) {sc_advance(); return;}
    fprintf(stderr, "Error! Expected %c, got %c", expected, sc_peek()); exit(1);
}

token sc_scan_token()
{
    sc.start = sc.current;
    if (sc_is_at_end()) {return make_token(TOKEN_EOF);}
    char c = sc_advance();

    switch (c)
    {
        case 'e': return make_token(TOKEN_EPSILON);
        case '.': return make_token(TOKEN_ANY_CHAR);
        case '*': return make_token(TOKEN_STAR);
        case '?': return make_token(TOKEN_QUESTION_MARK);
        case '|': return make_token(TOKEN_VERTICAL_BAR);
        case '(': return make_token(TOKEN_LEFT_PAREN);
        case ')': return make_token(TOKEN_RIGHT_PAREN);
        case '\\':
            if (sc_match('e') || sc_match('.') || sc_match('*') || sc_match('|') || sc_match('(') || sc_match(')') ||
                sc_match('?'))
            {return make_token(TOKEN_NORMAL);}
            else {fprintf(stderr, "Error!: Unidentifiable token."); exit(1);}
        default: return make_token(TOKEN_NORMAL);
    }
}



void sc_scan_tokens()
{
    while (!sc_is_at_end())
    {
        sc.start = sc.current;
        token t = sc_scan_token();
    }
}

void init_parser()
{
    psr.current = {};
    psr.previous = {};
}

void psr_advance();

finite_state_machine* psr_parse(char* source)
{
    init_scanner(source);
    psr_advance();
    return psr_expression();
}

void psr_advance()
{
    psr.previous = psr.current;
    psr.current = sc_scan_token();
}

bool psr_match(token_type expected)
{
    if (psr.current.type == expected) {psr_advance(); return true;}
    return false;
}

void psr_eat(token_type expected)
{
    if (psr.current.type == expected) {psr_advance();}
    else {fprintf(stderr, "Error: expected token %d, got token %d.\n", expected, psr.current.type);}
}

finite_state_machine* psr_expression()
{
    return psr_union();
}

finite_state_machine* psr_union()
{
    finite_state_machine* fsm = psr_concatenation();
    while (psr_match(TOKEN_VERTICAL_BAR))
    {
        fsm = exp_union(fsm, psr_concatenation());
    }
    return fsm;
}

finite_state_machine* psr_concatenation()
{
    finite_state_machine* fsm = psr_duplication();
    while (psr.current.type == TOKEN_NORMAL || 
           psr.current.type == TOKEN_LEFT_PAREN ||
           psr.current.type == TOKEN_ANY_CHAR ||
           psr.current.type == TOKEN_EPSILON)
    {fsm = exp_concat(fsm, psr_duplication());}
    return fsm;
}

finite_state_machine* psr_duplication()
{
    finite_state_machine* fsm = psr_primary();
    while (psr_match(TOKEN_STAR) || psr_match(TOKEN_QUESTION_MARK))
    {
        switch (psr.previous.type)
        {
            case TOKEN_STAR: {fsm = exp_zero_or_more(fsm); break;}
            case TOKEN_QUESTION_MARK: {fsm = exp_zero_or_one(fsm); break;}
            default: break;
        }
    }
    // if (psr_match(TOKEN_STAR)) {fsm = exp_zero_or_more(fsm);}
    // else if (psr_match(TOKEN_QUESTION_MARK)) {fsm = exp_zero_or_one(fsm);}
    // else if (psr_match(TOKEN_PLUS)) {fsm = exp_one_or_more(fsm);}
    return fsm;
}

finite_state_machine* psr_primary()
{
    if (psr_match(TOKEN_NORMAL)) return exp_single_char(psr.previous.lexeme[0]);
    if (psr_match(TOKEN_EPSILON)) return exp_empty_char();
    if (psr_match(TOKEN_ANY_CHAR)) return exp_any_char();
    if (psr_match(TOKEN_LEFT_PAREN))
    {
        finite_state_machine* fsm = psr_expression();
        psr_eat(TOKEN_RIGHT_PAREN);
        return fsm;
    }
}

finite_state_machine* exp_any_char()
{
    finite_state_machine* fsm = new finite_state_machine;
    fsm_node* s1 = new fsm_node;
    fsm_node* s2 = new fsm_node;
    initialize_fsm_node(s1);
    initialize_fsm_node(s2);
    s2->is_end = true;

    s1->transitions.push_back(make_transition('.', ' ', s2));

    fsm->start = s1;
    fsm->end = s2;
    return fsm;   
}

finite_state_machine* exp_empty_char()
{
    finite_state_machine* fsm = new finite_state_machine;
    fsm_node* s1 = new fsm_node;
    fsm_node* s2 = new fsm_node;
    initialize_fsm_node(s1);
    initialize_fsm_node(s2);
    s2->is_end = true;

    s1->transitions.push_back(make_transition('e', ' ', s2));

    fsm->start = s1;
    fsm->end = s2;
    return fsm;
}

finite_state_machine* exp_single_char(char c)
{
    finite_state_machine* fsm = new finite_state_machine;
    fsm_node* s1 = new fsm_node;
    fsm_node* s2 = new fsm_node;
    initialize_fsm_node(s1);
    initialize_fsm_node(s2);
    s2->is_end = true;

    s1->transitions.push_back(make_transition(' ', c, s2));
    
    fsm->start = s1;
    fsm->end = s2;
    return fsm;
}

finite_state_machine* exp_zero_or_more(finite_state_machine* operand)
{
    finite_state_machine* fsm = new finite_state_machine;
    fsm_node* start = new fsm_node;
    fsm_node* end = new fsm_node;
    initialize_fsm_node(start);
    initialize_fsm_node(end);
    end->is_end = true;
    operand->end->is_end = false;

    start->transitions.push_back(make_transition('e', ' ', operand->start));
    start->transitions.push_back(make_transition('e', ' ', end));
    operand->end->transitions.push_back(make_transition('e', ' ', operand->start));
    operand->end->transitions.push_back(make_transition('e', ' ', end));

    fsm->start = start;
    fsm->end = end;

    delete operand;
    return fsm;
}

finite_state_machine* exp_zero_or_one(finite_state_machine* operand)
{
    return exp_union(operand, exp_empty_char());
}

finite_state_machine* exp_concat(finite_state_machine* left, finite_state_machine* right)
{
    finite_state_machine* fsm = new finite_state_machine;
    left->end->is_end = false;

    left->end->transitions.push_back(make_transition('e', ' ', right->start));

    fsm->start = left->start;
    fsm->end = right->end;

    delete left;
    delete right;
    return fsm;
}

finite_state_machine* exp_union(finite_state_machine* left, finite_state_machine* right)
{
    finite_state_machine* fsm = new finite_state_machine;
    fsm_node* start = new fsm_node;
    fsm_node* end = new fsm_node;
    initialize_fsm_node(start);
    initialize_fsm_node(end);
    end->is_end = true;
    left->end->is_end = false;
    right->end->is_end = false;

    start->transitions.push_back(make_transition('e', ' ', left->start));
    start->transitions.push_back(make_transition('e', ' ', right->start));
    left->end->transitions.push_back(make_transition('e', ' ', end));
    right->end->transitions.push_back(make_transition('e', ' ', end));

    fsm->start = start;
    fsm->end = end;

    delete left;
    delete right;
    return fsm;
}

/*
{expr}? = ({expr}|e)
*/

void walk(char* s, fsm_node* node, bool* success)
{
    if (*success) {return;}
    if (node->is_end && strlen(s) == 0) {*success = true; return;}
    //printf("%s ", s);
    for (transition t : node->transitions)
    {
        if (t.meta == '.' && strlen(s) != 0) {walk(s+1, t.next, success);}
        else if (t.meta == 'e') {walk(s, t.next, success);}
        else if (*s == t.condition) {walk(s+1, t.next, success);}
    }
    return;
}

int main(int argc, char* argv[])
{
    if (argc != 2)
    {
        fprintf(stderr, "usage: ./fsm.exe [path_to_source_file]\n");
        return 1;
    }

    FILE* file = fopen(argv[1], "r");
    if (file == NULL)
    {
        fprintf(stderr, "File %s doesn't exist.\n", argv[1]);
        return 1;
    }
    char contents[513];
    fgets(contents, 513, file);
    bool valid_format = false;
    char* ptr = contents;
    while (*ptr != '\0')
    {
        if (*ptr == '|') 
        {
            *ptr = '\0';
            valid_format = true;
            break;
        }
        ptr++;
    }

    if (!valid_format) 
    {
        fprintf(stderr, "File must have the format of [test_string]|[regular_expression]");
        return 1;
    }

    char* source = ptr+1;
    char* test = contents;
    bool success = false;
    init_parser();
    finite_state_machine* fsm = psr_parse(source);
    walk (test, fsm->start, &success);
    printf("%d\n", success);
    return 0;
}