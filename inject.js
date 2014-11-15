var sign = require('./sign');
var verify = require('./verify');
var Writable = require('readable-stream').Writable;
var inherits = require('inherits');
var algos = require('./algos');
module.exports = function (exports, crypto) {
	exports.createSign = createSign;
	function createSign(algorithm) {
		var data = algos[algorithm];
		return new Sign(crypto.createHash(data.hash));
	}
	exports.createVerify = createVerify;
	function createVerify(algorithm) {
		var data = algos[algorithm];
		return new Verify(crypto.createHash(data.hash));
	}
};
inherits(Sign, Writable);
function Sign(hash) {
	Writable.call(this)
	this._hash = hash;
};
Sign.prototype._write = function _write(data, _, done) {
	this._hash.update(data);
	done();
};
Sign.prototype.update = function update(data) {
	this.write(data);
};

Sign.prototype.sign = function sign(key, enc) {
	this.end();
	var hash = this._hash.digest();
	var sig = sign(hash, key);
	if (enc) {
		sig = sig.toString(enc);
	}
	return sig;
};

inherits(Verify, Writable);
function Verify(hash) {
	Writable.call(this)
	this._hash = hash;
};
Verify.prototype._write = function _write(data, _, done) {
	this._hash.update(data);
	done();
};
Verify.prototype.update = function update(data) {
	this.write(data);
};

Verify.prototype.verify = function verify(key, sig, enc) {
	this.end();
	var hash = this._hash.digest();
	if (!Buffer.isBuffer(sig)) {
		sig = new Buffer(sig, enc);
	}
	return verify(sig, hash, key);
};