import * as Url from "url";// URL 
import * as Http from "http";//HTTP wird erstellt im Code erstellt, damit einzelne HTTP.Objekte im Code angehängt werden können

namespace Node {//namespace
    interface AssocStringString {//Interface
        [key: string]: string;//key ist string u wert auch / ist ein homogenes assoziatives Array
    }

    let port: number = process.env.PORT;//var port def. als number
                                        //process.env.PORT wird festgelegt als Umgebungsvar um anzugeben, welcher Port überwacht wird
    if ( port == undefined )//wenn port undefinded
        port = 8100;//dann portnummer 8100 ist port, dem server zuhören soll

    let server: Http.Server = Http.createServer();//var sever um zugriff zu ermöglichen und sever weiter arbeiten zu können
    server.addListener( "listening", handleListen );//wenn sever listening dann ausführund der funktion handleListen
    server.addListener( "request", handleRequest );//sever beibringen zu reagieren
    server.listen( port );

    function handleListen(): void {//funkt. wenn sever zuhört wird in konsole ich höre ausgegeben
        console.log( "Ich höre?" );//konsolenausgabe bzw terminal
    }

    function handleRequest( _request: Http.IncomingMessage, _response: Http.ServerResponse ): void {//Http.IncomingMessage: Einkommende Info
        console.log( "Ich höre Stimmen!" );//konsolenausgabe bzw terminal

        let query: AssocStringString = Url.parse( _request.url, true ).query;//übersetzung in assoziatives array und umwandeln in js (/?a=10&b=20)
        let a: number = parseInt( query["a"] );// a number u als var def
        let b: number = parseInt( query["b"] );// b number u als var def

        _response.setHeader( "content-type", "text/html; charset=utf-8" );//äüö Probleme behoben u änderung der schriftart
        _response.setHeader( "Access-Control-Allow-Origin", "*" );//alle haben zugang
        _response.write( "Ich habe dich gehört<br/>" );//konsolenausgabe bzw terminal

        for ( let key in query )//durchgeben von schlüssel
        _response.write( "eingegebene Infos: " + ( query[key] ) + "<br>" );
        _response.write( "Ergebnis: " + ( a + b ) );//wenn sever zuhört u daten bearbeitet dann wird ergebnis ausgegeben
        _response.end();//info zum nutzer schicken
    }
}
