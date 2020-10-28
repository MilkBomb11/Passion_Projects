class Peptide
{
    constructor(type, x, y, width, height)
    {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw()
    {
        strokeWeight(1);
        stroke(0);

        switch (this.type) {
            case "Phe":
                fill(186, 15, 15); // dark red Phenylalanine
                break;
            case "Leu":
                fill(235, 64, 52); // red Leucine
                break;
            case "Ile":
                fill(227, 79, 79); // light red Isoleucine
                break;
            
            case "Met":
                fill(207, 101, 21); // dark orange Methionine
                break;
            case "Val":
                fill(235, 131, 52); // orange Valine
                break;
            case "Ser":
                fill(227, 173, 79); // light orange Serine
                break;
            
            case "Pro":
                fill(212, 177, 25); // dark yellow Proline
                break;
            case "Thr":
                fill(235, 201, 52); // yellow Threonine
                break;
            case "Ala":
                fill(235, 208, 94); // light yellow Alanine
                break;
            
            case "Tyr":
                fill(199, 235, 117); // light lime Tyrosine
                break;
            case "His":
                fill(180, 235, 52); // lime Histidine
                break;
            case "Gln":
                fill(127, 158, 57); // dark lime Glutamine
                break;

            case "Asn":
                fill(52, 235, 98); // green Asparagine
                break;
            case "Lys":
                fill(52, 235, 223); // sky Lysine
                break;
            case "Asp":
                fill(52, 147, 235); // light blue Aspartic acid
                break;
            case "Glu":
                fill(52, 61, 235); // blue Glutamic acid
                break;
            case "Cys":
                fill(118, 50, 237); // purple Cysteine
                break;
            case "Trp":
                fill(158, 46, 232); // violet Tryptophan
                break;
            case "Arg":
                fill(219, 42, 235); // dark pink Arginine
                break;
            case "Gly":
                fill(122, 20, 133); // dark purple Glycine
                break;
            case "Stop":
                fill(163); // grey Stop
                break;
            default:
                fill(255);
                break;
        }
        rect(this.x, this.y, this.width, this.height);

        fill(255, 255, 255);
        noStroke();
        textSize(constrain(this.width/4, 5, 50));
        text(this.type, this.x+this.width/2 - this.width/2/3, this.y+this.height/2);
    }
}