const express = require('express');
const router = express.Router();
const path = require('path');

const ApiHelper = require('./helper');
const Status = ApiHelper.helper.Status;
const respond = ApiHelper.helper.respond;

const VolunteerModel = require('../../models/volunteer');
const Volunteer = VolunteerModel.model;

// Create: one volunteer registration
router.put('/', function (req, res, next) {
   // We assume that the request body data is in the right format
   const doc = new Volunteer(req.body);   

   // Attach other data that did not come from the user form
   doc.date_of_registration = new Date();

   console.log(`Saving volunteer to DB:\n${doc}`);
   doc.save()
      .then(doc => {
         const message = `Successfully saved volunteer ${doc.name}`;
         console.log(message);

         // TODO: Email volunteer and director about result

         res.respond(Status.ok);
      })
      .catch(err => {
         const message = `Failed to save volunteer ${doc.name}: ${err}`;
         console.error(message);

         res.respond(Status.error, new Error(message));
      });
});

// Read: all
router.get('/', function (req, res, next) {
   const projection = {};
   if (req.query.pretty) {
      // Exclude the following fields when the object is to be prettified
      projection._id = 0;
      projection.__v = 0;
   }

   VolunteerModel.model.find(null, projection)
        .then(volunteers => res.respond(Status.ok, { submissions: volunteers.map(doc => req.query.pretty ? doc.toJSON() : doc.toObject()), headers: VolunteerModel.propertyNames }))
        .catch(err => next(err));
});

module.exports = router;