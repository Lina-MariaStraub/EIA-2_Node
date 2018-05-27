var L06_Interfaces;
(function (L06_Interfaces) {
    window.addEventListener("load", init);
    var address = "https://eia2aufg6von257767.herokuapp.com/";
    function init(_event) {
        console.log("Init");
        //Enventlistener auf Button �bergeben
        var insertButton = document.getElementById("insert");
        var searchButton = document.getElementById("search");
        var refreshButton = document.getElementById("refresh");
        //Button f�r drei Bespieldatens�tze 
        var exampleButton = document.getElementById("exampleData");
        insertButton.addEventListener("click", insert);
        //Wenn geklickt wird f�hre refreshStudents aus  
        refreshButton.addEventListener("click", refreshStudents);
        searchButton.addEventListener("click", search);
        exampleButton.addEventListener("click", exampleData);
    }
    //Drei Datensatzbeispiele
    function exampleData() {
        for (var i = 0; i < 3; i++) {
            //Zugriff auf Interface
            var student = {
                name: "Nachname " + i,
                firstname: "Jeff" + i,
                matrikel: Math.floor(Math.random() * 222222),
                age: Math.floor(Math.random() * 22),
                gender: !!Math.round(Math.random()),
                studiengang: "OMB"
            };
            //Funktion sendDataToHost, Variable student wird �bergeben
            sendDataToHost("addStudent", student);
        }
    }
    //Funktion um Daten der Studenten zu speichern
    function insert(_event) {
        var inputs = document.getElementsByTagName("input");
        var genderButton = document.getElementById("male");
        var matrikel = inputs[2].value;
        var studi;
        //Interface �bergeben
        studi = {
            name: inputs[0].value,
            firstname: inputs[1].value,
            matrikel: parseInt(matrikel),
            age: parseInt(inputs[3].value),
            gender: genderButton.checked,
            studiengang: document.getElementsByTagName("select").item(0).value,
        };
        console.log(studi);
        console.log(studi.age);
        console.log(studi["age"]);
        L06_Interfaces.studiHomoAssoc[matrikel] = studi; // Datensatz im assoziativen Array unter der Matrikelnummer speichern
        L06_Interfaces.studiSimpleArray.push(studi); // nur um das auch noch zu zeigen...
        //Funktion sendDataToHost, Objekt studi wird �bergeben
        //Methode addStudent
        sendDataToHost("addStudent", studi);
    }
    //Serverfunktion refreshStudents wird ausgef�hrt
    //Funktion refreshStudents holt sich die Liste der ganzen Daten vom Server
    //Methode refreshStudents
    function refreshStudents(_event) {
        sendDataToHost("refreshStudents");
    }
    function refresh() {
        var output = document.getElementsByTagName("textarea")[1];
        output.value = "";
        // for-in-Schleife iteriert �ber die Schl�ssel des assoziativen Arrays
        for (var matrikel in L06_Interfaces.studiHomoAssoc) {
            var studi = L06_Interfaces.studiHomoAssoc[matrikel];
            var line = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            line += studi.studiengang + ": ";
            output.value += line + "\n";
        }
        console.group("Simple Array"); // zus�tzliche Konsolenausgaben zur Demonstration
        console.log(L06_Interfaces.studiSimpleArray);
        console.groupEnd();
        console.group("Associatives Array (Object)");
        console.log(L06_Interfaces.studiHomoAssoc);
        console.groupEnd();
    }
    //Funktion, um Studenten nach Matrikelnummer zu suchen
    //Funktion search aufstellen
    function search(_event) {
        //Auf erste Textarea zugreifen
        var output = document.getElementsByTagName("textarea")[0];
        output.value = "";
        var inputs = document.getElementsByTagName("input"); //Zugriff auf Inputs
        var matrikel = inputs[6].value; //Matrikel wird aufgerufen durch den 6. Input
        //Matrikelnummer wird gespeichert
        var studi = L06_Interfaces.studiHomoAssoc[matrikel];
        if (studi) {
            //�bereinstimmung mit Student
            var line = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? ", (M)" : ", (F)";
            line += studi.studiengang + ": ";
            output.value += line + "\n";
        }
        else {
            alert("Es wurde kein Student gefunden, bitte versuchen sie es noch einmal.");
        }
    }
    //Funktion sendDataToHost
    //Parameter method: string, data: any = undefined
    //data: any = undefined -> Optionalparameter, muss nicht unbedingt angeben werden(Daten werden schon �bergeben)
    function sendDataToHost(method, data) {
        if (data === void 0) { data = undefined; }
        console.log("Sending data to host.."); //Ausgabe wenn Daten zum Server gesendet werden
        var xhr = new XMLHttpRequest(); //Variable xhr, XMLHttpRequest wird erstellt
        var dataString = JSON.stringify(data); //Dataobjekt wird in ein string umgewandelt, damit es zum Server gesendet werden kann
        //true= asynchron
        //Neue Http Request wird ge�ffnet
        xhr.open("GET", address + method + "?method=" + method + "&data=" + encodeURIComponent(dataString), true);
        if (method == "addStudent") {
            xhr.onload = function () {
                console.log(xhr.responseText);
            };
        }
        else if (method == "refreshStudents") {
            xhr.onload = function () {
                console.log('Refreshing Students...'); //Sobald eine Antwort ankommt ersetze studiHomoAssoc mit der Antwort und f�hre die Methode refresh aus
                L06_Interfaces.studiHomoAssoc = JSON.parse(xhr.responseText); //�berschreibe studiHomoAssoc mit der Antwort
                refresh();
            };
        }
        xhr.send(); //Sende Request zum Server
    }
})(L06_Interfaces || (L06_Interfaces = {}));
//# sourceMappingURL=Aufgabe6.2.js.map