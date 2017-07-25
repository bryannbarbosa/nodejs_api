const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const router = express.Router();

router.get('/categories', ensureToken, (req, res) => {
  
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if(err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select * from categories', (err, result, fields) => {
          if(err) throw err;
          res.json({
            response: {
              categories: result,
              user: data
            }
          });
        });
      });
    }
  });
});

router.get('/categories/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if(err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      connection.connect((err) => {
        connection.query('select * from categories where id = ' + mysql.escape(id), (err, result, fields) => {
          if(err) throw err;
          res.json({
            response: {
              categories: result,
              user: data
            }
          });
        });
      });
    }
  });
});

module.exports = router;


