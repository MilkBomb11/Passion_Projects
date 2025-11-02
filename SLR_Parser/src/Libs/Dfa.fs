module Dfa

open Cfg
exception Error of string

type item = production
type state = Set<item>
type edge = int * symbol * int
type t = { nodes:Map<int,state>; rnodes:Map<state,int>; edges:Set<edge> }

let mutable state_num = -1
let new_state_num () = state_num <- state_num + 1; state_num

let try_get_symbol_after_dot (item:item) : symbol option =
    let rec helper (sl:symbol list) : symbol option =
        match sl with
        | [] -> raise (Error (sprintf "item %+A does not have a dot.\n" item))
        | head::tail when head = Dot -> List.tryHead tail
        | _::tail -> helper tail
    let _, rhs = item
    helper rhs
let create_item ((lhs, rhs):production) : item = 
    if rhs=[Epsilon] then lhs, [Dot] 
    else lhs, Dot::rhs

let move (item:item) : item =
    let rec helper (sl:symbol list) (acc:symbol list) : symbol list =
        match sl with
        | [] -> raise (Error (sprintf "item %+A does not have a dot.\n" item))
        | head::tail when head = Dot ->
            match tail with
            | [] -> acc @ [head]
            | s::t -> acc @ [s] @ Dot::t
        | head::tail -> helper tail (acc @ [head])
    let lhs, rhs = item
    lhs, helper rhs []

let closure (state:state) (cfg:Cfg.t) : state =
    let mutable state' = state
    let mutable change = true
    while change do
        change <- false
        let old_state = state'
        state' |> Set.iter (
            fun item ->
                let x = try_get_symbol_after_dot item
                let new_items = 
                    match x with
                    | Some s -> get_productions_of s cfg |> List.map (fun p -> create_item p)
                    | None -> []
                state' <- Set.union state' (Set.ofList new_items)
        )
        if state' <> old_state then change <- true
    state'

let next (state:state) (x:symbol) (cfg:Cfg.t) : state =
    let new_state = 
        state |> Set.filter (
            fun item ->
                let y_opt = try_get_symbol_after_dot item
                match y_opt with
                | Some y -> x = y
                | None -> false
        ) |> Set.map (fun item -> move item)
    closure new_state cfg

let construct_dfa (cfg:Cfg.t) : t =
    let state0 = closure (Set.singleton (get_production 0 cfg |> create_item)) cfg
    state_num <- -1
    let sn = new_state_num ()
    let mutable nodes:Map<int,state> = Map.empty |> Map.add sn state0
    let mutable rnodes:Map<state,int> = Map.empty |> Map.add state0 sn
    let mutable edges:Set<edge> = Set.empty

    let mutable change = true
    while change do
        change <- false
        let old_nodes = nodes
        let old_edges = edges
        nodes |> Map.iter (
        fun state_index state ->
            state |> Set.iter (
                fun item ->
                    let x_opt = try_get_symbol_after_dot item
                    match x_opt with
                    | Some x ->
                        let state' = next state x cfg
                        match Map.tryFind state' rnodes with
                        | Some state_index' ->  edges <- Set.add (state_index, x, state_index') edges
                        | None ->
                            let state_index' = new_state_num ()
                            nodes <- Map.add state_index' state'  nodes
                            rnodes <- Map.add state' state_index' rnodes
                            edges <- Set.add (state_index, x, state_index') edges
                    | None -> ()
            )
        )
        if old_nodes <> nodes || old_edges <> edges then change <- true
    {nodes=nodes;rnodes=rnodes;edges=edges}


    

let string_of_state (state:state) : string =
    let l = Set.toList state
    let rec helper (l:item list) (acc:string) : string =
        match l with
        | [] -> acc
        | p::tail -> helper tail (sprintf "%s%s\n" acc (string_of_production p))
    sprintf "{\n%s}\n" (helper l "")

let string_of_edge (edge:edge) : string =
    let a, b, c = edge
    sprintf "%d -%s-> %d" a (string_of_symbol b) c

let string_of_dfa (dfa:t) : string =
    let l_nodes = Map.toList dfa.nodes
    let rec helper (l:(int*state) list) (acc:string) : string =
        match l with
        | [] -> acc
        | (state_num, state)::tail -> helper tail (sprintf "%s%d\n%s\n" acc state_num (string_of_state state))
    let l_edges = Set.toList dfa.edges
    let rec helper2 (l:edge list) (acc:string) : string =
        match l with
        | [] -> acc
        | e::tail -> helper2 tail (sprintf "%s%s\n" acc (string_of_edge e)) 
    sprintf "NODES\n%sEDGES\n%s" (helper l_nodes "") (helper2 l_edges "")
    
