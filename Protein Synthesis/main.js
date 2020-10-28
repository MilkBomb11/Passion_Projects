/**
 * polypeptide gets nSequenceStr -> string to array -> create peptide array 
 * -> create peptide object array -> draw
 */


let winW, winH, inp;
let inpVal = "";

let dna, rna;

let nucleicAcids = [new NucleicAcid("", 0), new NucleicAcid("", 150)];
let polypeptide = new Polypeptide([], 300);

let aminoAcids = ["Phe", "Leu", "Ile", "Met", "Val", "Ser", "Pro", "Thr", "Ala", "Tyr", "His", "Gln", "Asn", "Lys", "Asp", "Glu", "Cys", "Trp", "Arg", "Gly", "Stop"];

let codonTable = 
[
    ["UUU", "UUC"], // Phe
    ["UUA", "UUG", "CUU", "CUC", "CUA", "CUG"], // Leu
    ["AUU", "AUC", "AUA"], // Ile
    ["AUG"], // Met
    ["GUU", "GUC", "GUA", "GUG"], // Val
    ["UCU", "UCC", "UCA", "UCG", "AGU", "AGC"], // Ser
    ["CCU", "CCC", "CCA", "CCG"], // Pro
    ["ACU", "ACC", "ACA", "ACG"], // Thr
    ["GCU", "GCC", "GCA", "GCG"], // Ala
    ["UAU", "UAC"], // Tyr
    ["CAU", "CAC"], // His
    ["CAA", "CAG"], // Gln
    ["AAU", "AAC"], // Asn
    ["AAA", "AAG"], // Lys
    ["GAU", "GAC"], // Asp
    ["GAA", "GAG"], // Glu
    ["UGU", "UGC"], // Cys
    ["UGG"], // Trp
    ["CGU", "CGC", "CGA", "CGG", "AGA", "AGG"], // Arg
    ["GGU", "GGC", "GGA", "GGG"], // Gly
    ["UAA", "UAG", "UGA"] // Stop
];

function setup() {
    winW = windowWidth;
    winH = windowHeight;

    inp = createInput(inpVal);
    inp.id("inp");
    inp.elt.style.height = 50;
    inp.elt.style.fontSize = 20;
    inp.elt.style.paddingLeft = 10;

    //base = new Base("G", 50, 50, 30, 150);
    createCanvas(winW, winH);
}

function draw() {
    background(0);
    inp.position(10, winH-60);
    inp.elt.style.width = winW-20;
    
    for (let i = 0; i < nucleicAcids.length; i++)
    {
        nucleicAcids[i].update();
        nucleicAcids[i].draw();
    }

    polypeptide.update();
    polypeptide.draw();

}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    winW = windowWidth;
    winH = windowHeight;
}

function keyPressed()
{
    if (keyCode === 13) // when ENTER is pressed
    {
        inpVal = inp.value().trim().replace(/ /g, '').toUpperCase();
        nucleicAcids[0] = new NucleicAcid(inpVal, 0);
        nucleicAcids[1] = new NucleicAcid(nucleicAcids[0].transcript(), 150);
    }
    polypeptide = new Polypeptide(nucleicAcids[1].nSequence, 300);
}
