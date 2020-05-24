const express = require('express');
const artistsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||'database.sqlite');

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

module.exports = artistsRouter;
