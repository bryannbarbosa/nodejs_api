const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const multer = require('multer');
const storage = require('../middleware/storage');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/comparisons', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select comparisons.id as id, exercises.id as id_exercise, comparisons.image_comparison_modify, comparisons.image_comparison_original, exercises.exercise_name, categories.category_name from ((comparisons inner join exercises on exercises.id = comparisons.id_exercise) inner join categories on exercises.id_category = categories.id)', (err, result, fields) => {
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

router.post('/comparisons', upload.single('file'), ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if (!req.file) {
        return res.json({
          success: false,
          error_code: 1
        });
      } else {
        let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        let image_default = 'https://cdn.pixabay.com/photo/2015/12/22/04/00/photo-1103595_960_720.png';
        let exercise_id = req.body.comparison.exercise_id.id;
        let values = [];
        values.push(exercise_id, image, image_default);
        let query = "insert into comparisons (id_exercise, image_comparison_modify, image_comparison_original) values (" + mysql.escape(values) + ")";
        connection.connect((err) => {
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            res.json({
              response: {
                message: 'Comparison has created successfully!',
                id_comparison: result.insertId,
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

router.put('/comparisons/:id', upload.single('file'), ensureToken, (req, res) => {
      jwt.verify(req.token, 'bobesponja63', (err, data) => {
          if (err) {
            res.sendStatus(403);
          } else {
            if (req.file) {
              if (req.body.comparison_type == 'modify') {
                let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
                let id = req.params.id;
                let query = "update comparisons set image_comparison_modify =" + mysql.escape(image) + " where id = " + mysql.escape(id);
                connection.connect((err) => {
                  connection.query(query, (err, result, fields) => {
                    if (err)
                      throw err;
                    res.json({
                      response: {
                        message: 'Comparison modify has updated successfully!',
                        sucess: true,
                        error_code: 0
                      }
                    });
                  });
                });
              }
                else {
                  let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
                  let id = req.params.id;
                  let query = "update comparisons set image_comparison_original = " + mysql.escape(image) + " where id = " + mysql.escape(id);
                  connection.connect((err) => {
                    connection.query(query, (err, result, fields) => {
                      if (err)
                        throw err;
                      res.json({
                        response: {
                          message: 'Comparison original has updated successfully!',
                          sucess: true,
                          error_code: 0
                        }
                      });
                    });
                  });
                }
              }
            }
          });
      });

    router.delete('/comparisons/:id', ensureToken, (req, res) => {
      jwt.verify(req.token, 'bobesponja63', (err, data) => {
        if (err) {
          res.sendStatus(403);
        } else {
          connection.connect((err) => {
            let id = req.params.id;
            connection.query('delete from comparisons where id = ' + mysql.escape(id), (err, result, fields) => {
              if (err)
                throw err;
              res.json({
                response: 'Comparison deleted sucessfully!'
              });
            });
          });
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