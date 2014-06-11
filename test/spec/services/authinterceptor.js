'use strict';
/*jshint expr: true*/
/* global CryptoJS: false */

describe('Service: Authinterceptor', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var Authinterceptor;
  beforeEach(inject(function (_Authinterceptor_) {
    Authinterceptor = _Authinterceptor_;
  }));

  var u = {
    username: 'test-user',
    passwordhash: 'test-hash'
  };

  it('should add add authentication details to each request config', function () {
    Authinterceptor.setLoggedInUser(u);

    var config = {};
    config.headers = {};
    config = Authinterceptor.request(config);

    config.headers['auth-username'].should.be.eql(u.username);
    config.headers['auth-ts'].should.exist;
    config.headers['auth-salt'].should.exist;
    config.headers['auth-token'].should.exist;

    var sha512 = CryptoJS.algo.SHA512.create();
    sha512.update(u.passwordhash);
    sha512.update(config.headers['auth-salt']);
    sha512.update(config.headers['auth-ts']);
    var hash = sha512.finalize();

    config.headers['auth-token'].should.eql(hash.toString(CryptoJS.enc.Hex));
  });

  it('should set the logged in user', function () {
    Authinterceptor.setLoggedInUser(u);
    var u2 = Authinterceptor.getLoggedInUser();

    u.should.be.eql(u2);
  });

});