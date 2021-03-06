const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mysql = require('mysql');
const config = require('./config/database');
const users = require('./routes/users');
const forge = require('node-forge');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const pay = require('./routes/Pay');
const stores = require('./routes/stores');
const cert = require('./routes/Cert');

const https = require('https');
const http = require('http');

const app = express();

// port number
//const port = 3000;
const port = process.env.PORT || 6000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyparser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//app.use('/user', passport.authenticate('jwt', {session: false}), users);
app.use('/users', users);
app.use('/stores', stores);
app.use('/Pay', pay);
app.use('/Cert', cert);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'), function(err) {
        if (err) {
            res.status(500).send(err)
        }
    })
});


// Start server
app.listen(port, function(){
    console.log("server started on port "+port);
});

/*
https.createServer(app).listen(port, function(){
    console.log('Https server started on port '+port);
});*/