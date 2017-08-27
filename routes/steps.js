const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const multer = require('multer');
const storage = require('../middleware/storage');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/steps', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select steps.id as id, steps.step_content, steps.step_name, steps.image_step_url, exercises.exercise_name, categories.category_name from ((steps inner join exercises on exercises.id = steps.id_exercise) inner join categories on exercises.id_category = categories.id)', (err, result, fields) => {
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

router.post('/steps', upload.single('file'), ensureToken, (req, res) => {

  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('name', 'step_content', 'exercise_id' in req.body.step) {
        connection.connect((err) => {
          let step_name = req.body.step.name;
          let query = "select * from steps where step_name = " + mysql.escape(step_name) + " limit 1";
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            if (result.length > 0) {
              res.json({response: 'This step already exists'});
            } else {
              if (!req.file) {
                return res.json({success: false, error_code: 1});
              } else {
                connection.connect((err) => {
                  let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
                  let exercise = req.body.step.exercise_id.id;
                  let step_name = req.body.step.name;
                  let image_step_url = image;
                  let step_content = req.body.step.step_content;
                  let values = [];
                  values.push(exercise, step_name, image_step_url, step_content);
                  let query = "insert into steps (id_exercise, step_name, image_step_url, step_content) values (" + mysql.escape(values) + ")";
                  connection.query(query, (err, result, fields) => {
                    if (err)
                      throw err;
                    res.json({
                      response: {
                        message: 'Step has created successfully!',
                        id_step: result.insertId,
                        sucess: true,
                        error_code: 0
                      }
                    });
                  });
                });
              }
            }
          });
        });
      } else {
        res.json({response: 'id of exercise, step name, step image and step content is required'});
      }
    }
  });
});

router.put('/steps/:id', upload.single('file'), ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if (!req.file) {
        let id = req.params.id;
        let step_name = req.body.step_name;
        let step_content = req.body.step_content;
        let query = "update steps set step_content = " + mysql.escape(step_content) + ", step_name = " + mysql.escape(step_name) + " where id = " + mysql.escape(id);
        connection.connect((err) => {
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            res.json({
              response: {
                message: 'Step has updated successfully!',
                sucess: true,
                error_code: 0
              }
            });
          });
        });
      } else {
        let id = req.params.id;
        let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        let step_name = req.body.step_name;
        let step_content = req.body.step_content;
        let query = "update steps set image_step_url = " + mysql.escape(image) + ", step_content = " + mysql.escape(step_content) + ", step_name = " + mysql.escape(step_name) + " where id = " + mysql.escape(id);
        connection.connect((err) => {
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            res.json({
              response: {
                message: 'Step has updated successfully!',
                sucess: true,
                error_code: 0
              }
            });
          });
        });
      }
    }
  });
});

router.delete('/steps/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        let id = req.params.id;
        connection.query('delete from steps where id = ' + mysql.escape(id), (err, result, fields) => {
          if (err)
            throw err;
          res.json({response: 'Step deleted sucessfully!'});
        });
      });
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
