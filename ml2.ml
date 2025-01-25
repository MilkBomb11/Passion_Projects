(*
Define a variable/function: let (id) = (expr) in (expr)
Define a recursive function: letrec (func_id) (var_id) = (expr) in (expr)
Define two mutually recursive functions: letmrec (func_id1) (var_id) = (expr) | (func_id2) (var_id) = (expr) in (expr)
Function: func (id) (expr)
If structure: if (expr) then (expr) else (expr)
Call function: (expr) [(expr)]

Gotchas
|NOT: ~ (expr) |AND: (expr) and (expr) |OR: (expr) or (expr)
|NOTEQUAL: (expr) ~= (expr)
|DEREF: !(expr) |SETREF: (expr) := (expr) |NEWREF: ref (expr)
|[]: nil |Null: unit
*)

type token_type = 
|TOKEN_LEFT_PAREN | TOKEN_RIGHT_PAREN |TOKEN_LEFT_BRACE |TOKEN_RIGHT_BRACE |TOKEN_LEFT_BRACKET | TOKEN_RIGHT_BRACKET
|TOKEN_DOT |TOKEN_MINUS |TOKEN_PLUS |TOKEN_SEMICOLON |TOKEN_SLASH |TOKEN_STAR |TOKEN_BANG(*deref*)
|TOKEN_ATSIGN |TOKEN_VERTICAL_BAR

|TOKEN_TILDE |TOKEN_TILDE_EQUAL
|TOKEN_EQUAL|TOKEN_EQUAL_EQUAL
|TOKEN_COLON_EQUAL |TOKEN_COLON_COLON
|TOKEN_GREATER |TOKEN_GREATER_EQUAL
|TOKEN_LESS |TOKEN_LESS_EQUAL

|TOKEN_IDENTIFIER |TOKEN_NUMBER |TOKEN_STRING

|TOKEN_AND |TOKEN_OR | TOKEN_REF
|TOKEN_ELSE |TOKEN_FALSE |TOKEN_LETREC |TOKEN_LETMREC | TOKEN_IF
|TOKEN_PRINT |TOKEN_TRUE |TOKEN_LET |TOKEN_IN
|TOKEN_NIL |TOKEN_UNIT |TOKEN_THEN |TOKEN_FUNC
|TOKEN_HEAD |TOKEN_TAIL |TOKEN_ISZERO |TOKEN_ISNIL
|TOKEN_EOF

type expression =
| UNIT
| TRUE
| FALSE
| NUM of float
| STRING of string
| VAR of var
| ADDITION of expression * expression
| SUBTRACTION of expression * expression
| MULTIPLICATION of expression * expression
| DIVISION of expression * expression
| EQUAL of expression * expression
| NOT_EQUAL of expression * expression
| LESS of expression * expression
| LESS_EQUAL of expression * expression
| GREATER of expression * expression
| GREATER_EQUAL of expression * expression
| AND of expression * expression
| OR of expression * expression
| LET of var * expression * expression
| LETREC of var * var * expression * expression
| LETMREC of (var * var * expression) * (var * var * expression) * expression
| NIL
| CONS of expression * expression
| APPEND of expression * expression
| HEAD of expression
| TAIL of expression
| ISNIL of expression
| NOT of expression
| IF of expression * expression * expression
| ISZERO of expression
| FUNC of var * expression
| CALL of expression * expression
| PRINT of expression
| SEQ of expression * expression
| NEWREF of expression
| DEREF of expression
| SETREF of expression * expression
and var = string

type value = 
| Unit
| Number of float
| Bool of bool
| Stringv of string
| List of value list
| Loc of loc
| Procedure of var * expression * env
| RecProcedure of var * var * expression * env
| MRecProcedure of var * var * expression * var * var * expression * env
and env = (var * value) list
and mem = (loc * value) list
and loc = int

type literal =
| LIT_Unit
| LIT_Number of float
| LIT_Bool of bool
| LIT_String of string

let string_of_tok_typ (typ:token_type):string =
  match typ with
  | TOKEN_LEFT_PAREN -> "LEFT_PAREN" | TOKEN_RIGHT_PAREN -> "RIGHT_PAREN"
  | TOKEN_LEFT_BRACE -> "LEFT_BRACE" | TOKEN_RIGHT_BRACE -> "RIGHT_BRACE"
  | TOKEN_LEFT_BRACKET -> "LEFT_BRACKET" | TOKEN_RIGHT_BRACKET -> "RIGHT_BRACKET"
  | TOKEN_DOT -> "DOT"
  | TOKEN_ATSIGN -> "ATSIGN"
  | TOKEN_MINUS -> "MINUS" | TOKEN_PLUS -> "PLUS"
  | TOKEN_SEMICOLON -> "SEMICOLON" | TOKEN_SLASH -> "SLASH"| TOKEN_STAR -> "STAR"
  | TOKEN_BANG -> "BANG" |TOKEN_TILDE -> "TILDE" | TOKEN_TILDE_EQUAL -> "TILDE_EQUAL"
  | TOKEN_EQUAL -> "EQUAL"
  | TOKEN_EQUAL_EQUAL -> "EQUAL_EQUAL" | TOKEN_COLON_EQUAL -> "COLON_EQUAL" | TOKEN_COLON_COLON -> "TOKEN_COLON_COLON"
  | TOKEN_GREATER -> "GREATER" | TOKEN_GREATER_EQUAL -> "GREATER_EQUAL" | TOKEN_LESS -> "LESS" | TOKEN_LESS_EQUAL -> "LESS_EQUAL"
  | TOKEN_IDENTIFIER -> "IDENTIFIER"
  | TOKEN_NUMBER -> "NUMBER" |TOKEN_STRING -> "STRING"
  | TOKEN_AND -> "AND" | TOKEN_OR -> "OR"
  | TOKEN_IF -> "IF" | TOKEN_ELSE -> "ELSE"
  | TOKEN_FALSE -> "FALSE" | TOKEN_TRUE -> "TRUE"
  | TOKEN_LET -> "LET" | TOKEN_LETREC -> "LETREC" | TOKEN_LETMREC -> "LETMREC"
  | TOKEN_IN -> "IN" 
  | TOKEN_PRINT -> "PRINT"
  | TOKEN_REF -> "REF"
  | TOKEN_NIL -> "NIL" |TOKEN_ISNIL -> "ISNIL" | TOKEN_ISZERO -> "ISZERO"
  | TOKEN_HEAD -> "HEAD" | TOKEN_TAIL -> "TAIL"
  | TOKEN_UNIT -> "UNIT"
  | TOKEN_VERTICAL_BAR -> "VERTICAL_BAR"
  | TOKEN_THEN -> "THEN"
  | TOKEN_FUNC -> "FUNC"
  | TOKEN_EOF -> "EOF"

(*tokenizer*)
class token ((_typ:token_type), (_lexeme:string), (_literal:literal), (_line:int)) = object
  val mutable typ = _typ
  val mutable lex = _lexeme
  val mutable lit = _literal
  val mutable line = _line

  method to_string():string =
    match lit with
    | LIT_Unit -> Printf.sprintf "%s %s %s %d" (string_of_tok_typ typ) lex "unit" line
    | LIT_Number n -> Printf.sprintf "%s %s %g %d" (string_of_tok_typ typ) lex n line
    | LIT_Bool b -> Printf.sprintf "%s %s %s %d" (string_of_tok_typ typ) lex (string_of_bool b) line
    | LIT_String s -> Printf.sprintf "%s %s %s %d" (string_of_tok_typ typ) lex s line
  
  method get_type():token_type = typ
  method get_lexeme():string = lex
  method get_literal():literal = lit
end
  
class scanner ((src:string)) = object(self)
  val source = src
  val mutable current = 0
  val mutable start = 0
  val mutable line = 0
  val mutable tokens = Dynarray.create()
  val mutable keywords = Hashtbl.create(9)

  initializer
    Hashtbl.add keywords "and" TOKEN_AND;
    Hashtbl.add keywords "or" TOKEN_OR;
    Hashtbl.add keywords "else" TOKEN_ELSE;
    Hashtbl.add keywords "if" TOKEN_IF;
    Hashtbl.add keywords "false" TOKEN_FALSE;
    Hashtbl.add keywords "true" TOKEN_TRUE;
    Hashtbl.add keywords "let" TOKEN_LET;
    Hashtbl.add keywords "letrec" TOKEN_LETREC;
    Hashtbl.add keywords "letmrec" TOKEN_LETMREC;
    Hashtbl.add keywords "in" TOKEN_IN;
    Hashtbl.add keywords "print" TOKEN_PRINT;
    Hashtbl.add keywords "nil" TOKEN_NIL;
    Hashtbl.add keywords "unit" TOKEN_UNIT;
    Hashtbl.add keywords "then" TOKEN_THEN;
    Hashtbl.add keywords "func" TOKEN_FUNC;
    Hashtbl.add keywords "head" TOKEN_HEAD;
    Hashtbl.add keywords "tail" TOKEN_TAIL;
    Hashtbl.add keywords "is_nil" TOKEN_ISNIL;
    Hashtbl.add keywords "is_zero" TOKEN_ISZERO;


  method scanTokens():unit =
    (while not (self#isAtEnd()) do 
      start <- current; 
      self#scanToken() 
    done);
    self#addToken TOKEN_EOF LIT_Unit;
  
  method printTokens():unit =
    Dynarray.iter (fun (tok:token) -> Printf.printf "%s\n" (tok#to_string())) tokens

    
  method scanToken():unit =
    let (c:char) = self#advance() in
    match c with
    | '(' -> self#addToken TOKEN_LEFT_PAREN LIT_Unit
    | ')' -> self#addToken TOKEN_RIGHT_PAREN LIT_Unit
    | '{' -> self#addToken TOKEN_LEFT_BRACE LIT_Unit
    | '}' -> self#addToken TOKEN_RIGHT_BRACE LIT_Unit
    | '[' -> self#addToken TOKEN_LEFT_BRACKET LIT_Unit
    | ']' -> self#addToken TOKEN_RIGHT_BRACKET LIT_Unit
    | '+' -> self#addToken TOKEN_PLUS LIT_Unit
    | '-' -> self#addToken TOKEN_MINUS LIT_Unit
    | '*' -> self#addToken TOKEN_STAR LIT_Unit
    | '@' -> self#addToken TOKEN_ATSIGN LIT_Unit
    | '.' -> self#addToken TOKEN_DOT LIT_Unit
    | ';' -> self#addToken TOKEN_SEMICOLON LIT_Unit
    | '!' -> self#addToken TOKEN_BANG LIT_Unit
    | '|' -> self#addToken TOKEN_VERTICAL_BAR LIT_Unit
    | ':' -> if self#isMatch '=' then (self#addToken TOKEN_COLON_EQUAL LIT_Unit) 
             else if self#isMatch ':' then (self#addToken TOKEN_COLON_COLON LIT_Unit) else self#err()
    | '~' -> if self#isMatch '=' then (self#addToken TOKEN_TILDE_EQUAL LIT_Unit) else (self#addToken TOKEN_TILDE LIT_Unit)
    | '=' -> if self#isMatch '=' then (self#addToken TOKEN_EQUAL_EQUAL LIT_Unit) else (self#addToken TOKEN_EQUAL LIT_Unit)
    | '/' -> if self#isMatch '/' then 
             while (self#peek() <> '\n' && not (self#isAtEnd())) do current <- (current+1) done  
             else (self#addToken TOKEN_SLASH LIT_Unit)
    | '>' -> if self#isMatch '=' then (self#addToken TOKEN_GREATER_EQUAL LIT_Unit) else self#addToken TOKEN_GREATER LIT_Unit
    | '<' -> if self#isMatch '=' then (self#addToken TOKEN_LESS_EQUAL LIT_Unit) else self#addToken TOKEN_LESS LIT_Unit
    | '"' -> self#string()
    | ' ' | '\t' | '\r' -> ()
    | '\n' -> line <- (line+1)
    | _ -> 
      if self#isDigit c then self#number()
      else if self#isAlphabet c then self#identifier()

  method string():unit =
    (while self#peek() <> '"' do
      if self#isAtEnd() then raise (Failure (Printf.sprintf "expected %c to end string" '"'))
      else current <- (current+1);
    done);
    self#eat '"' "expected %c to end string";
    self#addToken TOKEN_STRING (LIT_String (String.sub source (start+1) (current-start-2)))
  
  method number():unit = 
    (while self#isDigit (self#peek()) do current <- (current+1) done);
    let b = (match self#peek() with | '.' -> 1 | _ -> 0)
    in (current <- (current + b));
    (while self#isDigit (self#peek()) do current <- (current+1) done);
    self#addToken TOKEN_NUMBER ((LIT_Number (float_of_string (String.sub source start (current-start)))));
  
  method identifier():unit =
    (while self#isAlphaNumerical(self#peek()) do current <- (current+1) done);
    let text = String.sub source start (current-start) in
    if Hashtbl.mem keywords text then
      let typ = Hashtbl.find keywords text in 
      let lit = 
        if typ = TOKEN_TRUE then (LIT_Bool true) else
        if typ = TOKEN_FALSE then (LIT_Bool false) else LIT_Unit in 
        self#addToken typ lit
    else
      self#addToken TOKEN_IDENTIFIER LIT_Unit

  method advance():char =
    current <- (current+1);
    src.[current-1]
  method peek():char =
    if (self#isAtEnd()) then '\x00'
    else src.[current]
  method peekNext():char =
    if (current+1 >= (String.length source)) then '\x00' 
    else src.[current+1]
  method isAtEnd():bool =
    current >= String.length(source)
  method eat (expected:char) (err_msg:string):unit =
    if self#peek() = expected then current <- (current+1)
    else raise (Failure err_msg)
  method addToken (typ:token_type) (lit:literal): unit =
    let lex = String.sub src start (current-start) in
    Dynarray.add_last tokens (new token (typ, lex, lit, line))
  method isMatch (expected:char):bool =
    if (self#isAtEnd()) then false 
    else if source.[current] = expected then (current <- (current+1); true) else false
  method isDigit (c:char):bool =
    c >= '0' && c <= '9'
  method isAlphabet (c:char):bool =
    (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c = '_')
  method isAlphaNumerical (c:char):bool =
    (self#isAlphabet c) || (self#isDigit c)
  method err ():unit =
    Printf.printf "line: %d, col: %d: Unexpected lexeme: '%s'\n" (line) (start) (String.sub source start (current-start))
  method get_tokens():token Array.t = (Dynarray.to_array tokens)
end

(*parser*)
class parser (toks: token Array.t) = object(self)
  val tokens = toks
  val mutable current = 0

  method parse():expression = self#expression_()

  method expression_():expression = self#sequence()

  method sequence ():expression = 
    let expr = ref (self#assignment()) in
    (while self#isMatch([TOKEN_SEMICOLON]) do
      let operator = self#previous() in
      let right = self#assignment() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr
  
  method assignment():expression =
    let expr = ref (self#logic()) in
    (while self#isMatch([TOKEN_COLON_EQUAL]) do
      let operator = self#previous() in
      let right = self#logic() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr
  
  method logic ():expression =
    let expr = ref (self#equality()) in
    (while self#isMatch([TOKEN_AND;TOKEN_OR]) do
      let operator = self#previous() in
      let right = self#equality() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr

  method equality ():expression =
    let expr = ref (self#comparison()) in
    (while self#isMatch([TOKEN_EQUAL_EQUAL;TOKEN_TILDE_EQUAL]) do
      let operator = self#previous() in
      let right = self#comparison() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr

  method comparison ():expression =
    let expr = ref (self#term()) in
    (while self#isMatch([TOKEN_GREATER;TOKEN_GREATER_EQUAL;TOKEN_LESS;TOKEN_LESS_EQUAL]) do
      let operator = self#previous() in
      let right = self#term() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr

  method term():expression =
    let expr = ref (self#factor()) in
    (while self#isMatch([TOKEN_MINUS;TOKEN_PLUS]) do
      let operator = self#previous() in
      let right = self#factor() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr

  method factor():expression =
    let expr = ref (self#list_concat()) in
    (while self#isMatch([TOKEN_STAR;TOKEN_SLASH]) do
      let operator = self#previous() in
      let right = self#list_concat() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr
  
  method list_concat():expression =
    let expr = ref (self#unary()) in
    (while self#isMatch([TOKEN_COLON_COLON;TOKEN_ATSIGN]) do
      let operator = self#previous() in
      let right = self#list_concat() in
      expr := (self#binary_to_exp (!expr) operator right)
    done); !expr

  method unary():expression =
    if (self#isMatch([TOKEN_BANG;TOKEN_TILDE;TOKEN_MINUS;TOKEN_ISNIL;TOKEN_REF;TOKEN_ISZERO;TOKEN_HEAD;TOKEN_TAIL])) then
      let operator = self#previous() in
      let right = self#unary() in
      (self#unary_to_exp operator right)
    else self#call()

  method call():expression =
    let expr1 = self#primary() in
    if (self#isMatch([TOKEN_LEFT_BRACKET])) then
      let expr2 = self#call() in
      (self#eat TOKEN_RIGHT_BRACKET "expected ']'";CALL (expr1, expr2))
    else expr1

  method primary():expression =
    if (self#isMatch [TOKEN_FALSE]) then FALSE
    else if (self#isMatch [TOKEN_TRUE]) then TRUE
    else if (self#isMatch [TOKEN_UNIT]) then UNIT
    else if (self#isMatch [TOKEN_NIL]) then NIL 
    else if (self#isMatch [TOKEN_NUMBER]) then
      let lit = 
      match (self#previous())#get_literal() with
      | LIT_Number n -> n 
      | _ -> raise (Failure "Literal not defined.")
      in (NUM lit)
    else if (self#isMatch [TOKEN_STRING]) then
      let lit = 
      match (self#previous())#get_literal() with
      | LIT_String s -> s
      | _ -> raise (Failure "Literal string expected.")
      in (STRING lit)
    else if (self#isMatch [TOKEN_LEFT_PAREN]) then
      let expr = ref (self#expression_()) in
      (self#eat TOKEN_RIGHT_PAREN "Expected ')' but got something else."); (!expr)
    else if (self#isMatch [TOKEN_IDENTIFIER]) then
      VAR ((self#previous())#get_lexeme())
    else if (self#isMatch [TOKEN_LET]) then
      (self#eat TOKEN_IDENTIFIER "expected identifier";
      let x = (self#previous())#get_lexeme() in
      self#eat TOKEN_EQUAL "expected EQUAL";
      let ex0 = self#expression_() in
      self#eat TOKEN_IN "expected IN";
      let ex1 = self#expression_() in
      LET (x, ex0, ex1))
    else if (self#isMatch [TOKEN_LETREC]) then
      (self#eat TOKEN_IDENTIFIER "expected identifier";
      let f = (self#previous())#get_lexeme() in
      self#eat TOKEN_IDENTIFIER "expectected identifier";
      let x = (self#previous())#get_lexeme() in
      self#eat TOKEN_EQUAL "expected EQUAL";
      let ex0 = self#expression_() in
      self#eat TOKEN_IN "expected IN";
      let ex1 = self#expression_() in
      LETREC (f, x, ex0, ex1))
    else if (self#isMatch [TOKEN_LETMREC]) then
      (self#eat TOKEN_IDENTIFIER "expected identifier";
      let f = (self#previous())#get_lexeme() in
      self#eat TOKEN_IDENTIFIER "expected identifier";
      let x = (self#previous())#get_lexeme() in
      self#eat TOKEN_EQUAL "expected EQUAL";
      let exf = self#expression_() in
      self#eat TOKEN_VERTICAL_BAR "expected '|'";
      self#eat TOKEN_IDENTIFIER "expected identifier";
      let g = (self#previous())#get_lexeme() in
      self#eat TOKEN_IDENTIFIER "expected identifier";
      let y = (self#previous())#get_lexeme() in
      self#eat TOKEN_EQUAL "expected EQUAL";
      let exg = self#expression_() in
      self#eat TOKEN_IN "expected IN";
      let expr = self#expression_() in
      LETMREC ((f, x, exf), (g, y, exg), expr)
      )
    else if (self#isMatch [TOKEN_IF]) then
      (let ex1 = self#expression_() in
      self#eat TOKEN_THEN "expected THEN";
      let ex2 = self#expression_() in
      self#eat TOKEN_ELSE "expected ELSE";
      let ex3 = self#expression_() in
      IF (ex1, ex2, ex3))
    else if (self#isMatch [TOKEN_FUNC]) then
      (self#eat TOKEN_IDENTIFIER "expected identifier";
      let x = (self#previous())#get_lexeme() in
      let expr = self#expression_() in
      FUNC (x, expr))
    else raise (Failure "expected an expression")

  
  method advance():token = current <- (current+1); tokens.(current-1)
  method peek():token = tokens.(current)
  method previous():token = tokens.(current-1)
  method isAtEnd():bool = ((self#peek())#get_type() = TOKEN_EOF)
  method check (typ:token_type):bool = if (self#isAtEnd()) then false else ((self#peek())#get_type() = typ)
  method eat (expected:token_type) (err_msg:string):unit = 
    if (self#check (expected)) then (current <- (current+1))
    else raise (Failure err_msg)
  method isMatch (expected: token_type list): bool =
    match expected with
    | [] -> false
    | head::tail -> 
      if self#check(head) then (current <- (current+1); true)
      else (self#isMatch tail)
  
  method binary_to_exp (left:expression) (op:token) (right:expression):expression =
    match (op#get_type()) with
    | TOKEN_PLUS -> ADDITION (left, right)
    | TOKEN_MINUS -> SUBTRACTION (left, right)
    | TOKEN_SLASH -> DIVISION (left, right)
    | TOKEN_STAR -> MULTIPLICATION (left, right)
    | TOKEN_EQUAL_EQUAL -> EQUAL (left, right)
    | TOKEN_TILDE_EQUAL -> NOT_EQUAL (left, right)
    | TOKEN_GREATER -> GREATER (left, right)
    | TOKEN_GREATER_EQUAL -> GREATER_EQUAL (left, right)
    | TOKEN_LESS -> LESS (left, right)
    | TOKEN_LESS_EQUAL -> LESS_EQUAL (left, right)
    | TOKEN_AND -> AND (left, right)
    | TOKEN_OR -> OR (left, right)
    | TOKEN_ATSIGN -> APPEND (left, right)
    | TOKEN_COLON_COLON -> CONS (left, right)
    | TOKEN_COLON_EQUAL -> SETREF (left, right)
    | TOKEN_SEMICOLON -> SEQ (left, right)
    | _ -> raise (Failure "operation of token is non-binary")
  
  method unary_to_exp (op:token) (right:expression):expression =
    match (op#get_type()) with
    | TOKEN_BANG -> DEREF (right)
    | TOKEN_TILDE -> NOT (right)
    | TOKEN_MINUS -> SUBTRACTION (NUM 0.0, right)
    | TOKEN_REF -> NEWREF (right)
    | TOKEN_HEAD -> HEAD (right)
    | TOKEN_TAIL -> TAIL (right)
    | TOKEN_ISZERO -> ISZERO (right)
    | TOKEN_ISNIL -> ISNIL (right)
    | TOKEN_PRINT -> PRINT (right)
    | _ -> raise (Failure "operation of token is non-unary")
end

(*interpreter*)
let extend_env ((x:var), (v:value)) (en:env): env = (x, v)::en
let rec apply_env (x:var) (en:env): value =
  match en with
  | [] -> raise (Failure (x ^ " is not found"))
  | ((y:var), (v:value))::tail -> if x = y then v else apply_env x tail

let extend_mem ((l:loc), (v:value)) (m:mem): mem = (l, v)::m
let rec apply_mem (l:loc) (m: mem): value =
  match m with
  | [] -> raise (Failure (string_of_int(l) ^ " is not found"))
  | ((y:loc), (v:value))::tail -> if l = y then v else apply_mem l tail


let counter = ref 0
let new_location () = counter:=!counter+1;!counter

let rec eval (ex:expression) (en:env) (me:mem):value*mem =
  match ex with
  | UNIT -> (Unit, me)
  | TRUE -> (Bool true, me)
  | FALSE -> (Bool false, me)
  | NUM (n:float) -> (Number n, me)
  | STRING (s:string) -> (Stringv s, me)
  | VAR (x:var) -> (apply_env x en, me)
  | ADDITION ((ex0:expression), (ex1:expression)) -> 
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Number n0, Number n1) -> (Number (n0+.n1), m2)
    | (Stringv s0, Stringv s1) -> (Stringv (s0^s1), m2)
    | _ -> raise (Failure "Type Error (ADDITION only accepts Int * Int)")
    )
  | SUBTRACTION ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0,v1) with
    | (Number n0, Number n1) -> (Number (n0-.n1), m2)
    | _ -> raise (Failure "Type Error (SUBTRACTION only accepts Int * Int)")
    )
  | MULTIPLICATION ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0,v1) with
    | (Number n0, Number n1) -> (Number (n0*.n1), m2)
    | _ -> raise (Failure "Type Error (MULTIPLICATION only accepts Int * Int)")
    )
  | DIVISION ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0,v1) with
    | (Number n0, Number n1) -> if n1 <> 0.0 then (Number (n0/.n1), m2) else raise (Failure "Division by zero")
    | _ -> raise (Failure "Type Error (DIVISION only accepts Int * Int)")
    )
  | EQUAL ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Bool b0, Bool b1) -> (Bool (b0 = b1), m2)
    | (Number n0, Number n1) -> (Bool (n0 = n1), m2)
    | (Stringv s0, Stringv s1) -> (Bool (s0 = s1), m2)
    | (List l0, List l1) -> (Bool (List.equal (fun a b -> 
      (match (a, b) with
      | (Bool b0, Bool b1) -> b0=b1
      | (Number n0, Number n1) -> n0=n1
      | _ -> raise (Failure "Type error (EQUAL only accepts Int or Bool)")
      )
      ) l0 l1), m2)
    | _ -> raise (Failure "Type error (EQUAL only accepts Int or Bool)")
    )
  | NOT_EQUAL ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Bool b0, Bool b1) -> (Bool (b0 <> b1), m2)
    | (Number n0, Number n1) -> (Bool (n0 <> n1), m2)
    | (Stringv s0, Stringv s1) -> (Bool (s0 <> s1), m2)
    | (List l0, List l1) -> (Bool (List.equal (fun a b -> 
      (match (a, b) with
      | (Bool b0, Bool b1) -> b0<>b1
      | (Number n0, Number n1) -> n0<>n1
      | _ -> raise (Failure "Type error (EQUAL only accepts Int or Bool)")
      )
      ) l0 l1), m2)
    | _ -> raise (Failure "Type error (EQUAL only accepts Int or Bool)"))
  | LESS ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Number n0, Number n1) -> (Bool (n0 < n1), m2)
    | _ -> raise (Failure "Type error (LESS only accepts Int)")
    )
  | LESS_EQUAL ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Number n0, Number n1) -> (Bool (n0 <= n1), m2)
    | _ -> raise (Failure "Type error (LESS_EQUAL only accepts Int)")
    )
  | GREATER ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Number n0, Number n1) -> (Bool (n0 > n1), m2)
    | _ -> raise (Failure "Type error (GREATER only accepts Int"))
  | GREATER_EQUAL ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    let (v1, m2) = eval ex1 en m1 in
    (match (v0, v1) with
    | (Number n0, Number n1) -> (Bool (n0 >= n1), m2)
    | _ -> raise (Failure "Type error (GREATER_EQUAL only accepts Int)")
    )
  | AND ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    (match v0 with
    | Bool false -> (Bool false, m1)
    | Bool true ->
      let (v1, m2) = eval ex1 en m1 in
      (match v1 with
      | Bool true -> (Bool true, m2)
      | Bool false -> (Bool false, m2)
      | _ -> raise (Failure "Type error (AND only accepts Bool)")
      )
    | _ -> raise (Failure "Type error (AND only accepts Bool)")
    )
  | OR ((ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    (match v0 with
    | Bool true -> (Bool true, m1)
    | Bool false ->
      let (v1, m2) = eval ex1 en m1 in
      (match v1 with
      | Bool true -> (Bool true, m2)
      | Bool false -> (Bool false, m2)
      | _ -> raise (Failure "Type error (OR only accepts Bool)")
      )
    | _ -> raise (Failure "Type error (OR only accepts Bool)")
    )
  | NOT ex -> 
    let (v, m1) = eval ex en me in
    (match v with
    | Bool b -> (Bool (not b), m1)
    | _ -> raise (Failure "Type error (NOT only accepts Bool)")
    )
  | NIL -> (List [], me)
  | CONS (ex0, ex1) ->
    let (v, m1) = eval ex0 en me in
    let (s, m2) = eval ex1 en m1 in
    (match s with
    | List l -> (List (v::l), m2)
    | _ -> raise (Failure "Type error (CONS only accepts a' * a' list)")
    )
  | APPEND (ex0, ex1) ->
    let (s0, m1) = eval ex0 en me in
    let (s1, m2) = eval ex1 en m1 in
    (match (s0, s1) with
    | (List l0, List l1) -> (List (l0@l1), m2)
    | _ -> raise (Failure "Type error (CONS only accepts a' list * a' list)")
    )
  | HEAD (ex:expression) ->
    let (s, m1) = eval ex en me in
    (match s with
    | List l0 -> 
      (match l0 with
      | [] -> (List [], m1)
      | head::tail -> (head, m1)
      )
    | _ -> raise (Failure "Type error (HEADS only accepts a' list)")
    )
  | TAIL (ex:expression) ->
    let (s, m1) = eval ex en me in
    (match s with
    | List l0 ->
      (match l0 with
      | [] -> (List [], m1)
      | head::tail -> (List tail, m1)
      )
    | _ -> raise (Failure "Type error (TAIL only accepts a' list)")
    )
  | LET ((x:var), (ex0:expression), (ex1:expression)) ->
    let (v0, m1) = eval ex0 en me in
    eval ex1 (extend_env (x, v0) en) m1
  | LETREC (f, x, ex0, ex1) ->
    (eval ex1 (extend_env (f, RecProcedure(f, x, ex0, en)) en) me)
  | LETMREC ((f, x, ex0), (g, y, ex1), ex) ->
    let en0 = (extend_env (f, MRecProcedure (f, x, ex0, g, y, ex1, en)) en) in
    let en1 = (extend_env (g, MRecProcedure (g, y, ex1, f, x, ex0, en)) en0) in
    (eval ex en1 me)
  | ISZERO (ex:expression) ->
    let (v, m1) = eval ex en me in
    (match v with
    | Number 0.0 -> (Bool true, m1)
    | _ -> (Bool false, m1)
    )
  | ISNIL (ex:expression) ->
    let (v, m1) = eval ex en me in
    (match v with
    | List [] -> (Bool true, m1)
    | _ -> (Bool false, m1)
    )
  | IF ((ex0:expression), (ex1:expression), (ex2:expression)) ->
    let (v0, m1) = eval ex0 en me in
    (match v0 with
    | Bool true -> eval ex1 en m1
    | Number n when n <> 0.0 -> eval ex1 en m1
    | _ -> eval ex2 en m1
    )
  | FUNC ((x:var), (ex:expression)) -> (Procedure (x, ex, en), me)
  | CALL ((caller:expression), (arg:expression)) ->
    let (closure, m1) = (eval caller en me) in
    (match closure with
    | Procedure (x, expr, en0) ->
      let (v, m2) = (eval arg en m1) in
      eval expr (extend_env (x, v) en0) m2
    | RecProcedure (f, x, expr, en0) ->
      let (v, m2) = eval arg en m1 in
      let en1 = (extend_env (x, v) en0) in
      let en2 = (extend_env (f, RecProcedure(f, x, expr, en0)) en1) in 
      eval expr en2 m2
    | MRecProcedure (f, x, exf, g, y, exg, en0) ->
      let (v, m2) = (eval arg en m1) in
      let en1 = (extend_env (x, v) en0) in
      let en2 = (extend_env (f, MRecProcedure (f, x, exf, g, y, exg, en0)) en1) in
      let en3 = (extend_env (g, MRecProcedure (g, y, exg, f, x, exf, en0)) en2) in
      eval exf en3 m2
    | _ -> raise (Failure "Type error")
    )
  | PRINT ex -> 
    let (v, m1) = eval ex en me in
    (match v with
    | Unit -> print_string "Unit"
    | Bool b -> print_string (string_of_bool b)
    | Number n -> print_string (string_of_float n)
    | Stringv s -> print_string s
    | List l -> 
      print_char '['; 
      List.iter (fun x -> match x with 
      | Bool b -> print_string (string_of_bool b); print_char ';'
      | Number n -> Printf.printf "%g" n; print_char ';'
      | _ -> print_string "undefined;") l;
      print_char ']';
    | _ -> print_string "unprintable"
    );
    print_newline ();
    (Unit, m1)
  | SEQ (ex0, ex1) ->
    let (v, m1) = eval ex0 en me in
    eval ex1 en m1
  | NEWREF ex ->
    let (v, m1) = eval ex en me in
    let l = new_location () in (Loc l, (extend_mem (l, v) m1))
  | DEREF ex ->
    let (v, m1) = eval ex en me in
    (match v with
    | Loc l -> ((apply_mem l m1), m1)
    | _ -> raise (Failure "Type error (DEREF only accepts Loc)")
    )
  | SETREF (ex0, ex1) ->
    let (v0, m1) = eval ex0 en me in
    (match v0 with
    | Loc l ->
      let (v1, m2) = eval ex1 en m1 in
      (v1, (extend_mem (l, v1) m2))
    | _ -> raise (Failure "Type error (SETREF only accepts Loc * a')")
    )

let print_value (v:value): unit =
  match v with
  | Unit -> Printf.printf("Unit")
  | Number n -> Printf.printf "Int(%g)" n
  | Bool b -> Printf.printf "Bool(%s)" (string_of_bool b)
  | Stringv s -> Printf.printf {|String("%s")|} s
  | Procedure (x, expr, en) -> Printf.printf "Procedure (%s, exp, en)" x
  | RecProcedure (f, x, expr, en) -> Printf.printf "RecProcedure (%s, %s, exp, en)" f x
  | List l -> 
    print_char '['; 
      List.iter (fun x -> match x with 
      | Bool b -> Printf.printf "Bool(%s);" (string_of_bool b)
      | Number n -> Printf.printf "Int(%g);" n
      | Stringv s -> Printf.printf {|String("%s");|} s
      | Unit -> Printf.printf("Unit;")
      | _ -> print_string "undefined;") l;
      print_char ']';
  | _ -> Printf.printf ("undefined")

let empty_env: env = []
let empty_mem: mem = []
let run (program:expression): value*mem =
  eval program empty_env empty_mem

let get_value vm = let (v, _) = vm in v

let () = 
  if Array.length (Sys.argv) < 2 || Array.length (Sys.argv) > 2 then
    raise (Failure "usage: ocaml ml2.ml [src]")
  else
  let file = open_in Sys.argv.(1) in
  let src = In_channel.input_all file in
  let tokenizer = new scanner src in
  tokenizer#scanTokens();
  let parser_ = new parser (tokenizer#get_tokens()) in
  let e = parser_#parse() in

  print_value (get_value (run e));
  print_newline();
