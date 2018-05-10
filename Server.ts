import * as Url from "url";// URL 
import * as Http from "http";//HTTP wird erstellt im Code erstellt, damit einzelne HTTP.Objekte im Code angeh�ngt werden k�nnen

namespace Node {//namespace
    interface AssocStringString {//Interface
        [key: string]: string;//key ist string u wert auch / ist ein homogenes assoziatives Array
    }

    let port: number = process.env.PORT;//var port def. als number
                                        //process.env.PORT wird festgelegt als Umgebungsvar um anzugeben, welcher Port �berwacht wird
    if ( port == undefined )//wenn port undefinded
        port = 8100;//dann portnummer 8100 ist port, dem server zuh�ren soll

    let server: Http.Server = Http.createServer();//var sever um zugriff zu erm�glichen und sever weiter arbeiten zu k�nnen
    server.addListener( "listening", handleListen );//wenn sever listening dann ausf�hrund der funktion handleListen
    server.addListener( "request", handleRequest );//sever beibringen zu reagieren
    server.listen( port );

    function handleListen(): void {//funkt. wenn sever zuh�rt wird in konsole ich h�re ausgegeben
        console.log( "Ich h�re?" );//konsolenausgabe bzw terminal
    }

    function handleRequest( _request: Http.IncomingMessage, _response: Http.ServerResponse ): void {//Http.IncomingMessage: Einkommende Info
        console.log( "Ich h�re Stimmen!" );//konsolenausgabe bzw terminal

        let query: AssocStringString = Url.parse( _request.url, true ).query;//�bersetzung in assoziatives array und umwandeln in js (/?a=10&b=20)
        let a: number = parseInt( query["a"] );// a number u als var def
        let b: number = parseInt( query["b"] );// b number u als var def

        _response.setHeader( "content-type", "text/html; charset=utf-8" );//��� Probleme behoben u �nderung der schriftart
        _response.setHeader( "Access-Control-Allow-Origin", "*" );//alle haben zugang
        _response.write( "Ich habe dich geh�rt<br/>" );//konsolenausgabe bzw terminal

        for ( let key in query )//durchgeben von schl�ssel
        _response.write( "eingegebene Infos: " + ( query[key] ) + "<br>" );
        _response.write( "Ergebnis: " + ( a + b ) );//wenn sever zuh�rt u daten bearbeitet dann wird ergebnis ausgegeben
        _response.end();//info zum nutzer schicken
    }
}
