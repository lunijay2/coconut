const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require("./database");
const mysql = require('mysql');

module.exports = function(passport){

    var pool = mysql.createPool(config);

    passport.use(new JwtStrategy({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : config.secret
        },
        function (jwtPayload, cb) {

            let statement = "SELECT * FROM user WHERE id='" + jwtPayload.id + "';";

            return pool.getConnection()
                .then( connection => {
                    return connection.query(statement)
                })
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ));
}