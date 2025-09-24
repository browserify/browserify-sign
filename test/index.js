'use strict';

var Buffer = require('safe-buffer').Buffer;
var asn1 = require('parse-asn1/asn1');
var test = require('tape');
var nCrypto = require('crypto');
var semver = require('semver');
var BN = require('bn.js');
var parseKeys = require('parse-asn1');

var bCrypto = require('../browser');
var fixtures = require('./fixtures');

var supportsPassphrases = semver.satisfies(process.versions.node, '>= 0.11.8');

test('valid RSA fixtures', function (t) {
  fixtures.valid.rsa.forEach(function (f) {
    var message = Buffer.from(f.message);
    var pub = Buffer.from(f['public'], 'base64');

    t.test('fixture: ' + f.message, { skip: !(nCrypto.getHashes().indexOf(f.scheme) >= 0) }, function (st) {
      var priv;

      if (f.passphrase) {
        if (!supportsPassphrases) {
          st.comment('SKIP skipping passphrase test on a node version that lacks support for it');
          st.end();
          return;
        }
        priv = {
          key: Buffer.from(f['private'], 'base64'),
          passphrase: f.passphrase
        };
      } else {
        priv = Buffer.from(f['private'], 'base64');
      }

      var bSign;
      try {
        bSign = bCrypto.createSign(f.scheme);
      } catch (e) {
        st.comment('SKIP skipping unsupported browserify-sign scheme ' + f.scheme);
        st.end();
        return;
      }

      try {
        var nSign = nCrypto.createSign(f.scheme);
      } catch (e) {
        st.comment('SKIP skipping unsupported node scheme ' + f.scheme);
        st.end();
        return;
      }

      var bSig = bSign.update(message).sign(priv);
      var nSig = nSign.update(message).sign(priv);

      st.equals(bSig.length, nSig.length, 'correct length');
      st.equals(bSig.toString('hex'), nSig.toString('hex'), 'equal sigs');
      st.equals(bSig.toString('hex'), f.signature, 'compare to known');

      st.ok(nCrypto.createVerify(f.scheme).update(message).verify(pub, nSig), 'node validate node sig');
      st.ok(nCrypto.createVerify(f.scheme).update(message).verify(pub, bSig), 'node validate browser sig');

      st.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, nSig), 'browser validate node sig');
      st.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, bSig), 'browser validate browser sig');

      st.end();
    });
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

test('valid EC fixtures', function (t) {
  fixtures.valid.ec.forEach(function (f) {
    var message = Buffer.from(f.message);
    var pub = Buffer.from(f['public'], 'base64');

    t.test('fixture: ' + f.message, { skip: !(nCrypto.getHashes().indexOf(f.scheme) >= 0) }, function (st) {
      var priv;

      if (f.passphrase) {
        if (!supportsPassphrases) {
          st.comment('SKIP skipping passphrase test on a node version that lacks support for it');
          st.end();
          return;
        }
        priv = {
          key: Buffer.from(f['private'], 'base64'),
          passphrase: f.passphrase
        };
      } else {
        priv = Buffer.from(f['private'], 'base64');
      }

      var nSign;
      try {
        nSign = nCrypto.createSign(f.scheme);
      } catch (e) {
        st.comment('SKIP skipping unsupported browserify-sign scheme', f.scheme);
        st.end();
        return;
      }

      var bSign;
      try {
        bSign = bCrypto.createSign(f.scheme);
      } catch (e) {
        st.comment('SKIP skipping unsupported node scheme', f.scheme);
        st.end();
        return;
      }

      var bSig = bSign.update(message).sign(priv);
      var nSig = nSign.update(message).sign(priv);
      st.notEqual(bSig.toString('hex'), nSig.toString('hex'), 'not equal sigs');
      st.equals(bSig.toString('hex'), f.signature, 'sig is determanistic');

      var nVer = nCrypto.createVerify(f.scheme);
      st.ok(nVer.update(message).verify(pub, bSig), 'node validate browser sig');

      var bVer = bCrypto.createVerify(f.scheme);
      st.ok(bVer.update(message).verify(pub, nSig), 'browser validate node sig');

      if (f.scheme !== 'DSA' && f.scheme.toLowerCase().indexOf('dsa') === -1) {
        st.test(f.message + ' named rsa through', function (s2t) {
          var scheme = 'RSA-' + f.scheme.toUpperCase();
          var nSign2 = nCrypto.createSign(scheme);
          var bSign2 = bCrypto.createSign(scheme);

          var bSig2 = bSign2.update(message).sign(priv);
          var nSig2 = nSign2.update(message).sign(priv);
          s2t.notEqual(bSig2.toString('hex'), nSig2.toString('hex'), 'not equal sigs');
          s2t.equals(bSig2.toString('hex'), f.signature, 'sig is determanistic');

          var nVer2 = nCrypto.createVerify(f.scheme);
          s2t.ok(nVer2.update(message).verify(pub, bSig2), 'node validate browser sig');

          var bVer2 = bCrypto.createVerify(f.scheme);
          s2t.ok(bVer2.update(message).verify(pub, nSig2), 'browser validate node sig');

          s2t.end();
        });
      }

      st.end();
    });

    var s = parseKeys(pub).data.q;
    t.test(
      f.message + ' against a fake signature',
      { skip: !s || '(this test only applies to DSA signatures and not EC signatures, this is ' + f.scheme + ')' },
      function (st) {
        var messageBase64 = Buffer.from(f.message, 'base64');

        // forge a fake signature
        var r = new BN('1');

        try {
          var fakeSig = asn1.signature.encode({ r: r, s: s }, 'der');
        } catch (e) {
          st.ifError(e);
          st.end();
          return;
        }

        var bVer = bCrypto.createVerify(f.scheme);
        st['throws'](
          function () { bVer.update(messageBase64).verify(pub, fakeSig); },
          Error,
          'fake signature is invalid'
        );

        st.end();
      }
    );
  });
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
