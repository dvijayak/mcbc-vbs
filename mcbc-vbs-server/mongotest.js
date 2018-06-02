/// This file is used to create test data in the MongoDB store, for development testing

// Some helpers //

Array.prototype.repeat = function (n) {
   if (typeof n !== 'number' || n < 2)
      return this;

   const result = [];
   for (let i = 0; i < n; i++)
      this.map(el => result.push(el));

   return result;
}

//////////////////////

const DBConfig = require(process.env.VBS2017_DBCFG || "./db.config.dev");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Mongoose comes with mpromises by default, but we want to use ES6 native promises
mongoose.connect(`mongodb://${DBConfig.host}:${DBConfig.port}/${DBConfig.db}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log("We're in!");

   // Create the admin user
   const User = require('./models/user').model;
   const security = require(process.env.VBS2017_SECURITYCFG || "./security.config.dev");
   const admin = new User({
      username: 'admin',
      password: security.hashPassword('password')
   });

   // Create test children
   const Child = require('./models/child').model;
   let childrenData = [
      {
         first_name: "Alexandria",
         last_name: "Bennett",
         dob: new Date('2009-05-06'),
         date_of_registration: new Date('2017-07-03'),
         grade: "3",
         shirt_size: "L",
         address: {
            street: "412 Knockers Crescent",
            city: "Mississauga",
            province: "Ontario",
            postal_code: "L4R 2Z3"
         },
         medical_info: "N/A",
         is_photo_allowed: true,
         is_photo_public_use_allowed: true,
         parent_first_name: "Brooklyn",
         parent_last_name: "Bennett",
         parent_phone: "4162540978",
         parent_email: "brooklyn.bennett@yahoo.ca",
         emergency_first_name: "Bent",
         emergency_last_name: "Galloway" ,
         emergency_relationship: "Uncle",
         emergency_phone: "6479801932",
      },
      {
         first_name: "Rose",
         last_name: "Sparks",
         dob: new Date('2007-02-28'),
         date_of_registration: new Date('2017-06-02'),
         grade: "5",
         shirt_size: "M",
         address: {
            street: "1835 Bramlea Drive",
            city: "Oakville",
            province: "Ontario",
            postal_code: "S4R 1B5"
         },
         medical_info: "Allergic to peanuts",
         is_photo_allowed: true,
         is_photo_public_use_allowed: false,
         parent_first_name: "Paul",
         parent_last_name: "Bentley",
         parent_phone: "9058897920",
         parent_email: "paul.bent@outlook.com",
         emergency_first_name: "Caitlyn",
         emergency_last_name: "Bentley" ,
         emergency_relationship: "Mother",
         emergency_phone: "6475294720",
      },
      {
         first_name: "Thomas",
         last_name: "Goodson",
         dob: new Date('2010-08-13'),
         date_of_registration: new Date('2017-05-28'),
         grade: "1",
         shirt_size: "XS",
         address: {
            street: "34 Marvin Court",
            city: "Mississauga",
            province: "Ontario",
            postal_code: "L8X 9F4"
         },
         medical_info: "",
         is_photo_allowed: false,
         is_photo_public_use_allowed: false,
         parent_first_name: "Rita",
         parent_last_name: "Alfonso",
         parent_phone: "9050280923",
         parent_email: "thealfonsoes@gmail.com",
         emergency_first_name: "Juan",
         emergency_last_name: "Pervez" ,
         emergency_relationship: "Family friend",
         emergency_phone: "4168560409",
      },
   ];
   childrenData = childrenData.repeat(5);
   const children = childrenData.map(data => new Child(data));

   // Create test volunteers
   const Volunteer = require('./models/volunteer').model;
   let volunteersData = [
      {
         first_name: "Leinad",
         last_name: "Delacour",
         date_of_registration: new Date('2017-06-28'),
         shirt_size: "M",
         address: {
            street: "1456 Court Road",
            city: "Mississauga",
            province: "Ontario",
            postal_code: "L31 2B5"
         },
         email: "javelind@hotmail.com",
         phone: "4160395820",
         is_adult: true,
         police_check_completed: true,
         ranked_aoi: ["Music", "Small Group", "Audio/Video"],
         emergency_first_name: "Michael",
         emergency_last_name: "Olofernes" ,
         emergency_relationship: "Cousin brother",
         emergency_phone: "9052459293",
      },
      {
         first_name: "Bogdan",
         last_name: "Ionescu",
         date_of_registration: new Date('2017-06-28'),
         shirt_size: "L",
         address: {
            street: "990 Brixton Blvd",
            city: "Oakville",
            province: "Ontario",
            postal_code: "F31 4VJ"
         },
         email: "bionescu@uoguelph.ca",
         phone: "4160395820",
         is_adult: true,
         police_check_completed: true,
         ranked_aoi: ["Snacks", "Stage Creation", "Security"],
         emergency_first_name: "Dan",
         emergency_last_name: "Oldenburg" ,
         emergency_relationship: "Soccer Coach",
         emergency_phone: "5192340394",
      },
      {
         first_name: "Florence",
         last_name: "Smith",
         date_of_registration: new Date('2017-05-29'),
         shirt_size: "S",
         address: {
            street: "12 Milwaukee Crescent",
            city: "Mississauga",
            province: "Ontario",
            postal_code: "B2H 9Z3"
         },
         email: "florence.smith@gmail.com",
         phone: "9058277101",
         is_adult: false,
         ranked_aoi: ["First Aid", "Stage Creation", "Sports"],
         emergency_first_name: "Daniel",
         emergency_last_name: "Smith" ,
         emergency_relationship: "Father",
         emergency_phone: "9058277101",
      },
   ];
   volunteersData = volunteersData.repeat(10);
   const volunteers = volunteersData.map(data => new Volunteer(data));

   // Clear all existing data, save all data, and close
   User.remove()
       .then(() => Child.remove())
       .then(() => Volunteer.remove())
       .then(() => admin.save())
       .then(user => console.log(`Saved user: ${user}`) || Child.insertMany(children))
       .then(children => console.log(`Saved children: ${children}`) || Volunteer.insertMany(volunteers))
       .then(volunteers => console.log(`Saved volunteers: ${volunteers}`) || db.close())
       .then(() => console.log("Goodbye!"))
       .catch(err => console.error(err));
});