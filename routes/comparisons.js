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
        connection.query('select comparisons.id as id, comparisons.comparison_content, comparisons.image_comparison_url, exercises.exercise_name, categories.category_name from ((comparisons inner join exercises on exercises.id = comparisons.id_exercise) inner join categories on exercises.id_category = categories.id)', (err, result, fields) => {
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
        return res.json({success: false, error_code: 1});
      } else {
        let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        let comparison_content = req.body.comparison.comparison_content;
        let exercise_id = req.body.comparison.exercise_id.id;
        let values = [];
        values.push(exercise_id, image, comparison_content);
        let query = "insert into comparisons (id_exercise, image_comparison_url, comparison_content) values (" + mysql.escape(values) + ")";
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
      if (!req.file) {
        let id = req.params.id;
        let comparison_content = req.body.comparison_content;
        let query = "update comparisons set comparison_content = " + mysql.escape(comparison_content) + " where id = " + mysql.escape(id);
        connection.connect((err) => {
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            res.json({
              response: {
                message: 'Comparison has updated successfully!',
                sucess: true,
                error_code: 0
              }
            });
          });
        });
      } else {
        let image = req.protocol + '://' + req.get('host') + '/' + req.file.path;
        let id = req.params.id;
        let comparison_content = req.body.comparison_content;
        let query = "update comparisons set image_comparison_url = " + mysql.escape(image) + ", comparison_content = " + mysql.escape(comparison_content) + " where id = " + mysql.escape(id);
        connection.connect((err) => {
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            res.json({
              response: {
                message: 'Comparison has updated successfully!',
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
          res.json({response: 'Comparison deleted sucessfully!'});
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
