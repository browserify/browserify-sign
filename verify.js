// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var parseKeys = require('./parseKeys');

var bn = require('bn.js');
module.exports = verify;
function verify(sig, hash, key) {
  var pub = parseKeys(key);

  var red = bn.mont(pub.modulus);
  sig = new bn(sig).toRed(red);

  sig = sig.redPow(new bn(pub.publicExponent));

  sig = new Buffer(sig.fromRed().toArray());
  sig = sig.slice(sig.length - hash.length);
  var out = 0;
  var len = sig.length;
  var i = -1;
  while (++i < len) {
    out += (sig[i] ^ hash[i]);
  }
  return !out;
}