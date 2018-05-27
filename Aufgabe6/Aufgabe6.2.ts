namespace L06_Interfaces {
    window.addEventListener( "load", init );
    let address: string = "https://eia2aufg6von257767.herokuapp.com/";                  
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
        for (let i = 0; i < 3; i++) {      
            //Zugriff auf Interface
            let student: L06_Interfaces.Studi = {
                name: "Nachname " + i,
                firstname: "Jeff" + i,
                matrikel: Math.floor(Math.random() * 222222),
                age: Math.floor(Math.random() * 22),
                gender: !!Math.round(Math.random()),
                studiengang: "OMB"
            }
            //Funktion sendDataToHost, Variable student wird übergeben
            sendDataToHost("addStudent", student)
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

        studiHomoAssoc[matrikel] = studi;// Datensatz im assoziativen Array unter der Matrikelnummer speichern

        studiSimpleArray.push( studi );   // nur um das auch noch zu zeigen...
        
        //Funktion sendDataToHost, Objekt studi wird übergeben
        //Methode addStudent
        sendDataToHost("addStudent", studi);
    }

    //Serverfunktion refreshStudents wird ausgeführt
    //Funktion refreshStudents holt sich die Liste der ganzen Daten vom Server
    //Methode refreshStudents
    function refreshStudents(_event: Event): void {
        sendDataToHost("refreshStudents");
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

        console.group( "Simple Array" ); // zusätzliche Konsolenausgaben zur Demonstration
        console.log( studiSimpleArray );
        console.groupEnd();

        console.group( "Associatives Array (Object)" );
        console.log( studiHomoAssoc );
        console.groupEnd();
    }

    //Funktion, um Studenten nach Matrikelnummer zu suchen
    //Funktion search aufstellen
    function search( _event: Event ): void {

        //Auf erste Textarea zugreifen
        let output: HTMLTextAreaElement = document.getElementsByTagName( "textarea" )[0];
        output.value = "";

        let inputs: NodeListOf<HTMLInputElement> = document.getElementsByTagName( "input" );//Zugriff auf Inputs

        let matrikel: string = inputs[6].value; //Matrikel wird aufgerufen durch den 6. Input

        //Matrikelnummer wird gespeichert
        let studi: Studi = studiHomoAssoc[matrikel];

        if ( studi ) {
            //Übereinstimmung mit Student
            let line: string = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? ", (M)" : ", (F)";
            line += studi.studiengang + ": ";
            output.value += line + "\n";
            
        } else { //Keine Übereinstimmung mit Student
            alert( "Es wurde kein Student gefunden, bitte versuchen sie es noch einmal." );
        }
    }
    
    //Funktion sendDataToHost
    //Parameter method: string, data: any = undefined
    //data: any = undefined -> Optionalparameter, muss nicht unbedingt angeben werden(Daten werden schon übergeben)
    function sendDataToHost(method: string, data: any = undefined) {
        
        console.log("Sending data to host..");  //Ausgabe wenn Daten zum Server gesendet werden
        
        let xhr: XMLHttpRequest = new XMLHttpRequest(); //Variable xhr, XMLHttpRequest wird erstellt
        
        let dataString: string = JSON.stringify(data); //Dataobjekt wird in ein string umgewandelt, damit es zum Server gesendet werden kann
        
        //true= asynchron
        //Neue Http Request wird geöffnet
        xhr.open("GET", address + method + "?method=" + method + "&data=" + encodeURIComponent(dataString), true);
        
        if (method == "addStudent") {//Überprüfen welche Methode ausgeführt werden soll
            
            xhr.onload = function () { //Sobald eine Antwort ankommt schreibe die Antwort in die Konsole
                console.log(xhr.responseText)
            }
        }
        else if (method == "refreshStudents") {
            xhr.onload = function () {
                
                console.log('Refreshing Students...');//Sobald eine Antwort ankommt ersetze studiHomoAssoc mit der Antwort und führe die Methode refresh aus
                
                studiHomoAssoc = JSON.parse(xhr.responseText);//Überschreibe studiHomoAssoc mit der Antwort
                refresh();
            }
        }
        xhr.send();  //Sende Request zum Server
    }
}
