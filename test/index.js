'use strict';

var Buffer = require('safe-buffer').Buffer;
var asn1 = require('parse-asn1/asn1');
var test = require('tape').test;
var nCrypto = require('crypto');
var semver = require('semver');
var bCrypto = require('../browser');
var fixtures = require('./fixtures');

fixtures.valid.rsa.forEach(function (f) {
  var message = Buffer.from(f.message);
  var pub = Buffer.from(f['public'], 'base64');
  var priv;

  if (f.passphrase) {
    priv = {
      key: Buffer.from(f['private'], 'base64'),
      passphrase: f.passphrase
    };
  } else {
    priv = Buffer.from(f['private'], 'base64');
  }

  (nCrypto.getHashes().indexOf(f.scheme) >= 0 ? test : test.skip)(f.message, function (t) {
    var bSign;
    try {
      bSign = bCrypto.createSign(f.scheme);
    } catch (e) {
      console.info('skipping unsupported browserify-sign scheme', f.scheme);
      t.end();
      return;
    }

    try {
      var nSign = nCrypto.createSign(f.scheme);
    } catch (e) {
      console.info('skipping unsupported node scheme', f.scheme);
      t.end();
      return;
    }

    var bSig = bSign.update(message).sign(priv);
    var nSig = nSign.update(message).sign(priv);

    t.equals(bSig.length, nSig.length, 'correct length');
    t.equals(bSig.toString('hex'), nSig.toString('hex'), 'equal sigs');
    t.equals(bSig.toString('hex'), f.signature, 'compare to known');

    t.ok(nCrypto.createVerify(f.scheme).update(message).verify(pub, nSig), 'node validate node sig');
    t.ok(nCrypto.createVerify(f.scheme).update(message).verify(pub, bSig), 'node validate browser sig');

    t.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, nSig), 'browser validate node sig');
    t.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, bSig), 'browser validate browser sig');

    t.end();
  });
});

// node has padding support since 8.0
// TODO: figure out why node v8.0 - v8.6 is broken
(semver.satisfies(process.versions.node, '>= 8.6') ? test : test.skip)('padding option', function (t) {
  var f = fixtures.valid.rsa[0];
  var message = Buffer.from(f.message);
  var priv = {
    key: Buffer.from(f['private'], 'base64'),
    padding: 11646841 // Some invalid value
  };

  t.test('invalid padding option', function (st) {
    var bSign = bCrypto.createSign(f.scheme);
    var nSign = nCrypto.createSign(f.scheme);
    st['throws'](
      function () { bSign.update(message).sign(priv); },
      /illegal or unsupported padding mode/,
      'browser throws exception with proper message'
    );
    st['throws'](
      function () { nSign.update(message).sign(priv); },
      /illegal or unsupported padding mode/,
      'node throws exception with proper message'
    );

    st.end();
  });

  t.end();
});

fixtures.valid.ec.forEach(function (f) {
  var message = Buffer.from(f.message);
  var pub = Buffer.from(f['public'], 'base64');
  var priv;

  if (f.passphrase) {
    priv = {
      key: Buffer.from(f['private'], 'base64'),
      passphrase: f.passphrase
    };
  } else {
    priv = Buffer.from(f['private'], 'base64');
  }

  (nCrypto.getHashes().indexOf(f.scheme) >= 0 ? test : test.skip)(f.message, function (t) {
    var nSign;
    try {
      nSign = nCrypto.createSign(f.scheme);
    } catch (e) {
      console.info('skipping unsupported browserify-sign scheme', f.scheme);
      t.end();
      return;
    }

    var bSign;
    try {
      bSign = bCrypto.createSign(f.scheme);
    } catch (e) {
      console.info('skipping unsupported node scheme', f.scheme);
      t.end();
      return;
    }

    var bSig = bSign.update(message).sign(priv);
    var nSig = nSign.update(message).sign(priv);
    t.notEqual(bSig.toString('hex'), nSig.toString('hex'), 'not equal sigs');
    t.equals(bSig.toString('hex'), f.signature, 'sig is determanistic');

    var nVer = nCrypto.createVerify(f.scheme);
    t.ok(nVer.update(message).verify(pub, bSig), 'node validate browser sig');

    var bVer = bCrypto.createVerify(f.scheme);
    t.ok(bVer.update(message).verify(pub, nSig), 'browser validate node sig');

    t.end();
  });

  if (f.scheme !== 'DSA' && f.scheme.toLowerCase().indexOf('dsa') === -1) {
    test(f.message + ' named rsa through', function (t) {
      var scheme = 'RSA-' + f.scheme.toUpperCase();
      var nSign = nCrypto.createSign(scheme);
      var bSign = bCrypto.createSign(scheme);

      var bSig = bSign.update(message).sign(priv);
      var nSig = nSign.update(message).sign(priv);
      t.notEqual(bSig.toString('hex'), nSig.toString('hex'), 'not equal sigs');
      t.equals(bSig.toString('hex'), f.signature, 'sig is determanistic');

      var nVer = nCrypto.createVerify(f.scheme);
      t.ok(nVer.update(message).verify(pub, bSig), 'node validate browser sig');

      var bVer = bCrypto.createVerify(f.scheme);
      t.ok(bVer.update(message).verify(pub, nSig), 'browser validate node sig');

      t.end();
    });
  }
});

fixtures.valid.kvectors.forEach(function (f) {
  test('kvector algo: ' + f.algo + ' key len: ' + f.key.length + ' msg: ' + f.msg, function (t) {
    var key = Buffer.from(f.key, 'base64');

    var bSig = bCrypto.createSign(f.algo).update(f.msg).sign(key);
    var bRS = asn1.signature.decode(bSig, 'der');
    t.equals(bRS.r.toString(16), f.r.toLowerCase(), 'r');
    t.equals(bRS.s.toString(16), f.s.toLowerCase(), 's');

    t.end();
  });
});

fixtures.invalid.verify.forEach(function (f) {
  test(f.description, function (t) {
    var sign = Buffer.from(f.signature, 'hex');
    var pub = Buffer.from(f['public'], 'base64');
    var message = Buffer.from(f.message);

    var nVerify = nCrypto.createVerify(f.scheme).update(message).verify(pub, sign);
    t.notOk(nVerify, 'node rejects it');

    var bVerify = bCrypto.createVerify(f.scheme).update(message).verify(pub, sign);
    t.notOk(bVerify, 'We reject it');

    t.end();
  });
});
