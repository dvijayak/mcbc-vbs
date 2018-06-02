const ApiHelper = {};

ApiHelper.Status = {
   ok: { message: "OK", code: 200},
   error: { message: "ERROR", code: 500}, // generic internal error
   badrequest: { message: "BAD REQUEST", code: 400},
   missing: { message: "NOT FOUND", code: 404},
   unauthorized: { message: "UNAUTHORIZED", code: 401},
};

// Standard function for issuing responses to API requests
// Expected to be attached to the Express response object
// status is expected to an object with 'message' and 'code' properties
ApiHelper.respond = function (status, data) {
   const res = this; // assumes that we've been attached
   if (!res || // probably unnecessary?
       !status ||
       typeof status !== 'object' ||
       (!status.message || !status.code) || 
       (data && typeof data !== 'object')
      )
      return false;

   // Normalize status
   const message = status.message.toUpperCase();
   const statusCode = parseInt(status.code);

   // Normalize data payload
   if (!data) {
      data = {}
   } else if (data instanceof Error) {
      data = {
         name: data.name,
         message: data.message,
         stack: data.stack
      }
   }

   // Now, configure and issue the response
   res.statusCode = statusCode;
   res.json({
      statusCode: statusCode,
      status: message,
      data: data
   });

   return true;
};

module.exports = {
   helper: ApiHelper,
   inject: function (req, res) {
      // Inject helpers to the appropriate express objects
      res.respond = ApiHelper.respond; // normalize responses to API requests

      return [req, res];
   }
}