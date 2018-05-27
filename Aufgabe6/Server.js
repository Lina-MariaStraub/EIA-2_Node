"use strict";
var Url = require("url"); //Bindet Url Modul mit ein
//HTTP Objekt wird im Code erstellt
//Interpreter sucht nach jedem m�glichen Import im http- Modul  und wird ihn einzeln an das http- Objekt im Code anh�ngen
var Http = require("http");
var Node;
(function (Node) {
    var studis = {};
    var port = process.env.PORT; // Todo: �ndern!
    if (port == undefined)
        port = 8100;
    var server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleListen() {
    }
    function handleRequest(_request, _response) {
        _response.setHeader('Access-Control-Allow-Origin', '*'); //Die Headers sind dazu da um von anderen Servern zugreifen zu k�nnen
        _response.setHeader('Access-Control-Request-Method', '*');
        _response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET'); //Options: Um abzufragen, ob man auf den Server zugreifen kann
        _response.setHeader('Access-Control-Allow-Headers', '*'); //GET: Um Antwort zur�ck zu bekommen
        var query = Url.parse(_request.url, true).query; //Aus string ein Objekt machen
        //console.log(query);
        //Schaut nach welche Methode angegeben wurde
        //Wenn die Methode addStudent ist f�ge Student zur Liste hinzu
        //Gebe als Antwort "Student added!"
        if (query["method"] == "addStudent") {
            var student = JSON.parse(query["data"].toString());
            studis[student.matrikel.toString()] = student;
            _response.write("Student added!");
            _response.end();
        }
        //Wenn die Methode refreshStudents ist, gebe die Liste der Studenten als Antwort
        //stringify: Objekt wird zum string
        if (query["method"] == "refreshStudents") {
            _response.write(JSON.stringify(studis));
            _response.end();
        }
    }
})(Node || (Node = {}));
//# sourceMappingURL=Server.js.map