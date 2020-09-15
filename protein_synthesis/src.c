#include <stdio.h>
#include <stdlib.h>

char* transcript(int length, char* dna);
char* codonToAmino(char* codon);
char** translate(int length, char* rna);
int stringCheck(char* a, char* b);

char aminoAcids[21][4] = {"ala", "arg", "asp", "ast", "cys", "glu", "gln", "gly", "his", "iso", "leu", "lys", "met", "phe", "pro", "ser", "end", "thr", "try", "tyr", "val"};
char codons[21][6][4] = {
    {"GCU", "GCC", "GCA", "GCG", "nnn", "nnn"}, //ala
    {"CGU", "CGC", "CGA", "CGG", "AGA", "AGG"}, //arg
    {"AAU", "AAC", "nnn", "nnn", "nnn", "nnn"}, //asp
    {"GAU", "GAC", "nnn", "nnn", "nnn", "nnn"}, //ast
    {"UGU", "UGC", "nnn", "nnn", "nnn", "nnn"}, //cys
    {"GAA", "GAG", "nnn", "nnn", "nnn", "nnn"}, //glu
    {"CAA", "CAG", "nnn", "nnn", "nnn", "nnn"}, //gln
    {"GGU", "GGC", "GGA", "GGG", "nnn", "nnn"}, //gly
    {"CAU", "CAC", "nnn", "nnn", "nnn", "nnn"}, //his
    {"AUU", "AUC", "AUA", "nnn", "nnn", "nnn"}, //iso
    {"UUA", "UUG", "CUU", "CUC", "CUA", "CUG"}, //leu
    {"AAA", "AAG", "nnn", "nnn", "nnn", "nnn"}, //lys
    {"AUG", "nnn", "nnn", "nnn", "nnn", "nnn"}, //met
    {"UUU", "UUC", "nnn", "nnn", "nnn", "nnn"}, // phe
    {"CCU", "CCC", "CCA", "CCG", "nnn", "nnn"}, //pro
    {"UCU", "UCC", "UCA", "UCG", "AGU", "AGC"}, //ser
    {"UAA", "UAG", "UGA", "nnn", "nnn", "nnn"}, //end
    {"ACU", "ACC", "ACA", "ACG", "nnn", "nnn"}, //thr
    {"UGG", "nnn", "nnn", "nnn", "nnn", "nnn"}, //try
    {"UAU", "UAC", "nnn", "nnn", "nnn", "nnn"}, //tyr
    {"GUU", "GUC", "GUA", "GUG", "nnn", "nnn"} //val
};

int main()
{
    int length;
    scanf("%d", &length);
    char* inp = (char*)malloc(length*sizeof(char));
    scanf("%s", inp);

    char* rna = transcript(length, inp);
    printf("%s\n", rna);

    char** protein = translate(length, rna);
    for (int i = 0; i < length/3; i++)
    {
        printf("%s ", protein[i]);
    }
    free(rna);
    free(protein);
    return 0;
}

char* transcript(int length, char* dna)
{
    char* rna = (char*)malloc((length+1)*sizeof(char));
    for (int i = 0; i < length; i++)
    {
        if (dna[i] == 'A')
            rna[i] = 'U';
        else if (dna[i] == 'T')
            rna[i] = 'A';
        else if (dna[i] == 'G')
            rna[i] = 'C';
        else if (dna[i] == 'C')
            rna[i] = 'G';
        else
            rna[i] = 'N';
    }
    rna[length] = '\0';
    return rna;
}

char* codonToAmino(char* codon)
{
    for (int i = 0; i < 21; i++)
    {
        for (int j = 0; j < 6; j++)
        {
            if (stringCheck(codon, codons[i][j]))
            {
                return aminoAcids[i];
            }
        }
    }
    return "nnn";
}

char** translate(int length, char* rna)
{
    char* aminoProto = (char*)malloc(4*sizeof(char));
    char** protein = (char**)malloc((length/3)*sizeof(aminoProto));
    for (int i = 0; i < length/3; i++)
    {
        char* codon = (char*)malloc(4*sizeof(char));
        for (int j = 0; j < 3; j++)
        {
            codon[j] = rna[i*3+j];
        }

        char* amino = (char*)malloc(4*sizeof(char));
        amino = codonToAmino(codon);

        //printf("%s\n", amino);
        protein[i] = amino;
    }
    return protein;
}

int stringCheck(char a[], char b[])
{
    for (int i = 0; i < 3; i++)
    {
        if (a[i] != b[i])
        {
            return 0;
        }
    }
    return 1;
}
