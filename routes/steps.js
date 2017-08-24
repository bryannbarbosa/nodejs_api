const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const router = express.Router();

router.get('/steps', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select * from steps', (err, result, fields) => {
          if (err)
            throw err;
          res.json({
            response: {
              steps: result,
              user: data
            }
          });
        });
      });
    }
  });
});

router.post('/steps', ensureToken, (req, res) => {

  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('id_exercise', 'step_name', 'image_step_url', 'step_content' in req.body) {
        connection.connect((err) => {
          let step_name = req.body.step_name;
          let query = "select * from steps where step_name = " + mysql.escape(step_name) + " limit 1";
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            if (result.length > 0) {
              res.json({response: 'This step already exists'});
            } else {
              connection.connect((err) => {
                let exercise = req.body.id_exercise;
                let step_name = req.body.step_name;
                let image_step_url = req.body.image_step_url;
                let step_content = req.body.step_content;
                let values = [];
                values.push(exercise, step_name, image_step_url, step_content);
                let query = "insert into steps (id_exercise, step_name, image_step_url, step_content) values (" + mysql.escape(values) + ")";
                connection.query(query, (err, result, fields) => {
                  if (err)
                    throw err;
                  res.json({
                    response: {
                      message: 'Step has created successfully!',
                      id_step: result.insertId
                    }
                  });
                });
              });
            }
          });
        });
      } else {
        res.json({response: 'id of exercise, step name, step image and step content is required'});
      }
    }
  });
});

router.get('/steps/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      connection.connect((err) => {
        connection.query('select * from steps where id = ' + mysql.escape(id), (err, result, fields) => {
          if (err)
            throw err;
          res.json({
            response: {
              steps: result,
              user: data
            }
          });
        });
      });
    }
  });
});

module.exports = router;
