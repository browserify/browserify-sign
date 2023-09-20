# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v4.2.1](https://github.com/browserify/browserify-sign/compare/v4.2.0...v4.2.1) - 2020-08-04

### Merged

- bump elliptic [`#58`](https://github.com/browserify/browserify-sign/pull/58)

## [v4.2.0](https://github.com/browserify/browserify-sign/compare/v4.1.0...v4.2.0) - 2020-05-18

### Merged

- switch to safe buffer [`#53`](https://github.com/browserify/browserify-sign/pull/53)

## [v4.1.0](https://github.com/browserify/browserify-sign/compare/v4.0.4...v4.1.0) - 2020-05-05

### Merged

- update deps, modernise usage, use readable-stream [`#49`](https://github.com/browserify/browserify-sign/pull/49)

## [v4.0.4](https://github.com/browserify/browserify-sign/compare/v4.0.3...v4.0.4) - 2017-03-28

### Merged

- Fix algorithms require path, add the extension [`#36`](https://github.com/browserify/browserify-sign/pull/36)

### Commits

- extranious semi-colon [`bf59e00`](https://github.com/browserify/browserify-sign/commit/bf59e00d0370a53876597be91a8ff7bfe855e0fc)

## [v4.0.3](https://github.com/browserify/browserify-sign/compare/v4.0.2...v4.0.3) - 2017-03-27

### Commits

- files key in the package.json [`1e0bea0`](https://github.com/browserify/browserify-sign/commit/1e0bea0e263e81b89bf564d7e0c7bddd3b7278f9)

## [v4.0.2](https://github.com/browserify/browserify-sign/compare/v4.0.1...v4.0.2) - 2017-03-27

### Commits

- put back in algos [`fd27cd3`](https://github.com/browserify/browserify-sign/commit/fd27cd3e6346c054dec937ae53f341740888e03f)

## [v4.0.1](https://github.com/browserify/browserify-sign/compare/v4.0.0...v4.0.1) - 2017-03-27

### Merged

- add support for calling ECDSA signatures RSA signatures, cuz node allows it [`#33`](https://github.com/browserify/browserify-sign/pull/33)
- don't generate a new key in ecSign [`#30`](https://github.com/browserify/browserify-sign/pull/30)
- more ecdsa [`#29`](https://github.com/browserify/browserify-sign/pull/29)
- use json files [`#26`](https://github.com/browserify/browserify-sign/pull/26)
- renaming files [`#25`](https://github.com/browserify/browserify-sign/pull/25)

### Commits

- algorithms as JSON file [`c41a01b`](https://github.com/browserify/browserify-sign/commit/c41a01bcb477df1ab20f6d3a311b7801a3da9ff6)
- add new fixtures [`16edebd`](https://github.com/browserify/browserify-sign/commit/16edebde35421ff376aeb7e8e62cfe5a3c1ffbee)
- curves as JSON file [`f40f060`](https://github.com/browserify/browserify-sign/commit/f40f0602f8dc6c2db8c9c1c02dc095a1e4837b89)
- update tests and travis [`9f6e80b`](https://github.com/browserify/browserify-sign/commit/9f6e80b4e1d748958bf46f7ddcb09bd38e8c3a21)
- remove unused files [`9a76f12`](https://github.com/browserify/browserify-sign/commit/9a76f12f6e673c0e9e87aed0d52f13f0ce644865)
- update package.json [`13f7b67`](https://github.com/browserify/browserify-sign/commit/13f7b67e78584a66d2275fc58978bdf59d365b03)
- update README.md [`b03de58`](https://github.com/browserify/browserify-sign/commit/b03de586a090c38e993f5e20ab94edbaa9b87b88)
- nits [`be99732`](https://github.com/browserify/browserify-sign/commit/be99732907b8ae2ea58b8935b6b33e58502239b2)
- we aparently no longer support 0.10 [`aec5180`](https://github.com/browserify/browserify-sign/commit/aec51801103b2755fc4127d2633a1c4369b3f427)
- better message [`06d76ed`](https://github.com/browserify/browserify-sign/commit/06d76ed4abb2094d8f86c395282ba53f1ffe47a6)
- move browser files to folder [`b648108`](https://github.com/browserify/browserify-sign/commit/b64810806e6f6c9c93624f1faa878ad5750a2e18)

## [v4.0.0](https://github.com/browserify/browserify-sign/compare/v3.0.8...v4.0.0) - 2015-11-02

### Merged

- upgrade bn and add 2 curves [`#22`](https://github.com/browserify/browserify-sign/pull/22)
- Add LICENSE file. [`#21`](https://github.com/browserify/browserify-sign/pull/21)

### Commits

- Revert "remove p521" [`0ad9f5c`](https://github.com/browserify/browserify-sign/commit/0ad9f5c5b2bed736a254722d3cd7eb779c4b45b7)
- remove p521 [`352ea17`](https://github.com/browserify/browserify-sign/commit/352ea1757d7bbcf1877757c5dc0101a7903c510c)
- add pack in p521 and update deps [`6e58dc4`](https://github.com/browserify/browserify-sign/commit/6e58dc410fa923344b9b1c7863fbf5c5f8f4f731)
- Create LICENSE [`e31c4a1`](https://github.com/browserify/browserify-sign/commit/e31c4a1e3c66a6124191e52052cadb4710814d71)
- update deps [`7ca87bc`](https://github.com/browserify/browserify-sign/commit/7ca87bc5465a9d19b4a01542eb99d70d97e84c6f)
- patch bn to 4.1.1 [`bd8dc2e`](https://github.com/browserify/browserify-sign/commit/bd8dc2e9eb8bd5cd4b7b255c1914c2f34f594ace)
- LICENSE: add @calvinmetcalf [`153a93f`](https://github.com/browserify/browserify-sign/commit/153a93f0f05c4368c76789df2df4a09ea455a8a9)
- package: adds description [`555b793`](https://github.com/browserify/browserify-sign/commit/555b79372cc4e8c29049e7f2b027f2694f7c7dd5)

## [v3.0.8](https://github.com/browserify/browserify-sign/compare/v3.0.3...v3.0.8) - 2015-09-05

### Merged

- Format [`#20`](https://github.com/browserify/browserify-sign/pull/20)
- Fixes unreachable return error [`#19`](https://github.com/browserify/browserify-sign/pull/19)

### Fixed

- adds standard (resolves #15) [`#15`](https://github.com/browserify/browserify-sign/issues/15)

### Commits

- add dsa back in [`1b8014d`](https://github.com/browserify/browserify-sign/commit/1b8014d8edfc228dc1f21e2b98442d1d297be458)
- merge [`6ada8de`](https://github.com/browserify/browserify-sign/commit/6ada8de15ebe83cedbaa2242409dbb1de441b5ed)
- standard format [`4f8a8e9`](https://github.com/browserify/browserify-sign/commit/4f8a8e90122eb1fab9be86cdfdf697989e51a507)
- comment unused functions [`2c68e08`](https://github.com/browserify/browserify-sign/commit/2c68e0828fe5c494ee5b75742bef549171404eea)
- fix use of lowercase constructor [`5032abe`](https://github.com/browserify/browserify-sign/commit/5032abe9eaaef64546f9ed085f9cf23f96eabe9a)
- README: remove TODOs [`dd76c98`](https://github.com/browserify/browserify-sign/commit/dd76c988ce7d1a6ff24e5ea55408d1771aa62380)
- algos: use 2 spaces, not tabs [`7097997`](https://github.com/browserify/browserify-sign/commit/709799742c576a57ead7d3686f00ad21de78112d)
- .travis.yml: update to new targets [`668ab5b`](https://github.com/browserify/browserify-sign/commit/668ab5b2f656854098c95d0f82b4b3b9da9e5c39)
- rm unused exports [`ddc0820`](https://github.com/browserify/browserify-sign/commit/ddc0820c766ceda98dcaf8d8bb99647d86b2fb0b)
- Rename readme.md to README.md [`557119b`](https://github.com/browserify/browserify-sign/commit/557119b51a6f8373bdededdedbd9d86be7801646)
- package: fix bad JSON [`b25808b`](https://github.com/browserify/browserify-sign/commit/b25808bea4860136edd87ced17d6bb6ccc6e143a)

## [v3.0.3](https://github.com/browserify/browserify-sign/compare/v3.0.2...v3.0.3) - 2015-08-07

### Merged

- add npmignore [`#17`](https://github.com/browserify/browserify-sign/pull/17)

## [v3.0.2](https://github.com/browserify/browserify-sign/compare/v3.0.1...v3.0.2) - 2015-05-20

### Merged

- correct error message [`#12`](https://github.com/browserify/browserify-sign/pull/12)

### Commits

- failing test [`93be166`](https://github.com/browserify/browserify-sign/commit/93be16675c1b276b5aae918d9cdf5825dc47cd4a)
- update deps, fixutres, and verify [`ef78685`](https://github.com/browserify/browserify-sign/commit/ef78685c39f9e234208a96488bdb845ea7ddaa18)
- test our own sigs [`2ea39b2`](https://github.com/browserify/browserify-sign/commit/2ea39b275415bf246ff0521e3a1f1fe99f91c3b5)
- update elleptic all the way [`525ea93`](https://github.com/browserify/browserify-sign/commit/525ea93f74e1543e722c6f967cb394e4b71fbd75)

## [v3.0.1](https://github.com/browserify/browserify-sign/compare/v3.0.0...v3.0.1) - 2015-03-11

### Commits

- tests: move all pre-produced data to fixtures, tests only test [`578bd27`](https://github.com/browserify/browserify-sign/commit/578bd275edb23e07d7a2e378d9f4442f29237970)
- inline fixtures [`c7fd8eb`](https://github.com/browserify/browserify-sign/commit/c7fd8eba2e58ccca5b2ba11c9a6cb447ec9b6a58)
- fixtures: convert to pure JSON [`1695735`](https://github.com/browserify/browserify-sign/commit/16957358f2026687035a999e56fcccc7e12c656d)
- passes standard [`2ba9c4c`](https://github.com/browserify/browserify-sign/commit/2ba9c4ce4b3a2fde1252da3b73f9c5dc3fedd491)
- rm node11 attribute [`456236d`](https://github.com/browserify/browserify-sign/commit/456236d0bab2d0f1aa3c365447ff6e6165c2c45e)
- check sign type [`af82685`](https://github.com/browserify/browserify-sign/commit/af826857539b1abf7075d65b21784cfabeff8d2c)
- tests/fixtures: re-compute signatures and assert equality [`69c0dd3`](https://github.com/browserify/browserify-sign/commit/69c0dd307251727c1d0db05868458451961b0215)
- fix tests in node 10 and 3 formatting issues [`a8796b0`](https://github.com/browserify/browserify-sign/commit/a8796b01dc99bbe393be49a1c5d74b71a385e7c3)
- tests: sort requires [`33591b9`](https://github.com/browserify/browserify-sign/commit/33591b9af8307f27178138271d26c020e72c6033)
- more tests [`3db65cf`](https://github.com/browserify/browserify-sign/commit/3db65cf75e990b0bc3f7a6fa1599197977c0a4c8)
- propper node10 test [`b0aa652`](https://github.com/browserify/browserify-sign/commit/b0aa65210afcb299e9a945fdf82a068a4821f5e8)
- fix typo in travis.yml [`4e42f0a`](https://github.com/browserify/browserify-sign/commit/4e42f0ac4c7b9a3cb751f41126b26749354b105d)

## [v3.0.0](https://github.com/browserify/browserify-sign/compare/v2.8.0...v3.0.0) - 2015-03-10

### Merged

- Modularize [`#8`](https://github.com/browserify/browserify-sign/pull/8)

### Commits

- modularize format [`d2a3f77`](https://github.com/browserify/browserify-sign/commit/d2a3f77b244ce8e967bd2b3067cdfaee670dfecf)
- better [`5077b98`](https://github.com/browserify/browserify-sign/commit/5077b984edc44440b65579fe100d74ca3e91a823)
- properly check signatures and test for it [`48f8881`](https://github.com/browserify/browserify-sign/commit/48f888175d1c1ab727cebba73def1dec48769375)
- other 3 curves [`b78737b`](https://github.com/browserify/browserify-sign/commit/b78737b27e1bcaae3f771caa89f7161bdc17c1f3)
- determanistic k [`2e1bf48`](https://github.com/browserify/browserify-sign/commit/2e1bf48e180d2ea699225b6e584e3a30c90ba312)
- formatting [`07a8727`](https://github.com/browserify/browserify-sign/commit/07a87278e6eb13539ee0a58262df3213e8cea4da)
- fixed bug with hash shorter then q [`438717a`](https://github.com/browserify/browserify-sign/commit/438717a2f00efbae18ba158b436555d56f2c9bbd)
- sign: s/getKay/getKey [`cec421c`](https://github.com/browserify/browserify-sign/commit/cec421c69d563f4cc51df5d0c323ed294e0df33e)
- make sure everything is strict [`3f10450`](https://github.com/browserify/browserify-sign/commit/3f1045017b95fdb0a0da87fe57b467705edbafdf)

## [v2.8.0](https://github.com/browserify/browserify-sign/compare/v2.7.5...v2.8.0) - 2015-01-12

### Commits

- better [`18b953c`](https://github.com/browserify/browserify-sign/commit/18b953c021e88ccdcdab809f93a1d5d2a42d3ea0)
- determanistic k [`9f1c348`](https://github.com/browserify/browserify-sign/commit/9f1c348009475ac7872e9f4e0f014bb15b88101f)
- fixed bug with hash shorter then q [`222dc8e`](https://github.com/browserify/browserify-sign/commit/222dc8ecb01f01999f69634af57ae9e64489dfb0)

## [v2.7.5](https://github.com/browserify/browserify-sign/compare/v2.7.4...v2.7.5) - 2015-01-06

### Commits

- update eliptic [`e4e5b42`](https://github.com/browserify/browserify-sign/commit/e4e5b427f7c3be3c1ded12147a66b134ae31eb0c)

## [v2.7.4](https://github.com/browserify/browserify-sign/compare/v2.7.3...v2.7.4) - 2015-01-06

### Commits

- update parse-asn1 [`22a3f57`](https://github.com/browserify/browserify-sign/commit/22a3f57340c08211547f14b63ab0cc9ab5d97dc9)

## [v2.7.3](https://github.com/browserify/browserify-sign/compare/v2.7.2...v2.7.3) - 2015-01-06

### Commits

- Update bn.js [`4519962`](https://github.com/browserify/browserify-sign/commit/4519962b2d2b73a9a118296de98280411f07fd2d)

## [v2.7.2](https://github.com/browserify/browserify-sign/compare/v2.7.1...v2.7.2) - 2015-01-05

### Commits

- aliases for sign and verify [`fcc366f`](https://github.com/browserify/browserify-sign/commit/fcc366ffe2f60e9c20d9b62b2321a96f7e9445d6)

## [v2.7.1](https://github.com/browserify/browserify-sign/compare/v2.7.0...v2.7.1) - 2015-01-03

### Commits

- Update bn.js [`c55b4aa`](https://github.com/browserify/browserify-sign/commit/c55b4aa577ef6a9414c366c760206434f97e3cce)

## [v2.7.0](https://github.com/browserify/browserify-sign/compare/v2.6.1...v2.7.0) - 2014-12-22

### Commits

- pull out rsa stuff [`0c076ff`](https://github.com/browserify/browserify-sign/commit/0c076ff1ff2aa4b626cdf25911200090a60d86c4)

## [v2.6.1](https://github.com/browserify/browserify-sign/compare/v2.6.0...v2.6.1) - 2014-12-19

### Commits

- just use regular stream not readable [`dfdd33d`](https://github.com/browserify/browserify-sign/commit/dfdd33d4bfd4823aa0308aa8215d6a32dfc210e9)

## [v2.6.0](https://github.com/browserify/browserify-sign/compare/v2.5.2...v2.6.0) - 2014-12-18

### Commits

- dsa [`e01ff39`](https://github.com/browserify/browserify-sign/commit/e01ff3987ecf80670bb6e5d38ad7a1dc08a429b0)
- varient encoding of password protected keys [`eaaf2d5`](https://github.com/browserify/browserify-sign/commit/eaaf2d53a385d6b13fcff33734675c3d886b5b51)

## [v2.5.2](https://github.com/browserify/browserify-sign/compare/v2.5.1...v2.5.2) - 2014-12-17

### Commits

- pull out parseKey [`b25775e`](https://github.com/browserify/browserify-sign/commit/b25775e1f4ed1b3df3ed776f3d0a352f2fa338cf)

## [v2.5.1](https://github.com/browserify/browserify-sign/compare/v2.5.0...v2.5.1) - 2014-12-09

### Commits

- circular dependancy [`1c15e75`](https://github.com/browserify/browserify-sign/commit/1c15e75b27a20b34bb7dd32eb833beb57716f69c)

## [v2.5.0](https://github.com/browserify/browserify-sign/compare/v2.4.0...v2.5.0) - 2014-11-25

### Commits

- add md5 and ripemd160 also make sure to include algorythm id when verifying [`da03fb0`](https://github.com/browserify/browserify-sign/commit/da03fb07ad10b61f4386560503802e16af8fa80e)
- cross off ecdsa [`1a3e3f3`](https://github.com/browserify/browserify-sign/commit/1a3e3f3e466c3de43ff02fd5434922e3b19fe77b)

## [v2.4.0](https://github.com/browserify/browserify-sign/compare/v2.3.0...v2.4.0) - 2014-11-16

### Commits

- eliptical curves [`17745d2`](https://github.com/browserify/browserify-sign/commit/17745d23773baad7b1ec1289d86ac46e87da9323)
- ecdsa with password [`2186465`](https://github.com/browserify/browserify-sign/commit/2186465dab56a1468d13964a3c6b3ef7b2b44437)
- encryption is out of scope [`f975416`](https://github.com/browserify/browserify-sign/commit/f97541615c9853b276a33cf40f394e079f3988b9)

## [v2.3.0](https://github.com/browserify/browserify-sign/compare/v2.2.0...v2.3.0) - 2014-11-15

### Commits

- Chinese remainder algorithm [`140a41f`](https://github.com/browserify/browserify-sign/commit/140a41fb482e02716e0d7b79ae390f6979cab031)

## [v2.2.0](https://github.com/browserify/browserify-sign/compare/v2.1.0...v2.2.0) - 2014-11-15

### Commits

- passwords! [`8c95b09`](https://github.com/browserify/browserify-sign/commit/8c95b09e5ba43d041f6527e3d62e7e216ec1d5ae)

## v2.1.0 - 2014-11-15

### Commits

- in prog [`d55225f`](https://github.com/browserify/browserify-sign/commit/d55225f0c3bd669ad616481dbc347fcab6654db1)
- working! [`130b1e2`](https://github.com/browserify/browserify-sign/commit/130b1e2703f807ff58ebf26612487a9a4d1e875c)
- generic key files [`7bd3f91`](https://github.com/browserify/browserify-sign/commit/7bd3f91d99b79a6077efb7c2239fcde5e2ebe95c)
- node stuff [`342c74f`](https://github.com/browserify/browserify-sign/commit/342c74f0db7ae0ae071f898f1cd8fcce3170b851)
- repo [`7e9b914`](https://github.com/browserify/browserify-sign/commit/7e9b91446c335d41e9e53466f8b4e07b697570ac)
- todo [`15410f2`](https://github.com/browserify/browserify-sign/commit/15410f260d813e07213b4bb51a2d2a747a8fd82a)
- test messages [`735a056`](https://github.com/browserify/browserify-sign/commit/735a056eb785387510bb9f0624ea6528447c4b8b)
- travis .yml file [`173fd78`](https://github.com/browserify/browserify-sign/commit/173fd7806d63d9808a2b1a7167b1fd3780f34a0d)
- travis [`9b562e6`](https://github.com/browserify/browserify-sign/commit/9b562e633e26e266153756cc70e0ba90284a0b3b)
