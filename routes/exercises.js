const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const router = express.Router();

router.get('/exercises', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if(err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select * from exercises', (err, result, fields) => {
          if(err) throw err;
          res.json({
            response: {
              exercises: result,
              user: data
            }
          });
        });
      });
    }
  });
});

router.get('/exercises/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if(err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      connection.connect((err) => {
        connection.query('select * from exercises where id = ' + mysql.escape(id), (err, result, fields) => {
          if(err) throw err;
          res.json({
            response: {
              exercises: result,
              user: data
            }
          });
        });
      });
    }
  });
});

module.exports = router;