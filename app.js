const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const users = require('./routes/users');
const mysql = require('mysql');
const config = require('./config/database');

const app = express();

// port number
const port = 3000;
//const port = process.env.PORT || 6000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyparser.json());

app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(port, function(){
    console.log("server started on port "+port);
});
