const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite');


db.serialize(function () {
    db.run(`DROP TABLE IF EXISTS Artist;`)
    db.run(`create table if not exists 'Artist' (
            id integer primary key not null , 
            name text not null ,
            date_of_birth text not null ,
            biography text not null ,
            is_currently_employed integer not null default 1
            );`)
})