/**
 * Simple database insertion and query for MongoDB
 * @author: Jirka Dell'Oro-Friedl
 */
import * as Mongo from "mongodb";
console.log("Database starting");

import * as Server from "./Server";

let databaseURL: string = "mongodb://localhost:27017";
let databaseName: string = "database_mongodb_lina-maria"; //oder database_mongodb???????????????????
let db: Mongo.Db;
let students: Mongo.Collection;

// wenn wir auf heroku sind...
if (process.env.NODE_ENV == "production") {
    //    databaseURL = "mongodb://username:password@hostname:port/database";
    databaseURL = "mongodb://testuser:testpassword@ds245170.mlab.com:45170/database_mongodb_lina-maria";
    databaseName = "ds245170.mlab.com:45170/database_mongodb_lina-maria";
}

// handleConnect wird aufgerufen wenn der Versuch, die Connection zur Datenbank herzustellen, erfolgte
Mongo.MongoClient.connect(databaseURL, handleConnect);


function handleConnect(_e: Mongo.MongoError, _db: Mongo.Db): void {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        students = db.collection("students");
    }
}



export function insert(_student: Server.Studi): void {
    let _name: string = _student.name;
    let _firstname: string = _student.firstname;
    let matrikel: string = _student.matrikel.toString();
    let _age: number = _student.age;
    let _gender: boolean = _student.gender;
    let _studiengang: string = _student.studiengang;

    let studi: Server.Studi;

    studi = {
        name: _name,
        firstname: _firstname,
        matrikel: parseInt( matrikel ),
        age: _age,
        gender: _gender,
        studiengang: _studiengang
    };

    students.insertOne(studi, handleInsert);
}


function handleInsert(_e: Mongo.MongoError): void {
    console.log("Database insertion returned -> " + _e);
}


export function findAll(_callback: Function): void {
    let cursor: Mongo.Cursor = students.find();
    cursor.toArray((_e: Mongo.MongoError, _result: Server.Studi[]) => {
        if (_e)
            _callback("Fehler " + _e, false);
        else
            _callback(JSON.stringify(_result), true)
    })

}

export function findStudent(_callback: Function, matrikel: number) {
    let cursor: Mongo.Cursor = students.find({"matrikel": matrikel});
    cursor.toArray((_e: Mongo.MongoError, _result: Server.Studi[]) => {
        if (_e)
            _callback("Fehler sind nicht gut " + _e, false);
        else {
            if (_result.length >= 1) {
                _callback(JSON.stringify(_result[0]), true)
            }
        }
    })
}