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

    var authorized = null;
    if (typeof username === 'function') {
      var checkFn = username;
      authorized = checkFn(user.name, user.pass, function(authentified) {
        if (authentified) {
          return next();
        }

        return unauthorized(res);
      });
    } else {
      authorized = !(!user || user.name !== username || user.pass !== password);
    }

    if (authorized === false) {
      return unauthorized(res);
    }

    if (authorized === true) {
      return next();
    }
  };
};
