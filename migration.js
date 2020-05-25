const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite');


db.serialize(function () {
    db.run(`DROP TABLE IF EXISTS Artist;`);
    db.run(`create table Artist
            (
                id                    integer not null primary key,
                name                  text    not null,
                date_of_birth         text    not null,
                biography             text    not null,
                is_currently_employed integer not null default 1
            );
    `);
    db.run(`drop table if exists Series;`);
    db.run(`create table Series
            (
                id          integer not null primary key,
                name        text    not null,
                description text    not null
            );
    `);
})
