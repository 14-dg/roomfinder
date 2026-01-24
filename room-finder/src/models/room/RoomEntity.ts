export interface RoomEntity {
id: string;                     //Die ID des Raums
label: string                   //Der "Name" des Raums
floor: number;                  //Die Etage, auf der sich der Raum befindet
type_id: string;             	//Einer der in RoomCategory definierten Typen von Raeumen
seats: number;                  //Die Anzahl der Sitzplätze des Raums
created_at: string              //Wann das Objekt in der Datenbank erstellt wurde
}
