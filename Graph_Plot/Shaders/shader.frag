uniform float codes[64];
uniform float width;
uniform float height;
uniform float s;
uniform vec2 tr;
uniform bool on;
int ip;

vec3 a_pos;
float stack[32];
int sp = 0;

#define CONST 1.0
#define NEG 2.0
#define ADD 3.0
#define SUB 4.0
#define MUL 5.0
#define DIV 6.0
#define POW 7.0
#define GET_X 8.0
#define GET_Y 9.0
#define EQUAL 10.0
#define END 11.0

void push(float v)
{
    stack[sp] = v;
    sp = sp + 1;
}

float pop()
{
    sp = sp - 1;
    return stack[sp+1];
}

float run()
{
    ip = 0;
    float code;
    float arg;
    for (;;)
    {
        code = codes[ip];
        ip = ip + 1;
        if (code == END) {return stack[sp-1];}
        else if (code == CONST)
        {
            arg = codes[ip];
            ip = ip + 1;
            push(arg);
        }
        else if (code == NEG) {push(-pop());}
        else if (code == ADD) {push(pop()+pop());}
        else if (code == SUB) {push(-pop()+pop());}
        else if (code == MUL) {push(pop()*pop());}
        else if (code == DIV) {push((1.0/pop())*pop());}
        else if (code == POW)
        {
            float e = pop();
            float b = pop();
            push(pow(b, e));
        }
        else if (code == GET_X) {push(a_pos.x);}
        else if (code == GET_Y) {push(a_pos.y);}
        else if (code == EQUAL)
        {
            bool v = (pop() == pop());
            if (v) {push(1.0);}
            else {push(0.0);}
        }
    }
}

vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords)
{
    mat3 trm = mat3(
        1.0, 0.0, tr.x,
        0.0, 1.0, tr.y,
        0.0, 0.0, 1.0
    );
    mat3 sm = mat3(
        s, 0.0, 0.0,
        0.0, s, 0.0,
        0.0, 0.0, 0.0 
    );

    mat3 tc_to_wc = mat3(
        width, 0.0, -width/2.0,
        0, -height, height/2.0,
        0, 0, 1
    );

    a_pos =  trm * sm * tc_to_wc * vec3(texture_coords.xy, 1);
    
    float v;
    if (on) {v = 0.0;} else {v = 1.0;}
    return vec4(v, v, v, 1.0);
}
