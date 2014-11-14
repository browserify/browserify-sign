// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var pemstrip = require('pemstrip');
var asn1 = require('./asn1');
var bn = require('bn.js');
module.exports = verify;
function verify(sig, hash, key) {
  var pub = asn1.RSAPublicKey.decode(new Buffer(pemstrip.strip(key).base64, 'base64'), 'der');


  var red = bn.mont(pub.modulus);
  sig = new bn(sig).toRed(red);

  sig = sig.redPow(new bn(pub.publicExponent));

  sig = new Buffer(sig.fromRed().toArray());
  console.log(sig.toString('hex'));
  sig = sig.slice(sig.length - hash.length);
  var out = 0;
  var len = sig.length;
  var i = -1;
  while (++i < len) {
    out += (sig[i] ^ hash[i]);
  }
  return !out;
}