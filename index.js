'use strict';

const basicAuth = require('basic-auth');

function unauthorized(res, realm) {
  const _realm = realm || 'Authorization Required';
  res.set('WWW-Authenticate', `Basic realm=${_realm}`);

  return res.sendStatus(401);
};

function isPromiseLike(obj) {
  return obj && typeof obj.then === 'function';
}

function createMiddleware(username, password, realm) {
  return function basicAuthMiddleware(req, res, next) {
    const user = basicAuth(req);
    if (!user) {
      return unauthorized(res, realm);
    }

    let authorized = null;
    if (typeof username === 'function') {
      const checkFn = username;
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
        })
        .catch(next);
    }

    if (authorized === false) {
      return unauthorized(res, realm);
    }

    if (authorized === true) {
      return next();
    }
  };
};


module.exports = createMiddleware;
