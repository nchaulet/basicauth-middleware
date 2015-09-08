var middleware = require('../index');
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');
var assert = require('chai').assert;

var req  = httpMocks.createRequest({
  headers: {
    Authorization: 'Basic ' + (new Buffer('username:password')).toString('base64')
  }
});

describe('basicauth-middleware', function() {
  it('should call next if user is authentified', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware('username', 'password')(req, res, next);

    assert.isTrue(next.called);
  });

  it('should not call next if user is not authentified', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware('userNotAuthetified', 'userNotAuthetified')(req, res, next);

    assert.isFalse(next.called);
  });

  it('should respond with 401 if user is not authentified', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware('userNotAuthetified', 'userNotAuthetified')(req, res, next);

    assert.equal(res.statusCode, 401);
  });

  it('should call next if checkFn return true', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function() {
      return true;
    })(req, res, next);

    assert.isTrue(next.called);
  });

  it('should not call next if checkFn return false', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function() {
      return false;
    })(req, res, next);

    assert.isFalse(next.called);
  });

  it('should respond with 401 if checkFn return false', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function() {
      return false;
    })(req, res, next);

    assert.equal(res.statusCode, 401);
  });

  it('should call next if checkFn call checkCb with true', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function(username, password, checkCb) {
      checkCb(true);
    })(req, res, next);

    assert.isTrue(next.called);
  });

  it('should not call next if checkFn call checkCb with false', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function(username, password, checkCb) {
      checkCb(false);
    })(req, res, next);

    assert.isFalse(next.called);
  });

  it('should respond 401 if checkFn call checkCb with false', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function(username, password, checkCb) {
      checkCb(false);
    })(req, res, next);

    assert.equal(res.statusCode, 401);
  });

  it('should not call next if checkFn dont call checkCb', function() {
    var res = httpMocks.createResponse();
    var next = sinon.spy();
    middleware(function(username, password, checkCb) {
    })(req, res, next);

    assert.isFalse(next.called);
  });
});
