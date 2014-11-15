// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var parseKeys = require('./parseKeys');
var bn = require('bn.js');
module.exports = sign;
function sign(hash, key, crypto) {
  var priv = parseKeys(key, crypto);
  var len = priv.modulus.byteLength();
  var pad = [ 0, 1 ];
  while (hash.length + pad.length + 1 < len) {
    pad.push(0xff);
  }
  pad.push(0x00);
  var i = -1;
  while (++i < hash.length) {
    pad.push(hash[i]);
  }
  hash = pad;
  var red = bn.mont(priv.modulus);
  hash = new bn(hash).toRed(red);

  hash = hash.redPow(priv.privateExponent);
  var out = new Buffer(hash.fromRed().toArray());
  if (out.length < len) {
    var prefix = new Buffer(len - out.length);
    prefix.fill(0);
    out = Buffer.concat([prefix, out], len);
  }
  return out;
}