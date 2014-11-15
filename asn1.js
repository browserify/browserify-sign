// from https://github.com/indutny/self-signed/blob/gh-pages/lib/asn1.js
// Fedor, you are amazing.

var asn1 = require('asn1.js');
var rfc3280 = require('asn1.js-rfc3280');

var RSAPrivateKey = asn1.define('RSAPrivateKey', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('modulus').int(),
    this.key('publicExponent').int(),
    this.key('privateExponent').int(),
    this.key('prime1').int(),
    this.key('prime2').int(),
    this.key('exponent1').int(),
    this.key('exponent2').int(),
    this.key('coefficient').int()
  );
});
exports.RSAPrivateKey = RSAPrivateKey;

var RSAPublicKey = asn1.define('RSAPublicKey', function() {
  this.seq().obj(
    this.key('modulus').int(),
    this.key('publicExponent').int()
  );
});
exports.RSAPublicKey = RSAPublicKey;

var PublicKey = rfc3280.SubjectPublicKeyInfo;
exports.PublicKey = PublicKey;
var PrivateKeyInfo = asn1.define('PrivateKeyInfo', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('algorithm').use(rfc3280.AlgorithmIdentifier),
    this.key('subjectPrivateKey').octstr()
  );
});
exports.PrivateKey = PrivateKeyInfo;
var EncryptedPrivateKeyInfo = asn1.define('EncryptedPrivateKeyInfo', function() {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('id').objid(),
      this.key('decrypt').seq().obj(
        this.key('kde').seq().obj(
          this.key('id').objid(),
          this.key('kdeparams').seq().obj(
            this.key('salt').octstr(),
            this.key('iters').int()
          )
        ),
        this.key('cipher').seq().obj(
          this.key('algo').objid(),
          this.key('iv').octstr()
        )
      )
    ),
    this.key('subjectPrivateKey').octstr()
  );
});
exports.EncryptedPrivateKey = EncryptedPrivateKeyInfo;
var GeneralName = asn1.define('GeneralName', function() {
  this.choice({
    dNSName: this.implicit(2).ia5str()
  });
});
exports.GeneralName = GeneralName;

var GeneralNames = asn1.define('GeneralNames', function() {
  this.seqof(GeneralName);
});
exports.GeneralNames = GeneralNames;

var Signature = asn1.define('Signature', function() {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('algorithm').objid(),
      this.null_()
    ),
    this.key('digest').octstr()
  );
});
exports.Signature = Signature;

var IA5Str = asn1.define('IA5Str', function() {
  this.ia5str();
});
exports.IA5Str = IA5Str;

exports.SHA256 = [ 2, 16, 840, 1, 101, 3, 4, 2, 1 ];
exports.SHA256RSA = [ 1, 2, 840, 113549, 1, 1, 11 ];
exports.RSA = [ 1, 2, 840, 113549, 1, 1, 1 ];
exports.COMMONNAME = [ 2, 5, 4, 3 ];
exports.ALTNAME = [ 2, 5, 29, 17 ];

exports.TBSCertificate = rfc3280.TBSCertificate;
exports.Certificate = rfc3280.Certificate;