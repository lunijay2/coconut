const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require("./database");
const mysql = require('mysql');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme( 'jwt');
    opts.secretOrKey = config.secret;

    //console.log('secretOrKey : ' + opts.secretOrKey);

    passport.use(new JwtStrategy( opts, (jwt_payload, done) => {
        //console.log('jwt_payload : '+JSON.stringify(jwt_payload));
        let statement = "SELECT * FROM user WHERE id='" + jwt_payload.data.id + "';";
        var pool = mysql.createPool(config);

        pool.getConnection(function (err, connection) {
            if(!err){
                connection.query(statement, function(err, rows, fields) {
                    if (err) {
                        console.log('Error while performing Query.', err);
                        throw err;
                        return done(err, false);
                    } else if (rows){
                        //console.log('The solution is: ', JSON.stringify(rows[0]));
                        return done(null, rows[0]);
                    } else {
                        return done(null, false);
                    }
                });
                connection.release(); //쿼리가 성공하던 실패하던 커넥션을 반환해야 함
            }
        });

        /*
        pool.getConnection((connection, err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (connection) {
                connection.query(statement, (err, rows, fields) => {
                    if (err) {
                        return done(err, false);
                    }
                    if (rows) {
                        return done(null, rows[0]);
                    } else {
                        return done(null, false);
                    }
                })
            }
        });
        */
    }));
};