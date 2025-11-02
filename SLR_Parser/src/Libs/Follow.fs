module Follow

open Cfg
open First

exception Error of string

type t = Map<symbol,Set<symbol>>

let get_follow_of_symbol (s:symbol) (follow:t) : Set<symbol> =
    match Map.tryFind s follow with
    | Some f -> f
    | None -> Set.empty

let splice (n:int) (sl:symbol list) : (symbol list) * symbol * (symbol list) =
    let rec helper (i:int) (acc:symbol list) (sl:symbol list)  =
        match sl with
        | [] -> raise (Error (sprintf "spliced out of bound: %d\n" i))
        | head::tail ->
            if i = n then acc, head, tail
            else helper (i+1) (acc @ [head]) tail
    helper 0 [] sl

let construct_follow ((start_symbol,cfg):Cfg.t) : t =
    let first = construct_first (start_symbol, cfg)
    
    let mutable follow:t = Map.add start_symbol (Set.singleton (T "$")) Map.empty
    let mutable change:bool = true
    while change do
        change <- false
        let old_follow = follow
        cfg |> List.iter (
            fun (lhs, rhs) ->
                let len = List.length rhs
                for i = 0 to len-1 do
                    let _, center, right = splice i rhs
                    match center with
                    | N _ ->
                        let fi_right = get_first_of right first
                        let fo_center_old = get_follow_of_symbol center follow
                        follow <- follow |>
                        Map.add center  (Set.union fo_center_old (Set.difference fi_right (Set.singleton Epsilon)))
                        if fi_right |> Set.exists (fun s -> s = Epsilon) then
                            let fo_center_old' = get_follow_of_symbol center follow
                            follow <- follow |>
                            Map.add center (Set.union fo_center_old' (get_follow_of_symbol lhs follow))
                    | _ -> ()
        )
        if old_follow <> follow then change <- true
    follow

let string_of_follow (follow:t) : string =
    let l: (symbol * Set<symbol>) list = Map.toList follow
    let rec helper (l:(symbol * Set<symbol>) list) (acc:string) : string =
        match l with
        | [] -> acc
        | (k, v)::tail -> helper tail (sprintf "%s%+A -> %+A\n" acc k (Set.toArray v))
    helper l ""

