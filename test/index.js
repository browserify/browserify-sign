var test = require('tape');
var fs = require('fs');
var priv1024 = fs.readFileSync(__dirname + '/rsa.1024.priv');
var pub1024 = fs.readFileSync(__dirname + '/rsa.1024.pub');
var priv2028 = fs.readFileSync(__dirname + '/rsa.2028.priv');
var pub2028 = fs.readFileSync(__dirname + '/rsa.2028.pub');
var nodeCrypto = require('crypto');
var myCrypto = require('../');
function testIt(pub, priv, message, scheme) {
	test(message.toString(), function (t) {
		t.plan(4);
		var mySign = myCrypto.createSign(scheme);
		var nodeSign = nodeCrypto.createSign(scheme);
		var mySig = mySign.update(message).sign(priv);
		var nodeSig = nodeSign.update(message).sign(priv);
		t.equals(mySig.length, nodeSig.length, 'correct length');
		t.equals(mySig.toString('hex'), nodeSig.toString('hex'), 'equal sigs');
		var myVer = myCrypto.createVerify(scheme);
		var nodeVer = nodeCrypto.createVerify(scheme);
		t.ok(nodeVer.update(message).verify(pub, mySig), 'node validate my sig');
		t.ok(myVer.update(message).verify(pub, nodeSig), 'me validate node sig');
	});
}
testIt(pub1024, priv1024, new Buffer('sha224 with 1024 keys'), 'RSA-SHA224');
testIt(pub2028, priv2028, new Buffer('sha224 with 2028 keys'), 'RSA-SHA224');
testIt(pub1024, priv1024, new Buffer('SHA256 with 1024 keys'), 'RSA-SHA256');
testIt(pub2028, priv2028, new Buffer('SHA256 with 2028 keys'), 'RSA-SHA256');
testIt(pub1024, priv1024, new Buffer('SHA384 with 1024 keys'), 'RSA-SHA384');
testIt(pub2028, priv2028, new Buffer('SHA384 with 2028 keys'), 'RSA-SHA384');
testIt(pub1024, priv1024, new Buffer('SHA512 with 1024 keys'), 'RSA-SHA512');
testIt(pub2028, priv2028, new Buffer('SHA512 with 2028 keys'), 'RSA-SHA512');