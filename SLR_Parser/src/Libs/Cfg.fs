module Cfg

open System

exception Error of string

type symbol =
| T of string
| N of string
| Epsilon
| Dot

type production = symbol * (symbol list)

type t = symbol * production list
let get_production (n:int) ((_,cfg):t) : production =
    let rec helper (i:int) (cfg:production list) : production =
        match cfg with
        | head::_ when i = n -> head
        | _::tail when i <> n -> helper (i+1) tail
        | [] | _ -> raise (Error (sprintf "Cannot find rule #%d.\n" n))
    helper 0 cfg 
let get_lhs_of_prod ((lhs, _):production) : symbol = lhs
let get_rhs_of_prod ((_, rhs):production) : symbol list = rhs

let get_productions_of (s:symbol) ((_,cfg):t) : production list =
    cfg |> List.filter (fun (lhs, _) -> lhs = s)

let string_of_symbol (s:symbol) : string =
    match s with
    | T x | N x -> x
    | Epsilon -> "[EPS]"
    | Dot -> "."

let string_of_production ((lhs,rhs):production) : string =
    let rec helper (rhs:symbol list) (acc:string) : string =
        match rhs with
        | [] -> acc
        | s::tail -> helper tail (sprintf "%s%s" acc (string_of_symbol s))
    sprintf "%s -> %s" (string_of_symbol lhs) (helper rhs "")

let get_terminals ((_,cfg):t) : Set<symbol> =
    let rec helper (sl:production list) (acc:Set<symbol>) : Set<symbol> =
        match sl with
        | [] -> acc
        | (_, rhs)::tail -> 
            let a = rhs |> List.filter (fun s -> match s with T _ -> true | _ -> false) |> Set.ofList
            helper tail (Set.union acc a)
    helper cfg Set.empty

let get_nonterminals ((_,cfg):t) : Set<symbol> =
    let rec helper (sl:production list) (acc:Set<symbol>) : Set<symbol> =
        match sl with
        | [] -> acc
        | (lhs,rhs)::tail ->
            let a = rhs |> List.filter (fun s -> match s with N _ -> true | _ -> false) |> Set.ofList
            helper tail (Set.add lhs (Set.union acc a))
    helper cfg Set.empty
let try_find_production_num (p:production) ((_,cfg):t) : int option =
    cfg |> List.tryFindIndex (fun x-> p = x)

let parse (source:string) : t =
    let lines = 
        source.Split("\n", StringSplitOptions.RemoveEmptyEntries ||| StringSplitOptions.TrimEntries)
        |> Array.toList
    let pairs = 
        lines |> List.map (fun s ->
            let arr = s.Split("->", StringSplitOptions.TrimEntries)
            let lhs = arr[0]
            let rhs = 
                arr[1].Split([|"\t";"\n";"\r";" "|], StringSplitOptions.RemoveEmptyEntries ||| StringSplitOptions.TrimEntries)
            lhs, rhs
        )
    let start_symbol = 
        match pairs with
        | [] -> raise (Error "Parse error.")
        | (lhs,_)::_ -> N lhs 
    
    let rec get_nonterminals (l:(string*string array) list) (acc:Set<string>) : Set<string> =
        match l with
        | [] -> acc
        | (lhs, _)::tail -> get_nonterminals tail (Set.add lhs acc )
    let nonterminals = get_nonterminals pairs Set.empty

    let rec iter (pairs:(string*string array) list) (acc:production list) : production list =
        match pairs with
        | [] -> acc
        | (lhs, rhs)::tail -> 
            let l = 
                rhs |> List.ofArray 
                    |> List.map (
                        fun s ->
                            if Set.contains s nonterminals then N s
                            else if s = "''" then Epsilon
                            else T s
                    )
            iter tail (acc @ [(N lhs, l)])
    start_symbol, iter pairs []
    