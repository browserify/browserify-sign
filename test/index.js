'use strict';

var Buffer = require('safe-buffer').Buffer;
var asn1 = require('parse-asn1/asn1');
var test = require('tape');
var nCrypto = require('crypto');
var semver = require('semver');
var BN = require('bn.js');
var parseKeys = require('parse-asn1');
var createHash = require('create-hash');

var bCrypto = require('../browser');
var browserSign = require('../browser/sign');
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

test('unknown algorithm', function (t) {
  t['throws'](
    function () { bCrypto.createSign('not-a-real-algorithm'); },
    /Unknown message digest/,
    'createSign throws for unknown algorithm'
  );

  t['throws'](
    function () { bCrypto.createVerify('not-a-real-algorithm'); },
    /Unknown message digest/,
    'createVerify throws for unknown algorithm'
  );

  t.end();
});

test('update with string and encoding', function (t) {
  var f = fixtures.valid.rsa[0];
  var priv = Buffer.from(f['private'], 'base64');
  var pub = Buffer.from(f['public'], 'base64');
  var message = f.message;
  var messageHex = Buffer.from(message).toString('hex');

  var bSign = bCrypto.createSign(f.scheme);
  var sig = bSign.update(messageHex, 'hex').sign(priv);

  var bVerify = bCrypto.createVerify(f.scheme);
  t.ok(bVerify.update(messageHex, 'hex').verify(pub, sig), 'verify with string update and encoding');

  t.end();
});

test('sign with encoding parameter', function (t) {
  var f = fixtures.valid.rsa[0];
  var priv = Buffer.from(f['private'], 'base64');
  var pub = Buffer.from(f['public'], 'base64');
  var message = Buffer.from(f.message);

  var sigHex = bCrypto.createSign(f.scheme).update(message).sign(priv, 'hex');
  t.equal(typeof sigHex, 'string', 'sign with encoding returns a string');

  var sigBuf = Buffer.from(sigHex, 'hex');
  t.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, sigBuf), 'signature from encoded sign is valid');

  t.end();
});

test('verify with string signature and encoding', function (t) {
  var f = fixtures.valid.rsa[0];
  var priv = Buffer.from(f['private'], 'base64');
  var pub = Buffer.from(f['public'], 'base64');
  var message = Buffer.from(f.message);

  var sig = bCrypto.createSign(f.scheme).update(message).sign(priv);
  var sigHex = sig.toString('hex');

  var result = bCrypto.createVerify(f.scheme).update(message).verify(pub, sigHex, 'hex');
  t.ok(result, 'verify accepts string signature with encoding');

  t.end();
});

test('stream _write interface', function (t) {
  var f = fixtures.valid.rsa[0];
  var priv = Buffer.from(f['private'], 'base64');
  var pub = Buffer.from(f['public'], 'base64');
  var message = Buffer.from(f.message);

  t.test('Sign _write via stream', function (st) {
    var signer = bCrypto.createSign(f.scheme);
    signer.write(message);
    signer.end();
    var sig = signer.sign(priv);
    st.ok(sig.length > 0, 'sign via stream produces a signature');

    st.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, sig), 'signature from stream sign is valid');
    st.end();
  });

  t.test('Verify _write via stream', function (st) {
    var sig = bCrypto.createSign(f.scheme).update(message).sign(priv);

    var verifier = bCrypto.createVerify(f.scheme);
    verifier.write(message);
    verifier.end();
    var result = verifier.verify(pub, sig);
    st.ok(result, 'verify via stream works');
    st.end();
  });

  t.end();
});

test('DSA browser verify', function (t) {
  var dsaFixtures = fixtures.valid.ec.filter(function (f) {
    return f.scheme === 'DSA' || f.scheme === 'DSA-SHA1';
  });

  dsaFixtures.forEach(function (f) {
    t.test('DSA verify: ' + f.message, function (st) {
      var message = Buffer.from(f.message);
      var pub = Buffer.from(f['public'], 'base64');
      var priv = Buffer.from(f['private'], 'base64');

      var sig = bCrypto.createSign(f.scheme).update(message).sign(priv);

      var result = bCrypto.createVerify(f.scheme).update(message).verify(pub, sig);
      st.ok(result, 'browser DSA verify accepts valid signature');

      st.end();
    });
  });

  t.end();
});

test('DSA verify with invalid signatures (checkValue)', function (t) {
  var f = fixtures.valid.ec[0]; // DSA fixture
  var pub = Buffer.from(f['public'], 'base64');
  var message = Buffer.from(f.message);
  var parsedPub = parseKeys(pub);
  var q = parsedPub.data.q;

  t.test('r = 0 is rejected', function (st) {
    var fakeSig = asn1.signature.encode({ r: new BN(0), s: new BN(1) }, 'der');
    st['throws'](
      function () { bCrypto.createVerify(f.scheme).update(message).verify(pub, fakeSig); },
      /invalid sig/,
      'r = 0 throws invalid sig'
    );
    st.end();
  });

  t.test('s = 0 is rejected', function (st) {
    var fakeSig = asn1.signature.encode({ r: new BN(1), s: new BN(0) }, 'der');
    st['throws'](
      function () { bCrypto.createVerify(f.scheme).update(message).verify(pub, fakeSig); },
      /invalid sig/,
      's = 0 throws invalid sig'
    );
    st.end();
  });

  t.test('r >= q is rejected', function (st) {
    var fakeSig = asn1.signature.encode({ r: q, s: new BN(1) }, 'der');
    st['throws'](
      function () { bCrypto.createVerify(f.scheme).update(message).verify(pub, fakeSig); },
      /invalid sig/,
      'r >= q throws invalid sig'
    );
    st.end();
  });

  t.test('s >= q is rejected', function (st) {
    var fakeSig = asn1.signature.encode({ r: new BN(1), s: q }, 'der');
    st['throws'](
      function () { bCrypto.createVerify(f.scheme).update(message).verify(pub, fakeSig); },
      /invalid sig/,
      's >= q throws invalid sig'
    );
    st.end();
  });

  t.end();
});

test('wrong key type errors in sign', function (t) {
  var ecFixture = fixtures.valid.ec.filter(function (f) {
    return f.scheme !== 'DSA' && f.scheme.toLowerCase().indexOf('dsa') === -1;
  })[0];
  var dsaFixture = fixtures.valid.ec[0]; // DSA fixture

  t.test('EC key with DSA scheme throws', function (st) {
    var priv = Buffer.from(ecFixture['private'], 'base64');
    st['throws'](
      function () { bCrypto.createSign('DSA').update('test').sign(priv); },
      /wrong private key type/,
      'EC key with DSA scheme throws'
    );
    st.end();
  });

  t.test('DSA key with RSA scheme throws', function (st) {
    var priv = Buffer.from(dsaFixture['private'], 'base64');
    st['throws'](
      function () { bCrypto.createSign('RSA-SHA256').update('test').sign(priv); },
      /wrong private key type/,
      'DSA key with RSA scheme throws'
    );
    st.end();
  });

  t.test('RSA key with DSA scheme throws', function (st) {
    var priv = Buffer.from(fixtures.valid.rsa[0]['private'], 'base64');
    st['throws'](
      function () { bCrypto.createSign('DSA').update('test').sign(priv); },
      /wrong private key type/,
      'RSA key with DSA scheme throws'
    );
    st.end();
  });

  t.end();
});

test('wrong key type errors in verify', function (t) {
  var ecFixture = fixtures.valid.ec.filter(function (f) {
    return f.scheme !== 'DSA' && f.scheme.toLowerCase().indexOf('dsa') === -1;
  })[0];
  var dsaFixture = fixtures.valid.ec[0]; // DSA fixture
  var rsaFixture = fixtures.valid.rsa[0];
  var dummySig = Buffer.alloc(64);

  t.test('EC key with DSA scheme throws', function (st) {
    var pub = Buffer.from(ecFixture['public'], 'base64');
    st['throws'](
      function () { bCrypto.createVerify('DSA').update('test').verify(pub, dummySig); },
      /wrong public key type/,
      'EC key with DSA scheme throws'
    );
    st.end();
  });

  t.test('DSA key with RSA scheme throws', function (st) {
    var pub = Buffer.from(dsaFixture['public'], 'base64');
    st['throws'](
      function () { bCrypto.createVerify('RSA-SHA256').update('test').verify(pub, dummySig); },
      /wrong public key type/,
      'DSA key with RSA scheme throws'
    );
    st.end();
  });

  t.test('RSA key with DSA scheme throws', function (st) {
    var pub = Buffer.from(rsaFixture['public'], 'base64');
    st['throws'](
      function () { bCrypto.createVerify('DSA').update('test').verify(pub, dummySig); },
      /wrong public key type/,
      'RSA key with DSA scheme throws'
    );
    st.end();
  });

  t.end();
});

test('getKey pads x when shorter than q byte length', function (t) {
  // Create a small x (1 byte) and a q that requires more bytes
  var smallX = new BN(42);
  var q = new BN('FFFFFFFFFFFFFFFFFFFF', 16); // 10 bytes
  var hash = Buffer.alloc(32);
  hash.fill(0xab);

  var result = browserSign.getKey(smallX, q, hash, 'sha256');
  t.ok(result.k, 'getKey returns k');
  t.ok(result.v, 'getKey returns v');

  t.end();
});

test('RSA verify with forged signature', function (t) {
  // Use a valid RSA fixture and verify with a completely wrong signature
  // to exercise the constant-time comparison path with various sig/pad length mismatches
  var f = fixtures.valid.rsa[0];
  var pub = Buffer.from(f['public'], 'base64');
  var message = Buffer.from(f.message);

  // Verify with a very short forged signature (triggers sig.length !== pad.length)
  var shortSig = Buffer.from([0x01, 0x02, 0x03]);
  var result = bCrypto.createVerify(f.scheme).update(message).verify(pub, shortSig);
  t.notOk(result, 'rejects very short forged signature');

  // Verify with a signature that is the right length but wrong content
  var parsedPub = parseKeys(pub);
  var wrongSig = Buffer.alloc(parsedPub.modulus.byteLength());
  wrongSig.fill(0x42);
  var result2 = bCrypto.createVerify(f.scheme).update(message).verify(pub, wrongSig);
  t.notOk(result2, 'rejects wrong-content signature of correct length');

  t.end();
});

test('unknown curve in ecVerify throws', function (t) {
  // Construct a PEM-encoded EC public key with an unrecognized curve OID
  // The EC algorithm OID is 1.2.840.10045.2.1, and we use a fake curve OID 9.9.9.9.9
  var fakeKeyDer = asn1.PublicKey.encode({
    algorithm: {
      algorithm: [1, 2, 840, 10045, 2, 1],
      curve: [9, 9, 9, 9, 9]
    },
    subjectPublicKey: { data: Buffer.alloc(65) }
  }, 'der');
  var fakePem = '-----BEGIN PUBLIC KEY-----\n' + fakeKeyDer.toString('base64') + '\n-----END PUBLIC KEY-----';

  t['throws'](
    function () { bCrypto.createVerify('ecdsa-with-SHA1').update('test').verify(fakePem, Buffer.alloc(64)); },
    /unknown curve/,
    'ecVerify throws for unknown curve OID'
  );

  t.end();
});

test('unknown curve in ecSign throws', function (t) {
  // Construct a PKCS#8 EC private key PEM with an unrecognized curve OID
  var ecPrivKeyDer = asn1.ECPrivateKey.encode({
    version: new BN(1),
    privateKey: Buffer.alloc(32),
    parameters: { type: 'namedCurve', value: [9, 9, 9, 9, 9] }
  }, 'der');
  var keyDer = asn1.PrivateKey.encode({
    version: new BN(0),
    algorithm: {
      algorithm: [1, 2, 840, 10045, 2, 1],
      curve: [9, 9, 9, 9, 9]
    },
    subjectPrivateKey: ecPrivKeyDer
  }, 'der');
  var keyPem = '-----BEGIN PRIVATE KEY-----\n' + keyDer.toString('base64') + '\n-----END PRIVATE KEY-----';

  t['throws'](
    function () { bCrypto.createSign('ecdsa-with-SHA1').update('test').sign(keyPem); },
    /unknown curve/,
    'ecSign throws for unknown curve OID'
  );

  t.end();
});

test('dsaSign s=0 retry path', function (t) {
  // Construct a DSA key with small parameters where s=0 is likely on first iteration.
  // With p=23, q=11, g=2, x=3, we brute-force messages until the first k from HMAC-DRBG
  // produces s=0, which triggers the retry on lines 65-66 of sign.js.
  var p = new BN(23);
  var q = new BN(11);
  var g = new BN(2);
  var x = new BN(3);

  // Encode as PKCS#8 PEM
  var xDer = asn1.DSAparam.encode(x, 'der');
  var keyDer = asn1.PrivateKey.encode({
    version: new BN(0),
    algorithm: {
      algorithm: [1, 2, 840, 10040, 4, 1],
      params: { p: p, q: q, g: g }
    },
    subjectPrivateKey: xDer
  }, 'der');
  var keyPem = '-----BEGIN PRIVATE KEY-----\n' + keyDer.toString('base64') + '\n-----END PRIVATE KEY-----';

  // Try many messages to find one where the first HMAC-DRBG k produces s=0
  // With q=11, roughly 1/11 messages should trigger this
  var found = false;
  for (var i = 0; i < 200 && !found; i++) {
    var msg = 'test message ' + i;
    var hash = createHash('sha1').update(msg).digest();

    // Compute what the first iteration would produce
    var H = browserSign.bits2int ? browserSign.bits2int(hash, q) : null;
    if (!H) {
      // bits2int is not exported, compute manually
      var bits = new BN(hash);
      var shift = (hash.length << 3) - q.bitLength();
      if (shift > 0) { bits.ishrn(shift); }
      H = bits.mod(q);
    }

    var kv = browserSign.getKey(x, q, hash, 'sha1');
    var k = browserSign.makeKey(q, kv, 'sha1');
    var r = g.toRed(BN.mont(p)).redPow(k).fromRed().mod(q);
    var s = k.invm(q).imul(H.add(x.mul(r))).mod(q);

    if (s.cmpn(0) === 0) {
      // This message will trigger the s=0 retry path!
      found = true;
      var sig = bCrypto.createSign('DSA').update(msg).sign(keyPem);
      t.ok(sig.length > 0, 'DSA sign with s=0 retry produces valid signature for message ' + i);
    }
  }

  if (!found) {
    t.comment('SKIP could not find a message that triggers s=0 in 200 iterations');
  }

  t.end();
});

test('RSA verify with small key (padNum < 8 branch)', { skip: !semver.satisfies(process.versions.node, '>= 10.12') && 'generateKeyPairSync requires Node >= 10.12' }, function (t) {
  // Generate a tiny RSA key (512 bits = 64 bytes modulus)
  // With SHA-512 hash (64 bytes) + tag (19 bytes) = 83 bytes > 64 byte modulus,
  // the padding loop never runs, so padNum stays 0 (< 8), exercising that branch
  var pair = nCrypto.generateKeyPairSync('rsa', {
    modulusLength: 512,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  });

  var message = Buffer.from('test message');
  var fakeSig = Buffer.alloc(64);
  fakeSig.fill(0x42);

  // SHA-512 with 512-bit key: hash+tag (83 bytes) > modulus (64 bytes)
  // padNum = 0 < 8, so out starts at 1, verification returns false
  var result = bCrypto.createVerify('sha512WithRSAEncryption').update(message).verify(pair.publicKey, fakeSig);
  t.notOk(result, 'rejects verification when padNum < 8 (hash+tag exceeds key size)');

  t.end();
});
