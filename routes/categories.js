const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const router = express.Router();

router.get('/categories', ensureToken, (req, res) => {

  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        connection.query('select * from categories', (err, result, fields) => {
          if (err)
            throw err;
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

router.post('/categories', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('category_name', 'description' in req.body) {
        connection.connect((err) => {
          let category = req.body.category_name;
          let description = req.body.description;
          let query = "select * from categories where category_name = " + mysql.escape(category) + " limit 1";
          connection.query(query, (err, result, fields) => {
            if (err)
              throw err;
            if (result.length > 0) {
              res.json({response: 'This category already exists'});
            } else {
              connection.connect((err) => {
                let category = req.body.category_name;
                let description = req.body.description;
                let values = [];
                values.push(category, description);
                let query = "insert into categories (category_name, category_description) values (" + mysql.escape(values) + ")";
                connection.query(query, (err, result, fields) => {
                  if (err)
                    throw err;
                  res.json({
                    response: {
                      message: 'Category has created successfully!',
                      id_category: result.insertId
                    }
                  });
                });
              });
            }
          });
        });
      } else {
        res.json({response: 'category name and description is required'});
      }
    }
  });
});

router.put('/categories/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if ('category_name', 'category_description' in req.body) {
        connection.connect((err) => {
          let category_name = req.body.category_name;
          let category_description = req.body.category_description;
          let id = req.params.id;
          connection.query('update categories set category_name = ' + mysql.escape(category_name) + ', category_description = ' + mysql.escape(category_description) + ' where id = ' + mysql.escape(id), (err, result, fields) => {
            if (err)
              throw err;
            res.json({response: 'Category updated sucessfully!'});
          });
        });
      }
    }
  });
});

router.delete('/categories/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      connection.connect((err) => {
        let id = req.params.id;
        connection.query('delete from categories where id = ' + mysql.escape(id), (err, result, fields) => {
          if (err)
            throw err;
          res.json({response: 'Category deleted sucessfully!'});
        });
      });
    }
  });
});

router.get('/categories/:id', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      connection.connect((err) => {
        connection.query('select * from categories where id = ' + mysql.escape(id), (err, result, fields) => {
          if (err)
            throw err;
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

router.get('/categories/:id/all', ensureToken, (req, res) => {
  jwt.verify(req.token, 'bobesponja63', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      connection.connect((err) => {
        connection.query('select * from categories where id = ' + mysql.escape(id), (err, result, fields) => {
          if (err)
            throw err;
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
