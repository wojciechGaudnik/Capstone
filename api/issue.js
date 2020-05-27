const express = require('express');
const issueRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||'database.sqlite');

issueRouter.param('issueId', (req, res, next, issueId) => {
    db.get(`select *
            from Issue
            where Issue.id = $issueId`,
        {$issueId: issueId}, (err, issue) => {
            if (err) {
                next(err);
            } else if (issue) {
                req.issue = issue;
                next();
            } else {
                res.sendStatus(404)
            }
        });
});

issueRouter.get('/', ((req, res, next) => {
    console.log("ok");
    db.all(`select *
            from Issue where series_id = ${req.params.seriesId}`, (err, issues) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({issues: issues});
        }
    });
}));

issueRouter.get('/:issueId', (req, res, next) => {
    res.status(200).json({issue: req.issue});
});

issueRouter.post('/', (req, res, next) => {
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;

    const artistSql = `select * from Artist where id = $artistId`;
    const artistValues = {$artistId: artistId}

    db.get(artistSql, artistValues, function (err, artist) {
        if (err) {
            next(err);
        } else {
            if (!name || !issueNumber || !publicationDate || !artist) return res.sendStatus(400);

            const sql = `insert into Issue (name, issue_number, publication_date, artist_id, series_id)
                         values ($name, $issueNumber, $publicationDate, $artistId, $seriesId);`
            const values = {
                $name: name,
                $issueNumber: issueNumber,
                $publicationDate: publicationDate,
                $artistId: artistId,
                $seriesId: req.params.seriesId
            };

            db.run(sql, values, function(err) {
                if (err) {
                    next(err);
                } else {
                    db.get(`select * from Issue where Issue.id = ${this.lastID}`, (err, issue) => {
                        res.status(201).json({issue: issue});
                    });
                }
            });
        }
    });
});

issueRouter.put('/:issueId', ((req, res, next) => {
    const name = req.body.issue.name;
    const issueNumber = req.body.issue.issueNumber;
    const publicationDate = req.body.issue.publicationDate;
    const artistId = req.body.issue.artistId;
    const artistSql = `select * from Artist where id = $artistId`;
    const artistValues = {$artistId: artistId}

    db.get(artistSql, artistValues, (err, artist) => {
        if (err) {
            next(next);
        } else if (!name || !issueNumber || !publicationDate || !artist) {
            return res.sendStatus(400);
        }
        const sql = `update Issue
                     set name             = $name,
                         issue_number     = $issueNumber,
                         publication_date = $publicationDate,
                         artist_id        = $artistId
                     where id = $issueId;
                     `;
        const values = {
            $name: name,
            $issueNumber: issueNumber,
            $publicationDate: publicationDate,
            $artistId: artistId,
            $issueId: req.params.issueId
        };
        db.run(sql, values, (err) => {
            if (err) {
                next(err);
            } else {
                db.get(`select * from Issue where id = ${req.params.issueId}`, (err, issue) => {
                    res.status(200).json({issue: issue})
                });
            }
        });
    })
}));

// seriesRouter.delete('/:seriesId', (req, res, next) => {
//     const sql = `DELETE
//                  FROM Series
//                  WHERE id = $seriesId`;
//     const values = {$seriesId: req.params.seriesId};
//     // db.run(sql, values, (err) => {
// });

module.exports = issueRouter;