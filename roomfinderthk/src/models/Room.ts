export interface Room {
    id: String;
    name: String;
    etage: number;
    //Referenz auf Campus
    campus: String;
    //Referenz auf Gebaeude
    gebaeude: String;
    //Referenz auf CheckIns
    checkIns: String;
} 