open System.IO
open Cfg
open Dfa
open Table

[<EntryPoint>]
let main args =
    let source = File.ReadAllText (args[0])
    let cfg = parse source
    let dfa = construct_dfa cfg
    printf "%s\n" (string_of_dfa dfa)
    let table = construct_table cfg
    printf "%s\n" (string_of_table table cfg)
    0
