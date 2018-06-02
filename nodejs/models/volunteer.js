const mongoose = require('mongoose');

const AddressSchema = require('./helper').models.Address.schema;
const transforms = require('./helper').transforms;

const VolunteerSchema = mongoose.Schema({
   first_name: String,
   last_name: String,
   date_of_registration: { type: Date, get: transforms.date },
   shirt_size: String,
   address: { type: AddressSchema, get: transforms.address },
   phone: { type: String, get: transforms.phone },
   email: String,
   is_adult: {
      type: Boolean,
      default: false,
      get: transforms.yesNo
   },
   police_check_completed: {
      type: Boolean,
      default: false,
      get: transforms.yesNo
   },
   ranked_aoi: { type: [String], get: transforms.splitLines },
   emergency_first_name: String,
   emergency_last_name: String,
   emergency_relationship: String,
   emergency_phone: { type: String, get: transforms.phone },
});

/// Virtuals

VolunteerSchema.virtual('name').get(function () {
   return `${this.first_name} ${this.last_name}`;
});

VolunteerSchema.virtual('emergency_name').get(function () {
   return `${this.emergency_first_name} ${this.emergency_last_name}`;
});

/// Default settings
VolunteerSchema.set('toJSON', { getters: true, virtuals: false }); // deal with the transformed/prettified data
VolunteerSchema.set('toObject', { getters: false, virtuals: false }); // deal with the raw original data

const propertyNames = {
   first_name: "First Name",
   last_name: "Last Name",
   date_of_registration: "Registered On",
   shirt_size: "Shirt",
   address: "Address",
   phone: "Phone",
   email: "Email",
   is_adult: "Is 18 or older?",
   police_check_completed: "Police Check Completed and Submitted?",
   ranked_aoi: "Ranked Areas of Interest",
   emergency_first_name: "Emergency Contact's First Name",
   emergency_last_name: "Emergency Contact's Last Name",
   emergency_relationship: "Emergency Contact's Relationship to Volunteer",
   emergency_phone: "Emergency Contact's Phone",
}

const Volunteer = mongoose.model('Volunteer', VolunteerSchema);

module.exports = {
   schema: VolunteerSchema,
   model: Volunteer,
   propertyNames: propertyNames,
};