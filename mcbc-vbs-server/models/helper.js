const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
   street: String,
   city: String,
   province: String,
   postal_code: String,
});

AddressSchema.methods.toString = function () {
   return `${this.street}, ${this.city}, ${this.province} ${this.postal_code}`;
}

module.exports = {
   models: {
      Address: {
         schema: AddressSchema,
         model: mongoose.model('Address', AddressSchema)
      }
   },
   transforms: {
      yesNo: x => x ? "Yes" : "No",
      date: date => date ? date.toDateString() : undefined,
      phone: phone => phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
      address: address => address.toString(),
      splitLines: arr => !arr.length ? arr : arr.reduce((acc, val, i) => {
         let result = `(${i+1}) ` + val;
         if (i > 0)
            result = acc + ", " + result;
         return result;
      }, arr[0])
   }
};
