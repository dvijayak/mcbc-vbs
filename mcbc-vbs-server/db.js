const DBConfig = require(process.env.VBS_DBCFG || "./db.config.dev");

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Mongoose comes with mpromises by default, but we want to use ES6 native promises

mongoose.connect(`mongodb://${DBConfig.host}:${DBConfig.port}/${DBConfig.db}`);
const db = mongoose.connection;

db.on('error', err => { throw err} ); // there is no point in continuing if we can't talk to the DB - note that mongoose will automatically try to reconnect but after the timeout, it will fail and result in this error being thrown...dieing *might* be too strong of a reaction, however the website is useless without the DB..
db.once('open', function () {
   console.log("Successfully connected to MongoDB!");
});
// We want the connection to persist for the entire lifetime of the application.

module.exports = db;

