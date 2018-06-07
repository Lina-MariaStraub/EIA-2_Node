//Diese Aufgabe wurde in Gruppenarbeit erstellt
namespace L06_Interfaces {
    window.addEventListener( "load", init );

    let address: string = "https://eia2node257455.herokuapp.com/";
    function init( _event: Event ): void {
        console.log( "Init" );

        //Enventlistener auf Button übergeben
        let insertButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById( "insert" );
        let searchButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById( "search" );
        let refreshButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById( "refresh" );

        //Button für drei Bespieldatensätze
        let exampleButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById( "exampleData" );
        insertButton.addEventListener( "click", insert );

        //Wenn geklickt wird führe refreshStudents aus
        refreshButton.addEventListener( "click", refreshStudents );
        searchButton.addEventListener( "click", search );
        exampleButton.addEventListener( "click", exampleData )
    }


    //Drei Datensatzbeispiele
    function exampleData() {
        for ( let i = 0; i < 3; i++ ) {

            //Zugriff auf Interface
            let student: L06_Interfaces.Studi = {
                name: "Nachname " + i,
                firstname: "Jeff" + i,
                matrikel: Math.floor( Math.random() * 222222 ),
                age: Math.floor( Math.random() * 22 ),
                gender: !!Math.round( Math.random() ),
                studiengang: "OMB"
            }

            //Funktion sendDataToHost, Variable student wird übergeben
            sendDataToHost( "addStudent", student )
        }
    }


    //Funktion um Daten der Studenten zu speichern
    function insert( _event: Event ): void {
        let inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName( "input" );
        let genderButton: HTMLInputElement = <HTMLInputElement>document.getElementById( "male" );
        let matrikel: string = inputs[2].value;
        let studi: Studi;

        //Interface übergeben
        studi = {
            name: inputs[0].value,
            firstname: inputs[1].value,
            matrikel: parseInt( matrikel ),
            age: parseInt( inputs[3].value ),
            gender: genderButton.checked,
            studiengang: document.getElementsByTagName( "select" ).item( 0 ).value,
        };

        console.log( studi );
        console.log( studi.age );

        console.log( studi["age"] );

        // Datensatz im assoziativen Array unter der Matrikelnummer speichern
        studiHomoAssoc[matrikel] = studi;

        // nur um das auch noch zu zeigen...
        studiSimpleArray.push( studi );

        //Funktion sendDataToHost, Objekt studi wird übergeben
        //Methode addStudent
        sendDataToHost( "addStudent", studi );
    }

    //Serverfunktion refreshStudents wird ausgeführt
    //Funktion refreshStudents holt sich die Liste der ganzen Daten vom Server
    //Methode refreshStudents
    function refreshStudents( _event: Event ): void {
        sendDataToHost( "refreshStudents" );
    }

    function refresh(): void {

        let output: HTMLTextAreaElement = document.getElementsByTagName( "textarea" )[1];
        output.value = "";

        // for-in-Schleife iteriert über die Schlüssel des assoziativen Arrays
        for ( let matrikel in studiHomoAssoc ) {  // Besonderheit: Type-Annotation nicht erlaubt, ergibt sich aus der Interface-Definition
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            line += studi.studiengang + ": ";
            output.value += line + "\n";
        }

        // zusätzliche Konsolenausgaben zur Demonstration
        console.group( "Simple Array" );
        console.log( studiSimpleArray );
        console.groupEnd();

        console.group( "Associatives Array (Object)" );
        console.log( studiHomoAssoc );
        console.groupEnd();
    }

    //Funktion, um Studenten nach Matrikelnummer zu suchen
    //Funktion search aufstellen
    function search( _event: Event ): void {

        //Zugriff auf Inputs
        let inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName( "input" );

        //Matrikel wird aufgerufen durch den 6. Input
        let matrikel: string = inputs[6].value;

        console.log(matrikel);

        //Funktion sendDataToHost, Variable matrikel wird übergeben
        sendDataToHost("searchStudent", matrikel);
    }

    //Funktion sendDataToHost
    //Parameter method: string, data: any = undefined
    //data: any = undefined -> Optionalparameter, muss nicht unbedingt angeben werden(Daten werden schon übergeben), kann ein string oder eine number sein
    function sendDataToHost( method: string, data: any = undefined ) {

        //Ausgabe wenn Daten zum Server gesendet werden
        console.log( "Sending data to host.." );

        //Variable xhr, XMLHttpRequest wird erstellt
        //XMLHttpRequest= Um Daten von einem URL zu erhalten
        let xhr: XMLHttpRequest = new XMLHttpRequest();

        //Dataobjekt wird in ein string umgewandelt, damit es zum Server gesendet werden kann
        let dataString: string = JSON.stringify( data );

        //true= asynchron
        //Neue Http Request wird geöffnet
        //Parameterliste: ("GET", address + method + "?method=" + method + "&data=" + encodeURIComponent(dataString), true);
        //xhr.open= Verbindung zum Server wird geöffnet
        //GET= Methode, mit der Infos gesendet werden
        xhr.open( "GET", address + method + "?method=" + method + "&data=" + encodeURIComponent( dataString ), true );

        //Überprüfen welche Methode ausgeführt werden soll
        //Methode addStudent
        if ( method == "addStudent" ) {

            //Sobald eine Antwort ankommt schreibe die Antwort in die Konsole
            xhr.onload = function() {
                console.log( xhr.responseText )
            }
        }

        //Methode refreshStudents
        else if ( method == "refreshStudents" ) {
            xhr.onload = function() {

                //Sobald eine Antwort ankommt ersetze studiHomoAssoc mit der Antwort und führe die Methode refresh aus
                console.log( 'Refreshing Students...' );

                //Überschreibe studiHomoAssoc mit der Antwort
                studiHomoAssoc = JSON.parse( xhr.responseText );
                refresh();
            }
        }

        else if ( method == "searchStudent" ) {

            //Onload wird erst ausgeführt wenn es eine Antwort bekommt
            xhr.onload = function() {
                // Wenn undefined zurückgegeben wird, gebe Meldung aus
                if (xhr.responseText == "undefined") {
                    alert( "Es wurde kein Student gefunden, bitte versuchen sie es noch einmal." );
                    return;
                }
                    
                // Student Rückgabe String wird zum Objekt umgewandelt
                let student = JSON.parse(xhr.responseText);

                //Auf erste Textarea zugreifen
                let output: HTMLTextAreaElement = document.getElementsByTagName( "textarea" )[0];

                output.value = "";
                
                //Übereinstimmung mit Student
                let line: string = data + ": ";
                line += student.name + ", " + student.firstname + ", " + student.age + " Jahre ";
                line += student.gender ? ", (M)" : ", (F)";
                line += student.studiengang + ": ";
                output.value += line + "\n";
                
            }
        }

        //Sende Request zum Server
        xhr.send();
    }
}