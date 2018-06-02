let morgan = require('morgan');

const C_RESET = '\033[0m';
const C_GREEN = '\033[32m';
const C_YELLOW = '\033[33m';
const C_BLUE = '\033[36m';
const C_RED = '\033[31m';
const C_GREY = '\033[90m';

const prependers = {
   method: function (verb) {
      switch (verb.toLowerCase())
      {
         case 'post':
            return C_YELLOW;            
         case 'put':
            return C_GREEN;            
         case 'delete':
            return C_RED;            
         default:
            return C_RESET;
      }
   },

   status: function (code) {
      if (code.toString().match(/^2\d+$/))
         return C_GREEN;
      else if (code.toString().match(/^3\d+$/))
         return C_BLUE;
      else if (code.toString().match(/^4\d+$/))
         return C_YELLOW;
      else if (code.toString().match(/^5\d+$/))
         return C_RED;

      return C_RESET;
   },

   responseTime: function (time) {
      time = parseFloat(time)
      if (!time) return C_RESET;

      if (time < 15)
         return C_GREEN;
      else if (time >= 15 && time < 30)
         return C_BLUE;
      else if (time >= 30 && time < 100)
         return C_YELLOW;
      else if (time >= 100)
         return C_RED;

      return C_RESET;
   },

   noise: function (str) {
      return C_GREY;
   }
}

function prependColor (str, fn) {
   return (typeof(fn) === 'function' ? fn(str) : C_RESET) + (str || '');
}

module.exports = morgan(function (tokens, req, res) {
   return [
      prependColor(tokens.status(req, res), prependers.status),
      prependColor(tokens.method(req, res), prependers.method),
      prependColor(tokens.url(req, res)),
      prependColor(tokens.res(req, res, 'content-length') || '0', prependers.contentLength), '-',
      prependColor(tokens['response-time'](req, res), prependers.responseTime), 'ms',
      '-', prependColor(tokens.date(req, res, 'clf')),
      prependColor(tokens['remote-addr'](req, res), prependers.noise), '-',
      'HTTP/' + prependColor(tokens['http-version'](req, res), prependers.noise),
      prependColor(tokens.referrer(req, res), prependers.noise),
      prependColor(tokens['user-agent'](req, res), prependers.noise),
   ].join(' ') + C_RESET;
});