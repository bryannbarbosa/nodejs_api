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
        connection.query('select exercises.id as id, categories.id as id_category, categories.category_name, exercises.exercise_name from categories inner join exercises on categories.id = exercises.id_category', (err, result, fields) => {
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

router.post('/exercises', ensureToken, (req, res) => {

  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('id_category', 'exercise_name' in req.body) {
        connection.connect((err) => {
          let exercise = req.body.exercise_name;
          let query = "select * from exercises where exercise_name = " + mysql.escape(exercise) + " limit 1";
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            if (result.length > 0) {
              res.json({response: 'This exercise already exists'});
            } else {
              connection.connect((err) => {
                let category_id = req.body.id_category;
                let exercise = req.body.exercise_name;
                let values = [];
                values.push(category_id, exercise);
                let query = "insert into exercises (id_category, exercise_name) values (" + mysql.escape(values) + ")";
                connection.query(query, (err, result, fields) => {
                  if (err)
                    throw err;
                  res.json({
                    response: {
                      message: 'Exercise has created successfully!',
                      id_exercise: result.insertId
                    }
                  });
                });
              });
            }
          });
        });
      } else {
        res.json({response: 'category id and exercise name are required'});
      }
    }
  });
});

router.put('/exercises/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('exercise_name' in req.body) {
        connection.connect((err) => {
          let exercise = req.body.exercise_name;
          let id = req.params.id;
          connection.query('update exercises set exercise_name = ' + mysql.escape(exercise) + ' where id = ' + mysql.escape(id), (err, result, fields) => {
            if (err)
              throw err;
            res.json({response: 'Exercise updated sucessfully!'});
          });
        });
      }
    }
  });
});

router.delete('/exercises/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {

        connection.connect((err) => {
          let id = req.params.id;
          connection.query('delete from exercises where id = ' + mysql.escape(id), (err, result, fields) => {
            if (err)
              throw err;
            res.json({response: 'Exercise removed sucessfully!'});
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
