## [1.8.1](https://github.com/andrewinci/free-retro/compare/v1.8.0...v1.8.1) (2022-08-18)


### Bug Fixes

* websocket check connection every second ([7216b42](https://github.com/andrewinci/free-retro/commit/7216b422bda14fcf3b91eaee1115052fe72a0826))

# [1.8.0](https://github.com/andrewinci/free-retro/compare/v1.7.2...v1.8.0) (2022-08-18)


### Features

* websocket reconnect ([0d983b5](https://github.com/andrewinci/free-retro/commit/0d983b53a3aa18402381ca86c6fc0d2c0efb4698))

## [1.7.2](https://github.com/andrewinci/free-retro/compare/v1.7.1...v1.7.2) (2022-08-18)


### Bug Fixes

* default text area to 1 row ([3b4c50c](https://github.com/andrewinci/free-retro/commit/3b4c50cfd7601aa24f820cfe7b15239599de75e8))

## [1.7.1](https://github.com/andrewinci/free-retro/compare/v1.7.0...v1.7.1) (2022-08-18)


### Bug Fixes

* missing group title ([14dff2f](https://github.com/andrewinci/free-retro/commit/14dff2f0c20b4577e06f5b4f91fb2dc8978e58d3))

# [1.7.0](https://github.com/andrewinci/free-retro/compare/v1.6.2...v1.7.0) (2022-08-16)


### Features

* autofocus text-area ([e0d2b33](https://github.com/andrewinci/free-retro/commit/e0d2b33b0ead640c959c3b1af1d9b3bf35114d43))

## [1.6.2](https://github.com/andrewinci/free-retro/compare/v1.6.1...v1.6.2) (2022-08-15)


### Bug Fixes

* Cards grouping and ids ([#15](https://github.com/andrewinci/free-retro/issues/15)) ([9233ec4](https://github.com/andrewinci/free-retro/commit/9233ec47d19ab793d36bfddb44bcd5f5c6233a60))

## [1.6.1](https://github.com/andrewinci/free-retro/compare/v1.6.0...v1.6.1) (2022-08-15)


### Bug Fixes

* Tweak monitor threshold ([a2319cd](https://github.com/andrewinci/free-retro/commit/a2319cda27084797b9057907958ad22d777239e3))

# [1.6.0](https://github.com/andrewinci/free-retro/compare/v1.5.1...v1.6.0) (2022-08-14)


### Features

* reuse the same sessionid for multiple retros ([#9](https://github.com/andrewinci/free-retro/issues/9)) ([034a9d1](https://github.com/andrewinci/free-retro/commit/034a9d1c8cdb7f4f77b6df53333825161b72c6ec))

## [1.5.1](https://github.com/andrewinci/free-retro/compare/v1.5.0...v1.5.1) (2022-08-14)


### Bug Fixes

* Fix unsupported dynamo removalPolicy ([483c3c1](https://github.com/andrewinci/free-retro/commit/483c3c10f49e718f15aeddbe145c1ca30ed29aad))

# [1.5.0](https://github.com/andrewinci/free-retro/compare/v1.4.0...v1.5.0) (2022-08-14)


### Features

* Add cloudwatch monitors ([2f9adde](https://github.com/andrewinci/free-retro/commit/2f9adde528d1e98cfb4e72f78cffe2eebf1b5cd4))

# [1.4.0](https://github.com/andrewinci/free-retro/compare/v1.3.0...v1.4.0) (2022-08-13)


### Features

* Remove the state of disconnected clients ([c9d856e](https://github.com/andrewinci/free-retro/commit/c9d856e5398d1145102850d2edf842dd739153dd))

# [1.3.0](https://github.com/andrewinci/free-retro/compare/v1.2.0...v1.3.0) (2022-08-10)


### Features

* infra improvements ([950b6a0](https://github.com/andrewinci/free-retro/commit/950b6a000d433c9432fb061e7bc8677cbbcd10ec))

# [1.2.0](https://github.com/andrewinci/free-retro/compare/v1.1.0...v1.2.0) (2022-08-09)


### Bug Fixes

* Add missign await ([547999c](https://github.com/andrewinci/free-retro/commit/547999ce2fb5f7d22102067a73feae33894ca3be))


### Features

* disable buttons if no cards are available ([72cba78](https://github.com/andrewinci/free-retro/commit/72cba78244c010a996db72cee34e0cff18ff149a))
* remove unused field username ([c68c7fc](https://github.com/andrewinci/free-retro/commit/c68c7fc6214192d49666addca614004c2951fc18))

# [1.1.0](https://github.com/andrewinci/free-retro/compare/v1.0.1...v1.1.0) (2022-08-08)


### Features

* show an alert if the retro is not found ([941cf6b](https://github.com/andrewinci/free-retro/commit/941cf6b6f8dc797c5210d2d54d218f0248f3eec9))

## [1.0.1](https://github.com/andrewinci/free-retro/compare/v1.0.0...v1.0.1) (2022-08-08)


### Bug Fixes

* Missing policy to send messages to clients ([53db9e0](https://github.com/andrewinci/free-retro/commit/53db9e0a388d2690a7bfb51188817afca6b1ac89))

# 1.0.0 (2022-08-08)


### Bug Fixes

* click on a blurred card updates the state ([27c532d](https://github.com/andrewinci/free-retro/commit/27c532d5f99fca64fec1d706e5454fd9cacb7916))
* Update api endpoint ([7e050f2](https://github.com/andrewinci/free-retro/commit/7e050f25817f1e172118876ac7bcc429e0c9c59e))


### Features

* add deployment pipeline ([41c3f00](https://github.com/andrewinci/free-retro/commit/41c3f008946c3e02af93c2e52621b008de80c5b1))
* deploy from gh actions ([da087f3](https://github.com/andrewinci/free-retro/commit/da087f3ddf1486bee24386692fc89d661de816e1))
* Replace serverless with CDK ([823638e](https://github.com/andrewinci/free-retro/commit/823638e9ee72aa91f3010897f2cd256e3212d2bc))
* textarea only update upstream components if text changed ([85100e4](https://github.com/andrewinci/free-retro/commit/85100e4bcb57e0060e9cf10aa4140c48083f752b))


### BREAKING CHANGES

*
