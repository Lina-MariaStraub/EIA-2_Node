namespace L06_Interfaces { // Struktur des heterogenen assoziativen Arrays als Datensatz für eine studierende Person
    export interface Studi {
        name: string;
        firstname: string;
        matrikel: number;
        age: number;
        gender: boolean;
        studiengang: string;
    }
    // Struktur des homogenen assoziativen Arrays, bei dem ein Datensatz der Matrikelnummer zugeordnet ist
    //Export, damit die andere Datei vom anderen Bescheid weiß
    export interface Studis { 
         [matrikel: string]: Studi;//Matrieln werden abgespeichert, Datentyp sind nur Studenten, homogen, da nur ein Datentyp  da ist, assoziatives Array
    }
    export let studiSimpleArray: Studi[] = [];// Simples Array zum Speichern der Studi-Datensätze (nur zur Demonstration)
    export let studiHomoAssoc: Studis = {};// Homogenes assoziatives Array zur Speicherung einer Person unter der Matrikelnummer
}