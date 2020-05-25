const express = require('express');
const artistsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||'database.sqlite');

artistsRouter.param('artistId', (req, res, next, artistId) => {
    db.get(`select *
            from main.Artist
            where Artist.id = $artistId`,
        {$artistId: artistId}, (err, artist) => {
            if (err) {
                next(err);
            } else if (artist) {
                req.artist = artist;
                next();
            } else {
                res.sendStatus(404);
            }
        });
});

artistsRouter.get('/', (req, res, next) => {
    db.all(`select * from Artist where Artist.is_currently_employed = 1`,
        (err, artists) => {
            if (err) {
                next(err);
            } else {
                res.status(200).json({artists: artists})
            }
    });
});

artistsRouter.get('/:artistId', (req, res, next) => {
    res.status(200).json({artist: req.artist});
});

artistsRouter.post('/', (req, res, next) => {
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;
    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    if (!name || !dateOfBirth || !biography) {
        return res.sendStatus(400);
    }
    db.run(`insert into Artist (name, date_of_birth, biography, is_currently_employed)
            values ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)`, {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed
    }, function (err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Artist where id = ${this.lastID}`, (err, artist) => {
                res.status(201).json({artist: artist})
            });
        }
    });
});

artistsRouter.put('/:artistId', (req, res, next) => {
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;
    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    if (!name || !dateOfBirth || !biography) {
        return res.sendStatus(400);
    }

    const sql = `update Artist
                 set name                  = $name,
                     date_of_birth         = $dateOfBirth,
                     biography             = $biography,
                     is_currently_employed = $isCurrentlyEmployed
                 where Artist.id = $artistId;`;

    const values = {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed,
        $artistId: req.params.artistId
    };

    db.run(sql, values, (err) => {
        if (err) {
            next(err);
        } else {
            db.get(`select * from main.Artist where Artist.id = ${req.params.artistId}`, (err, artist) => {
                res.status(200).json({artist: artist});
            });
        }
    })
})

module.exports = artistsRouter;
