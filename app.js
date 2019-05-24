const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const users = require('./routes/users');
const mysql = require('mysql');
const config = require('./config/database');

const app = express();


/*
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'dba',
    password : 'jbis2019',
    port     : 3306,
    database : 'coconut'
});


var connection = mysql.createConnection(config);

connection.connect();


connection.query("INSERT INTO `user` (`name`, `id`, `password`, `tell`, `addr`, `email`, `indi`) VALUES ('마민기3', 'ma03', 'j789249', '01074859012', '경기도', 'ma03@gmail.com', '0')", function(err, rows, fields) {
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.', err);
});

connection.query("SELECT * from user", function(err, rows, fields) {
    if (!err)
        console.log('The solution is: ', rows);
    else
        console.log('Error while performing Query.', err);
});
*/

// port number
//const port = 3000;
const port = process.env.PORT || 6000;

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

//connection.end();