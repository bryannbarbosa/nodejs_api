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
        connection.query('select steps.id as id, steps.step_type, steps.step_content, steps.step_name, exercises.exercise_name, exercises.id as id_exercise, categories.category_name from ((steps inner join exercises on exercises.id = steps.id_exercise) inner join categories on exercises.id_category = categories.id)', (err, result, fields) => {
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
        connection.connect((err) => {
          let step_name = req.body.name;
          if (!req.file) {
            step_name = req.body.name;
	    step_content = req.body.step_content;
	    step_type = req.body.step_type;
            exercise_id = req.body.exercise_id.id;
	    let values = [];
            values.push(exercise_id, step_name, step_type, step_content);
            let query = "insert into steps(id_exercise, step_name, step_type, step_content) values (" + mysql.escape(values) + ")";
	    connection.query(query, (err, result, fields) => {
  	       if(err) {
                 throw err;
               }
	       res.json({
		message: "Step has created successfully!",
		id_step: result.insertId,
		success: true,
		error_code: 0
              });
	    });
          } else {
            connection.connect((err) => {
              let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
              let exercise = req.body.step.exercise_id.id;
              let step_name = req.body.step.name;
	      let step_type = req.body.step.step_type;
              let step_content = image;
              let values = [];
              values.push(exercise, step_name, step_type, step_content);
              let query = "insert into steps (id_exercise, step_name, step_type, step_content) values (" + mysql.escape(values) + ")";
              connection.query(query, (err, result, fields) => {
                if (err)
                  throw err;
                res.json({
                  response: {
                    message: 'Step has created successfully!',
                    id_step: result.insertId,
                    success: true,
                    error_code: 0
                  }
                });
              });
            });
          }
        });
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
        let query = "update steps set step_name = " + mysql.escape(step_name) + ", step_content = " + mysql.escape(image) + " where id = " + mysql.escape(id);
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
