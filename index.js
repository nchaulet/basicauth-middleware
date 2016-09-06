var basicAuth = require('basic-auth');

function unauthorized(res, realm) {
  var realm = realm || 'Authorization Required';
  res.set('WWW-Authenticate', 'Basic realm=' + realm);

  return res.sendStatus(401);
};

function isPromiseLike(obj) {
  return obj && typeof obj.then === 'function';
}

module.exports = function(username, password, realm) {
  return function(req, res, next) {
    var user = basicAuth(req);
    if (!user) {
      return unauthorized(res, realm);
    }

    var authorized = null;
    if (typeof username === 'function') {
      var checkFn = username;
      try {
        authorized = checkFn(user.name, user.pass, function checkFnCallback(err, authentified) {
          if (err) {
            return next(err);
          }

          if (authentified) {
            return next();
          }

          return unauthorized(res, realm);
        });
      } catch(err) {
        next(err);
      }
    } else {
      authorized = !(!user || user.name !== username || user.pass !== password);
    }

    if (isPromiseLike(authorized)) {
      return authorized
        .then(function(authorized) {
          if (authorized === true) {
            return next();
          }

          return unauthorized(res, realm);
        }, next);
    }

    if (authorized === false) {
      return unauthorized(res, realm);
    }

    if (authorized === true) {
      return next();
    }
  };
};
