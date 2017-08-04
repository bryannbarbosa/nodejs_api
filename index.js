const express = require('express');
const bodyParser = require('body-parser');

// Routes

const routes = [
 require('./routes/users'),
 require('./routes/categories'),
 require('./routes/exercises'),
 require('./routes/steps'),
 require('./routes/comparisons')
];

// Setup our app
const app = express();
app.use(bodyParser.json());
// Inserting routes with loop
routes.map(route => app.use('/api', route));

// Error handler

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {response: 'This is an error'}
  });
});

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send({name: 'Yoshi'});
});

// Listen for requests
app.listen(process.env.port || 4000, function(){
  console.log('Server is running');
});
