var basicAuth = require('basic-auth');

var unauthorized = function(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');

  return res.sendStatus(401);
};

module.exports = function(username, password) {
  return function(req, res, next) {
    var user = basicAuth(req);

    if (!user) {
      return unauthorized(res);
    }

    if (typeof username === 'string') {
      if (!user || user.name !== username || user.pass !== password) {
        return unauthorized(res);
      }

      return next();
    }

   var checkFn = username;
   checkFn(user.name, user.pass, function(authentified) {
    if (authentified) {
      return next();
    }

    return unauthorized(res);
   });
  };
};
