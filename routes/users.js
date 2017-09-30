const express = require('express');
const mysql = require('mysql');
const connection = require('../database/env');
const jwt = require('jsonwebtoken');
const ensureToken = require('../middleware/ensuretoken');
const router = express.Router();

router.post('/authentication', (req, res) => {

  if ('email', 'password' in req.body) {
    let email = req.body.email;
    let password = req.body.password;
    connection.connect((err) => {
      connection.query("select * from users where email = "
      + mysql.escape(email) + "and password = "
      + mysql.escape(password) + " limit 1", (err, result, fields) => {
        if(err) throw err;
        if(result.length > 0) {
          const token = jwt.sign({id: result[0].id}, 'bobesponja63');
          res.json({
            response: token,
            success: true
          });
        } else {
          res.json({
            response: 'Wrong email or password for authentication',
            success: false
          })
        }
      });
    });
  } else {
    res.send({response: 'Bad Credentials'});
  }
});

router.post('/users', (req, res) => {
  if('name', 'email', 'password', 'matriculation' in req.body) {
    connection.connect((err) => {
      let email = req.body.email;
      let matriculation = req.body.matriculation;
      let query = "select * from users where email = " + mysql.escape(email)
      + " or matriculation_id = " + mysql.escape(matriculation) + " limit 1";
      connection.query(query, (err, result, fields) => {
        if(err) throw err;
        if(result.length > 0) {
          res.json({
            response: 'This account already exists'
          });
        } else {
            connection.connect((err) => {
            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;
            let matriculation = req.body.matriculation;
            let values = [];
            values.push(name, password, email, matriculation);
            let query = "insert into users (name, password, email, matriculation_id) values (" + mysql
            .escape(values) + ")";
            connection.query(query, (err, result, fields) => {
              if(err) throw err;
              res.json({
                response: {
                  message: 'Account has created successfully!',
                  id_account: result.insertId,
                }
              });
            });
          });
        }
      });
    });
  } else {
    res.json({response: 'Name, email, password and matriculation is required'});
  }
});

module.exports = router;
