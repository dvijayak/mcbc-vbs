const mongoose = require('mongoose');
const crypto = require('crypto');

const security = require(process.env.VBS2017_SECURITYCFG || "../security.config.dev");

const UserSchema = mongoose.Schema({
   username: String,
   password: String,
   last_login: Date
});

UserSchema.methods.validPassword = function (password) {
   return this.password === security.hashPassword(password);
}

UserSchema.statics.findByUserName = function (username) {
   return this.find({username: new RegExp(username)}); // returns a promise
}

const User = mongoose.model('User', UserSchema);

module.exports = {
   schema: UserSchema,
   model: User
};