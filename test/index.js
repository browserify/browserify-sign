var Buffer = require('buffer').Buffer
var asn1 = require('parse-asn1/asn1')
var test = require('tape').test
var nCrypto = require('crypto')
var bCrypto = require('../browser')
var fixtures = require('./fixtures')

function isNode10 () {
  return parseInt(process.version.split('.')[1], 10) <= 10
}

fixtures.valid.rsa.forEach(function (f) {
  var message = Buffer.from(f.message)
  var pub = Buffer.from(f.public, 'base64')
  var priv

  // skip passphrase tests in node 10
  if (f.passphrase && isNode10()) return

  if (f.passphrase) {
    priv = {
      key: Buffer.from(f.private, 'base64'),
      passphrase: f.passphrase
    }
  } else {
    priv = Buffer.from(f.private, 'base64')
  }

  test(f.message, function (t) {
    var bSign = bCrypto.createSign(f.scheme)
    var nSign = nCrypto.createSign(f.scheme)
    var bSig = bSign.update(message).sign(priv)
    var nSig = nSign.update(message).sign(priv)

    t.equals(bSig.length, nSig.length, 'correct length')
    t.equals(bSig.toString('hex'), nSig.toString('hex'), 'equal sigs')
    t.equals(bSig.toString('hex'), f.signature, 'compare to known')

    t.ok(nCrypto.createVerify(f.scheme).update(message).verify(pub, nSig), 'node validate node sig')
    t.ok(nCrypto.createVerify(f.scheme).update(message).verify(pub, bSig), 'node validate browser sig')

    t.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, nSig), 'browser validate node sig')
    t.ok(bCrypto.createVerify(f.scheme).update(message).verify(pub, bSig), 'browser validate browser sig')

    t.end()
  })
})

fixtures.valid.ec.forEach(function (f) {
  var message = Buffer.from(f.message)
  var pub = Buffer.from(f.public, 'base64')
  var priv

  // skip passphrase tests in node 10
  if (f.passphrase && isNode10()) return

  if (f.passphrase) {
    priv = {
      key: Buffer.from(f.private, 'base64'),
      passphrase: f.passphrase
    }
  } else {
    priv = Buffer.from(f.private, 'base64')
  }

  (nCrypto.getHashes().includes(f.scheme) ? test : test.skip)(f.message, function (t) {
    var nSign = nCrypto.createSign(f.scheme)
    var bSign = bCrypto.createSign(f.scheme)

    var bSig = bSign.update(message).sign(priv)
    var nSig = nSign.update(message).sign(priv)
    t.notEqual(bSig.toString('hex'), nSig.toString('hex'), 'not equal sigs')
    t.equals(bSig.toString('hex'), f.signature, 'sig is determanistic')

    var nVer = nCrypto.createVerify(f.scheme)
    t.ok(nVer.update(message).verify(pub, bSig), 'node validate browser sig')

    var bVer = bCrypto.createVerify(f.scheme)
    t.ok(bVer.update(message).verify(pub, nSig), 'browser validate node sig')

    t.end()
  })
  if (f.scheme !== 'DSA' && f.scheme.toLowerCase().indexOf('dsa') === -1) {
    test(f.message + ' named rsa through', function (t) {
      var scheme = 'RSA-' + f.scheme.toUpperCase()
      var nSign = nCrypto.createSign(scheme)
      var bSign = bCrypto.createSign(scheme)

      var bSig = bSign.update(message).sign(priv)
      var nSig = nSign.update(message).sign(priv)
      t.notEqual(bSig.toString('hex'), nSig.toString('hex'), 'not equal sigs')
      t.equals(bSig.toString('hex'), f.signature, 'sig is determanistic')

      var nVer = nCrypto.createVerify(f.scheme)
      t.ok(nVer.update(message).verify(pub, bSig), 'node validate browser sig')

      var bVer = bCrypto.createVerify(f.scheme)
      t.ok(bVer.update(message).verify(pub, nSig), 'browser validate node sig')

      t.end()
    })
  }
})

fixtures.valid.kvectors.forEach(function (f) {
  test('kvector algo: ' + f.algo + ' key len: ' + f.key.length + ' msg: ' + f.msg, function (t) {
    var key = Buffer.from(f.key, 'base64')

    var bSig = bCrypto.createSign(f.algo).update(f.msg).sign(key)
    var bRS = asn1.signature.decode(bSig, 'der')
    t.equals(bRS.r.toString(16), f.r.toLowerCase(), 'r')
    t.equals(bRS.s.toString(16), f.s.toLowerCase(), 's')

    t.end()
  })
})

fixtures.invalid.verify.forEach(function (f) {
  test(f.description, function (t) {
    var sign = Buffer.from(f.signature, 'hex')
    var pub = Buffer.from(f.public, 'base64')
    var message = Buffer.from(f.message)

    var nVerify = nCrypto.createVerify(f.scheme).update(message).verify(pub, sign)
    t.notOk(nVerify, 'node rejects it')

    var bVerify = bCrypto.createVerify(f.scheme).update(message).verify(pub, sign)
    t.notOk(bVerify, 'We reject it')

    t.end()
  })
})
