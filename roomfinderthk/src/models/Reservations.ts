export interface Reservierung {

    beginn: Date;
    ende: Date;
    inRaum: string;
    bezeichnung: string;
    //Referenz auf Prof
    vonProf: string;
}