module First

open Cfg

type t = Map<symbol,Set<symbol>>

let get_first_of_symbol (s:symbol) (first:t) : Set<symbol> =
    match Map.tryFind s first with
    | Some f -> f
    | None -> Set.empty

let get_first_of (sl:symbol list) (first:t) : Set<symbol> =
    let rec helper (sl:symbol list) (acc:Set<symbol>) : Set<symbol> =
        match sl with
        | [] -> Set.add Epsilon acc
        | head::tail ->
            let fi_head = get_first_of_symbol head first
            if fi_head |> Set.exists (fun s -> s = Epsilon) then
                helper tail (Set.union acc (Set.difference fi_head (Set.singleton Epsilon)))
            else Set.union acc (Set.difference fi_head (Set.singleton Epsilon))
    helper sl Set.empty


let construct_first ((_,cfg):Cfg.t) : t = 
    let mutable first:t = Map.empty
    let mutable change = true
    while change do
        let old_first = first
        change <- false
        cfg |> List.iter (
            fun (_, rhs) -> 
                rhs |> List.iter (
                    fun s ->
                        match s with
                        | T(_) | Epsilon -> first <- Map.add s (Set.singleton s) first 
                        | _ -> ()
                )
        )
        cfg |> List.iter (
            fun (lhs, rhs) ->
                let fi_lhs = get_first_of rhs first
                let fi_lhs_original = get_first_of_symbol lhs first
                first <- Map.add lhs (Set.union fi_lhs_original fi_lhs) first
        )
        if old_first <> first then change <- true
    first

let string_of_first (first:t) : string =
    let l: (symbol * Set<symbol>) list = Map.toList first
    let rec helper (l:(symbol * Set<symbol>) list) (acc:string) : string =
        match l with
        | [] -> acc
        | (k, v)::tail -> helper tail (sprintf "%s%+A -> %+A\n" acc k (Set.toArray v))
    helper l ""