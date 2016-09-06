var middleware = require('../index');
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');
var assert = require('chai').assert;
var Promise = require('es6-promise').Promise;

var req  = httpMocks.createRequest({
  headers: {
    Authorization: 'Basic ' + (new Buffer('username:password')).toString('base64')
  }
});

describe('basicauth-middleware', function() {
  describe('With plain username and password', function() {
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

    it('should respond with default realm', function() {
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      middleware('no', 'no')(req, res, next);

      assert.equal(res.getHeader('WWW-Authenticate'), 'Basic realm=Authorization Required');
    });

    it('should respond with custom realm if configured', function() {
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      middleware('no', 'no', 'Secret Garden')(req, res, next);

      assert.equal(res.getHeader('WWW-Authenticate'), 'Basic realm=Secret Garden');
    });
  });

  describe('With sync checkFn', function() {
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

    it('should call next with error if an uncaught error occurs here', function() {
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      var err = new Error('Test error');;
      middleware(function() {
        throw err;
      })(req, res, next);

      assert.isTrue(next.calledWith(err));
    });
  });

  describe('With async checkFn', function() {
    it('should call next if checkFn call checkCb with true', function() {
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      middleware(function(username, password, checkCb) {
        checkCb(null, true);
      })(req, res, next);

      assert.isTrue(next.called);
    });

    it('should call next with error checkFn call return an error', function() {
      var error = new Error('test error');
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      middleware(function(username, password, checkCb) {
        checkCb(new Error('test error'));
      })(req, res, next);

      assert.isTrue(next.calledWith(error));
    });

    it('should not call next if checkFn call checkCb with false', function() {
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      middleware(function(username, password, checkCb) {
        checkCb(null, false);
      })(req, res, next);

      assert.isFalse(next.called);
    });

    it('should respond 401 if checkFn call checkCb with false', function() {
      var res = httpMocks.createResponse();
      var next = sinon.spy();
      middleware(function(username, password, checkCb) {
        checkCb(null, false);
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

  describe('With promise', function() {
    it('call next with an autorized user', function(done) {
      var res = httpMocks.createResponse();

      middleware(function(username, password) {
        return Promise.resolve(true);
      })(req, res, function() {
        done();
      });
    });

    it('should call next with error with promise error', function(done) {
      var res = httpMocks.createResponse();

      middleware(function(username, password) {
        return Promise.reject(new Error('test'));
      })(req, res, function(err) {
        assert.instanceOf(err, Error);
        done();
      });
    });

    it('should send 401 with an unauthorized user', function(done) {
      var res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      var next = sinon.spy();

      middleware(function(username, password) {
        return Promise.resolve(false);
      })(req, res, next);

      res.on('end', function() {
        assert.isFalse(next.called);
        assert.equal(res.statusCode, 401);
        done();
      });
    });
  });
});
