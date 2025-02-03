Ml2 is a dynamically typed toy functional programming language based on ocaml and made with ocaml. The syntax is similar to that of ocaml and here is a run down of the fundamentals.

<how to run>
1. install ocaml
2. download ml2.ml
3. in the command line, type ocaml [path to ml2.ml] [path to source file]

<comment>
// -> single line comment.

<values>
Unit      -> unit value identical to ocaml's unit.
Num(n)    -> number value where n is a float literal.
Bool(b)   -> boolean value where b is a boolean literal.
List(l)   -> list value where l is a list. (*Identical to that of ocaml*)
String(s) -> string value where s is a string literal.
Loc(l)    -> location value where l is a location literal.
Procedure -> function closure value. (*Cannot be printed*)

<literals>
null        -> unit literal. (*Identical in functionality to unit of ocaml. Represented as Unit in program*)
true, false -> boolean literals. (*Represented as Bool(true) and Bool(false) respectively in program*)
nil         -> an empty list. (*Represented as List([]) in program*)
"{string}"  -> string literal. (*Represented as String("{string}") in program. To see the definition of {string}, refer to <context free grammar>*)
{number}    -> number literal. (*Represented as Num({number}) in program. Only decimal numbers are supported. To see the detailed definition of {number}, refer to <context free grammar>*)
{location}  -> location literal (*Represented as Loc({location}) in program. To see the definition of {location}, refer to <context free grammar>*)

<operators> 
+, -, *, /   -> arithmetic operators. [form: Num(n) (operator) Num(n) -> Num(n)]
+            -> string concatenation operator. [form: String(s) (operator) String(s) -> String(s)]
>, <, >=, <= -> comparison operators. [form: Num(n) (operator) Num(n) -> Bool(b)]
==, ~=       -> equality operators. [form: ('a) (operator) ('a) -> Bool(b) | List('a list) (operator) List('a list) -> Bool(b)] (*~= is the not equal operator, which is a syntax inspired by lua*)
iszero       -> returns whether the operand is 0. [form: (operator) ('a)]
~            -> logical NOT operator. [form: (operator) Bool(b)] (*The syntax of ~ was inspired by lua*)
and, or      -> logical AND, OR operators. [form: Bool(b) (operator) Bool(b) -> Bool(b)]
::           -> list concatenation operator. [form: ('a) (operator) List('a list) -> List('a list)] (*identical to that of ocaml*)
@            -> list appendment operator. [form: List('a list) (operator) List('a list) -> List('a list)] (*identical to that of ocaml*)
head         -> returns the head of the operand. [form: (operator) List('a list) -> ('a)]
tail         -> returns the tail of the operand. [form: (operator) List('a list) -> ('a)]
isnil        -> returns whether the operand is nil. [form: operator ('a) -> Bool(b)]
;            -> sequence operator. [form: ('a) (operator) ('b) -> ('b)] (*similar to that of ocaml, but the left operand doesn't need to evaluate to Unit*)
ref          -> stores the operand in the memory and returns its address. [form: (operator) ('a) -> ] (*identical to that of ocaml*)
:=           -> assigns value to a location. [form: Loc(l) (operator) ('a) -> ('a)]
!            -> dereference operator. [form: (operator) Loc(l) -> ('a)](*identical to that of ocaml*)
print        -> print operator. [form: (operator) ('a) -> Unit]

<structures>
let {id} = {expr1} in {expr2}                                    -> initializes local variable {id} with {expr1} and evaluates {expr2}.
letrec {id1} {id2} = {expr1} in {expr2}                          -> initializes local recursive function (id1) that has parameter {id2} with body {expr1} and evaluates {expr2}.
letmrec {id1} {id2} = {expr1} | {id3} {id4} = {expr2} in {expr3} -> initializes local function {id1} that has parameter {id2} with body {expr1} and function {id3} that has parameter {id4} with body {expr2}, which are mutually recursive to each other. Then it evaluates {expr3}.
if {expr1} then {expr2} else {expr3}                             -> evaluates {expr2} if {expr1} evaluates to true, else evaluates {expr3}.
func {id} {expr}                                                 -> evaluates to a non-recursive lambda function.
{expr1} [{expr2}]                                                -> calls (expr1) with argument {expr2} where {expr1} must evaluate to a function.

<context free grammar>
{expr}        -> {sequence}
{sequence}    -> {assignment} (';' {assignment})*
{assignment}  -> {logic} (':=' {logic})*
{logic}       -> {equality} (('and' | 'or') {equality})*
{equality}    -> {comparison} (('==' | '~=') {comparison})*
{comparison}  -> {term} (('>' | '<' | '>=' | '<=') {term})*
{term}        -> {factor} (('+'|'-') {factor})*
{factor}      -> {list concat} (('*' | '=') {list concat})*
{list concat} -> {unary} (('::' | '@') {unary})*
{unary}       -> {call} | (('-' | '!' | '~' | 'ref' | 'isnil' | 'iszero' | 'head' | 'tail' | 'print') {unary})*
{call}        -> {primary} | ('['{call}']')?
{primary}     -> 'null' | 'nil' | {bool} | {number} |'"'{string}'"' | '('{expr}')' | 'func' {id} {expr} | 'let' {id} '=' {expr} 'in' {expr} | 'letrec' {id} {id} '=' {expr} in {expr} | 'letmrec' {id} {id} '=' {expr} '|' {id} {id} '=' {expr} in {expr} | 'if' {expr} 'then' {expr} 'else' {expr}  
{bool}        -> 'true'|'false'
{number}      -> {digit}{digit}*('.'{digit}{digit}*)?
{digit}       -> ['0'-'9']
{string}      -> {character}*
{character}   -> . | '\n'
{id}          -> ('_'|{alphabet}) ('_'|{digit}|{alphabet})*
{alphabet}    -> ['a'-'z'] | ['A'-'Z']
{location}    -> {digit}{digit}*
