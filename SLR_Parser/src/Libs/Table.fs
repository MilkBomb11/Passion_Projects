module Table

open Cfg
open Follow
open Dfa

exception Error of string

type action =
| S of int
| G of int
| R of int
| Acc

type t = Map<int, Map<symbol, action>>

let add_action (sn:int) (symbol:symbol) (action:action) (table:t) : t =
    let row: Map<symbol,action> = 
        match Map.tryFind sn table with
        | Some r -> r
        | None -> Map.empty
    let row' = Map.add symbol action row
    Map.add sn row' table

let try_get_action (sn:int) (symbol:symbol) (table:t) : action option =
    match Map.tryFind sn table with
    | Some row -> Map.tryFind symbol row
    | None -> None

let item_to_production ((lhs, rhs):item) : production =
    let rec helper (sl:symbol list) (acc:symbol list) : symbol list =
        match sl with
        | [] -> acc
        | head::tail -> 
            if head <> Dot then helper tail (acc @ [head])
            else helper tail acc
    let rhs' = helper rhs []
    if rhs' = [] then lhs, [Epsilon]
    else lhs, rhs'

let get_reducable_rules (state:state) : Set<production> =
    let get_reducable_items (state:state) : Set<item> =
        state |> Set.filter (
        fun item -> 
            match try_get_symbol_after_dot item with
            | Some _ -> false
            | None -> true
        )
    get_reducable_items state |> Set.map item_to_production

let construct_table (cfg:Cfg.t) : t =
    let follow:Follow.t = construct_follow cfg
    let dfa:Dfa.t = construct_dfa cfg

    let mutable table:t = Map.empty
    let edges = dfa.edges
    let nodes = dfa.nodes
    edges |> Set.iter (
        fun (state, symbol, state') ->
            let action = 
                match symbol with 
                | N _ -> G state'
                | T _ -> S state'
                | s -> raise (Error (sprintf "Expected a terminal or nonterminal but got %s.\n" (string_of_symbol s)))
            table <- add_action state symbol action table
    )
    nodes |> Map.iter (
        fun sn state ->
            let reducable_rules = get_reducable_rules state
            reducable_rules |> Set.iter (
                fun (lhs, rhs) ->
                    let rn = 
                        match try_find_production_num (lhs, rhs) cfg with
                        | Some r -> r
                        | None -> raise (Error (sprintf "production %s doesn't exist.\n" (string_of_production (lhs, rhs))))
                    let follow_lhs = get_follow_of_symbol lhs follow
                    follow_lhs |> Set.iter (
                        let action = if rn = 0 then Acc else R rn
                        fun x -> table <- add_action sn x action table
                    )
            )
    )
    table

let string_of_action (action:action) : string =
    match action with
    | S n -> sprintf "s%d" n
    | G n -> sprintf "g%d" n
    | R n -> sprintf "r%d" n
    | Acc -> "acc"

let string_of_table (table:t) (cfg:Cfg.t) : string =
    let mutable str = "     "
    let states = Map.keys table |> Seq.toList
    let symbols = (get_terminals cfg |> Set.toList) @ [T "$"] @ (get_nonterminals cfg |> Set.toList)
    symbols |> List.iter (
        fun symbol ->
            str <- sprintf "%s%5s" str (string_of_symbol symbol)
    )
    str <- sprintf "%s\n" str

    states |> List.iter (
        fun sn ->
            str <- sprintf "%s%5d" str sn
            symbols |> List.iter (
                fun symbol ->
                    let action_opt = try_get_action sn symbol table
                    match action_opt with
                    | Some action -> str <- sprintf "%s%5s" str (string_of_action action)
                    | None -> str <- sprintf "%s%5s" str ""
            )
            str <- sprintf "%s\n" str
    )
    str
