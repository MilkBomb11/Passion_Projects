class Polypeptide
{
    constructor(nSequence, y)
    {
        this.nSequence = nSequence;
        this.codons = [];
        this.peptidesStr = [];
        this.peptides = [];

        this.x = 0;
        this.y = y;

        for (let i = 0; i < Math.floor(this.nSequence.length/3); i++)
        {
            let codon = "";
            for (let j = 0; j < 3; j++)
            {
                codon = codon.concat(this.nSequence[i*3 + j]);
            }
            this.codons.push(codon);
        }

        for (let i = 0; i < this.codons.length; i++)
        {
            for (let j = 0; j < codonTable.length; j++)
            {
                for (let k = 0; k < codonTable[j].length; k++)
                {
                    if (codonTable[j][k] === this.codons[i])
                    {
                        this.peptidesStr[i] = aminoAcids[j];
                        break;
                    }
                }
            }
        }

        this.baseWidth = winW/this.codons.length;
        
        for (let i = 0; i < this.peptidesStr.length; i++)
        {
            this.peptides[i] = new Peptide(this.peptidesStr[i], this.x + i*this.baseWidth, this.y, this.baseWidth, 150);
        }
    }

    update()
    {
        this.baseWidth = winW/this.codons.length;
        for (let i = 0; i < this.peptidesStr.length; i++)
        {
            this.peptides[i] = new Peptide(this.peptidesStr[i], this.x + i*this.baseWidth, this.y, this.baseWidth, 100);
        }
    }


    draw()
    {
        for (let i = 0; i < this.peptides.length; i++)
        {
            this.peptides[i].draw();
        }
    }
}