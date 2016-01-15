var basicAuth = require('basic-auth');

var unauthorized = function(res, realm) {
  var realm = realm || 'Authorization Required';
  res.set('WWW-Authenticate', 'Basic realm=' + realm);

  return res.sendStatus(401);
};

module.exports = function(username, password, realm) {
  return function(req, res, next) {
    var user = basicAuth(req);
    if (!user) {
      return unauthorized(res, realm);
    }

    var authorized = null;
    if (typeof username === 'function') {
      var checkFn = username;
      authorized = checkFn(user.name, user.pass, function(authentified) {
        if (authentified) {
          return next();
        }

        return unauthorized(res, realm);
      });
    } else {
      authorized = !(!user || user.name !== username || user.pass !== password);
    }

    if (authorized === false) {
      return unauthorized(res, realm);
    }

    if (authorized === true) {
      return next();
    }
  };
};
