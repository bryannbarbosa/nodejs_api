const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const router = express.Router();

router.get('/comparisons', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select * from comparisons', (err, result, fields) => {
          if (err)
            throw err;
          res.json({
            response: {
              comparisons: result,
              user: data
            }
          });
        });
      });
    }
  });
});

router.post('/comparisons', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('id_exercise', 'image_comparison_url', 'comparison_content' in req.body) {
        connection.connect((err) => {
          let exercise = req.body.id_exercise;
          let image_comparison_url = req.body.image_comparison_url;
          let comparison_content = req.body.comparison_content;
          let values = [];
          values.push(exercise, image_comparison_url, comparison_content);
          let query = "insert into comparisons (id_exercise, image_comparison_url, comparison_content) values (" + mysql.escape(values) + ")";
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            res.json({
              response: {
                message: 'Comparison has created successfully!',
                id_comparison: result.insertId
              }
            });
          });
        });
      } else {
        res.json({response: 'id of exercise, url and content for comparison are required'})
      }
    }
  });
});

router.get('/comparisons/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      connection.connect((err) => {
        connection.query('select * from comparisons where id = ' + mysql.escape(id), (err, result, fields) => {
          if (err)
            throw err;
          res.json({
            response: {
              comparisons: result,
              user: data
            }
          });
        });
      });
    }
  });
});

module.exports = router;
