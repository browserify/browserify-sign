var pemstrip = require('pemstrip');
var asn1 = require('./asn1');
module.exports = parseKeys;

function parseKeys(buffer) {
	var stripped = pemstrip.strip(buffer);
	var type = stripped.tag;
	var data = new Buffer(stripped.base64, 'base64');
	var subtype
	switch (type) {
		case 'PUBLIC KEY':
		  data = asn1.PublicKey.decode(data, 'der');
		  subtype = data.algorithm.algorithm.join('.');
		  switch(subtype) {
		  	case '1.2.840.113549.1.1.1':
		  	  return asn1.RSAPublicKey.decode(data.subjectPublicKey.data, 'der');
		  	default: throw new Error('unknown key id ' +  subtype);
		  }
		  throw new Error('unknown key type ' +  type);
		case 'PRIVATE KEY':
		  data = asn1.PrivateKey.decode(data, 'der');
		  subtype = data.algorithm.algorithm.join('.');
		  switch(subtype) {
		  	case '1.2.840.113549.1.1.1':
		  	  return asn1.RSAPrivateKey.decode(data.subjectPrivateKey, 'der');
		  	default: throw new Error('unknown key id ' +  subtype);
		  }
		  throw new Error('unknown key type ' +  type);
		case 'RSA PUBLIC KEY':
		  return asn1.RSAPublicKey.decode(data, 'der');
		case 'RSA PRIVATE KEY':
		  return asn1.RSAPrivateKey.decode(data, 'der');
		default: throw new Error('unknown key type ' +  type);
	}
}