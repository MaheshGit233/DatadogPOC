/******/ (function () {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "../core/src/boot/init.ts":
      /*!********************************!*\
  !*** ../core/src/boot/init.ts ***!
  \********************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ makePublicApi: function () {
            return /* binding */ makePublicApi;
          },
          /* harmony export */ defineGlobal: function () {
            return /* binding */ defineGlobal;
          },
          /* harmony export */ BuildMode: function () {
            return /* binding */ BuildMode;
          },
          /* harmony export */ commonInit: function () {
            return /* binding */ commonInit;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _domain_configuration__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../domain/configuration */ "../core/src/domain/configuration/configuration.ts"
          );
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _tools_catchUserErrors__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../tools/catchUserErrors */ "../core/src/tools/catchUserErrors.ts"
          );
        /* harmony import */ var _domain_configuration_experimentalFeatures__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../domain/configuration/experimentalFeatures */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );

        function makePublicApi(stub) {
          var publicApi = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, stub),
            {
              // This API method is intentionally not monitored, since the only thing executed is the
              // user-provided 'callback'.  All SDK usages executed in the callback should be monitored, and
              // we don't want to interfere with the user uncaught exceptions.
              onReady: function (callback) {
                callback();
              },
            }
          );
          // Add an "hidden" property to set debug mode. We define it that way to hide it
          // as much as possible but of course it's not a real protection.
          Object.defineProperty(publicApi, "_setDebug", {
            get: function () {
              return _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_1__.setDebugMode;
            },
            enumerable: false,
          });
          return publicApi;
        }
        function defineGlobal(global, name, api) {
          var existingGlobalVariable = global[name];
          global[name] = api;
          if (existingGlobalVariable && existingGlobalVariable.q) {
            existingGlobalVariable.q.forEach(function (fn) {
              return (0,
              _tools_catchUserErrors__WEBPACK_IMPORTED_MODULE_2__.catchUserErrors)(
                fn,
                "onReady callback threw an error:"
              )();
            });
          }
        }
        var BuildMode;
        (function (BuildMode) {
          BuildMode["RELEASE"] = "release";
          BuildMode["STAGING"] = "staging";
          BuildMode["CANARY"] = "canary";
          BuildMode["E2E_TEST"] = "e2e-test";
        })(BuildMode || (BuildMode = {}));
        function commonInit(initConfiguration, buildEnv) {
          (0,
          _domain_configuration_experimentalFeatures__WEBPACK_IMPORTED_MODULE_3__.updateExperimentalFeatures)(
            initConfiguration.enableExperimentalFeatures
          );
          var configuration = (0,
          _domain_configuration__WEBPACK_IMPORTED_MODULE_4__.buildConfiguration)(
            initConfiguration,
            buildEnv
          );
          var internalMonitoring = (0,
          _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_1__.startInternalMonitoring)(
            configuration
          );
          return {
            configuration: configuration,
            internalMonitoring: internalMonitoring,
          };
        }

        /***/
      },

    /***/ "../core/src/browser/cookie.ts":
      /*!*************************************!*\
  !*** ../core/src/browser/cookie.ts ***!
  \*************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ COOKIE_ACCESS_DELAY: function () {
            return /* binding */ COOKIE_ACCESS_DELAY;
          },
          /* harmony export */ cacheCookieAccess: function () {
            return /* binding */ cacheCookieAccess;
          },
          /* harmony export */ setCookie: function () {
            return /* binding */ setCookie;
          },
          /* harmony export */ getCookie: function () {
            return /* binding */ getCookie;
          },
          /* harmony export */ deleteCookie: function () {
            return /* binding */ deleteCookie;
          },
          /* harmony export */ areCookiesAuthorized: function () {
            return /* binding */ areCookiesAuthorized;
          },
          /* harmony export */ getCurrentSite: function () {
            return /* binding */ getCurrentSite;
          },
          /* harmony export */
        });
        /* harmony import */ var _tools_display__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../tools/display */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../tools/utils */ "../core/src/tools/utils.ts"
          );

        var COOKIE_ACCESS_DELAY =
          _tools_utils__WEBPACK_IMPORTED_MODULE_0__.ONE_SECOND;
        function cacheCookieAccess(name, options) {
          var timeout;
          var cache;
          var hasCache = false;
          var cacheAccess = function () {
            hasCache = true;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
              hasCache = false;
            }, COOKIE_ACCESS_DELAY);
          };
          return {
            get: function () {
              if (hasCache) {
                return cache;
              }
              cache = getCookie(name);
              cacheAccess();
              return cache;
            },
            set: function (value, expireDelay) {
              setCookie(name, value, expireDelay, options);
              cache = value;
              cacheAccess();
            },
            clearCache: function () {
              clearTimeout(timeout);
              hasCache = false;
            },
          };
        }
        function setCookie(name, value, expireDelay, options) {
          var date = new Date();
          date.setTime(date.getTime() + expireDelay);
          var expires = "expires=" + date.toUTCString();
          var sameSite = options && options.crossSite ? "none" : "strict";
          var domain =
            options && options.domain ? ";domain=" + options.domain : "";
          var secure = options && options.secure ? ";secure" : "";
          document.cookie =
            name +
            "=" +
            value +
            ";" +
            expires +
            ";path=/;samesite=" +
            sameSite +
            domain +
            secure;
        }
        function getCookie(name) {
          return (0,
          _tools_utils__WEBPACK_IMPORTED_MODULE_0__.findCommaSeparatedValue)(
            document.cookie,
            name
          );
        }
        function deleteCookie(name, options) {
          setCookie(name, "", 0, options);
        }
        function areCookiesAuthorized(options) {
          if (document.cookie === undefined || document.cookie === null) {
            return false;
          }
          try {
            // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
            // the test cookie lifetime
            var testCookieName =
              "dd_cookie_test_" +
              (0, _tools_utils__WEBPACK_IMPORTED_MODULE_0__.generateUUID)();
            var testCookieValue = "test";
            setCookie(
              testCookieName,
              testCookieValue,
              _tools_utils__WEBPACK_IMPORTED_MODULE_0__.ONE_SECOND,
              options
            );
            var isCookieCorrectlySet =
              getCookie(testCookieName) === testCookieValue;
            deleteCookie(testCookieName, options);
            return isCookieCorrectlySet;
          } catch (error) {
            _tools_display__WEBPACK_IMPORTED_MODULE_1__.display.error(error);
            return false;
          }
        }
        /**
         * No API to retrieve it, number of levels for subdomain and suffix are unknown
         * strategy: find the minimal domain on which cookies are allowed to be set
         * https://web.dev/same-site-same-origin/#site
         */
        var getCurrentSiteCache;
        function getCurrentSite() {
          if (getCurrentSiteCache === undefined) {
            // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
            // the test cookie lifetime
            var testCookieName =
              "dd_site_test_" +
              (0, _tools_utils__WEBPACK_IMPORTED_MODULE_0__.generateUUID)();
            var testCookieValue = "test";
            var domainLevels = window.location.hostname.split(".");
            var candidateDomain = domainLevels.pop();
            while (domainLevels.length && !getCookie(testCookieName)) {
              candidateDomain = domainLevels.pop() + "." + candidateDomain;
              setCookie(
                testCookieName,
                testCookieValue,
                _tools_utils__WEBPACK_IMPORTED_MODULE_0__.ONE_SECOND,
                { domain: candidateDomain }
              );
            }
            deleteCookie(testCookieName, { domain: candidateDomain });
            getCurrentSiteCache = candidateDomain;
          }
          return getCurrentSiteCache;
        }

        /***/
      },

    /***/ "../core/src/browser/fetchObservable.ts":
      /*!**********************************************!*\
  !*** ../core/src/browser/fetchObservable.ts ***!
  \**********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ initFetchObservable: function () {
            return /* binding */ initFetchObservable;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _domain_tracekit__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ../domain/tracekit */ "../core/src/domain/tracekit/computeStackTrace.ts"
          );
        /* harmony import */ var _tools_error__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../tools/error */ "../core/src/tools/error.ts"
          );
        /* harmony import */ var _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../tools/instrumentMethod */ "../core/src/tools/instrumentMethod.ts"
          );
        /* harmony import */ var _tools_observable__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../tools/observable */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _tools_timeUtils__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../tools/timeUtils */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _tools_urlPolyfill__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../tools/urlPolyfill */ "../core/src/tools/urlPolyfill.ts"
          );

        var fetchObservable;
        function initFetchObservable() {
          if (!fetchObservable) {
            fetchObservable = createFetchObservable();
          }
          return fetchObservable;
        }
        function createFetchObservable() {
          var observable =
            new _tools_observable__WEBPACK_IMPORTED_MODULE_1__.Observable(
              function () {
                if (!window.fetch) {
                  return;
                }
                var stop = (0,
                _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__.instrumentMethod)(
                  window,
                  "fetch",
                  function (originalFetch) {
                    return function (input, init) {
                      var responsePromise;
                      var context = (0,
                      _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.callMonitored)(
                        beforeSend,
                        null,
                        [observable, input, init]
                      );
                      if (context) {
                        responsePromise = originalFetch.call(
                          this,
                          context.input,
                          context.init
                        );
                        (0,
                        _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.callMonitored)(
                          afterSend,
                          null,
                          [observable, responsePromise, context]
                        );
                      } else {
                        responsePromise = originalFetch.call(this, input, init);
                      }
                      return responsePromise;
                    };
                  }
                ).stop;
                return stop;
              }
            );
          return observable;
        }
        function beforeSend(observable, input, init) {
          var method =
            (init && init.method) ||
            (typeof input === "object" && input.method) ||
            "GET";
          var url = (0,
          _tools_urlPolyfill__WEBPACK_IMPORTED_MODULE_4__.normalizeUrl)(
            (typeof input === "object" && input.url) || input
          );
          var startClocks = (0,
          _tools_timeUtils__WEBPACK_IMPORTED_MODULE_5__.clocksNow)();
          var context = {
            state: "start",
            init: init,
            input: input,
            method: method,
            startClocks: startClocks,
            url: url,
          };
          observable.notify(context);
          return context;
        }
        function afterSend(observable, responsePromise, startContext) {
          var _this = this;
          var reportFetch = function (response) {
            return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(
              _this,
              void 0,
              void 0,
              function () {
                var context, text, e_1;
                return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(
                  this,
                  function (_a) {
                    switch (_a.label) {
                      case 0:
                        context = startContext;
                        context.state = "complete";
                        context.duration = (0,
                        _tools_timeUtils__WEBPACK_IMPORTED_MODULE_5__.elapsed)(
                          context.startClocks.timeStamp,
                          (0,
                          _tools_timeUtils__WEBPACK_IMPORTED_MODULE_5__.timeStampNow)()
                        );
                        if (!("stack" in response || response instanceof Error))
                          return [3 /*break*/, 1];
                        context.status = 0;
                        context.responseText = (0,
                        _tools_error__WEBPACK_IMPORTED_MODULE_6__.toStackTraceString)(
                          (0,
                          _domain_tracekit__WEBPACK_IMPORTED_MODULE_7__.computeStackTrace)(
                            response
                          )
                        );
                        context.isAborted =
                          response instanceof DOMException &&
                          response.code === DOMException.ABORT_ERR;
                        context.error = response;
                        observable.notify(context);
                        return [3 /*break*/, 6];
                      case 1:
                        if (!("status" in response)) return [3 /*break*/, 6];
                        text = void 0;
                        _a.label = 2;
                      case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, response.clone().text()];
                      case 3:
                        text = _a.sent();
                        return [3 /*break*/, 5];
                      case 4:
                        e_1 = _a.sent();
                        text = "Unable to retrieve response: " + e_1;
                        return [3 /*break*/, 5];
                      case 5:
                        context.response = response;
                        context.responseText = text;
                        context.responseType = response.type;
                        context.status = response.status;
                        context.isAborted = false;
                        observable.notify(context);
                        _a.label = 6;
                      case 6:
                        return [2 /*return*/];
                    }
                  }
                );
              }
            );
          };
          responsePromise.then(
            (0,
            _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.monitor)(
              reportFetch
            ),
            (0,
            _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.monitor)(
              reportFetch
            )
          );
        }

        /***/
      },

    /***/ "../core/src/browser/xhrObservable.ts":
      /*!********************************************!*\
  !*** ../core/src/browser/xhrObservable.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ initXhrObservable: function () {
            return /* binding */ initXhrObservable;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../tools/instrumentMethod */ "../core/src/tools/instrumentMethod.ts"
          );
        /* harmony import */ var _tools_observable__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../tools/observable */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../tools/timeUtils */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _tools_urlPolyfill__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../tools/urlPolyfill */ "../core/src/tools/urlPolyfill.ts"
          );

        var xhrObservable;
        function initXhrObservable() {
          if (!xhrObservable) {
            xhrObservable = createXhrObservable();
          }
          return xhrObservable;
        }
        function createXhrObservable() {
          var observable =
            new _tools_observable__WEBPACK_IMPORTED_MODULE_1__.Observable(
              function () {
                var stopInstrumentingStart = (0,
                _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__.instrumentMethodAndCallOriginal)(
                  XMLHttpRequest.prototype,
                  "open",
                  {
                    before: openXhr,
                  }
                ).stop;
                var stopInstrumentingSend = (0,
                _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__.instrumentMethodAndCallOriginal)(
                  XMLHttpRequest.prototype,
                  "send",
                  {
                    before: function () {
                      sendXhr.call(this, observable);
                    },
                  }
                ).stop;
                var stopInstrumentingAbort = (0,
                _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__.instrumentMethodAndCallOriginal)(
                  XMLHttpRequest.prototype,
                  "abort",
                  {
                    before: abortXhr,
                  }
                ).stop;
                return function () {
                  stopInstrumentingStart();
                  stopInstrumentingSend();
                  stopInstrumentingAbort();
                };
              }
            );
          return observable;
        }
        function openXhr(method, url) {
          // WARN: since this data structure is tied to the instance, it is shared by both logs and rum
          // and can be used by different code versions depending on customer setup
          // so it should stay compatible with older versions
          this._datadog_xhr = {
            state: "open",
            method: method,
            url: (0,
            _tools_urlPolyfill__WEBPACK_IMPORTED_MODULE_3__.normalizeUrl)(url),
          };
        }
        function sendXhr(observable) {
          var _this = this;
          if (!this._datadog_xhr) {
            return;
          }
          var startContext = this._datadog_xhr;
          startContext.state = "start";
          startContext.startTime = (0,
          _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__.relativeNow)();
          startContext.startClocks = (0,
          _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__.clocksNow)();
          startContext.isAborted = false;
          startContext.xhr = this;
          var hasBeenReported = false;
          var stopInstrumentingOnReadyStateChange = (0,
          _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_2__.instrumentMethodAndCallOriginal)(
            this,
            "onreadystatechange",
            {
              before: function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                  // Try to report the XHR as soon as possible, because the XHR may be mutated by the
                  // application during a future event. For example, Angular is calling .abort() on
                  // completed requests during a onreadystatechange event, so the status becomes '0'
                  // before the request is collected.
                  onEnd();
                }
              },
            }
          ).stop;
          var onEnd = (0,
          _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_5__.monitor)(
            function () {
              _this.removeEventListener("loadend", onEnd);
              stopInstrumentingOnReadyStateChange();
              if (hasBeenReported) {
                return;
              }
              hasBeenReported = true;
              var completeContext = _this._datadog_xhr;
              completeContext.state = "complete";
              completeContext.duration = (0,
              _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__.elapsed)(
                startContext.startClocks.timeStamp,
                (0,
                _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__.timeStampNow)()
              );
              completeContext.responseText = _this.response;
              completeContext.status = _this.status;
              observable.notify(
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {},
                  completeContext
                )
              );
            }
          );
          this.addEventListener("loadend", onEnd);
          observable.notify(startContext);
        }
        function abortXhr() {
          if (this._datadog_xhr) {
            this._datadog_xhr.isAborted = true;
          }
        }

        /***/
      },

    /***/ "../core/src/domain/configuration/configuration.ts":
      /*!*********************************************************!*\
  !*** ../core/src/domain/configuration/configuration.ts ***!
  \*********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ DefaultPrivacyLevel: function () {
            return /* binding */ DefaultPrivacyLevel;
          },
          /* harmony export */ DEFAULT_CONFIGURATION: function () {
            return /* binding */ DEFAULT_CONFIGURATION;
          },
          /* harmony export */ buildConfiguration: function () {
            return /* binding */ buildConfiguration;
          },
          /* harmony export */ buildCookieOptions: function () {
            return /* binding */ buildCookieOptions;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _browser_cookie__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../../browser/cookie */ "../core/src/browser/cookie.ts"
          );
        /* harmony import */ var _tools_catchUserErrors__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../tools/catchUserErrors */ "../core/src/tools/catchUserErrors.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _transportConfiguration__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./transportConfiguration */ "../core/src/domain/configuration/transportConfiguration.ts"
          );

        var DefaultPrivacyLevel = {
          ALLOW: "allow",
          MASK: "mask",
          MASK_USER_INPUT: "mask-user-input",
        };
        var DEFAULT_CONFIGURATION = {
          allowedTracingOrigins: [],
          maxErrorsPerMinute: 3000,
          maxActionsPerMinute: 3000,
          maxInternalMonitoringMessagesPerPage: 15,
          sampleRate: 100,
          replaySampleRate: 100,
          silentMultipleInit: false,
          trackInteractions: false,
          trackViewsManually: false,
          defaultPrivacyLevel: DefaultPrivacyLevel.MASK_USER_INPUT,
          /**
           * arbitrary value, byte precision not needed
           */
          requestErrorResponseLengthLimit:
            32 * _tools_utils__WEBPACK_IMPORTED_MODULE_1__.ONE_KILO_BYTE,
          /**
           * flush automatically, aim to be lower than ALB connection timeout
           * to maximize connection reuse.
           */
          flushTimeout:
            30 * _tools_utils__WEBPACK_IMPORTED_MODULE_1__.ONE_SECOND,
          /**
           * Logs intake limit
           */
          maxBatchSize: 50,
          maxMessageSize:
            256 * _tools_utils__WEBPACK_IMPORTED_MODULE_1__.ONE_KILO_BYTE,
          /**
           * beacon payload max queue size implementation is 64kb
           * ensure that we leave room for logs, rum and potential other users
           */
          batchBytesLimit:
            16 * _tools_utils__WEBPACK_IMPORTED_MODULE_1__.ONE_KILO_BYTE,
        };
        function buildConfiguration(initConfiguration, buildEnv) {
          var configuration = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              {
                beforeSend:
                  initConfiguration.beforeSend &&
                  (0,
                  _tools_catchUserErrors__WEBPACK_IMPORTED_MODULE_2__.catchUserErrors)(
                    initConfiguration.beforeSend,
                    "beforeSend threw an error:"
                  ),
                cookieOptions: buildCookieOptions(initConfiguration),
                service: initConfiguration.service,
              },
              (0,
              _transportConfiguration__WEBPACK_IMPORTED_MODULE_3__.computeTransportConfiguration)(
                initConfiguration,
                buildEnv
              )
            ),
            DEFAULT_CONFIGURATION
          );
          if ("allowedTracingOrigins" in initConfiguration) {
            configuration.allowedTracingOrigins =
              initConfiguration.allowedTracingOrigins;
          }
          if ("sampleRate" in initConfiguration) {
            configuration.sampleRate = initConfiguration.sampleRate;
          }
          if ("replaySampleRate" in initConfiguration) {
            configuration.replaySampleRate = initConfiguration.replaySampleRate;
          }
          if ("trackInteractions" in initConfiguration) {
            configuration.trackInteractions =
              !!initConfiguration.trackInteractions;
          }
          if ("trackViewsManually" in initConfiguration) {
            configuration.trackViewsManually =
              !!initConfiguration.trackViewsManually;
          }
          if ("actionNameAttribute" in initConfiguration) {
            configuration.actionNameAttribute =
              initConfiguration.actionNameAttribute;
          }
          if (
            (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.objectHasValue)(
              DefaultPrivacyLevel,
              initConfiguration.defaultPrivacyLevel
            )
          ) {
            configuration.defaultPrivacyLevel =
              initConfiguration.defaultPrivacyLevel;
          }
          return configuration;
        }
        function buildCookieOptions(initConfiguration) {
          var cookieOptions = {};
          cookieOptions.secure = mustUseSecureCookie(initConfiguration);
          cookieOptions.crossSite =
            !!initConfiguration.useCrossSiteSessionCookie;
          if (!!initConfiguration.trackSessionAcrossSubdomains) {
            cookieOptions.domain = (0,
            _browser_cookie__WEBPACK_IMPORTED_MODULE_4__.getCurrentSite)();
          }
          return cookieOptions;
        }
        function mustUseSecureCookie(initConfiguration) {
          return (
            !!initConfiguration.useSecureSessionCookie ||
            !!initConfiguration.useCrossSiteSessionCookie
          );
        }

        /***/
      },

    /***/ "../core/src/domain/configuration/endpointBuilder.ts":
      /*!***********************************************************!*\
  !*** ../core/src/domain/configuration/endpointBuilder.ts ***!
  \***********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ENDPOINTS: function () {
            return /* binding */ ENDPOINTS;
          },
          /* harmony export */ INTAKE_SITE_US: function () {
            return /* binding */ INTAKE_SITE_US;
          },
          /* harmony export */ createEndpointBuilder: function () {
            return /* binding */ createEndpointBuilder;
          },
          /* harmony export */
        });
        /* harmony import */ var _tools_timeUtils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../tools/timeUtils */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../tools/utils */ "../core/src/tools/utils.ts"
          );

        var ENDPOINTS = {
          alternate: {
            logs: "logs",
            rum: "rum",
            sessionReplay: "session-replay",
          },
          classic: {
            logs: "browser",
            rum: "rum",
            // session-replay has no classic endpoint
            sessionReplay: undefined,
          },
        };
        var INTAKE_TRACKS = {
          logs: "logs",
          rum: "rum",
          sessionReplay: "replay",
        };
        var INTAKE_SITE_US = "datadoghq.com";
        var INTAKE_SITE_US3 = "us3.datadoghq.com";
        var INTAKE_SITE_GOV = "ddog-gov.com";
        var INTAKE_SITE_EU = "datadoghq.eu";
        var CLASSIC_ALLOWED_SITES = [INTAKE_SITE_US, INTAKE_SITE_EU];
        var INTAKE_V1_ALLOWED_SITES = [
          INTAKE_SITE_US,
          INTAKE_SITE_US3,
          INTAKE_SITE_EU,
          INTAKE_SITE_GOV,
        ];
        function createEndpointBuilder(
          initConfiguration,
          buildEnv,
          endpointType,
          source
        ) {
          var sdkVersion = buildEnv.sdkVersion;
          var _a = initConfiguration.site,
            site = _a === void 0 ? INTAKE_SITE_US : _a,
            clientToken = initConfiguration.clientToken,
            env = initConfiguration.env,
            proxyHost = initConfiguration.proxyHost,
            proxyUrl = initConfiguration.proxyUrl,
            service = initConfiguration.service,
            version = initConfiguration.version,
            intakeApiVersion = initConfiguration.intakeApiVersion,
            useAlternateIntakeDomains =
              initConfiguration.useAlternateIntakeDomains;
          var host = buildHost(endpointType);
          var path = buildPath(endpointType);
          function build() {
            var queryParameters = buildQueryParameters(endpointType, source);
            var endpoint = "https://" + host + path + "?" + queryParameters;
            if (proxyUrl) {
              return proxyUrl + "?ddforward=" + encodeURIComponent(endpoint);
            } else if (proxyHost) {
              return (
                "https://" +
                proxyHost +
                path +
                "?ddhost=" +
                host +
                "&" +
                queryParameters
              );
            }
            return endpoint;
          }
          function buildIntakeUrl() {
            var endpoint = build();
            return endpoint.slice(0, endpoint.indexOf("?"));
          }
          function buildHost(endpointType) {
            if (shouldUseAlternateDomain(endpointType)) {
              var endpoint_1 = ENDPOINTS.alternate[endpointType];
              var domainParts = site.split(".");
              var extension = domainParts.pop();
              var suffix = domainParts.join("-") + "." + extension;
              return endpoint_1 + ".browser-intake-" + suffix;
            }
            var endpoint = ENDPOINTS.classic[endpointType];
            return endpoint + "-http-intake.logs." + site;
          }
          function buildPath(endpointType) {
            return shouldUseIntakeV2(endpointType)
              ? "/api/v2/" + INTAKE_TRACKS[endpointType]
              : "/v1/input/" + clientToken;
          }
          function buildQueryParameters(endpointType, source) {
            var tags =
              "sdk_version:" +
              sdkVersion +
              ("" + (env ? ",env:" + env : "")) +
              ("" + (service ? ",service:" + service : "")) +
              ("" + (version ? ",version:" + version : ""));
            var parameters =
              "ddsource=" +
              (source || "browser") +
              "&ddtags=" +
              encodeURIComponent(tags);
            if (shouldUseIntakeV2(endpointType)) {
              parameters +=
                "&dd-api-key=" +
                clientToken +
                ("&dd-evp-origin-version=" + encodeURIComponent(sdkVersion)) +
                "&dd-evp-origin=browser" +
                ("&dd-request-id=" +
                  (0,
                  _tools_utils__WEBPACK_IMPORTED_MODULE_0__.generateUUID)());
            }
            if (endpointType === "rum") {
              parameters +=
                "&batch_time=" +
                (0,
                _tools_timeUtils__WEBPACK_IMPORTED_MODULE_1__.timeStampNow)();
            }
            return parameters;
          }
          function shouldUseIntakeV2(endpointType) {
            return (
              intakeApiVersion === 2 ||
              !(0, _tools_utils__WEBPACK_IMPORTED_MODULE_0__.includes)(
                INTAKE_V1_ALLOWED_SITES,
                site
              ) ||
              endpointType === "sessionReplay"
            );
          }
          function shouldUseAlternateDomain(endpointType) {
            return (
              useAlternateIntakeDomains ||
              !(0, _tools_utils__WEBPACK_IMPORTED_MODULE_0__.includes)(
                CLASSIC_ALLOWED_SITES,
                site
              ) ||
              endpointType === "sessionReplay"
            );
          }
          return {
            build: build,
            buildIntakeUrl: buildIntakeUrl,
          };
        }

        /***/
      },

    /***/ "../core/src/domain/configuration/experimentalFeatures.ts":
      /*!****************************************************************!*\
  !*** ../core/src/domain/configuration/experimentalFeatures.ts ***!
  \****************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ updateExperimentalFeatures: function () {
            return /* binding */ updateExperimentalFeatures;
          },
          /* harmony export */ isExperimentalFeatureEnabled: function () {
            return /* binding */ isExperimentalFeatureEnabled;
          },
          /* harmony export */ resetExperimentalFeatures: function () {
            return /* binding */ resetExperimentalFeatures;
          },
          /* harmony export */
        });
        /**
         * LIMITATION:
         * For NPM setup, this feature flag singleton is shared between RUM and Logs product.
         * This means that an experimental flag set on the RUM product will be set on the Logs product.
         * So keep in mind that in certain configurations, your experimental feature flag may affect other products.
         */
        var enabledExperimentalFeatures;
        function updateExperimentalFeatures(enabledFeatures) {
          // Safely handle external data
          if (!Array.isArray(enabledFeatures)) {
            return;
          }
          if (!enabledExperimentalFeatures) {
            enabledExperimentalFeatures = new Set(enabledFeatures);
          }
          enabledFeatures
            .filter(function (flag) {
              return typeof flag === "string";
            })
            .forEach(function (flag) {
              enabledExperimentalFeatures.add(flag);
            });
        }
        function isExperimentalFeatureEnabled(featureName) {
          return (
            !!enabledExperimentalFeatures &&
            enabledExperimentalFeatures.has(featureName)
          );
        }
        function resetExperimentalFeatures() {
          enabledExperimentalFeatures = new Set();
        }

        /***/
      },

    /***/ "../core/src/domain/configuration/transportConfiguration.ts":
      /*!******************************************************************!*\
  !*** ../core/src/domain/configuration/transportConfiguration.ts ***!
  \******************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ computeTransportConfiguration: function () {
            return /* binding */ computeTransportConfiguration;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _boot_init__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../boot/init */ "../core/src/boot/init.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./endpointBuilder */ "../core/src/domain/configuration/endpointBuilder.ts"
          );

        function computeTransportConfiguration(initConfiguration, buildEnv) {
          var endpointBuilders = computeEndpointBuilders(
            initConfiguration,
            buildEnv
          );
          var intakeEndpoints = (0,
          _tools_utils__WEBPACK_IMPORTED_MODULE_1__.objectValues)(
            endpointBuilders
          ).map(function (builder) {
            return builder.buildIntakeUrl();
          });
          var replicaConfiguration = computeReplicaConfiguration(
            initConfiguration,
            buildEnv,
            intakeEndpoints
          );
          return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              {
                isIntakeUrl: function (url) {
                  return intakeEndpoints.some(function (intakeEndpoint) {
                    return url.indexOf(intakeEndpoint) === 0;
                  });
                },
              },
              endpointBuilders
            ),
            { replica: replicaConfiguration }
          );
        }
        function computeEndpointBuilders(initConfiguration, buildEnv) {
          if (
            buildEnv.buildMode ===
            _boot_init__WEBPACK_IMPORTED_MODULE_2__.BuildMode.E2E_TEST
          ) {
            var e2eEndpointBuilder = function (placeholder) {
              return {
                build: function () {
                  return placeholder;
                },
                buildIntakeUrl: function () {
                  return placeholder;
                },
              };
            };
            return {
              logsEndpointBuilder: e2eEndpointBuilder(
                "<<< E2E LOGS ENDPOINT >>>"
              ),
              rumEndpointBuilder: e2eEndpointBuilder(
                "<<< E2E RUM ENDPOINT >>>"
              ),
              sessionReplayEndpointBuilder: e2eEndpointBuilder(
                "<<< E2E SESSION REPLAY ENDPOINT >>>"
              ),
              internalMonitoringEndpointBuilder: e2eEndpointBuilder(
                "<<< E2E INTERNAL MONITORING ENDPOINT >>>"
              ),
            };
          }
          var endpointBuilders = {
            logsEndpointBuilder: (0,
            _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
              initConfiguration,
              buildEnv,
              "logs"
            ),
            rumEndpointBuilder: (0,
            _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
              initConfiguration,
              buildEnv,
              "rum"
            ),
            sessionReplayEndpointBuilder: (0,
            _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
              initConfiguration,
              buildEnv,
              "sessionReplay"
            ),
          };
          if (initConfiguration.internalMonitoringApiKey) {
            return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                {},
                endpointBuilders
              ),
              {
                internalMonitoringEndpointBuilder: (0,
                _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
                  (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                      {},
                      initConfiguration
                    ),
                    { clientToken: initConfiguration.internalMonitoringApiKey }
                  ),
                  buildEnv,
                  "logs",
                  "browser-agent-internal-monitoring"
                ),
              }
            );
          }
          return endpointBuilders;
        }
        function computeReplicaConfiguration(
          initConfiguration,
          buildEnv,
          intakeEndpoints
        ) {
          if (
            buildEnv.buildMode !==
              _boot_init__WEBPACK_IMPORTED_MODULE_2__.BuildMode.STAGING ||
            initConfiguration.replica === undefined
          ) {
            return;
          }
          var replicaConfiguration = (0,
          tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              {},
              initConfiguration
            ),
            {
              site: _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.INTAKE_SITE_US,
              applicationId: initConfiguration.replica.applicationId,
              clientToken: initConfiguration.replica.clientToken,
              useAlternateIntakeDomains: true,
              intakeApiVersion: 2,
            }
          );
          var replicaEndpointBuilders = {
            logsEndpointBuilder: (0,
            _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
              replicaConfiguration,
              buildEnv,
              "logs"
            ),
            rumEndpointBuilder: (0,
            _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
              replicaConfiguration,
              buildEnv,
              "rum"
            ),
            internalMonitoringEndpointBuilder: (0,
            _endpointBuilder__WEBPACK_IMPORTED_MODULE_3__.createEndpointBuilder)(
              replicaConfiguration,
              buildEnv,
              "logs",
              "browser-agent-internal-monitoring"
            ),
          };
          intakeEndpoints.push.apply(
            intakeEndpoints,
            (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.objectValues)(
              replicaEndpointBuilders
            ).map(function (builder) {
              return builder.buildIntakeUrl();
            })
          );
          return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            { applicationId: initConfiguration.replica.applicationId },
            replicaEndpointBuilders
          );
        }

        /***/
      },

    /***/ "../core/src/domain/error/trackConsoleError.ts":
      /*!*****************************************************!*\
  !*** ../core/src/domain/error/trackConsoleError.ts ***!
  \*****************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ trackConsoleError: function () {
            return /* binding */ trackConsoleError;
          },
          /* harmony export */ resetConsoleErrorProxy: function () {
            return /* binding */ resetConsoleErrorProxy;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _tools_error__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../tools/error */ "../core/src/tools/error.ts"
          );
        /* harmony import */ var _tools_observable__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../tools/observable */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../../tools/timeUtils */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _internalMonitoring__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _tracekit__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../tracekit */ "../core/src/domain/tracekit/computeStackTrace.ts"
          );

        /* eslint-disable no-console */
        function trackConsoleError(errorObservable) {
          startConsoleErrorProxy().subscribe(function (error) {
            return errorObservable.notify(error);
          });
        }
        var originalConsoleError;
        var consoleErrorObservable;
        function startConsoleErrorProxy() {
          if (!consoleErrorObservable) {
            consoleErrorObservable =
              new _tools_observable__WEBPACK_IMPORTED_MODULE_1__.Observable();
            originalConsoleError = console.error;
            console.error = function () {
              var params = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
              }
              var handlingStack = (0,
              _tools_error__WEBPACK_IMPORTED_MODULE_2__.createHandlingStack)();
              (0,
              _internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.callMonitored)(
                function () {
                  originalConsoleError.apply(console, params);
                  var rawError = (0,
                  tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                      {},
                      buildErrorFromParams(params, handlingStack)
                    ),
                    {
                      source:
                        _tools_error__WEBPACK_IMPORTED_MODULE_2__.ErrorSource
                          .CONSOLE,
                      startClocks: (0,
                      _tools_timeUtils__WEBPACK_IMPORTED_MODULE_4__.clocksNow)(),
                      handling:
                        _tools_error__WEBPACK_IMPORTED_MODULE_2__.ErrorHandling
                          .HANDLED,
                    }
                  );
                  consoleErrorObservable.notify(rawError);
                }
              );
            };
          }
          return consoleErrorObservable;
        }
        function resetConsoleErrorProxy() {
          if (consoleErrorObservable) {
            consoleErrorObservable = undefined;
            console.error = originalConsoleError;
          }
        }
        function buildErrorFromParams(params, handlingStack) {
          var firstErrorParam = (0,
          _tools_utils__WEBPACK_IMPORTED_MODULE_5__.find)(
            params,
            function (param) {
              return param instanceof Error;
            }
          );
          return {
            message: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArrays)(
              ["console error:"],
              params
            )
              .map(function (param) {
                return formatConsoleParameters(param);
              })
              .join(" "),
            stack: firstErrorParam
              ? (0,
                _tools_error__WEBPACK_IMPORTED_MODULE_2__.toStackTraceString)(
                  (0, _tracekit__WEBPACK_IMPORTED_MODULE_6__.computeStackTrace)(
                    firstErrorParam
                  )
                )
              : undefined,
            handlingStack: handlingStack,
          };
        }
        function formatConsoleParameters(param) {
          if (typeof param === "string") {
            return param;
          }
          if (param instanceof Error) {
            return (0,
            _tools_error__WEBPACK_IMPORTED_MODULE_2__.formatErrorMessage)(
              (0, _tracekit__WEBPACK_IMPORTED_MODULE_6__.computeStackTrace)(
                param
              )
            );
          }
          return (0, _tools_utils__WEBPACK_IMPORTED_MODULE_5__.jsonStringify)(
            param,
            undefined,
            2
          );
        }

        /***/
      },

    /***/ "../core/src/domain/error/trackRuntimeError.ts":
      /*!*****************************************************!*\
  !*** ../core/src/domain/error/trackRuntimeError.ts ***!
  \*****************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ trackRuntimeError: function () {
            return /* binding */ trackRuntimeError;
          },
          /* harmony export */
        });
        /* harmony import */ var _tools_error__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../tools/error */ "../core/src/tools/error.ts"
          );
        /* harmony import */ var _tools_timeUtils__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../tools/timeUtils */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _tracekit__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../tracekit */ "../core/src/domain/tracekit/tracekit.ts"
          );

        function trackRuntimeError(errorObservable) {
          return (0,
          _tracekit__WEBPACK_IMPORTED_MODULE_0__.startUnhandledErrorCollection)(
            function (stackTrace, errorObject) {
              var _a = (0,
                _tools_error__WEBPACK_IMPORTED_MODULE_1__.formatUnknownError)(
                  stackTrace,
                  errorObject,
                  "Uncaught"
                ),
                stack = _a.stack,
                message = _a.message,
                type = _a.type;
              errorObservable.notify({
                message: message,
                stack: stack,
                type: type,
                source:
                  _tools_error__WEBPACK_IMPORTED_MODULE_1__.ErrorSource.SOURCE,
                startClocks: (0,
                _tools_timeUtils__WEBPACK_IMPORTED_MODULE_2__.clocksNow)(),
                originalError: errorObject,
                handling:
                  _tools_error__WEBPACK_IMPORTED_MODULE_1__.ErrorHandling
                    .UNHANDLED,
              });
            }
          );
        }

        /***/
      },

    /***/ "../core/src/domain/internalMonitoring.ts":
      /*!************************************************!*\
  !*** ../core/src/domain/internalMonitoring.ts ***!
  \************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startInternalMonitoring: function () {
            return /* binding */ startInternalMonitoring;
          },
          /* harmony export */ startFakeInternalMonitoring: function () {
            return /* binding */ startFakeInternalMonitoring;
          },
          /* harmony export */ resetInternalMonitoring: function () {
            return /* binding */ resetInternalMonitoring;
          },
          /* harmony export */ monitored: function () {
            return /* binding */ monitored;
          },
          /* harmony export */ monitor: function () {
            return /* binding */ monitor;
          },
          /* harmony export */ callMonitored: function () {
            return /* binding */ callMonitored;
          },
          /* harmony export */ addMonitoringMessage: function () {
            return /* binding */ addMonitoringMessage;
          },
          /* harmony export */ addErrorToMonitoringBatch: function () {
            return /* binding */ addErrorToMonitoringBatch;
          },
          /* harmony export */ setDebugMode: function () {
            return /* binding */ setDebugMode;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _tools_display__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../tools/display */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _tools_error__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../tools/error */ "../core/src/tools/error.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _transport__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../transport */ "../core/src/transport/batch.ts"
          );
        /* harmony import */ var _transport__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../transport */ "../core/src/transport/httpRequest.ts"
          );
        /* harmony import */ var _tracekit__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./tracekit */ "../core/src/domain/tracekit/computeStackTrace.ts"
          );

        var StatusType;
        (function (StatusType) {
          StatusType["info"] = "info";
          StatusType["error"] = "error";
        })(StatusType || (StatusType = {}));
        var monitoringConfiguration = {
          maxMessagesPerPage: 0,
          sentMessageCount: 0,
        };
        var externalContextProvider;
        function startInternalMonitoring(configuration) {
          if (configuration.internalMonitoringEndpointBuilder) {
            var batch = startMonitoringBatch(configuration);
            (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.assign)(
              monitoringConfiguration,
              {
                batch: batch,
                maxMessagesPerPage:
                  configuration.maxInternalMonitoringMessagesPerPage,
                sentMessageCount: 0,
              }
            );
          }
          return {
            setExternalContextProvider: function (provider) {
              externalContextProvider = provider;
            },
          };
        }
        function startMonitoringBatch(configuration) {
          var primaryBatch = createMonitoringBatch(
            configuration.internalMonitoringEndpointBuilder
          );
          var replicaBatch;
          if (configuration.replica !== undefined) {
            replicaBatch = createMonitoringBatch(
              configuration.replica.internalMonitoringEndpointBuilder
            );
          }
          function createMonitoringBatch(endpointBuilder) {
            return new _transport__WEBPACK_IMPORTED_MODULE_2__.Batch(
              new _transport__WEBPACK_IMPORTED_MODULE_3__.HttpRequest(
                endpointBuilder,
                configuration.batchBytesLimit
              ),
              configuration.maxBatchSize,
              configuration.batchBytesLimit,
              configuration.maxMessageSize,
              configuration.flushTimeout
            );
          }
          function withContext(message) {
            return (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.combine)(
              {
                date: new Date().getTime(),
              },
              externalContextProvider !== undefined
                ? externalContextProvider()
                : {},
              message
            );
          }
          return {
            add: function (message) {
              var contextualizedMessage = withContext(message);
              primaryBatch.add(contextualizedMessage);
              if (replicaBatch) {
                replicaBatch.add(contextualizedMessage);
              }
            },
          };
        }
        function startFakeInternalMonitoring() {
          var messages = [];
          (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.assign)(
            monitoringConfiguration,
            {
              batch: {
                add: function (message) {
                  messages.push(message);
                },
              },
              maxMessagesPerPage: Infinity,
              sentMessageCount: 0,
            }
          );
          return messages;
        }
        function resetInternalMonitoring() {
          monitoringConfiguration.batch = undefined;
        }
        function monitored(_, __, descriptor) {
          var originalMethod = descriptor.value;
          descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var decorated = monitoringConfiguration.batch
              ? monitor(originalMethod)
              : originalMethod;
            return decorated.apply(this, args);
          };
        }
        function monitor(fn) {
          return function () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return callMonitored(fn, this, arguments);
          }; // consider output type has input type
        }
        function callMonitored(fn, context, args) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return fn.apply(context, args);
          } catch (e) {
            logErrorIfDebug(e);
            try {
              addErrorToMonitoringBatch(e);
            } catch (e) {
              logErrorIfDebug(e);
            }
          }
        }
        function addMonitoringMessage(message, context) {
          logMessageIfDebug(message, context);
          addToMonitoringBatch(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                { message: message },
                context
              ),
              { status: StatusType.info }
            )
          );
        }
        function addErrorToMonitoringBatch(e) {
          addToMonitoringBatch(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                {},
                formatError(e)
              ),
              { status: StatusType.error }
            )
          );
        }
        function addToMonitoringBatch(message) {
          if (
            monitoringConfiguration.batch &&
            monitoringConfiguration.sentMessageCount <
              monitoringConfiguration.maxMessagesPerPage
          ) {
            monitoringConfiguration.sentMessageCount += 1;
            monitoringConfiguration.batch.add(message);
          }
        }
        function formatError(e) {
          if (e instanceof Error) {
            var stackTrace = (0,
            _tracekit__WEBPACK_IMPORTED_MODULE_4__.computeStackTrace)(e);
            return {
              error: {
                kind: stackTrace.name,
                stack: (0,
                _tools_error__WEBPACK_IMPORTED_MODULE_5__.toStackTraceString)(
                  stackTrace
                ),
              },
              message: stackTrace.message,
            };
          }
          return {
            error: {
              stack: "Not an instance of error",
            },
            message:
              "Uncaught " +
              (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.jsonStringify)(e),
          };
        }
        function setDebugMode(debugMode) {
          monitoringConfiguration.debugMode = debugMode;
        }
        function logErrorIfDebug(e) {
          if (monitoringConfiguration.debugMode) {
            _tools_display__WEBPACK_IMPORTED_MODULE_6__.display.error(
              "[INTERNAL ERROR]",
              e
            );
          }
        }
        function logMessageIfDebug(message, context) {
          if (monitoringConfiguration.debugMode) {
            _tools_display__WEBPACK_IMPORTED_MODULE_6__.display.log(
              "[MONITORING MESSAGE]",
              message,
              context
            );
          }
        }

        /***/
      },

    /***/ "../core/src/domain/session/oldCookiesMigration.ts":
      /*!*********************************************************!*\
  !*** ../core/src/domain/session/oldCookiesMigration.ts ***!
  \*********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ OLD_SESSION_COOKIE_NAME: function () {
            return /* binding */ OLD_SESSION_COOKIE_NAME;
          },
          /* harmony export */ OLD_RUM_COOKIE_NAME: function () {
            return /* binding */ OLD_RUM_COOKIE_NAME;
          },
          /* harmony export */ OLD_LOGS_COOKIE_NAME: function () {
            return /* binding */ OLD_LOGS_COOKIE_NAME;
          },
          /* harmony export */ RUM_SESSION_KEY: function () {
            return /* binding */ RUM_SESSION_KEY;
          },
          /* harmony export */ LOGS_SESSION_KEY: function () {
            return /* binding */ LOGS_SESSION_KEY;
          },
          /* harmony export */ tryOldCookiesMigration: function () {
            return /* binding */ tryOldCookiesMigration;
          },
          /* harmony export */
        });
        /* harmony import */ var _browser_cookie__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../browser/cookie */ "../core/src/browser/cookie.ts"
          );
        /* harmony import */ var _sessionStore__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./sessionStore */ "../core/src/domain/session/sessionStore.ts"
          );

        var OLD_SESSION_COOKIE_NAME = "_dd";
        var OLD_RUM_COOKIE_NAME = "_dd_r";
        var OLD_LOGS_COOKIE_NAME = "_dd_l";
        // duplicate values to avoid dependency issues
        var RUM_SESSION_KEY = "rum";
        var LOGS_SESSION_KEY = "logs";
        /**
         * This migration should remain in the codebase as long as older versions are available/live
         * to allow older sdk versions to be upgraded to newer versions without compatibility issues.
         */
        function tryOldCookiesMigration(options) {
          var sessionCookie = (0,
          _browser_cookie__WEBPACK_IMPORTED_MODULE_0__.cacheCookieAccess)(
            _sessionStore__WEBPACK_IMPORTED_MODULE_1__.SESSION_COOKIE_NAME,
            options
          );
          var sessionString = sessionCookie.get();
          var oldSessionId = (0,
          _browser_cookie__WEBPACK_IMPORTED_MODULE_0__.getCookie)(
            OLD_SESSION_COOKIE_NAME
          );
          var oldRumType = (0,
          _browser_cookie__WEBPACK_IMPORTED_MODULE_0__.getCookie)(
            OLD_RUM_COOKIE_NAME
          );
          var oldLogsType = (0,
          _browser_cookie__WEBPACK_IMPORTED_MODULE_0__.getCookie)(
            OLD_LOGS_COOKIE_NAME
          );
          if (!sessionString) {
            var session = {};
            if (oldSessionId) {
              session.id = oldSessionId;
            }
            if (oldLogsType && /^[01]$/.test(oldLogsType)) {
              session[LOGS_SESSION_KEY] = oldLogsType;
            }
            if (oldRumType && /^[012]$/.test(oldRumType)) {
              session[RUM_SESSION_KEY] = oldRumType;
            }
            (0, _sessionStore__WEBPACK_IMPORTED_MODULE_1__.persistSession)(
              session,
              sessionCookie
            );
          }
        }

        /***/
      },

    /***/ "../core/src/domain/session/sessionManagement.ts":
      /*!*******************************************************!*\
  !*** ../core/src/domain/session/sessionManagement.ts ***!
  \*******************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ VISIBILITY_CHECK_DELAY: function () {
            return /* binding */ VISIBILITY_CHECK_DELAY;
          },
          /* harmony export */ startSessionManagement: function () {
            return /* binding */ startSessionManagement;
          },
          /* harmony export */ stopSessionManagement: function () {
            return /* binding */ stopSessionManagement;
          },
          /* harmony export */
        });
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _internalMonitoring__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _oldCookiesMigration__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./oldCookiesMigration */ "../core/src/domain/session/oldCookiesMigration.ts"
          );
        /* harmony import */ var _sessionStore__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./sessionStore */ "../core/src/domain/session/sessionStore.ts"
          );

        var VISIBILITY_CHECK_DELAY =
          _tools_utils__WEBPACK_IMPORTED_MODULE_0__.ONE_MINUTE;
        function startSessionManagement(
          options,
          productKey,
          computeSessionState
        ) {
          (0,
          _oldCookiesMigration__WEBPACK_IMPORTED_MODULE_1__.tryOldCookiesMigration)(
            options
          );
          var sessionStore = (0,
          _sessionStore__WEBPACK_IMPORTED_MODULE_2__.startSessionStore)(
            options,
            productKey,
            computeSessionState
          );
          sessionStore.expandOrRenewSession();
          trackActivity(function () {
            return sessionStore.expandOrRenewSession();
          });
          trackVisibility(function () {
            return sessionStore.expandSession();
          });
          return {
            getId: function () {
              return sessionStore.retrieveSession().id;
            },
            getTrackingType: function () {
              return sessionStore.retrieveSession()[productKey];
            },
            renewObservable: sessionStore.renewObservable,
          };
        }
        function stopSessionManagement() {
          stopCallbacks.forEach(function (e) {
            return e();
          });
          stopCallbacks = [];
        }
        var stopCallbacks = [];
        function trackActivity(expandOrRenewSession) {
          var stop =
            _tools_utils__WEBPACK_IMPORTED_MODULE_0__.addEventListeners(
              window,
              [
                "click" /* CLICK */,
                "touchstart" /* TOUCH_START */,
                "keydown" /* KEY_DOWN */,
                "scroll" /* SCROLL */,
              ],
              expandOrRenewSession,
              { capture: true, passive: true }
            ).stop;
          stopCallbacks.push(stop);
        }
        function trackVisibility(expandSession) {
          var expandSessionWhenVisible = (0,
          _internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.monitor)(
            function () {
              if (document.visibilityState === "visible") {
                expandSession();
              }
            }
          );
          var stop = _tools_utils__WEBPACK_IMPORTED_MODULE_0__.addEventListener(
            document,
            "visibilitychange" /* VISIBILITY_CHANGE */,
            expandSessionWhenVisible
          ).stop;
          stopCallbacks.push(stop);
          var visibilityCheckInterval = setInterval(
            expandSessionWhenVisible,
            VISIBILITY_CHECK_DELAY
          );
          stopCallbacks.push(function () {
            clearInterval(visibilityCheckInterval);
          });
        }

        /***/
      },

    /***/ "../core/src/domain/session/sessionStore.ts":
      /*!**************************************************!*\
  !*** ../core/src/domain/session/sessionStore.ts ***!
  \**************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ SESSION_COOKIE_NAME: function () {
            return /* binding */ SESSION_COOKIE_NAME;
          },
          /* harmony export */ SESSION_EXPIRATION_DELAY: function () {
            return /* binding */ SESSION_EXPIRATION_DELAY;
          },
          /* harmony export */ SESSION_TIME_OUT_DELAY: function () {
            return /* binding */ SESSION_TIME_OUT_DELAY;
          },
          /* harmony export */ startSessionStore: function () {
            return /* binding */ startSessionStore;
          },
          /* harmony export */ persistSession: function () {
            return /* binding */ persistSession;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _browser_cookie__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../../browser/cookie */ "../core/src/browser/cookie.ts"
          );
        /* harmony import */ var _tools_observable__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../tools/observable */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _internalMonitoring__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );

        var SESSION_COOKIE_NAME = "_dd_s";
        var SESSION_EXPIRATION_DELAY =
          15 * _tools_utils__WEBPACK_IMPORTED_MODULE_1__.ONE_MINUTE;
        var SESSION_TIME_OUT_DELAY =
          4 * _tools_utils__WEBPACK_IMPORTED_MODULE_1__.ONE_HOUR;
        var SESSION_ENTRY_REGEXP = /^([a-z]+)=([a-z0-9-]+)$/;
        var SESSION_ENTRY_SEPARATOR = "&";
        function startSessionStore(options, productKey, computeSessionState) {
          var renewObservable =
            new _tools_observable__WEBPACK_IMPORTED_MODULE_2__.Observable();
          var sessionCookie = (0,
          _browser_cookie__WEBPACK_IMPORTED_MODULE_3__.cacheCookieAccess)(
            SESSION_COOKIE_NAME,
            options
          );
          var inMemorySession = retrieveActiveSession(sessionCookie);
          var expandOrRenewSession =
            _tools_utils__WEBPACK_IMPORTED_MODULE_1__.throttle(
              (0, _internalMonitoring__WEBPACK_IMPORTED_MODULE_4__.monitor)(
                function () {
                  sessionCookie.clearCache();
                  var cookieSession = retrieveActiveSession(sessionCookie);
                  var _a = computeSessionState(cookieSession[productKey]),
                    trackingType = _a.trackingType,
                    isTracked = _a.isTracked;
                  cookieSession[productKey] = trackingType;
                  if (isTracked && !cookieSession.id) {
                    cookieSession.id =
                      _tools_utils__WEBPACK_IMPORTED_MODULE_1__.generateUUID();
                    cookieSession.created = String(Date.now());
                  }
                  // save changes and expand session duration
                  persistSession(cookieSession, sessionCookie);
                  // If the session id has changed, notify that the session has been renewed
                  if (isTracked && inMemorySession.id !== cookieSession.id) {
                    inMemorySession = (0,
                    tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                      {},
                      cookieSession
                    );
                    renewObservable.notify();
                  }
                  inMemorySession = (0,
                  tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    {},
                    cookieSession
                  );
                }
              ),
              _browser_cookie__WEBPACK_IMPORTED_MODULE_3__.COOKIE_ACCESS_DELAY
            ).throttled;
          function expandSession() {
            sessionCookie.clearCache();
            var session = retrieveActiveSession(sessionCookie);
            persistSession(session, sessionCookie);
          }
          function retrieveSession() {
            return retrieveActiveSession(sessionCookie);
          }
          return {
            expandOrRenewSession: expandOrRenewSession,
            expandSession: expandSession,
            retrieveSession: retrieveSession,
            renewObservable: renewObservable,
          };
        }
        function isValidSessionString(sessionString) {
          return (
            sessionString !== undefined &&
            (sessionString.indexOf(SESSION_ENTRY_SEPARATOR) !== -1 ||
              SESSION_ENTRY_REGEXP.test(sessionString))
          );
        }
        function retrieveActiveSession(sessionCookie) {
          var session = retrieveSession(sessionCookie);
          if (isActiveSession(session)) {
            return session;
          }
          clearSession(sessionCookie);
          return {};
        }
        function isActiveSession(session) {
          // created and expire can be undefined for versions which was not storing them
          // these checks could be removed when older versions will not be available/live anymore
          return (
            (session.created === undefined ||
              Date.now() - Number(session.created) < SESSION_TIME_OUT_DELAY) &&
            (session.expire === undefined ||
              Date.now() < Number(session.expire))
          );
        }
        function retrieveSession(sessionCookie) {
          var sessionString = sessionCookie.get();
          var session = {};
          if (isValidSessionString(sessionString)) {
            sessionString
              .split(SESSION_ENTRY_SEPARATOR)
              .forEach(function (entry) {
                var matches = SESSION_ENTRY_REGEXP.exec(entry);
                if (matches !== null) {
                  var key = matches[1],
                    value = matches[2];
                  session[key] = value;
                }
              });
          }
          return session;
        }
        function persistSession(session, cookie) {
          if (
            _tools_utils__WEBPACK_IMPORTED_MODULE_1__.isEmptyObject(session)
          ) {
            clearSession(cookie);
            return;
          }
          session.expire = String(Date.now() + SESSION_EXPIRATION_DELAY);
          var cookieString = _tools_utils__WEBPACK_IMPORTED_MODULE_1__
            .objectEntries(session)
            .map(function (_a) {
              var key = _a[0],
                value = _a[1];
              return key + "=" + value;
            })
            .join(SESSION_ENTRY_SEPARATOR);
          cookie.set(cookieString, SESSION_EXPIRATION_DELAY);
        }
        function clearSession(cookie) {
          cookie.set("", 0);
        }

        /***/
      },

    /***/ "../core/src/domain/tracekit/computeStackTrace.ts":
      /*!********************************************************!*\
  !*** ../core/src/domain/tracekit/computeStackTrace.ts ***!
  \********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ computeStackTrace: function () {
            return /* binding */ computeStackTrace;
          },
          /* harmony export */ computeStackTraceFromStackProp: function () {
            return /* binding */ computeStackTraceFromStackProp;
          },
          /* harmony export */ computeStackTraceOfCaller: function () {
            return /* binding */ computeStackTraceOfCaller;
          },
          /* harmony export */
        });
        var UNKNOWN_FUNCTION = "?";
        /**
         * computeStackTrace: cross-browser stack traces in JavaScript
         *
         * Syntax:
         * ```js
         * s = computeStackTraceOfCaller([depth])
         * s = computeStackTrace(exception)
         * ```
         *
         * Supports:
         *   - Firefox:  full stack trace with line numbers and unreliable column
         *               number on top frame
         *   - Opera 10: full stack trace with line and column numbers
         *   - Opera 9-: full stack trace with line numbers
         *   - Chrome:   full stack trace with line and column numbers
         *   - Safari:   line and column number for the topmost stacktrace element
         *               only
         *   - IE:       no line numbers whatsoever
         *
         * Tries to guess names of anonymous functions by looking for assignments
         * in the source code. In IE and Safari, we have to guess source file names
         * by searching for function bodies inside all page scripts. This will not
         * work for scripts that are loaded cross-domain.
         * Here be dragons: some function names may be guessed incorrectly, and
         * duplicate functions may be mismatched.
         *
         * computeStackTrace should only be used for tracing purposes.
         *
         * Note: In IE and Safari, no stack trace is recorded on the Error object,
         * so computeStackTrace instead walks its *own* chain of callers.
         * This means that:
         *  * in Safari, some methods may be missing from the stack trace;
         *  * in IE, the topmost function in the stack trace will always be the
         *    caller of computeStackTrace.
         *
         * This is okay for tracing (because you are likely to be calling
         * computeStackTrace from the function you want to be the topmost element
         * of the stack trace anyway), but not okay for logging unhandled
         * exceptions (because your catch block will likely be far away from the
         * inner function that actually caused the exception).
         *
         * Tracing example:
         * ```js
         *     function trace(message) {
         *         let stackInfo = computeStackTrace.ofCaller();
         *         let data = message + "\n";
         *         for(let i in stackInfo.stack) {
         *             let item = stackInfo.stack[i];
         *             data += (item.func || '[anonymous]') + "() in " + item.url + ":" + (item.line || '0') + "\n";
         *         }
         *         if (window.console)
         *             console.info(data);
         *         else
         *             alert(data);
         *     }
         * ```
         * @memberof TraceKit
         * @namespace
         */
        /**
         * Computes a stack trace for an exception.
         * @param {Error} ex
         * @param {(string|number)=} depth
         * @memberof computeStackTrace
         */
        function computeStackTrace(ex, depth) {
          var stack;
          var normalizedDepth = depth === undefined ? 0 : +depth;
          try {
            // This must be tried first because Opera 10 *destroys*
            // its stacktrace property if you try to access the stack
            // property first!!
            stack = computeStackTraceFromStacktraceProp(ex);
            if (stack) {
              return stack;
            }
          } catch (e) {
            if (debug) {
              throw e;
            }
          }
          try {
            stack = computeStackTraceFromStackProp(ex);
            if (stack) {
              return stack;
            }
          } catch (e) {
            if (debug) {
              throw e;
            }
          }
          try {
            stack = computeStackTraceFromOperaMultiLineMessage(ex);
            if (stack) {
              return stack;
            }
          } catch (e) {
            if (debug) {
              throw e;
            }
          }
          try {
            stack = computeStackTraceByWalkingCallerChain(
              ex,
              normalizedDepth + 1
            );
            if (stack) {
              return stack;
            }
          } catch (e) {
            if (debug) {
              throw e;
            }
          }
          return {
            message: tryToGetString(ex, "message"),
            name: tryToGetString(ex, "name"),
            stack: [],
          };
        }
        var debug = false;
        // Contents of Exception in various browsers.
        //
        // SAFARI:
        // ex.message = Can't find variable: qq
        // ex.line = 59
        // ex.sourceId = 580238192
        // ex.sourceURL = http://...
        // ex.expressionBeginOffset = 96
        // ex.expressionCaretOffset = 98
        // ex.expressionEndOffset = 98
        // ex.name = ReferenceError
        //
        // FIREFOX:
        // ex.message = qq is not defined
        // ex.fileName = http://...
        // ex.lineNumber = 59
        // ex.columnNumber = 69
        // ex.stack = ...stack trace... (see the example below)
        // ex.name = ReferenceError
        //
        // CHROME:
        // ex.message = qq is not defined
        // ex.name = ReferenceError
        // ex.type = not_defined
        // ex.arguments = ['aa']
        // ex.stack = ...stack trace...
        //
        // INTERNET EXPLORER:
        // ex.message = ...
        // ex.name = ReferenceError
        //
        // OPERA:
        // ex.message = ...message... (see the example below)
        // ex.name = ReferenceError
        // ex.opera#sourceloc = 11  (pretty much useless, duplicates the info in ex.message)
        // ex.stacktrace = n/a; see 'opera:config#UserPrefs|Exceptions Have Stacktrace'
        /**
         * Computes stack trace information from the stack property.
         * Chrome and Gecko use this property.
         * @param {Error} ex
         * @return {?StackTrace} Stack trace information.
         * @memberof computeStackTrace
         */
        function computeStackTraceFromStackProp(ex) {
          var stacktrace = tryToGetString(ex, "stack");
          if (!stacktrace) {
            return;
          }
          // eslint-disable-next-line  max-len
          var chrome =
            /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
          // eslint-disable-next-line  max-len
          var gecko =
            /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
          // eslint-disable-next-line  max-len
          var winjs =
            /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
          // Used to additionally parse URL/line/column from eval frames
          var isEval;
          var geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
          var chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/;
          var lines = stacktrace.split("\n");
          var stack = [];
          var submatch;
          var parts;
          var element;
          for (var i = 0, j = lines.length; i < j; i += 1) {
            if (chrome.exec(lines[i])) {
              parts = chrome.exec(lines[i]);
              var isNative = parts[2] && parts[2].indexOf("native") === 0; // start of line
              isEval = parts[2] && parts[2].indexOf("eval") === 0; // start of line
              submatch = chromeEval.exec(parts[2]);
              if (isEval && submatch) {
                // throw out eval line/column and use top-most line/column number
                parts[2] = submatch[1]; // url
                parts[3] = submatch[2]; // line
                parts[4] = submatch[3]; // column
              }
              element = {
                args: isNative ? [parts[2]] : [],
                column: parts[4] ? +parts[4] : undefined,
                func: parts[1] || UNKNOWN_FUNCTION,
                line: parts[3] ? +parts[3] : undefined,
                url: !isNative ? parts[2] : undefined,
              };
            } else if (winjs.exec(lines[i])) {
              parts = winjs.exec(lines[i]);
              element = {
                args: [],
                column: parts[4] ? +parts[4] : undefined,
                func: parts[1] || UNKNOWN_FUNCTION,
                line: +parts[3],
                url: parts[2],
              };
            } else if (gecko.exec(lines[i])) {
              parts = gecko.exec(lines[i]);
              isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
              submatch = geckoEval.exec(parts[3]);
              if (isEval && submatch) {
                // throw out eval line/column and use top-most line number
                parts[3] = submatch[1];
                parts[4] = submatch[2];
                parts[5] = undefined; // no column when eval
              } else if (
                i === 0 &&
                !parts[5] &&
                !isUndefined(ex.columnNumber)
              ) {
                // FireFox uses this awesome columnNumber property for its top frame
                // Also note, Firefox's column number is 0-based and everything else expects 1-based,
                // so adding 1
                // NOTE: this hack doesn't work if top-most frame is eval
                stack[0].column = ex.columnNumber + 1;
              }
              element = {
                args: parts[2] ? parts[2].split(",") : [],
                column: parts[5] ? +parts[5] : undefined,
                func: parts[1] || UNKNOWN_FUNCTION,
                line: parts[4] ? +parts[4] : undefined,
                url: parts[3],
              };
            } else {
              continue;
            }
            if (!element.func && element.line) {
              element.func = UNKNOWN_FUNCTION;
            }
            stack.push(element);
          }
          if (!stack.length) {
            return;
          }
          return {
            stack: stack,
            message: tryToGetString(ex, "message"),
            name: tryToGetString(ex, "name"),
          };
        }
        /**
         * Computes stack trace information from the stacktrace property.
         * Opera 10+ uses this property.
         * @param {Error} ex
         * @return {?StackTrace} Stack trace information.
         * @memberof computeStackTrace
         */
        function computeStackTraceFromStacktraceProp(ex) {
          // Access and store the stacktrace property before doing ANYTHING
          // else to it because Opera is not very good at providing it
          // reliably in other circumstances.
          var stacktrace = tryToGetString(ex, "stacktrace");
          if (!stacktrace) {
            return;
          }
          var opera10Regex =
            / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
          // eslint-disable-next-line  max-len
          var opera11Regex =
            / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i;
          var lines = stacktrace.split("\n");
          var stack = [];
          var parts;
          for (var line = 0; line < lines.length; line += 2) {
            var element = void 0;
            if (opera10Regex.exec(lines[line])) {
              parts = opera10Regex.exec(lines[line]);
              element = {
                args: [],
                column: undefined,
                func: parts[3],
                line: +parts[1],
                url: parts[2],
              };
            } else if (opera11Regex.exec(lines[line])) {
              parts = opera11Regex.exec(lines[line]);
              element = {
                args: parts[5] ? parts[5].split(",") : [],
                column: +parts[2],
                func: parts[3] || parts[4],
                line: +parts[1],
                url: parts[6],
              };
            }
            if (element) {
              if (!element.func && element.line) {
                element.func = UNKNOWN_FUNCTION;
              }
              element.context = [lines[line + 1]];
              stack.push(element);
            }
          }
          if (!stack.length) {
            return;
          }
          return {
            stack: stack,
            message: tryToGetString(ex, "message"),
            name: tryToGetString(ex, "name"),
          };
        }
        /**
         * NOT TESTED.
         * Computes stack trace information from an error message that includes
         * the stack trace.
         * Opera 9 and earlier use this method if the option to show stack
         * traces is turned on in opera:config.
         * @param {Error} ex
         * @return {?StackTrace} Stack information.
         * @memberof computeStackTrace
         */
        function computeStackTraceFromOperaMultiLineMessage(ex) {
          // TODO: Clean this function up
          // Opera includes a stack trace into the exception message. An example is:
          //
          // Statement on line 3: Undefined variable: undefinedFunc
          // Backtrace:
          //   Line 3 of linked script file://localhost/Users/andreyvit/Projects/TraceKit/javascript-client/sample.js:
          //   In function zzz
          //         undefinedFunc(a);
          //   Line 7 of inline#1 script in file://localhost/Users/andreyvit/Projects/TraceKit/javascript-client/sample.html:
          //   In function yyy
          //           zzz(x, y, z);
          //   Line 3 of inline#1 script in file://localhost/Users/andreyvit/Projects/TraceKit/javascript-client/sample.html:
          //   In function xxx
          //           yyy(a, a, a);
          //   Line 1 of function script
          //     try { xxx('hi'); return false; } catch(ex) { report(ex); }
          //   ...
          var message = tryToGetString(ex, "message");
          if (!message) {
            return;
          }
          var lines = message.split("\n");
          if (lines.length < 4) {
            return;
          }
          var lineRE1 =
            /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i;
          var lineRE2 =
            /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i;
          var lineRE3 = /^\s*Line (\d+) of function script\s*$/i;
          var stack = [];
          var scripts =
            window &&
            window.document &&
            window.document.getElementsByTagName("script");
          var inlineScriptBlocks = [];
          var parts;
          for (var s in scripts) {
            if (has(scripts, s) && !scripts[s].src) {
              inlineScriptBlocks.push(scripts[s]);
            }
          }
          for (var line = 2; line < lines.length; line += 2) {
            var item = void 0;
            if (lineRE1.exec(lines[line])) {
              parts = lineRE1.exec(lines[line]);
              item = {
                args: [],
                column: undefined,
                func: parts[3],
                line: +parts[1],
                url: parts[2],
              };
            } else if (lineRE2.exec(lines[line])) {
              parts = lineRE2.exec(lines[line]);
              item = {
                args: [],
                column: undefined,
                func: parts[4],
                line: +parts[1],
                url: parts[3],
              };
            } else if (lineRE3.exec(lines[line])) {
              parts = lineRE3.exec(lines[line]);
              var url = window.location.href.replace(/#.*$/, "");
              item = {
                url: url,
                args: [],
                column: undefined,
                func: "",
                line: +parts[1],
              };
            }
            if (item) {
              if (!item.func) {
                item.func = UNKNOWN_FUNCTION;
              }
              item.context = [lines[line + 1]];
              stack.push(item);
            }
          }
          if (!stack.length) {
            return; // could not parse multiline exception message as Opera stack trace
          }
          return {
            stack: stack,
            message: lines[0],
            name: tryToGetString(ex, "name"),
          };
        }
        /**
         * Adds information about the first frame to incomplete stack traces.
         * Safari and IE require this to get complete data on the first frame.
         * @param {StackTrace} stackInfo Stack trace information from
         * one of the compute* methods.
         * @param {string=} url The URL of the script that caused an error.
         * @param {(number|string)=} lineNo The line number of the script that
         * caused an error.
         * @param {string=} message The error generated by the browser, which
         * hopefully contains the name of the object that caused the error.
         * @return {boolean} Whether or not the stack information was
         * augmented.
         * @memberof computeStackTrace
         */
        function augmentStackTraceWithInitialElement(stackInfo, url, lineNo) {
          var initial = {
            url: url,
            line: lineNo ? +lineNo : undefined,
          };
          if (initial.url && initial.line) {
            stackInfo.incomplete = false;
            var stack = stackInfo.stack;
            if (stack.length > 0) {
              if (stack[0].url === initial.url) {
                if (stack[0].line === initial.line) {
                  return false; // already in stack trace
                }
                if (!stack[0].line && stack[0].func === initial.func) {
                  stack[0].line = initial.line;
                  stack[0].context = initial.context;
                  return false;
                }
              }
            }
            stack.unshift(initial);
            stackInfo.partial = true;
            return true;
          }
          stackInfo.incomplete = true;
          return false;
        }
        /**
         * Computes stack trace information by walking the arguments.caller
         * chain at the time the exception occurred. This will cause earlier
         * frames to be missed but is the only way to get any stack trace in
         * Safari and IE. The top frame is restored by
         * {@link augmentStackTraceWithInitialElement}.
         * @param {Error} ex
         * @param {number} depth
         * @return {StackTrace} Stack trace information.
         * @memberof computeStackTrace
         */
        function computeStackTraceByWalkingCallerChain(ex, depth) {
          var functionName =
            /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i;
          var stack = [];
          var funcs = {};
          var recursion = false;
          var parts;
          var item;
          for (
            var curr = computeStackTraceByWalkingCallerChain.caller;
            curr && !recursion;
            curr = curr.caller
          ) {
            if (curr === computeStackTrace) {
              continue;
            }
            item = {
              args: [],
              column: undefined,
              func: UNKNOWN_FUNCTION,
              line: undefined,
              url: undefined,
            };
            parts = functionName.exec(curr.toString());
            if (curr.name) {
              item.func = curr.name;
            } else if (parts) {
              item.func = parts[1];
            }
            if (typeof item.func === "undefined") {
              item.func = parts
                ? parts.input.substring(0, parts.input.indexOf("{"))
                : undefined;
            }
            if (funcs[curr.toString()]) {
              recursion = true;
            } else {
              funcs[curr.toString()] = true;
            }
            stack.push(item);
          }
          if (depth) {
            stack.splice(0, depth);
          }
          var result = {
            stack: stack,
            message: tryToGetString(ex, "message"),
            name: tryToGetString(ex, "name"),
          };
          augmentStackTraceWithInitialElement(
            result,
            tryToGetString(ex, "sourceURL") || tryToGetString(ex, "fileName"),
            tryToGetString(ex, "line") || tryToGetString(ex, "lineNumber")
          );
          return result;
        }
        function tryToGetString(candidate, property) {
          if (
            typeof candidate !== "object" ||
            !candidate ||
            !(property in candidate)
          ) {
            return undefined;
          }
          var value = candidate[property];
          return typeof value === "string" ? value : undefined;
        }
        /**
         * Logs a stacktrace starting from the previous call and working down.
         * @param {(number|string)=} depth How many frames deep to trace.
         * @return {StackTrace} Stack trace information.
         * @memberof computeStackTrace
         */
        function computeStackTraceOfCaller(depth) {
          var currentDepth = (depth === undefined ? 0 : +depth) + 1; // "+ 1" because "ofCaller" should drop one frame
          try {
            throw new Error();
          } catch (ex) {
            return computeStackTrace(ex, currentDepth + 1);
          }
        }
        /**
         * A better form of hasOwnProperty<br/>
         * Example: `has(MainHostObject, property) === true/false`
         *
         * @param {Object} object to check property
         * @param {string} key to check
         * @return {Boolean} true if the object has the key and it is not inherited
         */
        function has(object, key) {
          return Object.prototype.hasOwnProperty.call(object, key);
        }
        /**
         * Returns true if the parameter is undefined<br/>
         * Example: `isUndefined(val) === true/false`
         *
         * @param {*} what Value to check
         * @return {Boolean} true if undefined and false otherwise
         */
        function isUndefined(what) {
          return typeof what === "undefined";
        }

        /***/
      },

    /***/ "../core/src/domain/tracekit/tracekit.ts":
      /*!***********************************************!*\
  !*** ../core/src/domain/tracekit/tracekit.ts ***!
  \***********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startUnhandledErrorCollection: function () {
            return /* binding */ startUnhandledErrorCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../tools/instrumentMethod */ "../core/src/tools/instrumentMethod.ts"
          );
        /* harmony import */ var _computeStackTrace__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./computeStackTrace */ "../core/src/domain/tracekit/computeStackTrace.ts"
          );

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types
        // eslint-disable-next-line  max-len
        var ERROR_TYPES_RE =
          /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
        /**
         * Cross-browser collection of unhandled errors
         *
         * Supports:
         * - Firefox: full stack trace with line numbers, plus column number
         * on top frame; column number is not guaranteed
         * - Opera: full stack trace with line and column numbers
         * - Chrome: full stack trace with line and column numbers
         * - Safari: line and column number for the top frame only; some frames
         * may be missing, and column number is not guaranteed
         * - IE: line and column number for the top frame only; some frames
         * may be missing, and column number is not guaranteed
         *
         * In theory, TraceKit should work on all of the following versions:
         * - IE5.5+ (only 8.0 tested)
         * - Firefox 0.9+ (only 3.5+ tested)
         * - Opera 7+ (only 10.50 tested; versions 9 and earlier may require
         * Exceptions Have Stacktrace to be enabled in opera:config)
         * - Safari 3+ (only 4+ tested)
         * - Chrome 1+ (only 5+ tested)
         * - Konqueror 3.5+ (untested)
         *
         * Tries to catch all unhandled errors and report them to the
         * callback.
         *
         * Callbacks receive a StackTrace object as described in the
         * computeStackTrace docs.
         *
         * @memberof TraceKit
         * @namespace
         */
        function startUnhandledErrorCollection(callback) {
          var stopInstrumentingOnError = instrumentOnError(callback).stop;
          var stopInstrumentingOnUnhandledRejection =
            instrumentUnhandledRejection(callback).stop;
          return {
            stop: function () {
              stopInstrumentingOnError();
              stopInstrumentingOnUnhandledRejection();
            },
          };
        }
        /**
         * Install a global onerror handler
         */
        function instrumentOnError(callback) {
          return (0,
          _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_0__.instrumentMethodAndCallOriginal)(
            window,
            "onerror",
            {
              before: function (message, url, lineNo, columnNo, errorObj) {
                var stack;
                if (errorObj) {
                  stack = (0,
                  _computeStackTrace__WEBPACK_IMPORTED_MODULE_1__.computeStackTrace)(
                    errorObj
                  );
                  callback(stack, errorObj);
                } else {
                  var location_1 = {
                    url: url,
                    column: columnNo,
                    line: lineNo,
                  };
                  var name_1;
                  var msg = message;
                  if ({}.toString.call(message) === "[object String]") {
                    var groups = ERROR_TYPES_RE.exec(msg);
                    if (groups) {
                      name_1 = groups[1];
                      msg = groups[2];
                    }
                  }
                  stack = {
                    name: name_1,
                    message: typeof msg === "string" ? msg : undefined,
                    stack: [location_1],
                  };
                  callback(stack, message);
                }
              },
            }
          );
        }
        /**
         * Install a global onunhandledrejection handler
         */
        function instrumentUnhandledRejection(callback) {
          return (0,
          _tools_instrumentMethod__WEBPACK_IMPORTED_MODULE_0__.instrumentMethodAndCallOriginal)(
            window,
            "onunhandledrejection",
            {
              before: function (e) {
                var reason = e.reason || "Empty reason";
                var stack = (0,
                _computeStackTrace__WEBPACK_IMPORTED_MODULE_1__.computeStackTrace)(
                  reason
                );
                callback(stack, reason);
              },
            }
          );
        }

        /***/
      },

    /***/ "../core/src/tools/boundedBuffer.ts":
      /*!******************************************!*\
  !*** ../core/src/tools/boundedBuffer.ts ***!
  \******************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BoundedBuffer: function () {
            return /* binding */ BoundedBuffer;
          },
          /* harmony export */
        });
        var DEFAULT_LIMIT = 10000;
        var BoundedBuffer = /** @class */ (function () {
          function BoundedBuffer(limit) {
            if (limit === void 0) {
              limit = DEFAULT_LIMIT;
            }
            this.limit = limit;
            this.buffer = [];
          }
          BoundedBuffer.prototype.add = function (callback) {
            var length = this.buffer.push(callback);
            if (length > this.limit) {
              this.buffer.splice(0, 1);
            }
          };
          BoundedBuffer.prototype.drain = function () {
            this.buffer.forEach(function (callback) {
              return callback();
            });
            this.buffer.length = 0;
          };
          return BoundedBuffer;
        })();

        /***/
      },

    /***/ "../core/src/tools/browserDetection.ts":
      /*!*********************************************!*\
  !*** ../core/src/tools/browserDetection.ts ***!
  \*********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ isIE: function () {
            return /* binding */ isIE;
          },
          /* harmony export */
        });
        function isIE() {
          return Boolean(document.documentMode);
        }

        /***/
      },

    /***/ "../core/src/tools/catchUserErrors.ts":
      /*!********************************************!*\
  !*** ../core/src/tools/catchUserErrors.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ catchUserErrors: function () {
            return /* binding */ catchUserErrors;
          },
          /* harmony export */
        });
        /* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./display */ "../core/src/tools/display.ts");

        function catchUserErrors(fn, errorMsg) {
          return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            try {
              return fn.apply(void 0, args);
            } catch (err) {
              _display__WEBPACK_IMPORTED_MODULE_0__.display.error(
                errorMsg,
                err
              );
            }
          };
        }

        /***/
      },

    /***/ "../core/src/tools/contextManager.ts":
      /*!*******************************************!*\
  !*** ../core/src/tools/contextManager.ts ***!
  \*******************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ createContextManager: function () {
            return /* binding */ createContextManager;
          },
          /* harmony export */
        });
        function createContextManager() {
          var context = {};
          return {
            get: function () {
              return context;
            },
            add: function (key, value) {
              context[key] = value;
            },
            remove: function (key) {
              delete context[key];
            },
            set: function (newContext) {
              context = newContext;
            },
          };
        }

        /***/
      },

    /***/ "../core/src/tools/createEventRateLimiter.ts":
      /*!***************************************************!*\
  !*** ../core/src/tools/createEventRateLimiter.ts ***!
  \***************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ createEventRateLimiter: function () {
            return /* binding */ createEventRateLimiter;
          },
          /* harmony export */
        });
        /* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! .. */ "../core/src/tools/utils.ts");
        /* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! .. */ "../core/src/tools/error.ts");
        /* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! .. */ "../core/src/tools/timeUtils.ts");

        function createEventRateLimiter(eventType, limit, onLimitReached) {
          var eventCount = 0;
          var allowNextEvent = false;
          return {
            isLimitReached: function () {
              if (eventCount === 0) {
                setTimeout(function () {
                  eventCount = 0;
                }, ___WEBPACK_IMPORTED_MODULE_0__.ONE_MINUTE);
              }
              eventCount += 1;
              if (eventCount <= limit || allowNextEvent) {
                allowNextEvent = false;
                return false;
              }
              if (eventCount === limit + 1) {
                allowNextEvent = true;
                try {
                  onLimitReached({
                    message:
                      "Reached max number of " +
                      eventType +
                      "s by minute: " +
                      limit,
                    source: ___WEBPACK_IMPORTED_MODULE_1__.ErrorSource.AGENT,
                    startClocks: (0,
                    ___WEBPACK_IMPORTED_MODULE_2__.clocksNow)(),
                  });
                } finally {
                  allowNextEvent = false;
                }
              }
              return true;
            },
          };
        }

        /***/
      },

    /***/ "../core/src/tools/display.ts":
      /*!************************************!*\
  !*** ../core/src/tools/display.ts ***!
  \************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ display: function () {
            return /* binding */ display;
          },
          /* harmony export */
        });
        /* eslint-disable no-console, local-rules/disallow-side-effects */
        /**
         * Keep references on console methods to avoid triggering patched behaviors
         *
         * NB: in some setup, console could already be patched by another SDK.
         * In this case, some display messages can be sent by the other SDK
         * but we should be safe from infinite loop nonetheless.
         */
        var display = {
          log: console.log.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console),
        };

        /***/
      },

    /***/ "../core/src/tools/error.ts":
      /*!**********************************!*\
  !*** ../core/src/tools/error.ts ***!
  \**********************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ErrorSource: function () {
            return /* binding */ ErrorSource;
          },
          /* harmony export */ ErrorHandling: function () {
            return /* binding */ ErrorHandling;
          },
          /* harmony export */ formatUnknownError: function () {
            return /* binding */ formatUnknownError;
          },
          /* harmony export */ toStackTraceString: function () {
            return /* binding */ toStackTraceString;
          },
          /* harmony export */ formatErrorMessage: function () {
            return /* binding */ formatErrorMessage;
          },
          /* harmony export */ createHandlingStack: function () {
            return /* binding */ createHandlingStack;
          },
          /* harmony export */
        });
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _domain_tracekit__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../domain/tracekit */ "../core/src/domain/tracekit/computeStackTrace.ts"
          );
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./utils */ "../core/src/tools/utils.ts");

        var ErrorSource = {
          AGENT: "agent",
          CONSOLE: "console",
          CUSTOM: "custom",
          LOGGER: "logger",
          NETWORK: "network",
          SOURCE: "source",
        };
        var ErrorHandling;
        (function (ErrorHandling) {
          ErrorHandling["HANDLED"] = "handled";
          ErrorHandling["UNHANDLED"] = "unhandled";
        })(ErrorHandling || (ErrorHandling = {}));
        function formatUnknownError(
          stackTrace,
          errorObject,
          nonErrorPrefix,
          handlingStack
        ) {
          if (
            !stackTrace ||
            (stackTrace.message === undefined &&
              !(errorObject instanceof Error))
          ) {
            return {
              message:
                nonErrorPrefix +
                " " +
                (0, _utils__WEBPACK_IMPORTED_MODULE_0__.jsonStringify)(
                  errorObject
                ),
              stack: "No stack, consider using an instance of Error",
              handlingStack: handlingStack,
              type: stackTrace && stackTrace.name,
            };
          }
          return {
            message: stackTrace.message || "Empty message",
            stack: toStackTraceString(stackTrace),
            handlingStack: handlingStack,
            type: stackTrace.name,
          };
        }
        function toStackTraceString(stack) {
          var result = formatErrorMessage(stack);
          stack.stack.forEach(function (frame) {
            var func = frame.func === "?" ? "<anonymous>" : frame.func;
            var args =
              frame.args && frame.args.length > 0
                ? "(" + frame.args.join(", ") + ")"
                : "";
            var line = frame.line ? ":" + frame.line : "";
            var column = frame.line && frame.column ? ":" + frame.column : "";
            result +=
              "\n  at " + func + args + " @ " + frame.url + line + column;
          });
          return result;
        }
        function formatErrorMessage(stack) {
          return (stack.name || "Error") + ": " + stack.message;
        }
        /**
 Creates a stacktrace without SDK internal frames.

 Constraints:
 - Has to be called at the utmost position of the call stack.
 - No internal monitoring should encapsulate the function, that is why we need to use callMonitored inside of it.
 */
        function createHandlingStack() {
          /**
           * Skip the two internal frames:
           * - SDK API (console.error, ...)
           * - this function
           * in order to keep only the user calls
           */
          var internalFramesToSkip = 2;
          var error = new Error();
          var formattedStack;
          // IE needs to throw the error to fill in the stack trace
          if (!error.stack) {
            try {
              throw error;
            } catch (e) {
              (0, _utils__WEBPACK_IMPORTED_MODULE_0__.noop)();
            }
          }
          (0,
          _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_1__.callMonitored)(
            function () {
              var stackTrace = (0,
              _domain_tracekit__WEBPACK_IMPORTED_MODULE_2__.computeStackTrace)(
                error
              );
              stackTrace.stack = stackTrace.stack.slice(internalFramesToSkip);
              formattedStack = toStackTraceString(stackTrace);
            }
          );
          return formattedStack;
        }

        /***/
      },

    /***/ "../core/src/tools/instrumentMethod.ts":
      /*!*********************************************!*\
  !*** ../core/src/tools/instrumentMethod.ts ***!
  \*********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ instrumentMethod: function () {
            return /* binding */ instrumentMethod;
          },
          /* harmony export */ instrumentMethodAndCallOriginal: function () {
            return /* binding */ instrumentMethodAndCallOriginal;
          },
          /* harmony export */
        });
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );

        function instrumentMethod(object, method, instrumentationFactory) {
          var original = object[method];
          var instrumentation = instrumentationFactory(original);
          var instrumentationWrapper = function () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return instrumentation.apply(this, arguments);
          };
          object[method] = instrumentationWrapper;
          return {
            stop: function () {
              if (object[method] === instrumentationWrapper) {
                object[method] = original;
              } else {
                instrumentation = original;
              }
            },
          };
        }
        function instrumentMethodAndCallOriginal(object, method, _a) {
          var before = _a.before,
            after = _a.after;
          return instrumentMethod(object, method, function (original) {
            return function () {
              var args = arguments;
              var result;
              if (before) {
                (0,
                _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__.callMonitored)(
                  before,
                  this,
                  args
                );
              }
              if (typeof original === "function") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                result = original.apply(this, args);
              }
              if (after) {
                (0,
                _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__.callMonitored)(
                  after,
                  this,
                  args
                );
              }
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return result;
            };
          });
        }

        /***/
      },

    /***/ "../core/src/tools/limitModification.ts":
      /*!**********************************************!*\
  !*** ../core/src/tools/limitModification.ts ***!
  \**********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ limitModification: function () {
            return /* binding */ limitModification;
          },
          /* harmony export */
        });
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./utils */ "../core/src/tools/utils.ts");

        /**
         * Current limitation:
         * - field path do not support array, 'a.b.c' only
         */
        function limitModification(object, modifiableFieldPaths, modifier) {
          var clone = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.deepClone)(
            object
          );
          var result = modifier(clone);
          modifiableFieldPaths.forEach(function (path) {
            var originalValue = get(object, path);
            var newValue = get(clone, path);
            var originalType = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.getType)(
              originalValue
            );
            var newType = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.getType)(
              newValue
            );
            if (newType === originalType) {
              set(object, path, newValue);
            } else if (
              originalType === "object" &&
              (newType === "undefined" || newType === "null")
            ) {
              set(object, path, {});
            }
          });
          return result;
        }
        function get(object, path) {
          var current = object;
          for (var _i = 0, _a = path.split("."); _i < _a.length; _i++) {
            var field = _a[_i];
            if (!isValidObjectContaining(current, field)) {
              return;
            }
            current = current[field];
          }
          return current;
        }
        function set(object, path, value) {
          var current = object;
          var fields = path.split(".");
          for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (!isValidObjectContaining(current, field)) {
              return;
            }
            if (i !== fields.length - 1) {
              current = current[field];
            } else {
              current[field] = value;
            }
          }
        }
        function isValidObjectContaining(object, field) {
          return (
            typeof object === "object" && object !== null && field in object
          );
        }

        /***/
      },

    /***/ "../core/src/tools/observable.ts":
      /*!***************************************!*\
  !*** ../core/src/tools/observable.ts ***!
  \***************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Observable: function () {
            return /* binding */ Observable;
          },
          /* harmony export */
        });
        var Observable = /** @class */ (function () {
          function Observable(onFirstSubscribe) {
            this.onFirstSubscribe = onFirstSubscribe;
            this.observers = [];
          }
          Observable.prototype.subscribe = function (f) {
            var _this = this;
            if (!this.observers.length && this.onFirstSubscribe) {
              this.onLastUnsubscribe = this.onFirstSubscribe() || undefined;
            }
            this.observers.push(f);
            return {
              unsubscribe: function () {
                _this.observers = _this.observers.filter(function (other) {
                  return f !== other;
                });
                if (!_this.observers.length && _this.onLastUnsubscribe) {
                  _this.onLastUnsubscribe();
                }
              },
            };
          };
          Observable.prototype.notify = function (data) {
            this.observers.forEach(function (observer) {
              return observer(data);
            });
          };
          return Observable;
        })();

        /***/
      },

    /***/ "../core/src/tools/timeUtils.ts":
      /*!**************************************!*\
  !*** ../core/src/tools/timeUtils.ts ***!
  \**************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ relativeToClocks: function () {
            return /* binding */ relativeToClocks;
          },
          /* harmony export */ currentDrift: function () {
            return /* binding */ currentDrift;
          },
          /* harmony export */ toServerDuration: function () {
            return /* binding */ toServerDuration;
          },
          /* harmony export */ timeStampNow: function () {
            return /* binding */ timeStampNow;
          },
          /* harmony export */ relativeNow: function () {
            return /* binding */ relativeNow;
          },
          /* harmony export */ clocksNow: function () {
            return /* binding */ clocksNow;
          },
          /* harmony export */ clocksOrigin: function () {
            return /* binding */ clocksOrigin;
          },
          /* harmony export */ elapsed: function () {
            return /* binding */ elapsed;
          },
          /* harmony export */ getRelativeTime: function () {
            return /* binding */ getRelativeTime;
          },
          /* harmony export */ getTimeStamp: function () {
            return /* binding */ getTimeStamp;
          },
          /* harmony export */ looksLikeRelativeTime: function () {
            return /* binding */ looksLikeRelativeTime;
          },
          /* harmony export */ resetNavigationStart: function () {
            return /* binding */ resetNavigationStart;
          },
          /* harmony export */
        });
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./utils */ "../core/src/tools/utils.ts");

        function relativeToClocks(relative) {
          return {
            relative: relative,
            timeStamp: getCorrectedTimeStamp(relative),
          };
        }
        function getCorrectedTimeStamp(relativeTime) {
          var correctedOrigin = Date.now() - performance.now();
          // apply correction only for positive drift
          if (correctedOrigin > getNavigationStart()) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            return Math.round(correctedOrigin + relativeTime);
          }
          return getTimeStamp(relativeTime);
        }
        function currentDrift() {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          return Math.round(
            Date.now() - (getNavigationStart() + performance.now())
          );
        }
        function toServerDuration(duration) {
          if (!(0, _utils__WEBPACK_IMPORTED_MODULE_0__.isNumber)(duration)) {
            return duration;
          }
          return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.round)(
            duration * 1e6,
            0
          );
        }
        function timeStampNow() {
          return Date.now();
        }
        function relativeNow() {
          return performance.now();
        }
        function clocksNow() {
          return { relative: relativeNow(), timeStamp: timeStampNow() };
        }
        function clocksOrigin() {
          return { relative: 0, timeStamp: getNavigationStart() };
        }
        function elapsed(start, end) {
          return end - start;
        }
        /**
         * Get the time since the navigation was started.
         *
         * Note: this does not use `performance.timeOrigin` because it doesn't seem to reflect the actual
         * time on which the navigation has started: it may be much farther in the past, at least in Firefox 71.
         * Related issue in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1429926
         */
        function getRelativeTime(timestamp) {
          return timestamp - getNavigationStart();
        }
        function getTimeStamp(relativeTime) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          return Math.round(getNavigationStart() + relativeTime);
        }
        function looksLikeRelativeTime(time) {
          return time < _utils__WEBPACK_IMPORTED_MODULE_0__.ONE_YEAR;
        }
        /**
         * Navigation start slightly change on some rare cases
         */
        var navigationStart;
        function getNavigationStart() {
          if (navigationStart === undefined) {
            navigationStart = performance.timing.navigationStart;
          }
          return navigationStart;
        }
        function resetNavigationStart() {
          navigationStart = undefined;
        }

        /***/
      },

    /***/ "../core/src/tools/urlPolyfill.ts":
      /*!****************************************!*\
  !*** ../core/src/tools/urlPolyfill.ts ***!
  \****************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ normalizeUrl: function () {
            return /* binding */ normalizeUrl;
          },
          /* harmony export */ isValidUrl: function () {
            return /* binding */ isValidUrl;
          },
          /* harmony export */ haveSameOrigin: function () {
            return /* binding */ haveSameOrigin;
          },
          /* harmony export */ getOrigin: function () {
            return /* binding */ getOrigin;
          },
          /* harmony export */ getPathName: function () {
            return /* binding */ getPathName;
          },
          /* harmony export */ getSearch: function () {
            return /* binding */ getSearch;
          },
          /* harmony export */ getHash: function () {
            return /* binding */ getHash;
          },
          /* harmony export */ buildUrl: function () {
            return /* binding */ buildUrl;
          },
          /* harmony export */
        });
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./utils */ "../core/src/tools/utils.ts");

        function normalizeUrl(url) {
          return buildUrl(
            url,
            (0, _utils__WEBPACK_IMPORTED_MODULE_0__.getLocationOrigin)()
          ).href;
        }
        function isValidUrl(url) {
          try {
            return !!buildUrl(url);
          } catch (_a) {
            return false;
          }
        }
        function haveSameOrigin(url1, url2) {
          return getOrigin(url1) === getOrigin(url2);
        }
        function getOrigin(url) {
          return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.getLinkElementOrigin)(
            buildUrl(url)
          );
        }
        function getPathName(url) {
          var pathname = buildUrl(url).pathname;
          return pathname[0] === "/" ? pathname : "/" + pathname;
        }
        function getSearch(url) {
          return buildUrl(url).search;
        }
        function getHash(url) {
          return buildUrl(url).hash;
        }
        function buildUrl(url, base) {
          if (checkURLSupported()) {
            return base !== undefined ? new URL(url, base) : new URL(url);
          }
          if (base === undefined && !/:/.test(url)) {
            throw new Error("Invalid URL: '" + url + "'");
          }
          var doc = document;
          var anchorElement = doc.createElement("a");
          if (base !== undefined) {
            doc = document.implementation.createHTMLDocument("");
            var baseElement = doc.createElement("base");
            baseElement.href = base;
            doc.head.appendChild(baseElement);
            doc.body.appendChild(anchorElement);
          }
          anchorElement.href = url;
          return anchorElement;
        }
        var isURLSupported;
        function checkURLSupported() {
          if (isURLSupported !== undefined) {
            return isURLSupported;
          }
          try {
            var url = new URL("http://test/path");
            isURLSupported = url.href === "http://test/path";
            return isURLSupported;
          } catch (_a) {
            isURLSupported = false;
          }
          return isURLSupported;
        }

        /***/
      },

    /***/ "../core/src/tools/utils.ts":
      /*!**********************************!*\
  !*** ../core/src/tools/utils.ts ***!
  \**********************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ONE_SECOND: function () {
            return /* binding */ ONE_SECOND;
          },
          /* harmony export */ ONE_MINUTE: function () {
            return /* binding */ ONE_MINUTE;
          },
          /* harmony export */ ONE_HOUR: function () {
            return /* binding */ ONE_HOUR;
          },
          /* harmony export */ ONE_DAY: function () {
            return /* binding */ ONE_DAY;
          },
          /* harmony export */ ONE_YEAR: function () {
            return /* binding */ ONE_YEAR;
          },
          /* harmony export */ ONE_KILO_BYTE: function () {
            return /* binding */ ONE_KILO_BYTE;
          },
          /* harmony export */ ResourceType: function () {
            return /* binding */ ResourceType;
          },
          /* harmony export */ RequestType: function () {
            return /* binding */ RequestType;
          },
          /* harmony export */ throttle: function () {
            return /* binding */ throttle;
          },
          /* harmony export */ assign: function () {
            return /* binding */ assign;
          },
          /* harmony export */ generateUUID: function () {
            return /* binding */ generateUUID;
          },
          /* harmony export */ performDraw: function () {
            return /* binding */ performDraw;
          },
          /* harmony export */ round: function () {
            return /* binding */ round;
          },
          /* harmony export */ noop: function () {
            return /* binding */ noop;
          },
          /* harmony export */ jsonStringify: function () {
            return /* binding */ jsonStringify;
          },
          /* harmony export */ includes: function () {
            return /* binding */ includes;
          },
          /* harmony export */ find: function () {
            return /* binding */ find;
          },
          /* harmony export */ isPercentage: function () {
            return /* binding */ isPercentage;
          },
          /* harmony export */ isNumber: function () {
            return /* binding */ isNumber;
          },
          /* harmony export */ objectValues: function () {
            return /* binding */ objectValues;
          },
          /* harmony export */ objectHasValue: function () {
            return /* binding */ objectHasValue;
          },
          /* harmony export */ objectEntries: function () {
            return /* binding */ objectEntries;
          },
          /* harmony export */ isEmptyObject: function () {
            return /* binding */ isEmptyObject;
          },
          /* harmony export */ mapValues: function () {
            return /* binding */ mapValues;
          },
          /* harmony export */ getGlobalObject: function () {
            return /* binding */ getGlobalObject;
          },
          /* harmony export */ getLocationOrigin: function () {
            return /* binding */ getLocationOrigin;
          },
          /* harmony export */ getLinkElementOrigin: function () {
            return /* binding */ getLinkElementOrigin;
          },
          /* harmony export */ findCommaSeparatedValue: function () {
            return /* binding */ findCommaSeparatedValue;
          },
          /* harmony export */ safeTruncate: function () {
            return /* binding */ safeTruncate;
          },
          /* harmony export */ addEventListener: function () {
            return /* binding */ addEventListener;
          },
          /* harmony export */ addEventListeners: function () {
            return /* binding */ addEventListeners;
          },
          /* harmony export */ runOnReadyState: function () {
            return /* binding */ runOnReadyState;
          },
          /* harmony export */ getType: function () {
            return /* binding */ getType;
          },
          /* harmony export */ mergeInto: function () {
            return /* binding */ mergeInto;
          },
          /* harmony export */ deepClone: function () {
            return /* binding */ deepClone;
          },
          /* harmony export */ combine: function () {
            return /* binding */ combine;
          },
          /* harmony export */
        });
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );

        var ONE_SECOND = 1000;
        var ONE_MINUTE = 60 * ONE_SECOND;
        var ONE_HOUR = 60 * ONE_MINUTE;
        var ONE_DAY = 24 * ONE_HOUR;
        var ONE_YEAR = 365 * ONE_DAY;
        var ONE_KILO_BYTE = 1024;
        var ResourceType;
        (function (ResourceType) {
          ResourceType["DOCUMENT"] = "document";
          ResourceType["XHR"] = "xhr";
          ResourceType["BEACON"] = "beacon";
          ResourceType["FETCH"] = "fetch";
          ResourceType["CSS"] = "css";
          ResourceType["JS"] = "js";
          ResourceType["IMAGE"] = "image";
          ResourceType["FONT"] = "font";
          ResourceType["MEDIA"] = "media";
          ResourceType["OTHER"] = "other";
        })(ResourceType || (ResourceType = {}));
        var RequestType;
        (function (RequestType) {
          RequestType["FETCH"] = "fetch";
          RequestType["XHR"] = "xhr";
        })(RequestType || (RequestType = {}));
        // use lodash API
        function throttle(fn, wait, options) {
          var needLeadingExecution =
            options && options.leading !== undefined ? options.leading : true;
          var needTrailingExecution =
            options && options.trailing !== undefined ? options.trailing : true;
          var inWaitPeriod = false;
          var pendingExecutionWithParameters;
          var pendingTimeoutId;
          return {
            throttled: function () {
              var parameters = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
              }
              if (inWaitPeriod) {
                pendingExecutionWithParameters = parameters;
                return;
              }
              if (needLeadingExecution) {
                fn.apply(void 0, parameters);
              } else {
                pendingExecutionWithParameters = parameters;
              }
              inWaitPeriod = true;
              pendingTimeoutId = setTimeout(function () {
                if (needTrailingExecution && pendingExecutionWithParameters) {
                  fn.apply(void 0, pendingExecutionWithParameters);
                }
                inWaitPeriod = false;
                pendingExecutionWithParameters = undefined;
              }, wait);
            },
            cancel: function () {
              clearTimeout(pendingTimeoutId);
              inWaitPeriod = false;
              pendingExecutionWithParameters = undefined;
            },
          };
        }
        function assign(target) {
          var toAssign = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            toAssign[_i - 1] = arguments[_i];
          }
          toAssign.forEach(function (source) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          });
        }
        /**
         * UUID v4
         * from https://gist.github.com/jed/982883
         */
        function generateUUID(placeholder) {
          return placeholder
            ? // eslint-disable-next-line  no-bitwise
              (
                parseInt(placeholder, 10) ^
                ((Math.random() * 16) >> (parseInt(placeholder, 10) / 4))
              ).toString(16)
            : (1e7 + "-" + 1e3 + "-" + 4e3 + "-" + 8e3 + "-" + 1e11).replace(
                /[018]/g,
                generateUUID
              );
        }
        /**
         * Return true if the draw is successful
         * @param threshold between 0 and 100
         */
        function performDraw(threshold) {
          return threshold !== 0 && Math.random() * 100 <= threshold;
        }
        function round(num, decimals) {
          return +num.toFixed(decimals);
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function noop() {}
        /**
         * Custom implementation of JSON.stringify that ignores value.toJSON.
         * We need to do that because some sites badly override toJSON on certain objects.
         * Note this still supposes that JSON.stringify is correct...
         */
        function jsonStringify(value, replacer, space) {
          if (value === null || value === undefined) {
            return JSON.stringify(value);
          }
          var originalToJSON = [false, undefined];
          if (hasToJSON(value)) {
            // We need to add a flag and not rely on the truthiness of value.toJSON
            // because it can be set but undefined and that's actually significant.
            originalToJSON = [true, value.toJSON];
            delete value.toJSON;
          }
          var originalProtoToJSON = [false, undefined];
          var prototype;
          if (typeof value === "object") {
            prototype = Object.getPrototypeOf(value);
            if (hasToJSON(prototype)) {
              originalProtoToJSON = [true, prototype.toJSON];
              delete prototype.toJSON;
            }
          }
          var result;
          try {
            result = JSON.stringify(value, replacer, space);
          } catch (_a) {
            result = "<error: unable to serialize object>";
          } finally {
            if (originalToJSON[0]) {
              value.toJSON = originalToJSON[1];
            }
            if (originalProtoToJSON[0]) {
              prototype.toJSON = originalProtoToJSON[1];
            }
          }
          return result;
        }
        function hasToJSON(value) {
          return (
            typeof value === "object" &&
            value !== null &&
            value.hasOwnProperty("toJSON")
          );
        }
        function includes(candidate, search) {
          return candidate.indexOf(search) !== -1;
        }
        function find(array, predicate) {
          for (var i = 0; i < array.length; i += 1) {
            var item = array[i];
            if (predicate(item, i, array)) {
              return item;
            }
          }
          return undefined;
        }
        function isPercentage(value) {
          return isNumber(value) && value >= 0 && value <= 100;
        }
        function isNumber(value) {
          return typeof value === "number";
        }
        function objectValues(object) {
          return Object.keys(object).map(function (key) {
            return object[key];
          });
        }
        function objectHasValue(object, value) {
          return Object.keys(object).some(function (key) {
            return object[key] === value;
          });
        }
        function objectEntries(object) {
          return Object.keys(object).map(function (key) {
            return [key, object[key]];
          });
        }
        function isEmptyObject(object) {
          return Object.keys(object).length === 0;
        }
        function mapValues(object, fn) {
          var newObject = {};
          for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
            var key = _a[_i];
            newObject[key] = fn(object[key]);
          }
          return newObject;
        }
        /**
         * inspired by https://mathiasbynens.be/notes/globalthis
         */
        function getGlobalObject() {
          if (typeof globalThis === "object") {
            return globalThis;
          }
          Object.defineProperty(Object.prototype, "_dd_temp_", {
            get: function () {
              return this;
            },
            configurable: true,
          });
          // @ts-ignore _dd_temp is defined using defineProperty
          var globalObject = _dd_temp_;
          // @ts-ignore _dd_temp is defined using defineProperty
          delete Object.prototype._dd_temp_;
          if (typeof globalObject !== "object") {
            // on safari _dd_temp_ is available on window but not globally
            // fallback on other browser globals check
            if (typeof self === "object") {
              globalObject = self;
            } else if (typeof window === "object") {
              globalObject = window;
            } else {
              globalObject = {};
            }
          }
          return globalObject;
        }
        function getLocationOrigin() {
          return getLinkElementOrigin(window.location);
        }
        /**
         * IE fallback
         * https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/origin
         */
        function getLinkElementOrigin(element) {
          if (element.origin) {
            return element.origin;
          }
          var sanitizedHost = element.host.replace(/(:80|:443)$/, "");
          return element.protocol + "//" + sanitizedHost;
        }
        function findCommaSeparatedValue(rawString, name) {
          var regex = new RegExp("(?:^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
          var matches = regex.exec(rawString);
          return matches ? matches[1] : undefined;
        }
        function safeTruncate(candidate, length) {
          var lastChar = candidate.charCodeAt(length - 1);
          // check if it is the high part of a surrogate pair
          if (lastChar >= 0xd800 && lastChar <= 0xdbff) {
            return candidate.slice(0, length + 1);
          }
          return candidate.slice(0, length);
        }
        /**
         * Add an event listener to an event emitter object (Window, Element, mock object...).  This provides
         * a few conveniences compared to using `element.addEventListener` directly:
         *
         * * supports IE11 by: using an option object only if needed and emulating the `once` option
         *
         * * wraps the listener with a `monitor` function
         *
         * * returns a `stop` function to remove the listener
         */
        function addEventListener(emitter, event, listener, options) {
          return addEventListeners(emitter, [event], listener, options);
        }
        /**
         * Add event listeners to an event emitter object (Window, Element, mock object...).  This provides
         * a few conveniences compared to using `element.addEventListener` directly:
         *
         * * supports IE11 by: using an option object only if needed and emulating the `once` option
         *
         * * wraps the listener with a `monitor` function
         *
         * * returns a `stop` function to remove the listener
         *
         * * with `once: true`, the listener will be called at most once, even if different events are listened
         */
        function addEventListeners(emitter, events, listener, _a) {
          var _b = _a === void 0 ? {} : _a,
            once = _b.once,
            capture = _b.capture,
            passive = _b.passive;
          var wrappedListener = (0,
          _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__.monitor)(
            once
              ? function (event) {
                  stop();
                  listener(event);
                }
              : listener
          );
          var options = passive
            ? { capture: capture, passive: passive }
            : capture;
          events.forEach(function (event) {
            return emitter.addEventListener(event, wrappedListener, options);
          });
          var stop = function () {
            return events.forEach(function (event) {
              return emitter.removeEventListener(
                event,
                wrappedListener,
                options
              );
            });
          };
          return {
            stop: stop,
          };
        }
        function runOnReadyState(expectedReadyState, callback) {
          if (
            document.readyState === expectedReadyState ||
            document.readyState === "complete"
          ) {
            callback();
          } else {
            var eventName =
              expectedReadyState === "complete"
                ? "load" /* LOAD */
                : "DOMContentLoaded"; /* DOM_CONTENT_LOADED */
            addEventListener(window, eventName, callback, { once: true });
          }
        }
        /**
         * Similar to `typeof`, but distinguish plain objects from `null` and arrays
         */
        function getType(value) {
          if (value === null) {
            return "null";
          }
          if (Array.isArray(value)) {
            return "array";
          }
          return typeof value;
        }
        function createCircularReferenceChecker() {
          if (typeof WeakSet !== "undefined") {
            var set_1 = new WeakSet();
            return {
              hasAlreadyBeenSeen: function (value) {
                var has = set_1.has(value);
                if (!has) {
                  set_1.add(value);
                }
                return has;
              },
            };
          }
          var array = [];
          return {
            hasAlreadyBeenSeen: function (value) {
              var has = array.indexOf(value) >= 0;
              if (!has) {
                array.push(value);
              }
              return has;
            },
          };
        }
        /**
         * Iterate over source and affect its sub values into destination, recursively.
         * If the source and destination can't be merged, return source.
         */
        function mergeInto(destination, source, circularReferenceChecker) {
          if (circularReferenceChecker === void 0) {
            circularReferenceChecker = createCircularReferenceChecker();
          }
          // ignore the source if it is undefined
          if (source === undefined) {
            return destination;
          }
          if (typeof source !== "object" || source === null) {
            // primitive values - just return source
            return source;
          } else if (source instanceof Date) {
            return new Date(source.getTime());
          } else if (source instanceof RegExp) {
            var flags =
              source.flags ||
              // old browsers compatibility
              [
                source.global ? "g" : "",
                source.ignoreCase ? "i" : "",
                source.multiline ? "m" : "",
                source.sticky ? "y" : "",
                source.unicode ? "u" : "",
              ].join("");
            return new RegExp(source.source, flags);
          }
          if (circularReferenceChecker.hasAlreadyBeenSeen(source)) {
            // remove circular references
            return undefined;
          } else if (Array.isArray(source)) {
            var merged_1 = Array.isArray(destination) ? destination : [];
            for (var i = 0; i < source.length; ++i) {
              merged_1[i] = mergeInto(
                merged_1[i],
                source[i],
                circularReferenceChecker
              );
            }
            return merged_1;
          }
          var merged = getType(destination) === "object" ? destination : {};
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              merged[key] = mergeInto(
                merged[key],
                source[key],
                circularReferenceChecker
              );
            }
          }
          return merged;
        }
        /**
         * A simplistic implementation of a deep clone algorithm.
         * Caveats:
         * - It doesn't maintain prototype chains - don't use with instances of custom classes.
         * - It doesn't handle Map and Set
         */
        function deepClone(value) {
          return mergeInto(undefined, value);
        }
        function combine() {
          var sources = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
          }
          var destination;
          for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
            var source = sources_1[_a];
            // Ignore any undefined or null sources.
            if (source === undefined || source === null) {
              continue;
            }
            destination = mergeInto(destination, source);
          }
          return destination;
        }

        /***/
      },

    /***/ "../core/src/transport/batch.ts":
      /*!**************************************!*\
  !*** ../core/src/transport/batch.ts ***!
  \**************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Batch: function () {
            return /* binding */ Batch;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _tools_display__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../tools/display */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _tools_utils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../tools/utils */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );

        // https://en.wikipedia.org/wiki/UTF-8
        var HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
        var Batch = /** @class */ (function () {
          function Batch(
            request,
            maxSize,
            bytesLimit,
            maxMessageSize,
            flushTimeout,
            beforeUnloadCallback
          ) {
            if (beforeUnloadCallback === void 0) {
              beforeUnloadCallback =
                _tools_utils__WEBPACK_IMPORTED_MODULE_1__.noop;
            }
            this.request = request;
            this.maxSize = maxSize;
            this.bytesLimit = bytesLimit;
            this.maxMessageSize = maxMessageSize;
            this.flushTimeout = flushTimeout;
            this.beforeUnloadCallback = beforeUnloadCallback;
            this.pushOnlyBuffer = [];
            this.upsertBuffer = {};
            this.bufferBytesSize = 0;
            this.bufferMessageCount = 0;
            this.flushOnVisibilityHidden();
            this.flushPeriodically();
          }
          Batch.prototype.add = function (message) {
            this.addOrUpdate(message);
          };
          Batch.prototype.upsert = function (message, key) {
            this.addOrUpdate(message, key);
          };
          Batch.prototype.flush = function (reason) {
            if (this.bufferMessageCount !== 0) {
              var messages = (0,
              tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArrays)(
                this.pushOnlyBuffer,
                (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.objectValues)(
                  this.upsertBuffer
                )
              );
              this.request.send(
                messages.join("\n"),
                this.bufferBytesSize,
                reason
              );
              this.pushOnlyBuffer = [];
              this.upsertBuffer = {};
              this.bufferBytesSize = 0;
              this.bufferMessageCount = 0;
            }
          };
          Batch.prototype.sizeInBytes = function (candidate) {
            // Accurate byte size computations can degrade performances when there is a lot of events to process
            if (!HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
              return candidate.length;
            }
            if (window.TextEncoder !== undefined) {
              return new TextEncoder().encode(candidate).length;
            }
            return new Blob([candidate]).size;
          };
          Batch.prototype.addOrUpdate = function (message, key) {
            var _a = this.process(message),
              processedMessage = _a.processedMessage,
              messageBytesSize = _a.messageBytesSize;
            if (messageBytesSize >= this.maxMessageSize) {
              _tools_display__WEBPACK_IMPORTED_MODULE_2__.display.warn(
                "Discarded a message whose size was bigger than the maximum allowed size " +
                  this.maxMessageSize +
                  "KB."
              );
              return;
            }
            if (this.hasMessageFor(key)) {
              this.remove(key);
            }
            if (this.willReachedBytesLimitWith(messageBytesSize)) {
              this.flush("willReachedBytesLimitWith");
            }
            this.push(processedMessage, messageBytesSize, key);
            if (this.isFull()) {
              this.flush("isFull");
            }
          };
          Batch.prototype.process = function (message) {
            var processedMessage = (0,
            _tools_utils__WEBPACK_IMPORTED_MODULE_1__.jsonStringify)(message);
            var messageBytesSize = this.sizeInBytes(processedMessage);
            return {
              processedMessage: processedMessage,
              messageBytesSize: messageBytesSize,
            };
          };
          Batch.prototype.push = function (
            processedMessage,
            messageBytesSize,
            key
          ) {
            if (this.bufferMessageCount > 0) {
              // \n separator at serialization
              this.bufferBytesSize += 1;
            }
            if (key !== undefined) {
              this.upsertBuffer[key] = processedMessage;
            } else {
              this.pushOnlyBuffer.push(processedMessage);
            }
            this.bufferBytesSize += messageBytesSize;
            this.bufferMessageCount += 1;
          };
          Batch.prototype.remove = function (key) {
            var removedMessage = this.upsertBuffer[key];
            delete this.upsertBuffer[key];
            var messageBytesSize = this.sizeInBytes(removedMessage);
            this.bufferBytesSize -= messageBytesSize;
            this.bufferMessageCount -= 1;
            if (this.bufferMessageCount > 0) {
              this.bufferBytesSize -= 1;
            }
          };
          Batch.prototype.hasMessageFor = function (key) {
            return key !== undefined && this.upsertBuffer[key] !== undefined;
          };
          Batch.prototype.willReachedBytesLimitWith = function (
            messageBytesSize
          ) {
            // byte of the separator at the end of the message
            return (
              this.bufferBytesSize + messageBytesSize + 1 >= this.bytesLimit
            );
          };
          Batch.prototype.isFull = function () {
            return (
              this.bufferMessageCount === this.maxSize ||
              this.bufferBytesSize >= this.bytesLimit
            );
          };
          Batch.prototype.flushPeriodically = function () {
            var _this = this;
            setTimeout(
              (0,
              _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_3__.monitor)(
                function () {
                  _this.flush("flushPeriodically");
                  _this.flushPeriodically();
                }
              ),
              this.flushTimeout
            );
          };
          Batch.prototype.flushOnVisibilityHidden = function () {
            var _this = this;
            /**
             * With sendBeacon, requests are guaranteed to be successfully sent during document unload
             */
            // @ts-ignore this function is not always defined
            if (navigator.sendBeacon) {
              /**
               * beforeunload is called before visibilitychange
               * register first to be sure to be called before flush on beforeunload
               * caveat: unload can still be canceled by another listener
               */
              (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.addEventListener)(
                window,
                "beforeunload" /* BEFORE_UNLOAD */,
                this.beforeUnloadCallback
              );
              /**
               * Only event that guarantee to fire on mobile devices when the page transitions to background state
               * (e.g. when user switches to a different application, goes to homescreen, etc), or is being unloaded.
               */
              (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.addEventListener)(
                document,
                "visibilitychange" /* VISIBILITY_CHANGE */,
                function () {
                  if (document.visibilityState === "hidden") {
                    _this.flush("visibilitychange" /* VISIBILITY_CHANGE */);
                  }
                }
              );
              /**
               * Safari does not support yet to send a request during:
               * - a visibility change during doc unload (cf: https://bugs.webkit.org/show_bug.cgi?id=194897)
               * - a page hide transition (cf: https://bugs.webkit.org/show_bug.cgi?id=188329)
               */
              (0, _tools_utils__WEBPACK_IMPORTED_MODULE_1__.addEventListener)(
                window,
                "beforeunload" /* BEFORE_UNLOAD */,
                function () {
                  return _this.flush("beforeunload" /* BEFORE_UNLOAD */);
                }
              );
            }
          };
          return Batch;
        })();

        /***/
      },

    /***/ "../core/src/transport/eventBridge.ts":
      /*!********************************************!*\
  !*** ../core/src/transport/eventBridge.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ getEventBridge: function () {
            return /* binding */ getEventBridge;
          },
          /* harmony export */ canUseEventBridge: function () {
            return /* binding */ canUseEventBridge;
          },
          /* harmony export */
        });
        /* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! .. */ "../core/src/tools/utils.ts");
        /* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! .. */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );

        function getEventBridge() {
          var eventBridgeGlobal = getEventBridgeGlobal();
          if (!eventBridgeGlobal) {
            return;
          }
          return {
            getAllowedWebViewHosts: function () {
              return JSON.parse(eventBridgeGlobal.getAllowedWebViewHosts());
            },
            send: function (eventType, event) {
              eventBridgeGlobal.send(
                JSON.stringify({ eventType: eventType, event: event })
              );
            },
          };
        }
        function canUseEventBridge() {
          var bridge = getEventBridge();
          return (
            !!bridge &&
            (0, ___WEBPACK_IMPORTED_MODULE_0__.includes)(
              bridge.getAllowedWebViewHosts(),
              window.location.hostname
            )
          );
        }
        function getEventBridgeGlobal() {
          return (0,
          ___WEBPACK_IMPORTED_MODULE_1__.isExperimentalFeatureEnabled)(
            "event-bridge"
          )
            ? window.DatadogEventBridge
            : null;
        }

        /***/
      },

    /***/ "../core/src/transport/httpRequest.ts":
      /*!********************************************!*\
  !*** ../core/src/transport/httpRequest.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ HttpRequest: function () {
            return /* binding */ HttpRequest;
          },
          /* harmony export */
        });
        /* harmony import */ var _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../domain/internalMonitoring */ "../core/src/domain/internalMonitoring.ts"
          );

        var hasReportedXhrError = false;
        /**
         * Use POST request without content type to:
         * - avoid CORS preflight requests
         * - allow usage of sendBeacon
         *
         * multiple elements are sent separated by \n in order
         * to be parsed correctly without content type header
         */
        var HttpRequest = /** @class */ (function () {
          function HttpRequest(endpointBuilder, bytesLimit) {
            this.endpointBuilder = endpointBuilder;
            this.bytesLimit = bytesLimit;
          }
          HttpRequest.prototype.send = function (data, size, flushReason) {
            var url = this.endpointBuilder.build();
            var tryBeacon = !!navigator.sendBeacon && size < this.bytesLimit;
            if (tryBeacon) {
              try {
                var isQueued = navigator.sendBeacon(url, data);
                if (isQueued) {
                  return;
                }
              } catch (e) {
                reportBeaconError(e);
              }
            }
            var transportIntrospection = function (event) {
              var req =
                event === null || event === void 0
                  ? void 0
                  : event.currentTarget;
              if (req.status >= 200 && req.status < 300) {
                return;
              }
              if (!hasReportedXhrError) {
                hasReportedXhrError = true;
                (0,
                _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__.addMonitoringMessage)(
                  "XHR fallback failed",
                  {
                    on_line: navigator.onLine,
                    size: size,
                    url: url,
                    try_beacon: tryBeacon,
                    flush_reason: flushReason,
                    event: {
                      is_trusted: event.isTrusted,
                      total: event.total,
                      loaded: event.loaded,
                    },
                    request: {
                      status: req.status,
                      ready_state: req.readyState,
                      response_text: req.responseText.slice(0, 512),
                    },
                  }
                );
              }
            };
            var request = new XMLHttpRequest();
            request.addEventListener(
              "loadend",
              (0,
              _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__.monitor)(
                function (event) {
                  return transportIntrospection(event);
                }
              )
            );
            request.open("POST", url, true);
            request.send(data);
          };
          return HttpRequest;
        })();

        var hasReportedBeaconError = false;
        function reportBeaconError(e) {
          if (!hasReportedBeaconError) {
            hasReportedBeaconError = true;
            (0,
            _domain_internalMonitoring__WEBPACK_IMPORTED_MODULE_0__.addErrorToMonitoringBatch)(
              e
            );
          }
        }

        /***/
      },

    /***/ "../rum-core/src/boot/buildEnv.ts":
      /*!****************************************!*\
  !*** ../rum-core/src/boot/buildEnv.ts ***!
  \****************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ buildEnv: function () {
            return /* binding */ buildEnv;
          },
          /* harmony export */
        });
        var buildEnv = {
          buildMode: "undefined",
          sdkVersion: "dev",
        };

        /***/
      },

    /***/ "../rum-core/src/boot/rumPublicApi.ts":
      /*!********************************************!*\
  !*** ../rum-core/src/boot/rumPublicApi.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ makeRumPublicApi: function () {
            return /* binding */ makeRumPublicApi;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/contextManager.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/boundedBuffer.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/eventBridge.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/boot/init.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/error.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_12__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/browser/cookie.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_13__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/configuration.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _buildEnv__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./buildEnv */ "../rum-core/src/boot/buildEnv.ts"
          );

        function makeRumPublicApi(startRumImpl, recorderApi) {
          var isAlreadyInitialized = false;
          var globalContextManager = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.createContextManager)();
          var user = {};
          var getInternalContextStrategy = function () {
            return undefined;
          };
          var getInitConfigurationStrategy = function () {
            return undefined;
          };
          var bufferApiCalls =
            new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.BoundedBuffer();
          var addTimingStrategy = function (name, time) {
            if (time === void 0) {
              time = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.timeStampNow)();
            }
            bufferApiCalls.add(function () {
              return addTimingStrategy(name, time);
            });
          };
          var startViewStrategy = function (name, startClocks) {
            if (startClocks === void 0) {
              startClocks = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.clocksNow)();
            }
            bufferApiCalls.add(function () {
              return startViewStrategy(name, startClocks);
            });
          };
          var addActionStrategy = function (action, commonContext) {
            if (commonContext === void 0) {
              commonContext = clonedCommonContext();
            }
            bufferApiCalls.add(function () {
              return addActionStrategy(action, commonContext);
            });
          };
          var addErrorStrategy = function (providedError, commonContext) {
            if (commonContext === void 0) {
              commonContext = clonedCommonContext();
            }
            bufferApiCalls.add(function () {
              return addErrorStrategy(providedError, commonContext);
            });
          };
          function clonedCommonContext() {
            return (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.deepClone)({
              context: globalContextManager.get(),
              user: user,
            });
          }
          function initRum(initConfiguration) {
            if (
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.canUseEventBridge)()
            ) {
              initConfiguration =
                overrideInitConfigurationForBridge(initConfiguration);
            } else if (!canHandleSession(initConfiguration)) {
              return;
            }
            if (!isValidInitConfiguration(initConfiguration)) {
              return;
            }
            var _a = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.commonInit)(
                initConfiguration,
                _buildEnv__WEBPACK_IMPORTED_MODULE_2__.buildEnv
              ),
              configuration = _a.configuration,
              internalMonitoring = _a.internalMonitoring;
            if (!configuration.trackViewsManually) {
              doStartRum(initConfiguration, configuration, internalMonitoring);
            } else {
              // drain beforeInitCalls by buffering them until we start RUM
              // if we get a startView, drain re-buffered calls before continuing to drain beforeInitCalls
              // in order to ensure that calls are processed in order
              var beforeInitCalls = bufferApiCalls;
              bufferApiCalls =
                new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.BoundedBuffer();
              startViewStrategy = function (name) {
                doStartRum(
                  initConfiguration,
                  configuration,
                  internalMonitoring,
                  name
                );
              };
              beforeInitCalls.drain();
            }
            getInitConfigurationStrategy = function () {
              return (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.deepClone)(
                initConfiguration
              );
            };
            isAlreadyInitialized = true;
          }
          function doStartRum(
            initConfiguration,
            configuration,
            internalMonitoring,
            initialViewName
          ) {
            var startRumResults = startRumImpl(
              initConfiguration,
              configuration,
              internalMonitoring,
              function () {
                return {
                  user: user,
                  context: globalContextManager.get(),
                  hasReplay: recorderApi.isRecording() ? true : undefined,
                };
              },
              recorderApi,
              initialViewName
            );
            (startViewStrategy = startRumResults.startView),
              (addActionStrategy = startRumResults.addAction),
              (addErrorStrategy = startRumResults.addError),
              (addTimingStrategy = startRumResults.addTiming),
              (getInternalContextStrategy = startRumResults.getInternalContext);
            bufferApiCalls.drain();
            recorderApi.onRumStart(
              startRumResults.lifeCycle,
              initConfiguration,
              configuration,
              startRumResults.session,
              startRumResults.parentContexts
            );
          }
          var rumPublicApi = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.makePublicApi)({
            init: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              initRum
            ),
            addRumGlobalContext: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              globalContextManager.add
            ),
            removeRumGlobalContext: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              globalContextManager.remove
            ),
            getRumGlobalContext: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              globalContextManager.get
            ),
            setRumGlobalContext: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              globalContextManager.set
            ),
            getInternalContext: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function (startTime) {
                return getInternalContextStrategy(startTime);
              }
            ),
            getInitConfiguration: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function () {
                return getInitConfigurationStrategy();
              }
            ),
            addAction: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function (name, context) {
                addActionStrategy({
                  name: name,
                  context: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.deepClone)(
                    context
                  ),
                  startClocks: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.clocksNow)(),
                  type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__
                    .ActionType.CUSTOM,
                });
              }
            ),
            addError: function (error, context) {
              var handlingStack = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.createHandlingStack)();
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.callMonitored)(
                function () {
                  addErrorStrategy({
                    error: error,
                    handlingStack: handlingStack,
                    context: (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.deepClone)(
                      context
                    ),
                    startClocks: (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.clocksNow)(),
                  });
                }
              );
            },
            addTiming: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function (name, time) {
                addTimingStrategy(name, time);
              }
            ),
            setUser: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function (newUser) {
                var sanitizedUser = sanitizeUser(newUser);
                if (sanitizedUser) {
                  user = sanitizedUser;
                } else {
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                    "Unsupported user:",
                    newUser
                  );
                }
              }
            ),
            removeUser: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function () {
                user = {};
              }
            ),
            startView: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              function (name) {
                startViewStrategy(name);
              }
            ),
            startSessionReplayRecording: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              recorderApi.start
            ),
            stopSessionReplayRecording: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.monitor)(
              recorderApi.stop
            ),
          });
          return rumPublicApi;
          function sanitizeUser(newUser) {
            if (typeof newUser !== "object" || !newUser) {
              return;
            }
            var result = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.deepClone)(
              newUser
            );
            if ("id" in result) {
              result.id = String(result.id);
            }
            if ("name" in result) {
              result.name = String(result.name);
            }
            if ("email" in result) {
              result.email = String(result.email);
            }
            return result;
          }
          function canHandleSession(initConfiguration) {
            if (
              !(0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_12__.areCookiesAuthorized)(
                (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_13__.buildCookieOptions)(
                  initConfiguration
                )
              )
            ) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.warn(
                "Cookies are not authorized, we will not send any data."
              );
              return false;
            }
            if (isLocalFile()) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                "Execution is not allowed in the current context."
              );
              return false;
            }
            return true;
          }
          function isValidInitConfiguration(initConfiguration) {
            if (isAlreadyInitialized) {
              if (!initConfiguration.silentMultipleInit) {
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                  "DD_RUM is already initialized."
                );
              }
              return false;
            }
            if (!initConfiguration || !initConfiguration.clientToken) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                "Client Token is not configured, we will not send any data."
              );
              return false;
            }
            if (!initConfiguration.applicationId) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                "Application ID is not configured, no RUM data will be collected."
              );
              return false;
            }
            if (
              initConfiguration.sampleRate !== undefined &&
              !(0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.isPercentage)(
                initConfiguration.sampleRate
              )
            ) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                "Sample Rate should be a number between 0 and 100"
              );
              return false;
            }
            if (
              initConfiguration.replaySampleRate !== undefined &&
              !(0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.isPercentage)(
                initConfiguration.replaySampleRate
              )
            ) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                "Replay Sample Rate should be a number between 0 and 100"
              );
              return false;
            }
            if (
              Array.isArray(initConfiguration.allowedTracingOrigins) &&
              initConfiguration.allowedTracingOrigins.length !== 0 &&
              initConfiguration.service === undefined
            ) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_11__.display.error(
                "Service need to be configured when tracing is enabled"
              );
              return false;
            }
            return true;
          }
          function overrideInitConfigurationForBridge(initConfiguration) {
            return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                {},
                initConfiguration
              ),
              { applicationId: "empty", clientToken: "empty", sampleRate: 100 }
            );
          }
          function isLocalFile() {
            return window.location.protocol === "file:";
          }
        }

        /***/
      },

    /***/ "../rum-core/src/boot/startRum.ts":
      /*!****************************************!*\
  !*** ../rum-core/src/boot/startRum.ts ***!
  \****************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startRum: function () {
            return /* binding */ startRum;
          },
          /* harmony export */ startRumEventCollection: function () {
            return /* binding */ startRumEventCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_18__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/eventBridge.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_19__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _browser_domMutationObservable__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../browser/domMutationObservable */ "../rum-core/src/browser/domMutationObservable.ts"
          );
        /* harmony import */ var _browser_performanceCollection__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../browser/performanceCollection */ "../rum-core/src/browser/performanceCollection.ts"
          );
        /* harmony import */ var _domain_assembly__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../domain/assembly */ "../rum-core/src/domain/assembly.ts"
          );
        /* harmony import */ var _domain_foregroundContexts__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../domain/foregroundContexts */ "../rum-core/src/domain/foregroundContexts.ts"
          );
        /* harmony import */ var _domain_internalContext__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../domain/internalContext */ "../rum-core/src/domain/internalContext.ts"
          );
        /* harmony import */ var _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ../domain/lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _domain_parentContexts__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ../domain/parentContexts */ "../rum-core/src/domain/parentContexts.ts"
          );
        /* harmony import */ var _domain_requestCollection__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ../domain/requestCollection */ "../rum-core/src/domain/requestCollection.ts"
          );
        /* harmony import */ var _domain_rumEventsCollection_action_actionCollection__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! ../domain/rumEventsCollection/action/actionCollection */ "../rum-core/src/domain/rumEventsCollection/action/actionCollection.ts"
          );
        /* harmony import */ var _domain_rumEventsCollection_error_errorCollection__WEBPACK_IMPORTED_MODULE_9__ =
          __webpack_require__(
            /*! ../domain/rumEventsCollection/error/errorCollection */ "../rum-core/src/domain/rumEventsCollection/error/errorCollection.ts"
          );
        /* harmony import */ var _domain_rumEventsCollection_longTask_longTaskCollection__WEBPACK_IMPORTED_MODULE_10__ =
          __webpack_require__(
            /*! ../domain/rumEventsCollection/longTask/longTaskCollection */ "../rum-core/src/domain/rumEventsCollection/longTask/longTaskCollection.ts"
          );
        /* harmony import */ var _domain_rumEventsCollection_resource_resourceCollection__WEBPACK_IMPORTED_MODULE_11__ =
          __webpack_require__(
            /*! ../domain/rumEventsCollection/resource/resourceCollection */ "../rum-core/src/domain/rumEventsCollection/resource/resourceCollection.ts"
          );
        /* harmony import */ var _domain_rumEventsCollection_view_viewCollection__WEBPACK_IMPORTED_MODULE_12__ =
          __webpack_require__(
            /*! ../domain/rumEventsCollection/view/viewCollection */ "../rum-core/src/domain/rumEventsCollection/view/viewCollection.ts"
          );
        /* harmony import */ var _domain_rumSession__WEBPACK_IMPORTED_MODULE_13__ =
          __webpack_require__(
            /*! ../domain/rumSession */ "../rum-core/src/domain/rumSession.ts"
          );
        /* harmony import */ var _transport_batch__WEBPACK_IMPORTED_MODULE_14__ =
          __webpack_require__(
            /*! ../transport/batch */ "../rum-core/src/transport/batch.ts"
          );
        /* harmony import */ var _transport_startRumEventBridge__WEBPACK_IMPORTED_MODULE_15__ =
          __webpack_require__(
            /*! ../transport/startRumEventBridge */ "../rum-core/src/transport/startRumEventBridge.ts"
          );
        /* harmony import */ var _domain_urlContexts__WEBPACK_IMPORTED_MODULE_16__ =
          __webpack_require__(
            /*! ../domain/urlContexts */ "../rum-core/src/domain/urlContexts.ts"
          );
        /* harmony import */ var _browser_locationChangeObservable__WEBPACK_IMPORTED_MODULE_17__ =
          __webpack_require__(
            /*! ../browser/locationChangeObservable */ "../rum-core/src/browser/locationChangeObservable.ts"
          );

        function startRum(
          initConfiguration,
          configuration,
          internalMonitoring,
          getCommonContext,
          recorderApi,
          initialViewName
        ) {
          var lifeCycle =
            new _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_5__.LifeCycle();
          var session = !(0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_18__.canUseEventBridge)()
            ? (0,
              _domain_rumSession__WEBPACK_IMPORTED_MODULE_13__.startRumSession)(
                configuration,
                lifeCycle
              )
            : (0,
              _domain_rumSession__WEBPACK_IMPORTED_MODULE_13__.startRumSessionStub)();
          var domMutationObservable = (0,
          _browser_domMutationObservable__WEBPACK_IMPORTED_MODULE_0__.createDOMMutationObservable)();
          var locationChangeObservable = (0,
          _browser_locationChangeObservable__WEBPACK_IMPORTED_MODULE_17__.createLocationChangeObservable)(
            location
          );
          internalMonitoring.setExternalContextProvider(function () {
            return (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_19__.combine)(
              {
                application_id: initConfiguration.applicationId,
              },
              parentContexts.findView(),
              { view: { name: null } }
            );
          });
          var _a = startRumEventCollection(
              initConfiguration.applicationId,
              lifeCycle,
              configuration,
              location,
              session,
              locationChangeObservable,
              getCommonContext
            ),
            parentContexts = _a.parentContexts,
            foregroundContexts = _a.foregroundContexts,
            urlContexts = _a.urlContexts;
          (0,
          _domain_rumEventsCollection_longTask_longTaskCollection__WEBPACK_IMPORTED_MODULE_10__.startLongTaskCollection)(
            lifeCycle,
            session
          );
          (0,
          _domain_rumEventsCollection_resource_resourceCollection__WEBPACK_IMPORTED_MODULE_11__.startResourceCollection)(
            lifeCycle
          );
          var _b = (0,
            _domain_rumEventsCollection_view_viewCollection__WEBPACK_IMPORTED_MODULE_12__.startViewCollection)(
              lifeCycle,
              configuration,
              location,
              domMutationObservable,
              locationChangeObservable,
              foregroundContexts,
              recorderApi,
              initialViewName
            ),
            addTiming = _b.addTiming,
            startView = _b.startView;
          var addError = (0,
          _domain_rumEventsCollection_error_errorCollection__WEBPACK_IMPORTED_MODULE_9__.startErrorCollection)(
            lifeCycle,
            foregroundContexts
          ).addError;
          var addAction = (0,
          _domain_rumEventsCollection_action_actionCollection__WEBPACK_IMPORTED_MODULE_8__.startActionCollection)(
            lifeCycle,
            domMutationObservable,
            configuration,
            foregroundContexts
          ).addAction;
          (0,
          _domain_requestCollection__WEBPACK_IMPORTED_MODULE_7__.startRequestCollection)(
            lifeCycle,
            configuration,
            session
          );
          (0,
          _browser_performanceCollection__WEBPACK_IMPORTED_MODULE_1__.startPerformanceCollection)(
            lifeCycle,
            configuration
          );
          var internalContext = (0,
          _domain_internalContext__WEBPACK_IMPORTED_MODULE_4__.startInternalContext)(
            initConfiguration.applicationId,
            session,
            parentContexts,
            urlContexts
          );
          return {
            addAction: addAction,
            addError: addError,
            addTiming: addTiming,
            startView: startView,
            lifeCycle: lifeCycle,
            parentContexts: parentContexts,
            session: session,
            getInternalContext: internalContext.get,
          };
        }
        function startRumEventCollection(
          applicationId,
          lifeCycle,
          configuration,
          location,
          session,
          locationChangeObservable,
          getCommonContext
        ) {
          var parentContexts = (0,
          _domain_parentContexts__WEBPACK_IMPORTED_MODULE_6__.startParentContexts)(
            lifeCycle,
            session
          );
          var urlContexts = (0,
          _domain_urlContexts__WEBPACK_IMPORTED_MODULE_16__.startUrlContexts)(
            lifeCycle,
            locationChangeObservable,
            location
          );
          var foregroundContexts = (0,
          _domain_foregroundContexts__WEBPACK_IMPORTED_MODULE_3__.startForegroundContexts)();
          var stopBatch;
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_18__.canUseEventBridge)()
          ) {
            (0,
            _transport_startRumEventBridge__WEBPACK_IMPORTED_MODULE_15__.startRumEventBridge)(
              lifeCycle
            );
          } else {
            stopBatch = (0,
            _transport_batch__WEBPACK_IMPORTED_MODULE_14__.startRumBatch)(
              configuration,
              lifeCycle
            ).stop;
          }
          (0, _domain_assembly__WEBPACK_IMPORTED_MODULE_2__.startRumAssembly)(
            applicationId,
            configuration,
            lifeCycle,
            session,
            parentContexts,
            urlContexts,
            getCommonContext
          );
          return {
            parentContexts: parentContexts,
            foregroundContexts: foregroundContexts,
            urlContexts: urlContexts,
            stop: function () {
              // prevent batch from previous tests to keep running and send unwanted requests
              // could be replaced by stopping all the component when they will all have a stop method
              stopBatch === null || stopBatch === void 0 ? void 0 : stopBatch();
              parentContexts.stop();
              foregroundContexts.stop();
            },
          };
        }

        /***/
      },

    /***/ "../rum-core/src/browser/domMutationObservable.ts":
      /*!********************************************************!*\
  !*** ../rum-core/src/browser/domMutationObservable.ts ***!
  \********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ createDOMMutationObservable: function () {
            return /* binding */ createDOMMutationObservable;
          },
          /* harmony export */ getMutationObserverConstructor: function () {
            return /* binding */ getMutationObserverConstructor;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );

        function createDOMMutationObservable() {
          var MutationObserver = getMutationObserverConstructor();
          var observable =
            new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.Observable(
              function () {
                if (!MutationObserver) {
                  return;
                }
                var observer = new MutationObserver(
                  (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.monitor)(
                    function () {
                      return observable.notify();
                    }
                  )
                );
                observer.observe(document, {
                  attributes: true,
                  characterData: true,
                  childList: true,
                  subtree: true,
                });
                return function () {
                  return observer.disconnect();
                };
              }
            );
          return observable;
        }
        function getMutationObserverConstructor() {
          var constructor;
          var browserWindow = window;
          // Angular uses Zone.js to provide a context persisting across async tasks.  Zone.js replaces the
          // global MutationObserver constructor with a patched version to support the context propagation.
          // There is an ongoing issue[1][2] with this setup when using a MutationObserver within a Angular
          // component: on some occasions, the callback is being called in an infinite loop, causing the
          // page to freeze (even if the callback is completely empty).
          //
          // To work around this issue, we are using the Zone __symbol__ API to get the original, unpatched
          // MutationObserver constructor.
          //
          // [1] https://github.com/angular/angular/issues/26948
          // [2] https://github.com/angular/angular/issues/31712
          if (browserWindow.Zone) {
            var symbol = browserWindow.Zone.__symbol__("MutationObserver");
            constructor = browserWindow[symbol];
          }
          if (!constructor) {
            constructor = browserWindow.MutationObserver;
          }
          return constructor;
        }

        /***/
      },

    /***/ "../rum-core/src/browser/locationChangeObservable.ts":
      /*!***********************************************************!*\
  !*** ../rum-core/src/browser/locationChangeObservable.ts ***!
  \***********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ createLocationChangeObservable: function () {
            return /* binding */ createLocationChangeObservable;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/instrumentMethod.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );

        function createLocationChangeObservable(location) {
          var currentLocation = (0,
          tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, location);
          var observable =
            new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.Observable(
              function () {
                var stopHistoryTracking = trackHistory(onLocationChange).stop;
                var stopHashTracking = trackHash(onLocationChange).stop;
                return function () {
                  stopHistoryTracking();
                  stopHashTracking();
                };
              }
            );
          function onLocationChange() {
            if (currentLocation.href === location.href) {
              return;
            }
            var newLocation = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              {},
              location
            );
            observable.notify({
              newLocation: newLocation,
              oldLocation: currentLocation,
            });
            currentLocation = newLocation;
          }
          return observable;
        }
        function trackHistory(onHistoryChange) {
          var stopInstrumentingPushState = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.instrumentMethodAndCallOriginal)(
            history,
            "pushState",
            {
              after: onHistoryChange,
            }
          ).stop;
          var stopInstrumentingReplaceState = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.instrumentMethodAndCallOriginal)(
            history,
            "replaceState",
            {
              after: onHistoryChange,
            }
          ).stop;
          var removeListener = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.addEventListener)(
            window,
            "popstate" /* POP_STATE */,
            onHistoryChange
          ).stop;
          return {
            stop: function () {
              stopInstrumentingPushState();
              stopInstrumentingReplaceState();
              removeListener();
            },
          };
        }
        function trackHash(onHashChange) {
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.addEventListener)(
            window,
            "hashchange" /* HASH_CHANGE */,
            onHashChange
          );
        }

        /***/
      },

    /***/ "../rum-core/src/browser/performanceCollection.ts":
      /*!********************************************************!*\
  !*** ../rum-core/src/browser/performanceCollection.ts ***!
  \********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ supportPerformanceTimingEvent: function () {
            return /* binding */ supportPerformanceTimingEvent;
          },
          /* harmony export */ supportPerformanceEntry: function () {
            return /* binding */ supportPerformanceEntry;
          },
          /* harmony export */ startPerformanceCollection: function () {
            return /* binding */ startPerformanceCollection;
          },
          /* harmony export */ retrieveInitialDocumentResourceTiming:
            function () {
              return /* binding */ retrieveInitialDocumentResourceTiming;
            },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../domain/lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _domain_rumEventsCollection_resource_resourceUtils__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../domain/rumEventsCollection/resource/resourceUtils */ "../rum-core/src/domain/rumEventsCollection/resource/resourceUtils.ts"
          );
        /* harmony import */ var _domain_tracing_getDocumentTraceId__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../domain/tracing/getDocumentTraceId */ "../rum-core/src/domain/tracing/getDocumentTraceId.ts"
          );

        function supportPerformanceObject() {
          return (
            window.performance !== undefined && "getEntries" in performance
          );
        }
        function supportPerformanceTimingEvent(entryType) {
          return (
            window.PerformanceObserver &&
            PerformanceObserver.supportedEntryTypes !== undefined &&
            PerformanceObserver.supportedEntryTypes.includes(entryType)
          );
        }
        function supportPerformanceEntry() {
          // Safari 10 doesn't support PerformanceEntry
          return typeof PerformanceEntry === "function";
        }
        function startPerformanceCollection(lifeCycle, configuration) {
          retrieveInitialDocumentResourceTiming(function (timing) {
            handleRumPerformanceEntry(lifeCycle, configuration, timing);
          });
          if (supportPerformanceObject()) {
            handlePerformanceEntries(
              lifeCycle,
              configuration,
              performance.getEntries()
            );
          }
          if (window.PerformanceObserver) {
            var handlePerformanceEntryList_1 = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.monitor)(
              function (entries) {
                return handlePerformanceEntries(
                  lifeCycle,
                  configuration,
                  entries.getEntries()
                );
              }
            );
            var mainEntries = ["resource", "navigation", "longtask", "paint"];
            var experimentalEntries = [
              "largest-contentful-paint",
              "first-input",
              "layout-shift",
            ];
            try {
              // Experimental entries are not retrieved by performance.getEntries()
              // use a single PerformanceObserver with buffered flag by type
              // to get values that could happen before SDK init
              experimentalEntries.forEach(function (type) {
                var observer = new PerformanceObserver(
                  handlePerformanceEntryList_1
                );
                observer.observe({ type: type, buffered: true });
              });
            } catch (e) {
              // Some old browser versions don't support PerformanceObserver without entryTypes option
              mainEntries.push.apply(mainEntries, experimentalEntries);
            }
            var mainObserver = new PerformanceObserver(
              handlePerformanceEntryList_1
            );
            mainObserver.observe({ entryTypes: mainEntries });
            if (
              supportPerformanceObject() &&
              "addEventListener" in performance
            ) {
              // https://bugzilla.mozilla.org/show_bug.cgi?id=1559377
              performance.addEventListener(
                "resourcetimingbufferfull",
                function () {
                  performance.clearResourceTimings();
                }
              );
            }
          }
          if (!supportPerformanceTimingEvent("navigation")) {
            retrieveNavigationTiming(function (timing) {
              handleRumPerformanceEntry(lifeCycle, configuration, timing);
            });
          }
          if (!supportPerformanceTimingEvent("first-input")) {
            retrieveFirstInputTiming(function (timing) {
              handleRumPerformanceEntry(lifeCycle, configuration, timing);
            });
          }
        }
        function retrieveInitialDocumentResourceTiming(callback) {
          (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.runOnReadyState)(
            "interactive",
            function () {
              var timing;
              var forcedAttributes = {
                entryType: "resource",
                initiatorType:
                  _domain_rumEventsCollection_resource_resourceUtils__WEBPACK_IMPORTED_MODULE_2__.FAKE_INITIAL_DOCUMENT,
                traceId: (0,
                _domain_tracing_getDocumentTraceId__WEBPACK_IMPORTED_MODULE_3__.getDocumentTraceId)(
                  document
                ),
              };
              if (
                supportPerformanceTimingEvent("navigation") &&
                performance.getEntriesByType("navigation").length > 0
              ) {
                var navigationEntry =
                  performance.getEntriesByType("navigation")[0];
                timing = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    {},
                    navigationEntry.toJSON()
                  ),
                  forcedAttributes
                );
              } else {
                var relativePerformanceTiming =
                  computeRelativePerformanceTiming();
                timing = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                      {},
                      relativePerformanceTiming
                    ),
                    {
                      decodedBodySize: 0,
                      duration: relativePerformanceTiming.responseEnd,
                      name: window.location.href,
                      startTime: 0,
                    }
                  ),
                  forcedAttributes
                );
              }
              callback(timing);
            }
          );
        }
        function retrieveNavigationTiming(callback) {
          function sendFakeTiming() {
            callback(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {},
                  computeRelativePerformanceTiming()
                ),
                { entryType: "navigation" }
              )
            );
          }
          (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.runOnReadyState)(
            "complete",
            function () {
              // Send it a bit after the actual load event, so the "loadEventEnd" timing is accurate
              setTimeout(
                (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.monitor)(
                  sendFakeTiming
                )
              );
            }
          );
        }
        /**
         * first-input timing entry polyfill based on
         * https://github.com/GoogleChrome/web-vitals/blob/master/src/lib/polyfills/firstInputPolyfill.ts
         */
        function retrieveFirstInputTiming(callback) {
          var startTimeStamp = Date.now();
          var timingSent = false;
          var removeEventListeners = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.addEventListeners)(
            window,
            [
              "click" /* CLICK */,
              "mousedown" /* MOUSE_DOWN */,
              "keydown" /* KEY_DOWN */,
              "touchstart" /* TOUCH_START */,
              "pointerdown" /* POINTER_DOWN */,
            ],
            function (evt) {
              // Only count cancelable events, which should trigger behavior important to the user.
              if (!evt.cancelable) {
                return;
              }
              // This timing will be used to compute the "first Input delay", which is the delta between
              // when the system received the event (e.g. evt.timeStamp) and when it could run the callback
              // (e.g. performance.now()).
              var timing = {
                entryType: "first-input",
                processingStart: (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.relativeNow)(),
                startTime: evt.timeStamp,
              };
              if (evt.type === "pointerdown" /* POINTER_DOWN */) {
                sendTimingIfPointerIsNotCancelled(timing);
              } else {
                sendTiming(timing);
              }
            },
            { passive: true, capture: true }
          ).stop;
          /**
           * Pointer events are a special case, because they can trigger main or compositor thread behavior.
           * We differentiate these cases based on whether or not we see a pointercancel event, which are
           * fired when we scroll. If we're scrolling we don't need to report input delay since FID excludes
           * scrolling and pinch/zooming.
           */
          function sendTimingIfPointerIsNotCancelled(timing) {
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.addEventListeners)(
              window,
              [
                "pointerup" /* POINTER_UP */,
                "pointercancel" /* POINTER_CANCEL */,
              ],
              function (event) {
                if (event.type === "pointerup" /* POINTER_UP */) {
                  sendTiming(timing);
                }
              },
              { once: true }
            );
          }
          function sendTiming(timing) {
            if (!timingSent) {
              timingSent = true;
              removeEventListeners();
              // In some cases the recorded delay is clearly wrong, e.g. it's negative or it's larger than
              // the time between now and when the page was loaded.
              // - https://github.com/GoogleChromeLabs/first-input-delay/issues/4
              // - https://github.com/GoogleChromeLabs/first-input-delay/issues/6
              // - https://github.com/GoogleChromeLabs/first-input-delay/issues/7
              var delay = timing.processingStart - timing.startTime;
              if (delay >= 0 && delay < Date.now() - startTimeStamp) {
                callback(timing);
              }
            }
          }
        }
        function computeRelativePerformanceTiming() {
          var result = {};
          var timing = performance.timing;
          for (var key in timing) {
            if (
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.isNumber)(
                timing[key]
              )
            ) {
              var numberKey = key;
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              var timingElement = timing[numberKey];
              result[numberKey] =
                timingElement === 0
                  ? 0
                  : (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.getRelativeTime)(
                      timingElement
                    );
            }
          }
          return result;
        }
        function handlePerformanceEntries(lifeCycle, configuration, entries) {
          entries.forEach(function (entry) {
            if (
              entry.entryType === "resource" ||
              entry.entryType === "navigation" ||
              entry.entryType === "paint" ||
              entry.entryType === "longtask" ||
              entry.entryType === "largest-contentful-paint" ||
              entry.entryType === "first-input" ||
              entry.entryType === "layout-shift"
            ) {
              handleRumPerformanceEntry(lifeCycle, configuration, entry);
            }
          });
        }
        function handleRumPerformanceEntry(lifeCycle, configuration, entry) {
          if (
            isIncompleteNavigation(entry) ||
            isForbiddenResource(configuration, entry)
          ) {
            return;
          }
          lifeCycle.notify(
            _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            entry
          );
        }
        function isIncompleteNavigation(entry) {
          return entry.entryType === "navigation" && entry.loadEventEnd <= 0;
        }
        function isForbiddenResource(configuration, entry) {
          return (
            entry.entryType === "resource" &&
            !(0,
            _domain_rumEventsCollection_resource_resourceUtils__WEBPACK_IMPORTED_MODULE_2__.isAllowedRequestUrl)(
              configuration,
              entry.name
            )
          );
        }

        /***/
      },

    /***/ "../rum-core/src/domain/assembly.ts":
      /*!******************************************!*\
  !*** ../rum-core/src/domain/assembly.ts ***!
  \******************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startRumAssembly: function () {
            return /* binding */ startRumAssembly;
          },
          /* harmony export */ SYNTHETICS_TEST_ID_COOKIE_NAME: function () {
            return /* binding */ SYNTHETICS_TEST_ID_COOKIE_NAME;
          },
          /* harmony export */ SYNTHETICS_RESULT_ID_COOKIE_NAME: function () {
            return /* binding */ SYNTHETICS_RESULT_ID_COOKIE_NAME;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/createEventRateLimiter.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/limitModification.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/browser/cookie.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _rumSession__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./rumSession */ "../rum-core/src/domain/rumSession.ts"
          );

        var SessionType;
        (function (SessionType) {
          SessionType["SYNTHETICS"] = "synthetics";
          SessionType["USER"] = "user";
        })(SessionType || (SessionType = {}));
        var VIEW_EVENTS_MODIFIABLE_FIELD_PATHS = [
          // Fields with sensitive data
          "view.url",
          "view.referrer",
          "action.target.name",
          "error.message",
          "error.stack",
          "error.resource.url",
          "resource.url",
        ];
        var OTHER_EVENTS_MODIFIABLE_FIELD_PATHS = (0,
        tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArrays)(
          VIEW_EVENTS_MODIFIABLE_FIELD_PATHS,
          [
            // User-customizable field
            "context",
          ]
        );
        function startRumAssembly(
          applicationId,
          configuration,
          lifeCycle,
          session,
          parentContexts,
          urlContexts,
          getCommonContext
        ) {
          var _a;
          var reportError = function (error) {
            lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                .RAW_ERROR_COLLECTED,
              { error: error }
            );
          };
          var eventRateLimiters =
            ((_a = {}),
            (_a[
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType.ERROR
            ] = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.createEventRateLimiter)(
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                .ERROR,
              configuration.maxErrorsPerMinute,
              reportError
            )),
            (_a[
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType.ACTION
            ] = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.createEventRateLimiter)(
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                .ACTION,
              configuration.maxActionsPerMinute,
              reportError
            )),
            _a);
          var syntheticsContext = getSyntheticsContext();
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
              .RAW_RUM_EVENT_COLLECTED,
            function (_a) {
              var startTime = _a.startTime,
                rawRumEvent = _a.rawRumEvent,
                domainContext = _a.domainContext,
                savedCommonContext = _a.savedCommonContext,
                customerContext = _a.customerContext;
              var viewContext = parentContexts.findView(startTime);
              var urlContext = urlContexts.findUrl(startTime);
              if (
                session.isTracked() &&
                viewContext &&
                urlContext &&
                viewContext.session.id === session.getId()
              ) {
                var actionContext = parentContexts.findAction(startTime);
                var commonContext = savedCommonContext || getCommonContext();
                var rumContext = {
                  _dd: {
                    format_version: 2,
                    drift: (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.currentDrift)(),
                    session: {
                      plan: session.hasReplayPlan()
                        ? _rumSession__WEBPACK_IMPORTED_MODULE_3__
                            .RumSessionPlan.REPLAY
                        : _rumSession__WEBPACK_IMPORTED_MODULE_3__
                            .RumSessionPlan.LITE,
                    },
                  },
                  application: {
                    id: applicationId,
                  },
                  date: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.timeStampNow)(),
                  service: configuration.service,
                  session: {
                    type: syntheticsContext
                      ? SessionType.SYNTHETICS
                      : SessionType.USER,
                  },
                  synthetics: syntheticsContext,
                };
                var serverRumEvent = needToAssembleWithAction(rawRumEvent)
                  ? (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.combine)(
                      rumContext,
                      urlContext,
                      viewContext,
                      actionContext,
                      rawRumEvent
                    )
                  : (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.combine)(
                      rumContext,
                      urlContext,
                      viewContext,
                      rawRumEvent
                    );
                serverRumEvent.context = (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.combine)(
                  commonContext.context,
                  customerContext
                );
                if (!("has_replay" in serverRumEvent.session)) {
                  serverRumEvent.session.has_replay = commonContext.hasReplay;
                }
                if (
                  !(0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.isEmptyObject)(
                    commonContext.user
                  )
                ) {
                  serverRumEvent.usr = commonContext.user;
                }
                if (
                  shouldSend(
                    serverRumEvent,
                    configuration.beforeSend,
                    domainContext,
                    eventRateLimiters
                  )
                ) {
                  if (
                    (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.isEmptyObject)(
                      serverRumEvent.context
                    )
                  ) {
                    delete serverRumEvent.context;
                  }
                  lifeCycle.notify(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                      .RUM_EVENT_COLLECTED,
                    serverRumEvent
                  );
                }
              }
            }
          );
        }
        function shouldSend(
          event,
          beforeSend,
          domainContext,
          eventRateLimiters
        ) {
          var _a;
          if (beforeSend) {
            var result = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.limitModification)(
              event,
              event.type ===
                _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                  .VIEW
                ? VIEW_EVENTS_MODIFIABLE_FIELD_PATHS
                : OTHER_EVENTS_MODIFIABLE_FIELD_PATHS,
              function (event) {
                return beforeSend(event, domainContext);
              }
            );
            if (
              result === false &&
              event.type !==
                _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                  .VIEW
            ) {
              return false;
            }
            if (result === false) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.display.warn(
                "Can't dismiss view events using beforeSend!"
              );
            }
          }
          var rateLimitReached =
            (_a = eventRateLimiters[event.type]) === null || _a === void 0
              ? void 0
              : _a.isLimitReached();
          return !rateLimitReached;
        }
        function needToAssembleWithAction(event) {
          return (
            [
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                .ERROR,
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                .RESOURCE,
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                .LONG_TASK,
            ].indexOf(event.type) !== -1
          );
        }
        var SYNTHETICS_TEST_ID_COOKIE_NAME = "datadog-synthetics-public-id";
        var SYNTHETICS_RESULT_ID_COOKIE_NAME = "datadog-synthetics-result-id";
        function getSyntheticsContext() {
          var testId =
            window._DATADOG_SYNTHETICS_PUBLIC_ID ||
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.getCookie)(
              SYNTHETICS_TEST_ID_COOKIE_NAME
            );
          var resultId =
            window._DATADOG_SYNTHETICS_RESULT_ID ||
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.getCookie)(
              SYNTHETICS_RESULT_ID_COOKIE_NAME
            );
          if (typeof testId === "string" && typeof resultId === "string") {
            return {
              test_id: testId,
              result_id: resultId,
            };
          }
        }

        /***/
      },

    /***/ "../rum-core/src/domain/contextHistory.ts":
      /*!************************************************!*\
  !*** ../rum-core/src/domain/contextHistory.ts ***!
  \************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ CLEAR_OLD_CONTEXTS_INTERVAL: function () {
            return /* binding */ CLEAR_OLD_CONTEXTS_INTERVAL;
          },
          /* harmony export */ ContextHistory: function () {
            return /* binding */ ContextHistory;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );

        var CLEAR_OLD_CONTEXTS_INTERVAL =
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.ONE_MINUTE;
        var ContextHistory = /** @class */ (function () {
          function ContextHistory(expireDelay) {
            var _this = this;
            this.expireDelay = expireDelay;
            this.previousContexts = [];
            this.clearOldContextsInterval = setInterval(function () {
              return _this.clearOldContexts();
            }, CLEAR_OLD_CONTEXTS_INTERVAL);
          }
          ContextHistory.prototype.find = function (startTime) {
            if (
              startTime === undefined ||
              (this.current !== undefined &&
                this.currentStart !== undefined &&
                startTime >= this.currentStart)
            ) {
              return this.current;
            }
            for (var _i = 0, _a = this.previousContexts; _i < _a.length; _i++) {
              var previousContext = _a[_i];
              if (startTime > previousContext.endTime) {
                break;
              }
              if (startTime >= previousContext.startTime) {
                return previousContext.context;
              }
            }
            return undefined;
          };
          ContextHistory.prototype.setCurrent = function (current, startTime) {
            this.current = current;
            this.currentStart = startTime;
          };
          ContextHistory.prototype.getCurrent = function () {
            return this.current;
          };
          ContextHistory.prototype.clearCurrent = function () {
            this.current = undefined;
            this.currentStart = undefined;
          };
          ContextHistory.prototype.closeCurrent = function (endTime) {
            if (this.current !== undefined && this.currentStart !== undefined) {
              this.previousContexts.unshift({
                endTime: endTime,
                context: this.current,
                startTime: this.currentStart,
              });
              this.clearCurrent();
            }
          };
          ContextHistory.prototype.clearOldContexts = function () {
            var oldTimeThreshold =
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.relativeNow)() -
              this.expireDelay;
            while (
              this.previousContexts.length > 0 &&
              this.previousContexts[this.previousContexts.length - 1]
                .startTime < oldTimeThreshold
            ) {
              this.previousContexts.pop();
            }
          };
          ContextHistory.prototype.reset = function () {
            this.clearCurrent();
            this.previousContexts = [];
          };
          ContextHistory.prototype.stop = function () {
            clearInterval(this.clearOldContextsInterval);
          };
          return ContextHistory;
        })();

        /***/
      },

    /***/ "../rum-core/src/domain/foregroundContexts.ts":
      /*!****************************************************!*\
  !*** ../rum-core/src/domain/foregroundContexts.ts ***!
  \****************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ MAX_NUMBER_OF_SELECTABLE_FOREGROUND_PERIODS:
            function () {
              return /* binding */ MAX_NUMBER_OF_SELECTABLE_FOREGROUND_PERIODS;
            },
          /* harmony export */ MAX_NUMBER_OF_STORED_FOREGROUND_PERIODS:
            function () {
              return /* binding */ MAX_NUMBER_OF_STORED_FOREGROUND_PERIODS;
            },
          /* harmony export */ startForegroundContexts: function () {
            return /* binding */ startForegroundContexts;
          },
          /* harmony export */ addNewForegroundPeriod: function () {
            return /* binding */ addNewForegroundPeriod;
          },
          /* harmony export */ closeForegroundPeriod: function () {
            return /* binding */ closeForegroundPeriod;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );

        // Arbitrary value to cap number of element mostly for backend & to save bandwidth
        var MAX_NUMBER_OF_SELECTABLE_FOREGROUND_PERIODS = 500;
        // Arbitrary value to cap number of element mostly for memory consumption in the browser
        var MAX_NUMBER_OF_STORED_FOREGROUND_PERIODS = 2500;
        var foregroundPeriods = [];
        function startForegroundContexts() {
          if (document.hasFocus()) {
            addNewForegroundPeriod();
          }
          var stopForegroundTracking = trackFocus(addNewForegroundPeriod).stop;
          var stopBlurTracking = trackBlur(closeForegroundPeriod).stop;
          return {
            isInForegroundAt: isInForegroundAt,
            selectInForegroundPeriodsFor: selectInForegroundPeriodsFor,
            stop: function () {
              foregroundPeriods = [];
              stopForegroundTracking();
              stopBlurTracking();
            },
          };
        }
        function addNewForegroundPeriod() {
          if (
            foregroundPeriods.length > MAX_NUMBER_OF_STORED_FOREGROUND_PERIODS
          ) {
            return;
          }
          var currentForegroundPeriod =
            foregroundPeriods[foregroundPeriods.length - 1];
          var now = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.relativeNow)();
          if (
            currentForegroundPeriod !== undefined &&
            currentForegroundPeriod.end === undefined
          ) {
            return;
          }
          foregroundPeriods.push({
            start: now,
          });
        }
        function closeForegroundPeriod() {
          if (foregroundPeriods.length === 0) {
            return;
          }
          var currentForegroundPeriod =
            foregroundPeriods[foregroundPeriods.length - 1];
          var now = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.relativeNow)();
          if (currentForegroundPeriod.end !== undefined) {
            return;
          }
          currentForegroundPeriod.end = now;
        }
        function trackFocus(onFocusChange) {
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.addEventListener)(
            window,
            "focus" /* FOCUS */,
            function (event) {
              if (!event.isTrusted) {
                return;
              }
              onFocusChange();
            }
          );
        }
        function trackBlur(onBlurChange) {
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.addEventListener)(
            window,
            "blur" /* BLUR */,
            function (event) {
              if (!event.isTrusted) {
                return;
              }
              onBlurChange();
            }
          );
        }
        function isInForegroundAt(startTime) {
          for (var i = foregroundPeriods.length - 1; i >= 0; i--) {
            var foregroundPeriod = foregroundPeriods[i];
            if (
              foregroundPeriod.end !== undefined &&
              startTime > foregroundPeriod.end
            ) {
              break;
            }
            if (
              startTime > foregroundPeriod.start &&
              (foregroundPeriod.end === undefined ||
                startTime < foregroundPeriod.end)
            ) {
              return true;
            }
          }
          return false;
        }
        function selectInForegroundPeriodsFor(eventStartTime, duration) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          var eventEndTime = eventStartTime + duration;
          var filteredForegroundPeriods = [];
          var earliestIndex = Math.max(
            0,
            foregroundPeriods.length -
              MAX_NUMBER_OF_SELECTABLE_FOREGROUND_PERIODS
          );
          for (var i = foregroundPeriods.length - 1; i >= earliestIndex; i--) {
            var foregroundPeriod = foregroundPeriods[i];
            if (
              foregroundPeriod.end !== undefined &&
              eventStartTime > foregroundPeriod.end
            ) {
              // event starts after the end of the current focus period
              // since the array is sorted, we can stop looking for foreground periods
              break;
            }
            if (eventEndTime < foregroundPeriod.start) {
              // event ends before the start of the current focus period
              // continue to previous one
              continue;
            }
            var startTime =
              eventStartTime > foregroundPeriod.start
                ? eventStartTime
                : foregroundPeriod.start;
            var startDuration = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.elapsed)(
              eventStartTime,
              startTime
            );
            var endTime =
              foregroundPeriod.end === undefined ||
              eventEndTime < foregroundPeriod.end
                ? eventEndTime
                : foregroundPeriod.end;
            var endDuration = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.elapsed)(
              startTime,
              endTime
            );
            filteredForegroundPeriods.unshift({
              start: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.toServerDuration)(
                startDuration
              ),
              duration: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.toServerDuration)(
                endDuration
              ),
            });
          }
          return filteredForegroundPeriods;
        }

        /***/
      },

    /***/ "../rum-core/src/domain/internalContext.ts":
      /*!*************************************************!*\
  !*** ../rum-core/src/domain/internalContext.ts ***!
  \*************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startInternalContext: function () {
            return /* binding */ startInternalContext;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );

        /**
         * Internal context keep returning v1 format
         * to not break compatibility with logs data format
         */
        function startInternalContext(
          applicationId,
          session,
          parentContexts,
          urlContexts
        ) {
          return {
            get: function (startTime) {
              var viewContext = parentContexts.findView(startTime);
              var urlContext = urlContexts.findUrl(startTime);
              if (
                session.isTracked() &&
                viewContext &&
                urlContext &&
                viewContext.session.id
              ) {
                var actionContext = parentContexts.findAction(startTime);
                return {
                  application_id: applicationId,
                  session_id: viewContext.session.id,
                  user_action: actionContext
                    ? {
                        id: actionContext.action.id,
                      }
                    : undefined,
                  view: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                      {},
                      viewContext.view
                    ),
                    urlContext.view
                  ),
                };
              }
            },
          };
        }

        /***/
      },

    /***/ "../rum-core/src/domain/lifeCycle.ts":
      /*!*******************************************!*\
  !*** ../rum-core/src/domain/lifeCycle.ts ***!
  \*******************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ LifeCycleEventType: function () {
            return /* binding */ LifeCycleEventType;
          },
          /* harmony export */ LifeCycle: function () {
            return /* binding */ LifeCycle;
          },
          /* harmony export */
        });
        var LifeCycleEventType;
        (function (LifeCycleEventType) {
          LifeCycleEventType[
            (LifeCycleEventType["PERFORMANCE_ENTRY_COLLECTED"] = 0)
          ] = "PERFORMANCE_ENTRY_COLLECTED";
          LifeCycleEventType[(LifeCycleEventType["AUTO_ACTION_CREATED"] = 1)] =
            "AUTO_ACTION_CREATED";
          LifeCycleEventType[
            (LifeCycleEventType["AUTO_ACTION_COMPLETED"] = 2)
          ] = "AUTO_ACTION_COMPLETED";
          LifeCycleEventType[
            (LifeCycleEventType["AUTO_ACTION_DISCARDED"] = 3)
          ] = "AUTO_ACTION_DISCARDED";
          LifeCycleEventType[(LifeCycleEventType["VIEW_CREATED"] = 4)] =
            "VIEW_CREATED";
          LifeCycleEventType[(LifeCycleEventType["VIEW_UPDATED"] = 5)] =
            "VIEW_UPDATED";
          LifeCycleEventType[(LifeCycleEventType["VIEW_ENDED"] = 6)] =
            "VIEW_ENDED";
          LifeCycleEventType[(LifeCycleEventType["REQUEST_STARTED"] = 7)] =
            "REQUEST_STARTED";
          LifeCycleEventType[(LifeCycleEventType["REQUEST_COMPLETED"] = 8)] =
            "REQUEST_COMPLETED";
          // The SESSION_EXPIRED lifecycle event has been introduced to represent when a session has expired
          // and trigger cleanup tasks related to this, prior to renewing the session. Its implementation is
          // slightly naive: it is not triggered as soon as the session is expired, but rather just before
          // notifying that the session is renewed. Thus, the session id is already set to the newly renewed
          // session.
          //
          // This implementation is "good enough" for our use-cases. Improving this is not trivial,
          // primarily because multiple instances of the SDK may be managing the same session cookie at
          // the same time, for example when using Logs and RUM on the same page, or opening multiple tabs
          // on the same domain.
          LifeCycleEventType[(LifeCycleEventType["SESSION_EXPIRED"] = 9)] =
            "SESSION_EXPIRED";
          LifeCycleEventType[(LifeCycleEventType["SESSION_RENEWED"] = 10)] =
            "SESSION_RENEWED";
          LifeCycleEventType[(LifeCycleEventType["BEFORE_UNLOAD"] = 11)] =
            "BEFORE_UNLOAD";
          LifeCycleEventType[
            (LifeCycleEventType["RAW_RUM_EVENT_COLLECTED"] = 12)
          ] = "RAW_RUM_EVENT_COLLECTED";
          LifeCycleEventType[(LifeCycleEventType["RUM_EVENT_COLLECTED"] = 13)] =
            "RUM_EVENT_COLLECTED";
          LifeCycleEventType[(LifeCycleEventType["RAW_ERROR_COLLECTED"] = 14)] =
            "RAW_ERROR_COLLECTED";
        })(LifeCycleEventType || (LifeCycleEventType = {}));
        var LifeCycle = /** @class */ (function () {
          function LifeCycle() {
            this.callbacks = {};
          }
          LifeCycle.prototype.notify = function (eventType, data) {
            var eventCallbacks = this.callbacks[eventType];
            if (eventCallbacks) {
              eventCallbacks.forEach(function (callback) {
                return callback(data);
              });
            }
          };
          LifeCycle.prototype.subscribe = function (eventType, callback) {
            var _this = this;
            if (!this.callbacks[eventType]) {
              this.callbacks[eventType] = [];
            }
            this.callbacks[eventType].push(callback);
            return {
              unsubscribe: function () {
                _this.callbacks[eventType] = _this.callbacks[eventType].filter(
                  function (other) {
                    return callback !== other;
                  }
                );
              },
            };
          };
          return LifeCycle;
        })();

        /***/
      },

    /***/ "../rum-core/src/domain/parentContexts.ts":
      /*!************************************************!*\
  !*** ../rum-core/src/domain/parentContexts.ts ***!
  \************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ VIEW_CONTEXT_TIME_OUT_DELAY: function () {
            return /* binding */ VIEW_CONTEXT_TIME_OUT_DELAY;
          },
          /* harmony export */ ACTION_CONTEXT_TIME_OUT_DELAY: function () {
            return /* binding */ ACTION_CONTEXT_TIME_OUT_DELAY;
          },
          /* harmony export */ startParentContexts: function () {
            return /* binding */ startParentContexts;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/session/sessionStore.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _contextHistory__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./contextHistory */ "../rum-core/src/domain/contextHistory.ts"
          );

        var VIEW_CONTEXT_TIME_OUT_DELAY =
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.SESSION_TIME_OUT_DELAY;
        var ACTION_CONTEXT_TIME_OUT_DELAY =
          5 * _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.ONE_MINUTE; // arbitrary
        function startParentContexts(lifeCycle, session) {
          var viewContextHistory =
            new _contextHistory__WEBPACK_IMPORTED_MODULE_1__.ContextHistory(
              VIEW_CONTEXT_TIME_OUT_DELAY
            );
          var actionContextHistory =
            new _contextHistory__WEBPACK_IMPORTED_MODULE_1__.ContextHistory(
              ACTION_CONTEXT_TIME_OUT_DELAY
            );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .VIEW_CREATED,
            function (view) {
              viewContextHistory.setCurrent(
                buildViewContext(view, session.getId()),
                view.startClocks.relative
              );
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .VIEW_UPDATED,
            function (view) {
              // A view can be updated after its end.  We have to ensure that the view being updated is the
              // most recently created.
              var current = viewContextHistory.getCurrent();
              if (current && current.view.id === view.id) {
                viewContextHistory.setCurrent(
                  buildViewContext(view, current.session.id),
                  view.startClocks.relative
                );
              }
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .VIEW_ENDED,
            function (_a) {
              var endClocks = _a.endClocks;
              viewContextHistory.closeCurrent(endClocks.relative);
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .AUTO_ACTION_CREATED,
            function (action) {
              actionContextHistory.setCurrent(
                buildActionContext(action),
                action.startClocks.relative
              );
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .AUTO_ACTION_COMPLETED,
            function (action) {
              if (actionContextHistory.getCurrent()) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                var actionEndTime =
                  action.startClocks.relative + action.duration;
                actionContextHistory.closeCurrent(actionEndTime);
              }
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .AUTO_ACTION_DISCARDED,
            function () {
              actionContextHistory.clearCurrent();
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .SESSION_RENEWED,
            function () {
              viewContextHistory.reset();
              actionContextHistory.reset();
            }
          );
          function buildViewContext(view, sessionId) {
            return {
              session: {
                id: sessionId,
              },
              view: {
                id: view.id,
                name: view.name,
              },
            };
          }
          function buildActionContext(action) {
            return { action: { id: action.id } };
          }
          return {
            findAction: function (startTime) {
              return actionContextHistory.find(startTime);
            },
            findView: function (startTime) {
              return viewContextHistory.find(startTime);
            },
            stop: function () {
              viewContextHistory.stop();
              actionContextHistory.stop();
            },
          };
        }

        /***/
      },

    /***/ "../rum-core/src/domain/requestCollection.ts":
      /*!***************************************************!*\
  !*** ../rum-core/src/domain/requestCollection.ts ***!
  \***************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startRequestCollection: function () {
            return /* binding */ startRequestCollection;
          },
          /* harmony export */ trackXhr: function () {
            return /* binding */ trackXhr;
          },
          /* harmony export */ trackFetch: function () {
            return /* binding */ trackFetch;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/browser/xhrObservable.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/browser/fetchObservable.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _rumEventsCollection_resource_resourceUtils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./rumEventsCollection/resource/resourceUtils */ "../rum-core/src/domain/rumEventsCollection/resource/resourceUtils.ts"
          );
        /* harmony import */ var _tracing_tracer__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./tracing/tracer */ "../rum-core/src/domain/tracing/tracer.ts"
          );

        var nextRequestIndex = 1;
        function startRequestCollection(lifeCycle, configuration, session) {
          var tracer = (0,
          _tracing_tracer__WEBPACK_IMPORTED_MODULE_2__.startTracer)(
            configuration,
            session
          );
          trackXhr(lifeCycle, configuration, tracer);
          trackFetch(lifeCycle, configuration, tracer);
        }
        function trackXhr(lifeCycle, configuration, tracer) {
          var subscription = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.initXhrObservable)().subscribe(
            function (rawContext) {
              var context = rawContext;
              if (
                !(0,
                _rumEventsCollection_resource_resourceUtils__WEBPACK_IMPORTED_MODULE_1__.isAllowedRequestUrl)(
                  configuration,
                  context.url
                )
              ) {
                return;
              }
              switch (context.state) {
                case "start":
                  tracer.traceXhr(context, context.xhr);
                  context.requestIndex = getNextRequestIndex();
                  lifeCycle.notify(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .REQUEST_STARTED,
                    {
                      requestIndex: context.requestIndex,
                    }
                  );
                  break;
                case "complete":
                  tracer.clearTracingIfNeeded(context);
                  lifeCycle.notify(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .REQUEST_COMPLETED,
                    {
                      duration: context.duration,
                      method: context.method,
                      requestIndex: context.requestIndex,
                      responseText: context.responseText,
                      spanId: context.spanId,
                      startClocks: context.startClocks,
                      status: context.status,
                      traceId: context.traceId,
                      type: _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__
                        .RequestType.XHR,
                      url: context.url,
                      xhr: context.xhr,
                    }
                  );
                  break;
              }
            }
          );
          return {
            stop: function () {
              return subscription.unsubscribe();
            },
          };
        }
        function trackFetch(lifeCycle, configuration, tracer) {
          var subscription = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.initFetchObservable)().subscribe(
            function (rawContext) {
              var context = rawContext;
              if (
                !(0,
                _rumEventsCollection_resource_resourceUtils__WEBPACK_IMPORTED_MODULE_1__.isAllowedRequestUrl)(
                  configuration,
                  context.url
                )
              ) {
                return;
              }
              switch (context.state) {
                case "start":
                  tracer.traceFetch(context);
                  context.requestIndex = getNextRequestIndex();
                  lifeCycle.notify(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .REQUEST_STARTED,
                    {
                      requestIndex: context.requestIndex,
                    }
                  );
                  break;
                case "complete":
                  tracer.clearTracingIfNeeded(context);
                  lifeCycle.notify(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .REQUEST_COMPLETED,
                    {
                      duration: context.duration,
                      method: context.method,
                      requestIndex: context.requestIndex,
                      responseText: context.responseText,
                      responseType: context.responseType,
                      spanId: context.spanId,
                      startClocks: context.startClocks,
                      status: context.status,
                      traceId: context.traceId,
                      type: _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__
                        .RequestType.FETCH,
                      url: context.url,
                      response: context.response,
                      init: context.init,
                      input: context.input,
                    }
                  );
                  break;
              }
            }
          );
          return {
            stop: function () {
              return subscription.unsubscribe();
            },
          };
        }
        function getNextRequestIndex() {
          var result = nextRequestIndex;
          nextRequestIndex += 1;
          return result;
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/action/actionCollection.ts":
      /*!*****************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/action/actionCollection.ts ***!
  \*****************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startActionCollection: function () {
            return /* binding */ startActionCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _trackActions__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./trackActions */ "../rum-core/src/domain/rumEventsCollection/action/trackActions.ts"
          );

        function startActionCollection(
          lifeCycle,
          domMutationObservable,
          configuration,
          foregroundContexts
        ) {
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
              .AUTO_ACTION_COMPLETED,
            function (action) {
              return lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                  .RAW_RUM_EVENT_COLLECTED,
                processAction(action, foregroundContexts)
              );
            }
          );
          if (configuration.trackInteractions) {
            (0, _trackActions__WEBPACK_IMPORTED_MODULE_3__.trackActions)(
              lifeCycle,
              domMutationObservable,
              configuration
            );
          }
          return {
            addAction: function (action, savedCommonContext) {
              lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                  .RAW_RUM_EVENT_COLLECTED,
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  { savedCommonContext: savedCommonContext },
                  processAction(action, foregroundContexts)
                )
              );
            },
          };
        }
        function processAction(action, foregroundContexts) {
          var autoActionProperties = isAutoAction(action)
            ? {
                action: {
                  error: {
                    count: action.counts.errorCount,
                  },
                  id: action.id,
                  loading_time: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.toServerDuration)(
                    action.duration
                  ),
                  long_task: {
                    count: action.counts.longTaskCount,
                  },
                  resource: {
                    count: action.counts.resourceCount,
                  },
                },
              }
            : undefined;
          var customerContext = !isAutoAction(action)
            ? action.context
            : undefined;
          var actionEvent = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.combine)(
            {
              action: {
                id: (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.generateUUID)(),
                target: {
                  name: action.name,
                },
                type: action.type,
              },
              date: action.startClocks.timeStamp,
              type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                .ACTION,
            },
            autoActionProperties
          );
          var inForeground = foregroundContexts.isInForegroundAt(
            action.startClocks.relative
          );
          if (inForeground !== undefined) {
            actionEvent.view = { in_foreground: inForeground };
          }
          return {
            customerContext: customerContext,
            rawRumEvent: actionEvent,
            startTime: action.startClocks.relative,
            domainContext: isAutoAction(action) ? { event: action.event } : {},
          };
        }
        function isAutoAction(action) {
          return (
            action.type !==
            _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.ActionType.CUSTOM
          );
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/action/getActionNameFromElement.ts":
      /*!*************************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/action/getActionNameFromElement.ts ***!
  \*************************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ getActionNameFromElement: function () {
            return /* binding */ getActionNameFromElement;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/browserDetection.ts"
          );

        /**
         * Get the action name from the attribute 'data-dd-action-name' on the element or any of its parent.
         * It can also be retrieved from a user defined attribute.
         */
        var DEFAULT_PROGRAMMATIC_ATTRIBUTE = "data-dd-action-name";
        function getActionNameFromElement(element, userProgrammaticAttribute) {
          // Proceed to get the action name in two steps:
          // * first, get the name programmatically, explicitly defined by the user.
          // * then, use strategies that are known to return good results. Those strategies will be used on
          //   the element and a few parents, but it's likely that they won't succeed at all.
          // * if no name is found this way, use strategies returning less accurate names as a fallback.
          //   Those are much likely to succeed.
          return (
            getActionNameFromElementProgrammatically(
              element,
              DEFAULT_PROGRAMMATIC_ATTRIBUTE
            ) ||
            (userProgrammaticAttribute &&
              getActionNameFromElementProgrammatically(
                element,
                userProgrammaticAttribute
              )) ||
            getActionNameFromElementForStrategies(
              element,
              priorityStrategies
            ) ||
            getActionNameFromElementForStrategies(
              element,
              fallbackStrategies
            ) ||
            ""
          );
        }
        function getActionNameFromElementProgrammatically(
          targetElement,
          programmaticAttribute
        ) {
          var elementWithAttribute;
          // We don't use getActionNameFromElementForStrategies here, because we want to consider all parents,
          // without limit. It is up to the user to declare a relevant naming strategy.
          // If available, use element.closest() to match get the attribute from the element or any of its
          // parent.  Else fallback to a more traditional implementation.
          if (supportsElementClosest()) {
            elementWithAttribute = targetElement.closest(
              "[" + programmaticAttribute + "]"
            );
          } else {
            var element = targetElement;
            while (element) {
              if (element.hasAttribute(programmaticAttribute)) {
                elementWithAttribute = element;
                break;
              }
              element = element.parentElement;
            }
          }
          if (!elementWithAttribute) {
            return;
          }
          var name = elementWithAttribute.getAttribute(programmaticAttribute);
          return truncate(normalizeWhitespace(name.trim()));
        }
        var priorityStrategies = [
          // associated LABEL text
          function (element) {
            // IE does not support element.labels, so we fallback to a CSS selector based on the element id
            // instead
            if (supportsLabelProperty()) {
              if (
                "labels" in element &&
                element.labels &&
                element.labels.length > 0
              ) {
                return getTextualContent(element.labels[0]);
              }
            } else if (element.id) {
              var label =
                element.ownerDocument &&
                element.ownerDocument.querySelector(
                  'label[for="' + element.id.replace('"', '\\"') + '"]'
                );
              return label && getTextualContent(label);
            }
          },
          // INPUT button (and associated) value
          function (element) {
            if (element.nodeName === "INPUT") {
              var input = element;
              var type = input.getAttribute("type");
              if (type === "button" || type === "submit" || type === "reset") {
                return input.value;
              }
            }
          },
          // BUTTON, LABEL or button-like element text
          function (element) {
            if (
              element.nodeName === "BUTTON" ||
              element.nodeName === "LABEL" ||
              element.getAttribute("role") === "button"
            ) {
              return getTextualContent(element);
            }
          },
          function (element) {
            return element.getAttribute("aria-label");
          },
          // associated element text designated by the aria-labelledby attribute
          function (element) {
            var labelledByAttribute = element.getAttribute("aria-labelledby");
            if (labelledByAttribute) {
              return labelledByAttribute
                .split(/\s+/)
                .map(function (id) {
                  return getElementById(element, id);
                })
                .filter(function (label) {
                  return Boolean(label);
                })
                .map(getTextualContent)
                .join(" ");
            }
          },
          function (element) {
            return element.getAttribute("alt");
          },
          function (element) {
            return element.getAttribute("name");
          },
          function (element) {
            return element.getAttribute("title");
          },
          function (element) {
            return element.getAttribute("placeholder");
          },
          // SELECT first OPTION text
          function (element) {
            if ("options" in element && element.options.length > 0) {
              return getTextualContent(element.options[0]);
            }
          },
        ];
        var fallbackStrategies = [
          function (element) {
            return getTextualContent(element);
          },
        ];
        /**
         * Iterates over the target element and its parent, using the strategies list to get an action name.
         * Each strategies are applied on each element, stopping as soon as a non-empty value is returned.
         */
        var MAX_PARENTS_TO_CONSIDER = 10;
        function getActionNameFromElementForStrategies(
          targetElement,
          strategies
        ) {
          var element = targetElement;
          var recursionCounter = 0;
          while (
            recursionCounter <= MAX_PARENTS_TO_CONSIDER &&
            element &&
            element.nodeName !== "BODY" &&
            element.nodeName !== "HTML" &&
            element.nodeName !== "HEAD"
          ) {
            for (
              var _i = 0, strategies_1 = strategies;
              _i < strategies_1.length;
              _i++
            ) {
              var strategy = strategies_1[_i];
              var name_1 = strategy(element);
              if (typeof name_1 === "string") {
                var trimmedName = name_1.trim();
                if (trimmedName) {
                  return truncate(normalizeWhitespace(trimmedName));
                }
              }
            }
            // Consider a FORM as a contextual limit to get the action name.  This is experimental and may
            // be reconsidered in the future.
            if (element.nodeName === "FORM") {
              break;
            }
            element = element.parentElement;
            recursionCounter += 1;
          }
        }
        function normalizeWhitespace(s) {
          return s.replace(/\s+/g, " ");
        }
        function truncate(s) {
          return s.length > 100
            ? (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.safeTruncate)(
                s,
                100
              ) + " [...]"
            : s;
        }
        function getElementById(refElement, id) {
          // Use the element ownerDocument here, because tests are executed in an iframe, so
          // document.getElementById won't work.
          return refElement.ownerDocument
            ? refElement.ownerDocument.getElementById(id)
            : null;
        }
        function getTextualContent(element) {
          if (element.isContentEditable) {
            return;
          }
          if ("innerText" in element) {
            var text = element.innerText;
            if (!supportsInnerTextScriptAndStyleRemoval()) {
              // remove the inner text of SCRIPT and STYLES from the result. This is a bit dirty, but should
              // be relatively fast and work in most cases.
              var elementsTextToRemove =
                element.querySelectorAll("script, style");
              // eslint-disable-next-line @typescript-eslint/prefer-for-of
              for (var i = 0; i < elementsTextToRemove.length; i += 1) {
                var innerText = elementsTextToRemove[i].innerText;
                if (innerText.trim().length > 0) {
                  text = text.replace(innerText, "");
                }
              }

              var elementsTextToScrub = element.querySelectorAll(
                "[data-dd-action-name]"
              );

              for (var i = 0; i < elementsTextToScrub.length; i += 1) {
                var innerText = elementsTextToScrub[i].innerText;
                if (innerText.trim().length > 0) {
                  text = text.replace(
                    innerText,
                    element.getAttribute("data-dd-action-name")
                  );
                }
              }
            }
            return text;
          }
          return element.textContent;
        }
        /**
         * Returns true if element.innerText excludes the text from inline SCRIPT and STYLE element. This
         * should be the case everywhere except on Internet Explorer 10 and 11 (see [1])
         *
         * The innerText property relies on what is actually rendered to compute its output, so to check if
         * it actually excludes SCRIPT and STYLE content, a solution would be to create a style element, set
         * its content to '*', inject it in the document body, and check if the style element innerText
         * property returns '*'. Using a new `document` instance won't work as it is not rendered.
         *
         * This solution requires specific CSP rules (see [2]) to be set by the customer. We want to avoid
         * this, so instead we rely on browser detection. In case of false negative, the impact should be
         * low, since we rely on this result to remove the SCRIPT and STYLE innerText (which will be empty)
         * from a parent element innerText.
         *
         * [1]: https://web.archive.org/web/20210602165716/http://perfectionkills.com/the-poor-misunderstood-innerText/#diff-with-textContent
         * [2]: https://github.com/DataDog/browser-sdk/issues/1084
         */
        function supportsInnerTextScriptAndStyleRemoval() {
          return !(0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.isIE)();
        }
        /**
         * Returns true if the browser supports the element.labels property.  This should be the case
         * everywhere except on Internet Explorer.
         * Note: The result is computed lazily, because we don't want any DOM access when the SDK is
         * evaluated.
         */
        var supportsLabelPropertyResult;
        function supportsLabelProperty() {
          if (supportsLabelPropertyResult === undefined) {
            supportsLabelPropertyResult =
              "labels" in HTMLInputElement.prototype;
          }
          return supportsLabelPropertyResult;
        }
        /**
         * Returns true if the browser supports the element.closest method.  This should be the case
         * everywhere except on Internet Explorer.
         * Note: The result is computed lazily, because we don't want any DOM access when the SDK is
         * evaluated.
         */
        var supportsElementClosestResult;
        function supportsElementClosest() {
          if (supportsElementClosestResult === undefined) {
            supportsElementClosestResult = "closest" in HTMLElement.prototype;
          }
          return supportsElementClosestResult;
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/action/trackActions.ts":
      /*!*************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/action/trackActions.ts ***!
  \*************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ AUTO_ACTION_MAX_DURATION: function () {
            return /* binding */ AUTO_ACTION_MAX_DURATION;
          },
          /* harmony export */ trackActions: function () {
            return /* binding */ trackActions;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _trackEventCounts__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../trackEventCounts */ "../rum-core/src/domain/trackEventCounts.ts"
          );
        /* harmony import */ var _waitIdlePage__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../../waitIdlePage */ "../rum-core/src/domain/waitIdlePage.ts"
          );
        /* harmony import */ var _getActionNameFromElement__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./getActionNameFromElement */ "../rum-core/src/domain/rumEventsCollection/action/getActionNameFromElement.ts"
          );

        // Maximum duration for automatic actions
        var AUTO_ACTION_MAX_DURATION =
          10 * _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.ONE_SECOND;
        function trackActions(lifeCycle, domMutationObservable, _a) {
          var actionNameAttribute = _a.actionNameAttribute;
          var action = startActionManagement(lifeCycle, domMutationObservable);
          // New views trigger the discard of the current pending Action
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .VIEW_CREATED,
            function () {
              action.discardCurrent();
            }
          );
          var stopListener = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.addEventListener)(
            window,
            "click" /* CLICK */,
            function (event) {
              if (!(event.target instanceof Element)) {
                return;
              }
              var name = (0,
              _getActionNameFromElement__WEBPACK_IMPORTED_MODULE_4__.getActionNameFromElement)(
                event.target,
                actionNameAttribute
              );
              if (!name) {
                return;
              }
              action.create(
                _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__.ActionType
                  .CLICK,
                name,
                event
              );
            },
            { capture: true }
          ).stop;
          return {
            stop: function () {
              action.discardCurrent();
              stopListener();
            },
          };
        }
        function startActionManagement(lifeCycle, domMutationObservable) {
          var currentAction;
          var stopWaitingIdlePage;
          return {
            create: function (type, name, event) {
              if (currentAction) {
                // Ignore any new action if another one is already occurring.
                return;
              }
              var pendingAutoAction = new PendingAutoAction(
                lifeCycle,
                type,
                name,
                event
              );
              currentAction = pendingAutoAction;
              stopWaitingIdlePage = (0,
              _waitIdlePage__WEBPACK_IMPORTED_MODULE_3__.waitIdlePage)(
                lifeCycle,
                domMutationObservable,
                function (event) {
                  if (event.hadActivity && event.duration >= 0) {
                    pendingAutoAction.complete(event.duration);
                  } else {
                    pendingAutoAction.discard();
                  }
                  currentAction = undefined;
                },
                AUTO_ACTION_MAX_DURATION
              ).stop;
            },
            discardCurrent: function () {
              if (currentAction) {
                stopWaitingIdlePage();
                currentAction.discard();
                currentAction = undefined;
              }
            },
          };
        }
        var PendingAutoAction = /** @class */ (function () {
          function PendingAutoAction(lifeCycle, type, name, event) {
            this.lifeCycle = lifeCycle;
            this.type = type;
            this.name = name;
            this.event = event;
            this.id = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.generateUUID)();
            this.startClocks = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.clocksNow)();
            this.eventCountsSubscription = (0,
            _trackEventCounts__WEBPACK_IMPORTED_MODULE_2__.trackEventCounts)(
              lifeCycle
            );
            this.lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
                .AUTO_ACTION_CREATED,
              { id: this.id, startClocks: this.startClocks }
            );
          }
          PendingAutoAction.prototype.complete = function (duration) {
            var eventCounts = this.eventCountsSubscription.eventCounts;
            this.lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
                .AUTO_ACTION_COMPLETED,
              {
                counts: {
                  errorCount: eventCounts.errorCount,
                  longTaskCount: eventCounts.longTaskCount,
                  resourceCount: eventCounts.resourceCount,
                },
                duration: duration,
                id: this.id,
                name: this.name,
                startClocks: this.startClocks,
                type: this.type,
                event: this.event,
              }
            );
            this.eventCountsSubscription.stop();
          };
          PendingAutoAction.prototype.discard = function () {
            this.lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
                .AUTO_ACTION_DISCARDED
            );
            this.eventCountsSubscription.stop();
          };
          return PendingAutoAction;
        })();

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/error/errorCollection.ts":
      /*!***************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/error/errorCollection.ts ***!
  \***************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startErrorCollection: function () {
            return /* binding */ startErrorCollection;
          },
          /* harmony export */ doStartErrorCollection: function () {
            return /* binding */ doStartErrorCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/error/trackConsoleError.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/error/trackRuntimeError.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/tracekit/computeStackTrace.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/error.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        function startErrorCollection(lifeCycle, foregroundContexts) {
          var errorObservable =
            new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.Observable();
          (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.trackConsoleError)(
            errorObservable
          );
          (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.trackRuntimeError)(
            errorObservable
          );
          errorObservable.subscribe(function (error) {
            return lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                .RAW_ERROR_COLLECTED,
              { error: error }
            );
          });
          return doStartErrorCollection(lifeCycle, foregroundContexts);
        }
        function doStartErrorCollection(lifeCycle, foregroundContexts) {
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
              .RAW_ERROR_COLLECTED,
            function (_a) {
              var error = _a.error,
                customerContext = _a.customerContext,
                savedCommonContext = _a.savedCommonContext;
              lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                  .RAW_RUM_EVENT_COLLECTED,
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    customerContext: customerContext,
                    savedCommonContext: savedCommonContext,
                  },
                  processError(error, foregroundContexts)
                )
              );
            }
          );
          return {
            addError: function (_a, savedCommonContext) {
              var error = _a.error,
                handlingStack = _a.handlingStack,
                startClocks = _a.startClocks,
                customerContext = _a.context;
              var rawError = computeRawError(error, handlingStack, startClocks);
              lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                  .RAW_ERROR_COLLECTED,
                {
                  customerContext: customerContext,
                  savedCommonContext: savedCommonContext,
                  error: rawError,
                }
              );
            },
          };
        }
        function computeRawError(error, handlingStack, startClocks) {
          var stackTrace =
            error instanceof Error
              ? (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.computeStackTrace)(
                  error
                )
              : undefined;
          return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              {
                startClocks: startClocks,
                source:
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.ErrorSource
                    .CUSTOM,
                originalError: error,
              },
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.formatUnknownError)(
                stackTrace,
                error,
                "Provided",
                handlingStack
              )
            ),
            {
              handling:
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.ErrorHandling
                  .HANDLED,
            }
          );
        }
        function processError(error, foregroundContexts) {
          var rawRumEvent = {
            date: error.startClocks.timeStamp,
            error: {
              id: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.generateUUID)(),
              message: error.message,
              resource: error.resource
                ? {
                    method: error.resource.method,
                    status_code: error.resource.statusCode,
                    url: error.resource.url,
                  }
                : undefined,
              source: error.source,
              stack: error.stack,
              handling_stack: error.handlingStack,
              type: error.type,
              handling: error.handling,
            },
            type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
              .ERROR,
          };
          var inForeground = foregroundContexts.isInForegroundAt(
            error.startClocks.relative
          );
          if (inForeground !== undefined) {
            rawRumEvent.view = { in_foreground: inForeground };
          }
          return {
            rawRumEvent: rawRumEvent,
            startTime: error.startClocks.relative,
            domainContext: {
              error: error.originalError,
            },
          };
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/longTask/longTaskCollection.ts":
      /*!*********************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/longTask/longTaskCollection.ts ***!
  \*********************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startLongTaskCollection: function () {
            return /* binding */ startLongTaskCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        function startLongTaskCollection(lifeCycle, session) {
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (entry.entryType !== "longtask" || session.hasLitePlan()) {
                return;
              }
              var startClocks = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.relativeToClocks)(
                entry.startTime
              );
              var rawRumEvent = {
                date: startClocks.timeStamp,
                long_task: {
                  id: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.generateUUID)(),
                  duration: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.toServerDuration)(
                    entry.duration
                  ),
                },
                type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__
                  .RumEventType.LONG_TASK,
              };
              lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
                  .RAW_RUM_EVENT_COLLECTED,
                {
                  rawRumEvent: rawRumEvent,
                  startTime: startClocks.relative,
                  domainContext: { performanceEntry: entry.toJSON() },
                }
              );
            }
          );
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/resource/matchRequestTiming.ts":
      /*!*********************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/resource/matchRequestTiming.ts ***!
  \*********************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ matchRequestTiming: function () {
            return /* binding */ matchRequestTiming;
          },
          /* harmony export */
        });
        /* harmony import */ var _resourceUtils__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./resourceUtils */ "../rum-core/src/domain/rumEventsCollection/resource/resourceUtils.ts"
          );

        /**
         * Look for corresponding timing in resource timing buffer
         *
         * Observations:
         * - Timing (start, end) are nested inside the request (start, end)
         * - Some timing can be not exactly nested, being off by < 1 ms
         * - Browsers generate a timing entry for OPTIONS request
         *
         * Strategy:
         * - from valid nested entries (with 1 ms error margin)
         * - if a single timing match, return the timing
         * - if two following timings match (OPTIONS request), return the timing for the actual request
         * - otherwise we can't decide, return undefined
         */
        function matchRequestTiming(request) {
          if (!performance || !("getEntriesByName" in performance)) {
            return;
          }
          var sameNameEntries = performance.getEntriesByName(
            request.url,
            "resource"
          );
          if (!sameNameEntries.length || !("toJSON" in sameNameEntries[0])) {
            return;
          }
          var candidates = sameNameEntries
            .map(function (entry) {
              return entry.toJSON();
            })
            .filter(_resourceUtils__WEBPACK_IMPORTED_MODULE_0__.toValidEntry)
            .filter(function (entry) {
              return isBetween(
                entry,
                request.startClocks.relative,
                endTime({
                  startTime: request.startClocks.relative,
                  duration: request.duration,
                })
              );
            });
          if (candidates.length === 1) {
            return candidates[0];
          }
          if (candidates.length === 2 && firstCanBeOptionRequest(candidates)) {
            return candidates[1];
          }
          return;
        }
        function firstCanBeOptionRequest(correspondingEntries) {
          return (
            endTime(correspondingEntries[0]) <=
            correspondingEntries[1].startTime
          );
        }
        function endTime(timing) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          return timing.startTime + timing.duration;
        }
        function isBetween(timing, start, end) {
          var errorMargin = 1;
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          return (
            timing.startTime >= start - errorMargin &&
            endTime(timing) <= end + errorMargin
          );
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/resource/resourceCollection.ts":
      /*!*********************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/resource/resourceCollection.ts ***!
  \*********************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startResourceCollection: function () {
            return /* binding */ startResourceCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _browser_performanceCollection__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../../browser/performanceCollection */ "../rum-core/src/browser/performanceCollection.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _matchRequestTiming__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./matchRequestTiming */ "../rum-core/src/domain/rumEventsCollection/resource/matchRequestTiming.ts"
          );
        /* harmony import */ var _resourceUtils__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./resourceUtils */ "../rum-core/src/domain/rumEventsCollection/resource/resourceUtils.ts"
          );

        function startResourceCollection(lifeCycle) {
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_3__.LifeCycleEventType
              .REQUEST_COMPLETED,
            function (request) {
              lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_3__.LifeCycleEventType
                  .RAW_RUM_EVENT_COLLECTED,
                processRequest(request)
              );
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_3__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (
                entry.entryType === "resource" &&
                !(0, _resourceUtils__WEBPACK_IMPORTED_MODULE_5__.isRequestKind)(
                  entry
                )
              ) {
                lifeCycle.notify(
                  _lifeCycle__WEBPACK_IMPORTED_MODULE_3__.LifeCycleEventType
                    .RAW_RUM_EVENT_COLLECTED,
                  processResourceEntry(entry)
                );
              }
            }
          );
        }
        function processRequest(request) {
          var type =
            request.type ===
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.RequestType.XHR
              ? _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.ResourceType
                  .XHR
              : _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.ResourceType
                  .FETCH;
          var matchingTiming = (0,
          _matchRequestTiming__WEBPACK_IMPORTED_MODULE_4__.matchRequestTiming)(
            request
          );
          var startClocks = matchingTiming
            ? (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.relativeToClocks)(
                matchingTiming.startTime
              )
            : request.startClocks;
          var correspondingTimingOverrides = matchingTiming
            ? computePerformanceEntryMetrics(matchingTiming)
            : undefined;
          var tracingInfo = computeRequestTracingInfo(request);
          var resourceEvent = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.combine)(
            {
              date: startClocks.timeStamp,
              resource: {
                id: (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.generateUUID)(),
                type: type,
                duration: (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.toServerDuration)(
                  request.duration
                ),
                method: request.method,
                status_code: request.status,
                url: request.url,
              },
              type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_2__.RumEventType
                .RESOURCE,
            },
            tracingInfo,
            correspondingTimingOverrides
          );
          return {
            startTime: startClocks.relative,
            rawRumEvent: resourceEvent,
            domainContext: {
              performanceEntry:
                matchingTiming &&
                toPerformanceEntryRepresentation(matchingTiming),
              xhr: request.xhr,
              response: request.response,
              requestInput: request.input,
              requestInit: request.init,
              error: request.error,
            },
          };
        }
        function processResourceEntry(entry) {
          var type = (0,
          _resourceUtils__WEBPACK_IMPORTED_MODULE_5__.computeResourceKind)(
            entry
          );
          var entryMetrics = computePerformanceEntryMetrics(entry);
          var tracingInfo = computeEntryTracingInfo(entry);
          var startClocks = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.relativeToClocks)(
            entry.startTime
          );
          var resourceEvent = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.combine)(
            {
              date: startClocks.timeStamp,
              resource: {
                id: (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.generateUUID)(),
                type: type,
                url: entry.name,
              },
              type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_2__.RumEventType
                .RESOURCE,
            },
            tracingInfo,
            entryMetrics
          );
          return {
            startTime: startClocks.relative,
            rawRumEvent: resourceEvent,
            domainContext: {
              performanceEntry: toPerformanceEntryRepresentation(entry),
            },
          };
        }
        function computePerformanceEntryMetrics(timing) {
          return {
            resource: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              {
                duration: (0,
                _resourceUtils__WEBPACK_IMPORTED_MODULE_5__.computePerformanceResourceDuration)(
                  timing
                ),
                size: (0,
                _resourceUtils__WEBPACK_IMPORTED_MODULE_5__.computeSize)(
                  timing
                ),
              },
              (0,
              _resourceUtils__WEBPACK_IMPORTED_MODULE_5__.computePerformanceResourceDetails)(
                timing
              )
            ),
          };
        }
        function computeRequestTracingInfo(request) {
          var hasBeenTraced = request.traceId && request.spanId;
          if (!hasBeenTraced) {
            return undefined;
          }
          return {
            _dd: {
              span_id: request.spanId.toDecimalString(),
              trace_id: request.traceId.toDecimalString(),
            },
          };
        }
        function computeEntryTracingInfo(entry) {
          return entry.traceId
            ? { _dd: { trace_id: entry.traceId } }
            : undefined;
        }
        function toPerformanceEntryRepresentation(entry) {
          if (
            (0,
            _browser_performanceCollection__WEBPACK_IMPORTED_MODULE_1__.supportPerformanceEntry)() &&
            entry instanceof PerformanceEntry
          ) {
            entry.toJSON();
          }
          return entry;
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/resource/resourceUtils.ts":
      /*!****************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/resource/resourceUtils.ts ***!
  \****************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ FAKE_INITIAL_DOCUMENT: function () {
            return /* binding */ FAKE_INITIAL_DOCUMENT;
          },
          /* harmony export */ computeResourceKind: function () {
            return /* binding */ computeResourceKind;
          },
          /* harmony export */ isRequestKind: function () {
            return /* binding */ isRequestKind;
          },
          /* harmony export */ computePerformanceResourceDuration: function () {
            return /* binding */ computePerformanceResourceDuration;
          },
          /* harmony export */ computePerformanceResourceDetails: function () {
            return /* binding */ computePerformanceResourceDetails;
          },
          /* harmony export */ toValidEntry: function () {
            return /* binding */ toValidEntry;
          },
          /* harmony export */ computeSize: function () {
            return /* binding */ computeSize;
          },
          /* harmony export */ isAllowedRequestUrl: function () {
            return /* binding */ isAllowedRequestUrl;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/urlPolyfill.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );

        var FAKE_INITIAL_DOCUMENT = "initial_document";
        var RESOURCE_TYPES = [
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
              .DOCUMENT,
            function (initiatorType) {
              return FAKE_INITIAL_DOCUMENT === initiatorType;
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType.XHR,
            function (initiatorType) {
              return "xmlhttprequest" === initiatorType;
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
              .FETCH,
            function (initiatorType) {
              return "fetch" === initiatorType;
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
              .BEACON,
            function (initiatorType) {
              return "beacon" === initiatorType;
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType.CSS,
            function (_, path) {
              return /\.css$/i.test(path);
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType.JS,
            function (_, path) {
              return /\.js$/i.test(path);
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
              .IMAGE,
            function (initiatorType, path) {
              return (
                (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.includes)(
                  ["image", "img", "icon"],
                  initiatorType
                ) || /\.(gif|jpg|jpeg|tiff|png|svg|ico)$/i.exec(path) !== null
              );
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
              .FONT,
            function (_, path) {
              return /\.(woff|eot|woff2|ttf)$/i.exec(path) !== null;
            },
          ],
          [
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
              .MEDIA,
            function (initiatorType, path) {
              return (
                (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.includes)(
                  ["audio", "video"],
                  initiatorType
                ) || /\.(mp3|mp4)$/i.exec(path) !== null
              );
            },
          ],
        ];
        function computeResourceKind(timing) {
          var url = timing.name;
          if (
            !(0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.isValidUrl)(
              url
            )
          ) {
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.addMonitoringMessage)(
              'Failed to construct URL for "' + timing.name + '"'
            );
            return _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__
              .ResourceType.OTHER;
          }
          var path = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.getPathName)(url);
          for (
            var _i = 0, RESOURCE_TYPES_1 = RESOURCE_TYPES;
            _i < RESOURCE_TYPES_1.length;
            _i++
          ) {
            var _a = RESOURCE_TYPES_1[_i],
              type = _a[0],
              isType = _a[1];
            if (isType(timing.initiatorType, path)) {
              return type;
            }
          }
          return _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.ResourceType
            .OTHER;
        }
        function areInOrder() {
          var numbers = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            numbers[_i] = arguments[_i];
          }
          for (var i = 1; i < numbers.length; i += 1) {
            if (numbers[i - 1] > numbers[i]) {
              return false;
            }
          }
          return true;
        }
        function isRequestKind(timing) {
          return (
            timing.initiatorType === "xmlhttprequest" ||
            timing.initiatorType === "fetch"
          );
        }
        function computePerformanceResourceDuration(entry) {
          var duration = entry.duration,
            startTime = entry.startTime,
            responseEnd = entry.responseEnd;
          // Safari duration is always 0 on timings blocked by cross origin policies.
          if (duration === 0 && startTime < responseEnd) {
            return (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.toServerDuration)(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.elapsed)(
                startTime,
                responseEnd
              )
            );
          }
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.toServerDuration)(
            duration
          );
        }
        function computePerformanceResourceDetails(entry) {
          var validEntry = toValidEntry(entry);
          if (!validEntry) {
            return undefined;
          }
          var startTime = validEntry.startTime,
            fetchStart = validEntry.fetchStart,
            redirectStart = validEntry.redirectStart,
            redirectEnd = validEntry.redirectEnd,
            domainLookupStart = validEntry.domainLookupStart,
            domainLookupEnd = validEntry.domainLookupEnd,
            connectStart = validEntry.connectStart,
            secureConnectionStart = validEntry.secureConnectionStart,
            connectEnd = validEntry.connectEnd,
            requestStart = validEntry.requestStart,
            responseStart = validEntry.responseStart,
            responseEnd = validEntry.responseEnd;
          var details = {
            download: formatTiming(startTime, responseStart, responseEnd),
            first_byte: formatTiming(startTime, requestStart, responseStart),
          };
          // Make sure a connection occurred
          if (connectEnd !== fetchStart) {
            details.connect = formatTiming(startTime, connectStart, connectEnd);
            // Make sure a secure connection occurred
            if (areInOrder(connectStart, secureConnectionStart, connectEnd)) {
              details.ssl = formatTiming(
                startTime,
                secureConnectionStart,
                connectEnd
              );
            }
          }
          // Make sure a domain lookup occurred
          if (domainLookupEnd !== fetchStart) {
            details.dns = formatTiming(
              startTime,
              domainLookupStart,
              domainLookupEnd
            );
          }
          if (hasRedirection(entry)) {
            details.redirect = formatTiming(
              startTime,
              redirectStart,
              redirectEnd
            );
          }
          return details;
        }
        function toValidEntry(entry) {
          // Ensure timings are in the right order. On top of filtering out potential invalid
          // RumPerformanceResourceTiming, it will ignore entries from requests where timings cannot be
          // collected, for example cross origin requests without a "Timing-Allow-Origin" header allowing
          // it.
          if (
            !areInOrder(
              entry.startTime,
              entry.fetchStart,
              entry.domainLookupStart,
              entry.domainLookupEnd,
              entry.connectStart,
              entry.connectEnd,
              entry.requestStart,
              entry.responseStart,
              entry.responseEnd
            )
          ) {
            return undefined;
          }
          if (!hasRedirection(entry)) {
            return entry;
          }
          var redirectStart = entry.redirectStart,
            redirectEnd = entry.redirectEnd;
          // Firefox doesn't provide redirect timings on cross origin requests.
          // Provide a default for those.
          if (redirectStart < entry.startTime) {
            redirectStart = entry.startTime;
          }
          if (redirectEnd < entry.startTime) {
            redirectEnd = entry.fetchStart;
          }
          // Make sure redirect timings are in order
          if (
            !areInOrder(
              entry.startTime,
              redirectStart,
              redirectEnd,
              entry.fetchStart
            )
          ) {
            return undefined;
          }
          return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, entry),
            { redirectEnd: redirectEnd, redirectStart: redirectStart }
          );
        }
        function hasRedirection(entry) {
          // The only time fetchStart is different than startTime is if a redirection occurred.
          return entry.fetchStart !== entry.startTime;
        }
        function formatTiming(origin, start, end) {
          return {
            duration: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.toServerDuration)(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.elapsed)(
                start,
                end
              )
            ),
            start: (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.toServerDuration)(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.elapsed)(
                origin,
                start
              )
            ),
          };
        }
        function computeSize(entry) {
          // Make sure a request actually occurred
          if (entry.startTime < entry.responseStart) {
            return entry.decodedBodySize;
          }
          return undefined;
        }
        function isAllowedRequestUrl(configuration, url) {
          return url && !configuration.isIntakeUrl(url);
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/view/trackFirstHidden.ts":
      /*!***************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/view/trackFirstHidden.ts ***!
  \***************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ trackFirstHidden: function () {
            return /* binding */ trackFirstHidden;
          },
          /* harmony export */ resetFirstHidden: function () {
            return /* binding */ resetFirstHidden;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );

        var trackFirstHiddenSingleton;
        var stopListeners;
        function trackFirstHidden(emitter) {
          if (emitter === void 0) {
            emitter = window;
          }
          if (!trackFirstHiddenSingleton) {
            if (document.visibilityState === "hidden") {
              trackFirstHiddenSingleton = { timeStamp: 0 };
            } else {
              trackFirstHiddenSingleton = {
                timeStamp: Infinity,
              };
              stopListeners = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.addEventListener)(
                emitter,
                "pagehide" /* PAGE_HIDE */,
                function (_a) {
                  var timeStamp = _a.timeStamp;
                  trackFirstHiddenSingleton.timeStamp = timeStamp;
                },
                { capture: true, once: true }
              ).stop;
            }
          }
          return trackFirstHiddenSingleton;
        }
        function resetFirstHidden() {
          if (stopListeners) {
            stopListeners();
          }
          trackFirstHiddenSingleton = undefined;
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/view/trackInitialViewTimings.ts":
      /*!**********************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/view/trackInitialViewTimings.ts ***!
  \**********************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ TIMING_MAXIMUM_DELAY: function () {
            return /* binding */ TIMING_MAXIMUM_DELAY;
          },
          /* harmony export */ trackInitialViewTimings: function () {
            return /* binding */ trackInitialViewTimings;
          },
          /* harmony export */ trackNavigationTimings: function () {
            return /* binding */ trackNavigationTimings;
          },
          /* harmony export */ trackFirstContentfulPaintTiming: function () {
            return /* binding */ trackFirstContentfulPaintTiming;
          },
          /* harmony export */ trackLargestContentfulPaintTiming: function () {
            return /* binding */ trackLargestContentfulPaintTiming;
          },
          /* harmony export */ trackFirstInputTimings: function () {
            return /* binding */ trackFirstInputTimings;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _trackFirstHidden__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./trackFirstHidden */ "../rum-core/src/domain/rumEventsCollection/view/trackFirstHidden.ts"
          );

        // Discard LCP and FCP timings above a certain delay to avoid incorrect data
        // It happens in some cases like sleep mode or some browser implementations
        var TIMING_MAXIMUM_DELAY =
          10 * _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.ONE_MINUTE;
        function trackInitialViewTimings(lifeCycle, callback) {
          var timings;
          function setTimings(newTimings) {
            timings = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, timings),
              newTimings
            );
            callback(timings);
          }
          var stopNavigationTracking = trackNavigationTimings(
            lifeCycle,
            setTimings
          ).stop;
          var stopFCPTracking = trackFirstContentfulPaintTiming(
            lifeCycle,
            function (firstContentfulPaint) {
              return setTimings({ firstContentfulPaint: firstContentfulPaint });
            }
          ).stop;
          var stopLCPTracking = trackLargestContentfulPaintTiming(
            lifeCycle,
            window,
            function (largestContentfulPaint) {
              setTimings({
                largestContentfulPaint: largestContentfulPaint,
              });
            }
          ).stop;
          var stopFIDTracking = trackFirstInputTimings(
            lifeCycle,
            function (_a) {
              var firstInputDelay = _a.firstInputDelay,
                firstInputTime = _a.firstInputTime;
              setTimings({
                firstInputDelay: firstInputDelay,
                firstInputTime: firstInputTime,
              });
            }
          ).stop;
          return {
            stop: function () {
              stopNavigationTracking();
              stopFCPTracking();
              stopLCPTracking();
              stopFIDTracking();
            },
          };
        }
        function trackNavigationTimings(lifeCycle, callback) {
          var stop = lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (entry.entryType === "navigation") {
                callback({
                  domComplete: entry.domComplete,
                  domContentLoaded: entry.domContentLoadedEventEnd,
                  domInteractive: entry.domInteractive,
                  loadEvent: entry.loadEventEnd,
                });
              }
            }
          ).unsubscribe;
          return { stop: stop };
        }
        function trackFirstContentfulPaintTiming(lifeCycle, callback) {
          var firstHidden = (0,
          _trackFirstHidden__WEBPACK_IMPORTED_MODULE_2__.trackFirstHidden)();
          var stop = lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (
                entry.entryType === "paint" &&
                entry.name === "first-contentful-paint" &&
                entry.startTime < firstHidden.timeStamp &&
                entry.startTime < TIMING_MAXIMUM_DELAY
              ) {
                callback(entry.startTime);
              }
            }
          ).unsubscribe;
          return { stop: stop };
        }
        /**
         * Track the largest contentful paint (LCP) occurring during the initial View.  This can yield
         * multiple values, only the most recent one should be used.
         * Documentation: https://web.dev/lcp/
         * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts
         */
        function trackLargestContentfulPaintTiming(
          lifeCycle,
          emitter,
          callback
        ) {
          var firstHidden = (0,
          _trackFirstHidden__WEBPACK_IMPORTED_MODULE_2__.trackFirstHidden)();
          // Ignore entries that come after the first user interaction.  According to the documentation, the
          // browser should not send largest-contentful-paint entries after a user interact with the page,
          // but the web-vitals reference implementation uses this as a safeguard.
          var firstInteractionTimestamp = Infinity;
          var stopEventListener = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.addEventListeners)(
            emitter,
            ["pointerdown" /* POINTER_DOWN */, "keydown" /* KEY_DOWN */],
            function (event) {
              firstInteractionTimestamp = event.timeStamp;
            },
            { capture: true, once: true }
          ).stop;
          var unsubscribeLifeCycle = lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (
                entry.entryType === "largest-contentful-paint" &&
                entry.startTime < firstInteractionTimestamp &&
                entry.startTime < firstHidden.timeStamp &&
                entry.startTime < TIMING_MAXIMUM_DELAY
              ) {
                callback(entry.startTime);
              }
            }
          ).unsubscribe;
          return {
            stop: function () {
              stopEventListener();
              unsubscribeLifeCycle();
            },
          };
        }
        /**
         * Track the first input occurring during the initial View to return:
         * - First Input Delay
         * - First Input Time
         * Callback is called at most one time.
         * Documentation: https://web.dev/fid/
         * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts
         */
        function trackFirstInputTimings(lifeCycle, callback) {
          var firstHidden = (0,
          _trackFirstHidden__WEBPACK_IMPORTED_MODULE_2__.trackFirstHidden)();
          var stop = lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (
                entry.entryType === "first-input" &&
                entry.startTime < firstHidden.timeStamp
              ) {
                var firstInputDelay = (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.elapsed)(
                  entry.startTime,
                  entry.processingStart
                );
                callback({
                  // Ensure firstInputDelay to be positive, see
                  // https://bugs.chromium.org/p/chromium/issues/detail?id=1185815
                  firstInputDelay: firstInputDelay >= 0 ? firstInputDelay : 0,
                  firstInputTime: entry.startTime,
                });
              }
            }
          ).unsubscribe;
          return {
            stop: stop,
          };
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/view/trackViewMetrics.ts":
      /*!***************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/view/trackViewMetrics.ts ***!
  \***************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ trackViewMetrics: function () {
            return /* binding */ trackViewMetrics;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _browser_performanceCollection__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../../browser/performanceCollection */ "../rum-core/src/browser/performanceCollection.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _trackEventCounts__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../../trackEventCounts */ "../rum-core/src/domain/trackEventCounts.ts"
          );
        /* harmony import */ var _waitIdlePage__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../../waitIdlePage */ "../rum-core/src/domain/waitIdlePage.ts"
          );

        function trackViewMetrics(
          lifeCycle,
          domMutationObservable,
          scheduleViewUpdate,
          loadingType
        ) {
          var viewMetrics = {
            eventCounts: {
              errorCount: 0,
              longTaskCount: 0,
              resourceCount: 0,
              userActionCount: 0,
            },
          };
          var stopEventCountsTracking = (0,
          _trackEventCounts__WEBPACK_IMPORTED_MODULE_3__.trackEventCounts)(
            lifeCycle,
            function (newEventCounts) {
              viewMetrics.eventCounts = newEventCounts;
              scheduleViewUpdate();
            }
          ).stop;
          var _a = trackLoadingTime(loadingType, function (newLoadingTime) {
              viewMetrics.loadingTime = newLoadingTime;
              scheduleViewUpdate();
            }),
            setActivityLoadingTime = _a.setActivityLoadingTime,
            setLoadEvent = _a.setLoadEvent;
          var stopActivityLoadingTimeTracking = trackActivityLoadingTime(
            lifeCycle,
            domMutationObservable,
            setActivityLoadingTime
          ).stop;
          var stopCLSTracking;
          if (isLayoutShiftSupported()) {
            viewMetrics.cumulativeLayoutShift = 0;
            stopCLSTracking = trackCumulativeLayoutShift(
              lifeCycle,
              function (cumulativeLayoutShift) {
                viewMetrics.cumulativeLayoutShift = cumulativeLayoutShift;
                scheduleViewUpdate();
              }
            ).stop;
          } else {
            stopCLSTracking =
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.noop;
          }
          return {
            stop: function () {
              stopEventCountsTracking();
              stopActivityLoadingTimeTracking();
              stopCLSTracking();
            },
            setLoadEvent: setLoadEvent,
            viewMetrics: viewMetrics,
          };
        }
        function trackLoadingTime(loadType, callback) {
          var isWaitingForLoadEvent =
            loadType ===
            _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.ViewLoadingType
              .INITIAL_LOAD;
          var isWaitingForActivityLoadingTime = true;
          var loadingTimeCandidates = [];
          function invokeCallbackIfAllCandidatesAreReceived() {
            if (
              !isWaitingForActivityLoadingTime &&
              !isWaitingForLoadEvent &&
              loadingTimeCandidates.length > 0
            ) {
              callback(Math.max.apply(Math, loadingTimeCandidates));
            }
          }
          return {
            setLoadEvent: function (loadEvent) {
              if (isWaitingForLoadEvent) {
                isWaitingForLoadEvent = false;
                loadingTimeCandidates.push(loadEvent);
                invokeCallbackIfAllCandidatesAreReceived();
              }
            },
            setActivityLoadingTime: function (activityLoadingTime) {
              if (isWaitingForActivityLoadingTime) {
                isWaitingForActivityLoadingTime = false;
                if (activityLoadingTime !== undefined) {
                  loadingTimeCandidates.push(activityLoadingTime);
                }
                invokeCallbackIfAllCandidatesAreReceived();
              }
            },
          };
        }
        function trackActivityLoadingTime(
          lifeCycle,
          domMutationObservable,
          callback
        ) {
          return (0, _waitIdlePage__WEBPACK_IMPORTED_MODULE_4__.waitIdlePage)(
            lifeCycle,
            domMutationObservable,
            function (event) {
              if (event.hadActivity) {
                callback(event.duration);
              } else {
                callback(undefined);
              }
            }
          );
        }
        /**
         * Track the cumulative layout shifts (CLS).
         * Layout shifts are grouped into session windows.
         * The minimum gap between session windows is 1 second.
         * The maximum duration of a session window is 5 second.
         * The session window layout shift value is the sum of layout shifts inside it.
         * The CLS value is the max of session windows values.
         *
         * This yields a new value whenever the CLS value is updated (a higher session window value is computed).
         *
         * See isLayoutShiftSupported to check for browser support.
         *
         * Documentation:
         * https://web.dev/cls/
         * https://web.dev/evolving-cls/
         * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts
         */
        function trackCumulativeLayoutShift(lifeCycle, callback) {
          var maxClsValue = 0;
          var window = slidingSessionWindow();
          var stop = lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
              .PERFORMANCE_ENTRY_COLLECTED,
            function (entry) {
              if (entry.entryType === "layout-shift" && !entry.hadRecentInput) {
                window.update(entry);
                if (window.value() > maxClsValue) {
                  maxClsValue = window.value();
                  callback(
                    (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.round)(
                      maxClsValue,
                      4
                    )
                  );
                }
              }
            }
          ).unsubscribe;
          return {
            stop: stop,
          };
        }
        function slidingSessionWindow() {
          var value = 0;
          var startTime;
          var endTime;
          return {
            update: function (entry) {
              var shouldCreateNewWindow =
                startTime === undefined ||
                entry.startTime - endTime >=
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.ONE_SECOND ||
                entry.startTime - startTime >=
                  5 *
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.ONE_SECOND;
              if (shouldCreateNewWindow) {
                startTime = endTime = entry.startTime;
                value = entry.value;
              } else {
                value += entry.value;
                endTime = entry.startTime;
              }
            },
            value: function () {
              return value;
            },
          };
        }
        /**
         * Check whether `layout-shift` is supported by the browser.
         */
        function isLayoutShiftSupported() {
          return (0,
          _browser_performanceCollection__WEBPACK_IMPORTED_MODULE_0__.supportPerformanceTimingEvent)(
            "layout-shift"
          );
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/view/trackViews.ts":
      /*!*********************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/view/trackViews.ts ***!
  \*********************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ THROTTLE_VIEW_UPDATE_PERIOD: function () {
            return /* binding */ THROTTLE_VIEW_UPDATE_PERIOD;
          },
          /* harmony export */ SESSION_KEEP_ALIVE_INTERVAL: function () {
            return /* binding */ SESSION_KEEP_ALIVE_INTERVAL;
          },
          /* harmony export */ trackViews: function () {
            return /* binding */ trackViews;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _trackInitialViewTimings__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./trackInitialViewTimings */ "../rum-core/src/domain/rumEventsCollection/view/trackInitialViewTimings.ts"
          );
        /* harmony import */ var _trackViewMetrics__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./trackViewMetrics */ "../rum-core/src/domain/rumEventsCollection/view/trackViewMetrics.ts"
          );

        var THROTTLE_VIEW_UPDATE_PERIOD = 3000;
        var SESSION_KEEP_ALIVE_INTERVAL =
          5 * _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.ONE_MINUTE;
        function trackViews(
          location,
          lifeCycle,
          domMutationObservable,
          locationChangeObservable,
          areViewsTrackedAutomatically,
          initialViewName
        ) {
          var _a = trackInitialView(initialViewName),
            stopInitialViewTracking = _a.stop,
            initialView = _a.initialView;
          var currentView = initialView;
          var stopViewLifeCycle = startViewLifeCycle().stop;
          var locationChangeSubscription;
          if (areViewsTrackedAutomatically) {
            locationChangeSubscription = renewViewOnLocationChange(
              locationChangeObservable
            );
          }
          function trackInitialView(name) {
            var initialView = newView(
              lifeCycle,
              domMutationObservable,
              location,
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.ViewLoadingType
                .INITIAL_LOAD,
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.clocksOrigin)(),
              name
            );
            var stop = (0,
            _trackInitialViewTimings__WEBPACK_IMPORTED_MODULE_3__.trackInitialViewTimings)(
              lifeCycle,
              function (timings) {
                initialView.updateTimings(timings);
                initialView.scheduleUpdate();
              }
            ).stop;
            return { initialView: initialView, stop: stop };
          }
          function trackViewChange(startClocks, name) {
            return newView(
              lifeCycle,
              domMutationObservable,
              location,
              _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.ViewLoadingType
                .ROUTE_CHANGE,
              startClocks,
              name
            );
          }
          function startViewLifeCycle() {
            lifeCycle.subscribe(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                .SESSION_RENEWED,
              function () {
                // do not trigger view update to avoid wrong data
                currentView.end();
                // Renew view on session renewal
                currentView = trackViewChange(undefined, currentView.name);
              }
            );
            // End the current view on page unload
            lifeCycle.subscribe(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                .BEFORE_UNLOAD,
              function () {
                currentView.end();
                currentView.triggerUpdate();
              }
            );
            // Session keep alive
            var keepAliveInterval = window.setInterval(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.monitor)(
                function () {
                  currentView.triggerUpdate();
                }
              ),
              SESSION_KEEP_ALIVE_INTERVAL
            );
            return {
              stop: function () {
                clearInterval(keepAliveInterval);
              },
            };
          }
          function renewViewOnLocationChange(locationChangeObservable) {
            return locationChangeObservable.subscribe(function (_a) {
              var oldLocation = _a.oldLocation,
                newLocation = _a.newLocation;
              if (areDifferentLocation(oldLocation, newLocation)) {
                currentView.end();
                currentView.triggerUpdate();
                currentView = trackViewChange();
                return;
              }
            });
          }
          return {
            addTiming: function (name, time) {
              if (time === void 0) {
                time = (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.timeStampNow)();
              }
              currentView.addTiming(name, time);
              currentView.triggerUpdate();
            },
            startView: function (name, startClocks) {
              currentView.end(startClocks);
              currentView.triggerUpdate();
              currentView = trackViewChange(startClocks, name);
            },
            stop: function () {
              locationChangeSubscription === null ||
              locationChangeSubscription === void 0
                ? void 0
                : locationChangeSubscription.unsubscribe();
              stopInitialViewTracking();
              stopViewLifeCycle();
              currentView.end();
            },
          };
        }
        function newView(
          lifeCycle,
          domMutationObservable,
          initialLocation,
          loadingType,
          startClocks,
          name
        ) {
          if (startClocks === void 0) {
            startClocks = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.clocksNow)();
          }
          // Setup initial values
          var id = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.generateUUID)();
          var timings = {};
          var customTimings = {};
          var documentVersion = 0;
          var endClocks;
          var location = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            {},
            initialLocation
          );
          lifeCycle.notify(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
              .VIEW_CREATED,
            { id: id, name: name, startClocks: startClocks }
          );
          // Update the view every time the measures are changing
          var _a = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.throttle)(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.monitor)(
                triggerViewUpdate
              ),
              THROTTLE_VIEW_UPDATE_PERIOD,
              {
                leading: false,
              }
            ),
            scheduleViewUpdate = _a.throttled,
            cancelScheduleViewUpdate = _a.cancel;
          var _b = (0,
            _trackViewMetrics__WEBPACK_IMPORTED_MODULE_4__.trackViewMetrics)(
              lifeCycle,
              domMutationObservable,
              scheduleViewUpdate,
              loadingType
            ),
            setLoadEvent = _b.setLoadEvent,
            stopViewMetricsTracking = _b.stop,
            viewMetrics = _b.viewMetrics;
          // Initial view update
          triggerViewUpdate();
          function triggerViewUpdate() {
            documentVersion += 1;
            var currentEnd =
              endClocks === undefined
                ? (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.timeStampNow)()
                : endClocks.timeStamp;
            lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                .VIEW_UPDATED,
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {},
                  viewMetrics
                ),
                {
                  customTimings: customTimings,
                  documentVersion: documentVersion,
                  id: id,
                  name: name,
                  loadingType: loadingType,
                  location: location,
                  startClocks: startClocks,
                  timings: timings,
                  duration: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.elapsed)(
                    startClocks.timeStamp,
                    currentEnd
                  ),
                  isActive: endClocks === undefined,
                }
              )
            );
          }
          return {
            name: name,
            scheduleUpdate: scheduleViewUpdate,
            end: function (clocks) {
              if (clocks === void 0) {
                clocks = (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.clocksNow)();
              }
              endClocks = clocks;
              stopViewMetricsTracking();
              lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType
                  .VIEW_ENDED,
                { endClocks: endClocks }
              );
            },
            triggerUpdate: function () {
              // cancel any pending view updates execution
              cancelScheduleViewUpdate();
              triggerViewUpdate();
            },
            updateTimings: function (newTimings) {
              timings = newTimings;
              if (newTimings.loadEvent !== undefined) {
                setLoadEvent(newTimings.loadEvent);
              }
            },
            addTiming: function (name, time) {
              var relativeTime = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.looksLikeRelativeTime)(
                time
              )
                ? time
                : (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_6__.elapsed)(
                    startClocks.timeStamp,
                    time
                  );
              customTimings[sanitizeTiming(name)] = relativeTime;
            },
          };
        }
        /**
         * Timing name is used as facet path that must contain only letters, digits, or the characters - _ . @ $
         */
        function sanitizeTiming(name) {
          var sanitized = name.replace(/[^a-zA-Z0-9-_.@$]/g, "_");
          if (sanitized !== name) {
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.display.warn(
              "Invalid timing name: " + name + ", sanitized to: " + sanitized
            );
          }
          return sanitized;
        }
        function areDifferentLocation(currentLocation, otherLocation) {
          return (
            currentLocation.pathname !== otherLocation.pathname ||
            (!isHashAnAnchor(otherLocation.hash) &&
              getPathFromHash(otherLocation.hash) !==
                getPathFromHash(currentLocation.hash))
          );
        }
        function isHashAnAnchor(hash) {
          var correspondingId = hash.substr(1);
          return !!document.getElementById(correspondingId);
        }
        function getPathFromHash(hash) {
          var index = hash.indexOf("?");
          return index < 0 ? hash : hash.slice(0, index);
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumEventsCollection/view/viewCollection.ts":
      /*!*************************************************************************!*\
  !*** ../rum-core/src/domain/rumEventsCollection/view/viewCollection.ts ***!
  \*************************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startViewCollection: function () {
            return /* binding */ startViewCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../../../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _trackViews__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./trackViews */ "../rum-core/src/domain/rumEventsCollection/view/trackViews.ts"
          );

        function startViewCollection(
          lifeCycle,
          configuration,
          location,
          domMutationObservable,
          locationChangeObservable,
          foregroundContexts,
          recorderApi,
          initialViewName
        ) {
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .VIEW_UPDATED,
            function (view) {
              return lifeCycle.notify(
                _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
                  .RAW_RUM_EVENT_COLLECTED,
                processViewUpdate(view, foregroundContexts, recorderApi)
              );
            }
          );
          return (0, _trackViews__WEBPACK_IMPORTED_MODULE_2__.trackViews)(
            location,
            lifeCycle,
            domMutationObservable,
            locationChangeObservable,
            !configuration.trackViewsManually,
            initialViewName
          );
        }
        function processViewUpdate(view, foregroundContexts, recorderApi) {
          var replayStats = recorderApi.getReplayStats(view.id);
          var viewEvent = {
            _dd: {
              document_version: view.documentVersion,
              replay_stats: replayStats,
            },
            date: view.startClocks.timeStamp,
            type: _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__.RumEventType
              .VIEW,
            view: {
              action: {
                count: view.eventCounts.userActionCount,
              },
              cumulative_layout_shift: view.cumulativeLayoutShift,
              dom_complete: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.domComplete
              ),
              dom_content_loaded: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.domContentLoaded
              ),
              dom_interactive: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.domInteractive
              ),
              error: {
                count: view.eventCounts.errorCount,
              },
              first_contentful_paint: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.firstContentfulPaint
              ),
              first_input_delay: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.firstInputDelay
              ),
              first_input_time: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.firstInputTime
              ),
              is_active: view.isActive,
              name: view.name,
              largest_contentful_paint: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.largestContentfulPaint
              ),
              load_event: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.timings.loadEvent
              ),
              loading_time: discardNegativeDuration(
                (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                  view.loadingTime
                )
              ),
              loading_type: view.loadingType,
              long_task: {
                count: view.eventCounts.longTaskCount,
              },
              resource: {
                count: view.eventCounts.resourceCount,
              },
              time_spent: (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration)(
                view.duration
              ),
              in_foreground_periods:
                foregroundContexts.selectInForegroundPeriodsFor(
                  view.startClocks.relative,
                  view.duration
                ),
            },
            session: {
              has_replay: replayStats ? true : undefined,
            },
          };
          if (
            !(0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.isEmptyObject)(
              view.customTimings
            )
          ) {
            viewEvent.view.custom_timings = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.mapValues)(
              view.customTimings,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.toServerDuration
            );
          }
          return {
            rawRumEvent: viewEvent,
            startTime: view.startClocks.relative,
            domainContext: {
              location: view.location,
            },
          };
        }
        function discardNegativeDuration(duration) {
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.isNumber)(
            duration
          ) && duration < 0
            ? undefined
            : duration;
        }

        /***/
      },

    /***/ "../rum-core/src/domain/rumSession.ts":
      /*!********************************************!*\
  !*** ../rum-core/src/domain/rumSession.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ RUM_SESSION_KEY: function () {
            return /* binding */ RUM_SESSION_KEY;
          },
          /* harmony export */ RumSessionPlan: function () {
            return /* binding */ RumSessionPlan;
          },
          /* harmony export */ RumTrackingType: function () {
            return /* binding */ RumTrackingType;
          },
          /* harmony export */ startRumSession: function () {
            return /* binding */ startRumSession;
          },
          /* harmony export */ startRumSessionStub: function () {
            return /* binding */ startRumSessionStub;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/session/sessionManagement.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        var RUM_SESSION_KEY = "rum";
        var RumSessionPlan;
        (function (RumSessionPlan) {
          RumSessionPlan[(RumSessionPlan["LITE"] = 1)] = "LITE";
          RumSessionPlan[(RumSessionPlan["REPLAY"] = 2)] = "REPLAY";
        })(RumSessionPlan || (RumSessionPlan = {}));
        var RumTrackingType;
        (function (RumTrackingType) {
          RumTrackingType["NOT_TRACKED"] = "0";
          // Note: the "tracking type" value (stored in the session cookie) does not match the "session
          // plan" value (sent in RUM events). This is expected, and was done to keep retrocompatibility
          // with active sessions when upgrading the SDK.
          RumTrackingType["TRACKED_REPLAY"] = "1";
          RumTrackingType["TRACKED_LITE"] = "2";
        })(RumTrackingType || (RumTrackingType = {}));
        function startRumSession(configuration, lifeCycle) {
          var session = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.startSessionManagement)(
            configuration.cookieOptions,
            RUM_SESSION_KEY,
            function (rawTrackingType) {
              return computeSessionState(configuration, rawTrackingType);
            }
          );
          session.renewObservable.subscribe(function () {
            lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                .SESSION_EXPIRED
            );
            lifeCycle.notify(
              _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                .SESSION_RENEWED
            );
          });
          return {
            getId: session.getId,
            isTracked: function () {
              return isSessionTracked(session);
            },
            hasReplayPlan: function () {
              return (
                isSessionTracked(session) &&
                session.getTrackingType() === RumTrackingType.TRACKED_REPLAY
              );
            },
            hasLitePlan: function () {
              return (
                isSessionTracked(session) &&
                session.getTrackingType() === RumTrackingType.TRACKED_LITE
              );
            },
          };
        }
        /**
         * Start a tracked replay session stub
         * It needs to be a replay plan in order to get long tasks
         */
        function startRumSessionStub() {
          return {
            getId: function () {
              return "00000000-aaaa-0000-aaaa-000000000000";
            },
            isTracked: function () {
              return true;
            },
            hasReplayPlan: function () {
              return true;
            },
            hasLitePlan: function () {
              return false;
            },
          };
        }
        function isSessionTracked(session) {
          return (
            session.getId() !== undefined &&
            isTypeTracked(session.getTrackingType())
          );
        }
        function computeSessionState(configuration, rawTrackingType) {
          var trackingType;
          if (hasValidRumSession(rawTrackingType)) {
            trackingType = rawTrackingType;
          } else if (
            !(0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.performDraw)(
              configuration.sampleRate
            )
          ) {
            trackingType = RumTrackingType.NOT_TRACKED;
          } else if (
            !(0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.performDraw)(
              configuration.replaySampleRate
            )
          ) {
            trackingType = RumTrackingType.TRACKED_LITE;
          } else {
            trackingType = RumTrackingType.TRACKED_REPLAY;
          }
          return {
            trackingType: trackingType,
            isTracked: isTypeTracked(trackingType),
          };
        }
        function hasValidRumSession(trackingType) {
          return (
            trackingType === RumTrackingType.NOT_TRACKED ||
            trackingType === RumTrackingType.TRACKED_REPLAY ||
            trackingType === RumTrackingType.TRACKED_LITE
          );
        }
        function isTypeTracked(rumSessionType) {
          return (
            rumSessionType === RumTrackingType.TRACKED_LITE ||
            rumSessionType === RumTrackingType.TRACKED_REPLAY
          );
        }

        /***/
      },

    /***/ "../rum-core/src/domain/tracing/getDocumentTraceId.ts":
      /*!************************************************************!*\
  !*** ../rum-core/src/domain/tracing/getDocumentTraceId.ts ***!
  \************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD:
            function () {
              return /* binding */ INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD;
            },
          /* harmony export */ getDocumentTraceId: function () {
            return /* binding */ getDocumentTraceId;
          },
          /* harmony export */ getDocumentTraceDataFromMeta: function () {
            return /* binding */ getDocumentTraceDataFromMeta;
          },
          /* harmony export */ getDocumentTraceDataFromComment: function () {
            return /* binding */ getDocumentTraceDataFromComment;
          },
          /* harmony export */ createDocumentTraceData: function () {
            return /* binding */ createDocumentTraceData;
          },
          /* harmony export */ findTraceComment: function () {
            return /* binding */ findTraceComment;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );

        var INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD =
          2 * _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.ONE_MINUTE;
        function getDocumentTraceId(document) {
          var data =
            getDocumentTraceDataFromMeta(document) ||
            getDocumentTraceDataFromComment(document);
          if (
            !data ||
            data.traceTime <=
              Date.now() - INITIAL_DOCUMENT_OUTDATED_TRACE_ID_THRESHOLD
          ) {
            return undefined;
          }
          return data.traceId;
        }
        function getDocumentTraceDataFromMeta(document) {
          var traceIdMeta = document.querySelector("meta[name=dd-trace-id]");
          var traceTimeMeta = document.querySelector(
            "meta[name=dd-trace-time]"
          );
          return createDocumentTraceData(
            traceIdMeta && traceIdMeta.content,
            traceTimeMeta && traceTimeMeta.content
          );
        }
        function getDocumentTraceDataFromComment(document) {
          var comment = findTraceComment(document);
          if (!comment) {
            return undefined;
          }
          return createDocumentTraceData(
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.findCommaSeparatedValue)(
              comment,
              "trace-id"
            ),
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.findCommaSeparatedValue)(
              comment,
              "trace-time"
            )
          );
        }
        function createDocumentTraceData(traceId, rawTraceTime) {
          var traceTime = rawTraceTime && Number(rawTraceTime);
          if (!traceId || !traceTime) {
            return undefined;
          }
          return {
            traceId: traceId,
            traceTime: traceTime,
          };
        }
        function findTraceComment(document) {
          // 1. Try to find the comment as a direct child of the document
          // Note: TSLint advises to use a 'for of', but TS doesn't allow to use 'for of' if the iterated
          // value is not an array or string (here, a NodeList).
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (var i = 0; i < document.childNodes.length; i += 1) {
            var comment = getTraceCommentFromNode(document.childNodes[i]);
            if (comment) {
              return comment;
            }
          }
          // 2. If the comment is placed after the </html> tag, but have some space or new lines before or
          // after, the DOM parser will lift it (and the surrounding text) at the end of the <body> tag.
          // Try to look for the comment at the end of the <body> by by iterating over its child nodes in
          // reverse order, stopping if we come across a non-text node.
          if (document.body) {
            for (var i = document.body.childNodes.length - 1; i >= 0; i -= 1) {
              var node = document.body.childNodes[i];
              var comment = getTraceCommentFromNode(node);
              if (comment) {
                return comment;
              }
              if (!isTextNode(node)) {
                break;
              }
            }
          }
        }
        function getTraceCommentFromNode(node) {
          if (node && isCommentNode(node)) {
            var match = /^\s*DATADOG;(.*?)\s*$/.exec(node.data);
            if (match) {
              return match[1];
            }
          }
        }
        function isCommentNode(node) {
          return node.nodeName === "#comment";
        }
        function isTextNode(node) {
          return node.nodeName === "#text";
        }

        /***/
      },

    /***/ "../rum-core/src/domain/tracing/tracer.ts":
      /*!************************************************!*\
  !*** ../rum-core/src/domain/tracing/tracer.ts ***!
  \************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ clearTracingIfNeeded: function () {
            return /* binding */ clearTracingIfNeeded;
          },
          /* harmony export */ startTracer: function () {
            return /* binding */ startTracer;
          },
          /* harmony export */ isTracingSupported: function () {
            return /* binding */ isTracingSupported;
          },
          /* harmony export */ TraceIdentifier: function () {
            return /* binding */ TraceIdentifier;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/urlPolyfill.ts"
          );

        /**
         * Clear tracing information to avoid incomplete traces. Ideally, we should do it when the the
         * request did not reach the server, but we the browser does not expose this. So, we clear tracing
         * information if the request ended with status 0 without being aborted by the application.
         *
         * Reasoning:
         *
         * * Applications are usually aborting requests after a bit of time, for example when the user is
         * typing (autocompletion) or navigating away (in a SPA). With a performant device and good
         * network conditions, the request is likely to reach the server before being canceled.
         *
         * * Requests aborted otherwise (ex: lack of internet, CORS issue, blocked by a privacy extension)
         * are likely to finish quickly and without reaching the server.
         *
         * Of course it might not be the case every time, but it should limit having incomplete traces a
         * bit..
         * */
        function clearTracingIfNeeded(context) {
          if (context.status === 0 && !context.isAborted) {
            context.traceId = undefined;
            context.spanId = undefined;
          }
        }
        function startTracer(configuration, session) {
          return {
            clearTracingIfNeeded: clearTracingIfNeeded,
            traceFetch: function (context) {
              return injectHeadersIfTracingAllowed(
                configuration,
                context,
                session,
                function (tracingHeaders) {
                  var _a;
                  if (
                    context.input instanceof Request &&
                    !((_a = context.init) === null || _a === void 0
                      ? void 0
                      : _a.headers)
                  ) {
                    context.input = new Request(context.input);
                    Object.keys(tracingHeaders).forEach(function (key) {
                      context.input.headers.append(key, tracingHeaders[key]);
                    });
                  } else {
                    context.init = (0,
                    tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                      {},
                      context.init
                    );
                    var headers_1 = [];
                    if (context.init.headers instanceof Headers) {
                      context.init.headers.forEach(function (value, key) {
                        headers_1.push([key, value]);
                      });
                    } else if (Array.isArray(context.init.headers)) {
                      context.init.headers.forEach(function (header) {
                        headers_1.push(header);
                      });
                    } else if (context.init.headers) {
                      Object.keys(context.init.headers).forEach(function (key) {
                        headers_1.push([key, context.init.headers[key]]);
                      });
                    }
                    context.init.headers = headers_1.concat(
                      (0,
                      _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.objectEntries)(
                        tracingHeaders
                      )
                    );
                  }
                }
              );
            },
            traceXhr: function (context, xhr) {
              return injectHeadersIfTracingAllowed(
                configuration,
                context,
                session,
                function (tracingHeaders) {
                  Object.keys(tracingHeaders).forEach(function (name) {
                    xhr.setRequestHeader(name, tracingHeaders[name]);
                  });
                }
              );
            },
          };
        }
        function injectHeadersIfTracingAllowed(
          configuration,
          context,
          session,
          inject
        ) {
          if (
            !isTracingSupported() ||
            !isAllowedUrl(configuration, context.url) ||
            !session.isTracked()
          ) {
            return;
          }
          context.traceId = new TraceIdentifier();
          context.spanId = new TraceIdentifier();
          inject(makeTracingHeaders(context.traceId, context.spanId));
        }
        function isAllowedUrl(configuration, requestUrl) {
          var requestOrigin = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.getOrigin)(
            requestUrl
          );
          for (
            var _i = 0, _a = configuration.allowedTracingOrigins;
            _i < _a.length;
            _i++
          ) {
            var allowedOrigin = _a[_i];
            if (
              requestOrigin === allowedOrigin ||
              (allowedOrigin instanceof RegExp &&
                allowedOrigin.test(requestOrigin))
            ) {
              return true;
            }
          }
          return false;
        }
        function isTracingSupported() {
          return getCrypto() !== undefined;
        }
        function getCrypto() {
          return window.crypto || window.msCrypto;
        }
        function makeTracingHeaders(traceId, spanId) {
          return {
            "x-datadog-origin": "rum",
            "x-datadog-parent-id": spanId.toDecimalString(),
            "x-datadog-sampled": "1",
            "x-datadog-sampling-priority": "1",
            "x-datadog-trace-id": traceId.toDecimalString(),
          };
        }
        /* eslint-disable no-bitwise */
        var TraceIdentifier = /** @class */ (function () {
          function TraceIdentifier() {
            this.buffer = new Uint8Array(8);
            getCrypto().getRandomValues(this.buffer);
            this.buffer[0] = this.buffer[0] & 0x7f; // force 63-bit
          }
          TraceIdentifier.prototype.toString = function (radix) {
            var high = this.readInt32(0);
            var low = this.readInt32(4);
            var str = "";
            while (1) {
              var mod = (high % radix) * 4294967296 + low;
              high = Math.floor(high / radix);
              low = Math.floor(mod / radix);
              str = (mod % radix).toString(radix) + str;
              if (!high && !low) {
                break;
              }
            }
            return str;
          };
          /**
           * Format used everywhere except the trace intake
           */
          TraceIdentifier.prototype.toDecimalString = function () {
            return this.toString(10);
          };
          TraceIdentifier.prototype.readInt32 = function (offset) {
            return (
              this.buffer[offset] * 16777216 +
              (this.buffer[offset + 1] << 16) +
              (this.buffer[offset + 2] << 8) +
              this.buffer[offset + 3]
            );
          };
          return TraceIdentifier;
        })();

        /* eslint-enable no-bitwise */

        /***/
      },

    /***/ "../rum-core/src/domain/trackEventCounts.ts":
      /*!**************************************************!*\
  !*** ../rum-core/src/domain/trackEventCounts.ts ***!
  \**************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ trackEventCounts: function () {
            return /* binding */ trackEventCounts;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        function trackEventCounts(lifeCycle, callback) {
          if (callback === void 0) {
            callback = _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.noop;
          }
          var eventCounts = {
            errorCount: 0,
            longTaskCount: 0,
            resourceCount: 0,
            userActionCount: 0,
          };
          var subscription = lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .RUM_EVENT_COLLECTED,
            function (_a) {
              var type = _a.type;
              switch (type) {
                case _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__
                  .RumEventType.ERROR:
                  eventCounts.errorCount += 1;
                  callback(eventCounts);
                  break;
                case _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__
                  .RumEventType.ACTION:
                  eventCounts.userActionCount += 1;
                  callback(eventCounts);
                  break;
                case _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__
                  .RumEventType.LONG_TASK:
                  eventCounts.longTaskCount += 1;
                  callback(eventCounts);
                  break;
                case _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_0__
                  .RumEventType.RESOURCE:
                  eventCounts.resourceCount += 1;
                  callback(eventCounts);
                  break;
              }
            }
          );
          return {
            stop: function () {
              subscription.unsubscribe();
            },
            eventCounts: eventCounts,
          };
        }

        /***/
      },

    /***/ "../rum-core/src/domain/urlContexts.ts":
      /*!*********************************************!*\
  !*** ../rum-core/src/domain/urlContexts.ts ***!
  \*********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ URL_CONTEXT_TIME_OUT_DELAY: function () {
            return /* binding */ URL_CONTEXT_TIME_OUT_DELAY;
          },
          /* harmony export */ startUrlContexts: function () {
            return /* binding */ startUrlContexts;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/session/sessionStore.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _contextHistory__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./contextHistory */ "../rum-core/src/domain/contextHistory.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        /**
         * We want to attach to an event:
         * - the url corresponding to its start
         * - the referrer corresponding to the previous view url (or document referrer for initial view)
         */
        var URL_CONTEXT_TIME_OUT_DELAY =
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.SESSION_TIME_OUT_DELAY;
        function startUrlContexts(
          lifeCycle,
          locationChangeObservable,
          location
        ) {
          var urlContextHistory =
            new _contextHistory__WEBPACK_IMPORTED_MODULE_0__.ContextHistory(
              URL_CONTEXT_TIME_OUT_DELAY
            );
          var previousViewUrl;
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .VIEW_ENDED,
            function (_a) {
              var endClocks = _a.endClocks;
              urlContextHistory.closeCurrent(endClocks.relative);
            }
          );
          lifeCycle.subscribe(
            _lifeCycle__WEBPACK_IMPORTED_MODULE_1__.LifeCycleEventType
              .VIEW_CREATED,
            function (_a) {
              var startClocks = _a.startClocks;
              var viewUrl = location.href;
              urlContextHistory.setCurrent(
                buildUrlContext({
                  url: viewUrl,
                  referrer: !previousViewUrl
                    ? document.referrer
                    : previousViewUrl,
                }),
                startClocks.relative
              );
              previousViewUrl = viewUrl;
            }
          );
          var locationChangeSubscription = locationChangeObservable.subscribe(
            function (_a) {
              var newLocation = _a.newLocation;
              var current = urlContextHistory.getCurrent();
              if (current) {
                var changeTime = (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.relativeNow)();
                urlContextHistory.closeCurrent(changeTime);
                urlContextHistory.setCurrent(
                  buildUrlContext({
                    url: newLocation.href,
                    referrer: current.view.referrer,
                  }),
                  changeTime
                );
              }
            }
          );
          function buildUrlContext(_a) {
            var url = _a.url,
              referrer = _a.referrer;
            return {
              view: {
                url: url,
                referrer: referrer,
              },
            };
          }
          return {
            findUrl: function (startTime) {
              return urlContextHistory.find(startTime);
            },
            stop: function () {
              locationChangeSubscription.unsubscribe();
              urlContextHistory.stop();
            },
          };
        }

        /***/
      },

    /***/ "../rum-core/src/domain/waitIdlePage.ts":
      /*!**********************************************!*\
  !*** ../rum-core/src/domain/waitIdlePage.ts ***!
  \**********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ PAGE_ACTIVITY_VALIDATION_DELAY: function () {
            return /* binding */ PAGE_ACTIVITY_VALIDATION_DELAY;
          },
          /* harmony export */ PAGE_ACTIVITY_END_DELAY: function () {
            return /* binding */ PAGE_ACTIVITY_END_DELAY;
          },
          /* harmony export */ waitIdlePage: function () {
            return /* binding */ waitIdlePage;
          },
          /* harmony export */ doWaitIdlePage: function () {
            return /* binding */ doWaitIdlePage;
          },
          /* harmony export */ createPageActivityObservable: function () {
            return /* binding */ createPageActivityObservable;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/timeUtils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/observable.ts"
          );
        /* harmony import */ var _lifeCycle__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        // Delay to wait for a page activity to validate the tracking process
        var PAGE_ACTIVITY_VALIDATION_DELAY = 100;
        // Delay to wait after a page activity to end the tracking process
        var PAGE_ACTIVITY_END_DELAY = 100;
        /**
         * Wait for the next idle page time
         *
         * Detection lifecycle:
         * ```
         *                           Wait idle page
         *              .-------------------'--------------------.
         *              v                                        v
         *     [Wait for a page activity ]          [Wait for a maximum duration]
         *     [timeout: VALIDATION_DELAY]          [  timeout: maxDuration     ]
         *          /                  \                           |
         *         v                    v                          |
         *  [No page activity]   [Page activity]                   |
         *         |                   |,----------------------.   |
         *         v                   v                       |   |
         *     (Discard)     [Wait for a page activity]        |   |
         *                   [   timeout: END_DELAY   ]        |   |
         *                       /                \            |   |
         *                      v                  v           |   |
         *             [No page activity]    [Page activity]   |   |
         *                      |                 |            |   |
         *                      |                 '------------'   |
         *                      '-----------. ,--------------------'
         *                                   v
         *                                 (End)
         * ```
         *
         * Note: by assuming that maxDuration is greater than VALIDATION_DELAY, we are sure that if the
         * process is still alive after maxDuration, it has been validated.
         */
        function waitIdlePage(
          lifeCycle,
          domMutationObservable,
          idlePageCallback,
          maxDuration
        ) {
          var pageActivityObservable = createPageActivityObservable(
            lifeCycle,
            domMutationObservable
          );
          return doWaitIdlePage(
            pageActivityObservable,
            idlePageCallback,
            maxDuration
          );
        }
        function doWaitIdlePage(
          pageActivityObservable,
          idlePageCallback,
          maxDuration
        ) {
          var idleTimeoutId;
          var hasCompleted = false;
          var startTime = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.timeStampNow)();
          var validationTimeoutId = setTimeout(
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.monitor)(
              function () {
                return complete({ hadActivity: false });
              }
            ),
            PAGE_ACTIVITY_VALIDATION_DELAY
          );
          var maxDurationTimeoutId =
            maxDuration &&
            setTimeout(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.monitor)(
                function () {
                  return complete({
                    hadActivity: true,
                    duration: (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.elapsed)(
                      startTime,
                      (0,
                      _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.timeStampNow)()
                    ),
                  });
                }
              ),
              maxDuration
            );
          var pageActivitySubscription = pageActivityObservable.subscribe(
            function (_a) {
              var isBusy = _a.isBusy;
              clearTimeout(validationTimeoutId);
              clearTimeout(idleTimeoutId);
              var lastChangeTime = (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.timeStampNow)();
              if (!isBusy) {
                idleTimeoutId = setTimeout(
                  (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.monitor)(
                    function () {
                      return complete({
                        hadActivity: true,
                        duration: (0,
                        _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.elapsed)(
                          startTime,
                          lastChangeTime
                        ),
                      });
                    }
                  ),
                  PAGE_ACTIVITY_END_DELAY
                );
              }
            }
          );
          var stop = function () {
            hasCompleted = true;
            clearTimeout(validationTimeoutId);
            clearTimeout(idleTimeoutId);
            clearTimeout(maxDurationTimeoutId);
            pageActivitySubscription.unsubscribe();
          };
          function complete(event) {
            if (hasCompleted) {
              return;
            }
            stop();
            idlePageCallback(event);
          }
          return { stop: stop };
        }
        function createPageActivityObservable(
          lifeCycle,
          domMutationObservable
        ) {
          var observable =
            new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.Observable(
              function () {
                var subscriptions = [];
                var firstRequestIndex;
                var pendingRequestsCount = 0;
                subscriptions.push(
                  domMutationObservable.subscribe(function () {
                    return notifyPageActivity(pendingRequestsCount);
                  }),
                  lifeCycle.subscribe(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .PERFORMANCE_ENTRY_COLLECTED,
                    function (entry) {
                      if (entry.entryType !== "resource") {
                        return;
                      }
                      notifyPageActivity(pendingRequestsCount);
                    }
                  ),
                  lifeCycle.subscribe(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .REQUEST_STARTED,
                    function (startEvent) {
                      if (firstRequestIndex === undefined) {
                        firstRequestIndex = startEvent.requestIndex;
                      }
                      notifyPageActivity(++pendingRequestsCount);
                    }
                  ),
                  lifeCycle.subscribe(
                    _lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
                      .REQUEST_COMPLETED,
                    function (request) {
                      // If the request started before the tracking start, ignore it
                      if (
                        firstRequestIndex === undefined ||
                        request.requestIndex < firstRequestIndex
                      ) {
                        return;
                      }
                      notifyPageActivity(--pendingRequestsCount);
                    }
                  )
                );
                return function () {
                  return subscriptions.forEach(function (s) {
                    return s.unsubscribe();
                  });
                };
              }
            );
          function notifyPageActivity(pendingRequestsCount) {
            observable.notify({ isBusy: pendingRequestsCount > 0 });
          }
          return observable;
        }

        /***/
      },

    /***/ "../rum-core/src/index.ts":
      /*!********************************!*\
  !*** ../rum-core/src/index.ts ***!
  \********************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ makeRumPublicApi: function () {
            return /* reexport safe */ _boot_rumPublicApi__WEBPACK_IMPORTED_MODULE_0__.makeRumPublicApi;
          },
          /* harmony export */ startRum: function () {
            return /* reexport safe */ _boot_startRum__WEBPACK_IMPORTED_MODULE_1__.startRum;
          },
          /* harmony export */ LifeCycle: function () {
            return /* reexport safe */ _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycle;
          },
          /* harmony export */ LifeCycleEventType: function () {
            return /* reexport safe */ _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_2__.LifeCycleEventType;
          },
          /* harmony export */ RumSessionPlan: function () {
            return /* reexport safe */ _domain_rumSession__WEBPACK_IMPORTED_MODULE_3__.RumSessionPlan;
          },
          /* harmony export */ getMutationObserverConstructor: function () {
            return /* reexport safe */ _browser_domMutationObservable__WEBPACK_IMPORTED_MODULE_4__.getMutationObserverConstructor;
          },
          /* harmony export */
        });
        /* harmony import */ var _boot_rumPublicApi__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./boot/rumPublicApi */ "../rum-core/src/boot/rumPublicApi.ts"
          );
        /* harmony import */ var _boot_startRum__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./boot/startRum */ "../rum-core/src/boot/startRum.ts"
          );
        /* harmony import */ var _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./domain/lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _domain_rumSession__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./domain/rumSession */ "../rum-core/src/domain/rumSession.ts"
          );
        /* harmony import */ var _browser_domMutationObservable__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./browser/domMutationObservable */ "../rum-core/src/browser/domMutationObservable.ts"
          );

        /***/
      },

    /***/ "../rum-core/src/rawRumEvent.types.ts":
      /*!********************************************!*\
  !*** ../rum-core/src/rawRumEvent.types.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ RumEventType: function () {
            return /* binding */ RumEventType;
          },
          /* harmony export */ ViewLoadingType: function () {
            return /* binding */ ViewLoadingType;
          },
          /* harmony export */ ActionType: function () {
            return /* binding */ ActionType;
          },
          /* harmony export */
        });
        var RumEventType;
        (function (RumEventType) {
          RumEventType["ACTION"] = "action";
          RumEventType["ERROR"] = "error";
          RumEventType["LONG_TASK"] = "long_task";
          RumEventType["VIEW"] = "view";
          RumEventType["RESOURCE"] = "resource";
        })(RumEventType || (RumEventType = {}));
        var ViewLoadingType;
        (function (ViewLoadingType) {
          ViewLoadingType["INITIAL_LOAD"] = "initial_load";
          ViewLoadingType["ROUTE_CHANGE"] = "route_change";
        })(ViewLoadingType || (ViewLoadingType = {}));
        var ActionType;
        (function (ActionType) {
          ActionType["CLICK"] = "click";
          ActionType["CUSTOM"] = "custom";
        })(ActionType || (ActionType = {}));

        /***/
      },

    /***/ "../rum-core/src/transport/batch.ts":
      /*!******************************************!*\
  !*** ../rum-core/src/transport/batch.ts ***!
  \******************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startRumBatch: function () {
            return /* binding */ startRumBatch;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/batch.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/httpRequest.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../domain/lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );
        /* harmony import */ var _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../rawRumEvent.types */ "../rum-core/src/rawRumEvent.types.ts"
          );

        function startRumBatch(configuration, lifeCycle) {
          var batch = makeRumBatch(configuration, lifeCycle);
          lifeCycle.subscribe(
            _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .RUM_EVENT_COLLECTED,
            function (serverRumEvent) {
              if (
                serverRumEvent.type ===
                _rawRumEvent_types__WEBPACK_IMPORTED_MODULE_1__.RumEventType
                  .VIEW
              ) {
                batch.upsert(serverRumEvent, serverRumEvent.view.id);
              } else {
                batch.add(serverRumEvent);
              }
            }
          );
          return {
            stop: function () {
              return batch.stop();
            },
          };
        }
        function makeRumBatch(configuration, lifeCycle) {
          var primaryBatch = createRumBatch(
            configuration.rumEndpointBuilder,
            function () {
              return lifeCycle.notify(
                _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_0__
                  .LifeCycleEventType.BEFORE_UNLOAD
              );
            }
          );
          var replicaBatch;
          var replica = configuration.replica;
          if (replica !== undefined) {
            replicaBatch = createRumBatch(replica.rumEndpointBuilder);
          }
          function createRumBatch(endpointBuilder, unloadCallback) {
            return new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.Batch(
              new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.HttpRequest(
                endpointBuilder,
                configuration.batchBytesLimit
              ),
              configuration.maxBatchSize,
              configuration.batchBytesLimit,
              configuration.maxMessageSize,
              configuration.flushTimeout,
              unloadCallback
            );
          }
          function withReplicaApplicationId(message) {
            return (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.combine)(
              message,
              { application: { id: replica.applicationId } }
            );
          }
          var stopped = false;
          return {
            add: function (message) {
              if (stopped) {
                return;
              }
              primaryBatch.add(message);
              if (replicaBatch) {
                replicaBatch.add(withReplicaApplicationId(message));
              }
            },
            stop: function () {
              stopped = true;
            },
            upsert: function (message, key) {
              if (stopped) {
                return;
              }
              primaryBatch.upsert(message, key);
              if (replicaBatch) {
                replicaBatch.upsert(withReplicaApplicationId(message), key);
              }
            },
          };
        }

        /***/
      },

    /***/ "../rum-core/src/transport/startRumEventBridge.ts":
      /*!********************************************************!*\
  !*** ../rum-core/src/transport/startRumEventBridge.ts ***!
  \********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startRumEventBridge: function () {
            return /* binding */ startRumEventBridge;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/eventBridge.ts"
          );
        /* harmony import */ var _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ../domain/lifeCycle */ "../rum-core/src/domain/lifeCycle.ts"
          );

        function startRumEventBridge(lifeCycle) {
          var bridge = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.getEventBridge)();
          lifeCycle.subscribe(
            _domain_lifeCycle__WEBPACK_IMPORTED_MODULE_0__.LifeCycleEventType
              .RUM_EVENT_COLLECTED,
            function (serverRumEvent) {
              bridge.send(serverRumEvent.type, serverRumEvent);
            }
          );
        }

        /***/
      },

    /***/ "./src/boot/recorderApi.ts":
      /*!*********************************!*\
  !*** ./src/boot/recorderApi.ts ***!
  \*********************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ makeRecorderApi: function () {
            return /* binding */ makeRecorderApi;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/eventBridge.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );
        /* harmony import */ var _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-rum-core */ "../rum-core/src/index.ts"
          );
        /* harmony import */ var _domain_replayStats__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../domain/replayStats */ "./src/domain/replayStats.ts"
          );
        /* harmony import */ var _domain_segmentCollection_startDeflateWorker__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../domain/segmentCollection/startDeflateWorker */ "./src/domain/segmentCollection/startDeflateWorker.ts"
          );

        function makeRecorderApi(startRecordingImpl, startDeflateWorkerImpl) {
          if (startDeflateWorkerImpl === void 0) {
            startDeflateWorkerImpl =
              _domain_segmentCollection_startDeflateWorker__WEBPACK_IMPORTED_MODULE_2__.startDeflateWorker;
          }
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.canUseEventBridge)()
          ) {
            return {
              start: _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.noop,
              stop: _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.noop,
              getReplayStats: function () {
                return undefined;
              },
              onRumStart:
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.noop,
              isRecording: function () {
                return false;
              },
            };
          }
          var state = {
            status: 0 /* Stopped */,
          };
          var startStrategy = function () {
            state = { status: 1 /* IntentToStart */ };
          };
          var stopStrategy = function () {
            state = { status: 0 /* Stopped */ };
          };
          return {
            start: function () {
              return startStrategy();
            },
            stop: function () {
              return stopStrategy();
            },
            getReplayStats:
              _domain_replayStats__WEBPACK_IMPORTED_MODULE_1__.getReplayStats,
            onRumStart: function (
              lifeCycle,
              initConfiguration,
              configuration,
              session,
              parentContexts
            ) {
              lifeCycle.subscribe(
                _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__
                  .LifeCycleEventType.SESSION_EXPIRED,
                function () {
                  if (
                    state.status === 2 /* Starting */ ||
                    state.status === 3 /* Started */
                  ) {
                    stopStrategy();
                    state = { status: 1 /* IntentToStart */ };
                  }
                }
              );
              lifeCycle.subscribe(
                _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__
                  .LifeCycleEventType.SESSION_RENEWED,
                function () {
                  if (state.status === 1 /* IntentToStart */) {
                    startStrategy();
                  }
                }
              );
              startStrategy = function () {
                if (!session.hasReplayPlan()) {
                  state = { status: 1 /* IntentToStart */ };
                  return;
                }
                if (
                  state.status === 2 /* Starting */ ||
                  state.status === 3 /* Started */
                ) {
                  return;
                }
                state = { status: 2 /* Starting */ };
                (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.runOnReadyState)(
                  (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_5__.isExperimentalFeatureEnabled)(
                    "record-at-dom-loaded"
                  )
                    ? "interactive"
                    : "complete",
                  function () {
                    if (state.status !== 2 /* Starting */) {
                      return;
                    }
                    startDeflateWorkerImpl(function (worker) {
                      if (state.status !== 2 /* Starting */) {
                        return;
                      }
                      if (!worker) {
                        state = {
                          status: 0 /* Stopped */,
                        };
                        return;
                      }
                      var stopRecording = startRecordingImpl(
                        lifeCycle,
                        initConfiguration.applicationId,
                        configuration,
                        session,
                        parentContexts,
                        worker
                      ).stop;
                      state = {
                        status: 3 /* Started */,
                        stopRecording: stopRecording,
                      };
                    });
                  }
                );
              };
              stopStrategy = function () {
                if (state.status === 0 /* Stopped */) {
                  return;
                }
                if (state.status === 3 /* Started */) {
                  state.stopRecording();
                }
                state = {
                  status: 0 /* Stopped */,
                };
              };
              if (state.status === 1 /* IntentToStart */) {
                startStrategy();
              }
            },
            isRecording: function () {
              return state.status === 3 /* Started */;
            },
          };
        }

        /***/
      },

    /***/ "./src/boot/startRecording.ts":
      /*!************************************!*\
  !*** ./src/boot/startRecording.ts ***!
  \************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startRecording: function () {
            return /* binding */ startRecording;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-rum-core */ "../rum-core/src/index.ts"
          );
        /* harmony import */ var _domain_record__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../domain/record */ "./src/domain/record/index.ts"
          );
        /* harmony import */ var _domain_segmentCollection__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ../domain/segmentCollection */ "./src/domain/segmentCollection/index.ts"
          );
        /* harmony import */ var _transport_send__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ../transport/send */ "./src/transport/send.ts"
          );
        /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(/*! ../types */ "./src/types.ts");

        function startRecording(
          lifeCycle,
          applicationId,
          configuration,
          session,
          parentContexts,
          worker
        ) {
          var _a = (0,
            _domain_segmentCollection__WEBPACK_IMPORTED_MODULE_3__.startSegmentCollection)(
              lifeCycle,
              applicationId,
              session,
              parentContexts,
              function (data, meta, rawSegmentSize, flushReason) {
                return (0, _transport_send__WEBPACK_IMPORTED_MODULE_4__.send)(
                  configuration.sessionReplayEndpointBuilder,
                  data,
                  meta,
                  rawSegmentSize,
                  flushReason
                );
              },
              worker
            ),
            addRecord = _a.addRecord,
            stopSegmentCollection = _a.stop;
          function addRawRecord(rawRecord) {
            addRecord(
              (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, rawRecord),
                { timestamp: Date.now() }
              )
            );
          }
          var _b = (0, _domain_record__WEBPACK_IMPORTED_MODULE_2__.record)({
              emit: addRawRecord,
              defaultPrivacyLevel: configuration.defaultPrivacyLevel,
            }),
            stopRecording = _b.stop,
            takeFullSnapshot = _b.takeFullSnapshot,
            flushMutations = _b.flushMutations;
          var unsubscribeViewEnded = lifeCycle.subscribe(
            _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_1__
              .LifeCycleEventType.VIEW_ENDED,
            function () {
              flushMutations();
              addRawRecord({
                type: _types__WEBPACK_IMPORTED_MODULE_5__.RecordType.ViewEnd,
              });
            }
          ).unsubscribe;
          var unsubscribeViewCreated = lifeCycle.subscribe(
            _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_1__
              .LifeCycleEventType.VIEW_CREATED,
            takeFullSnapshot
          ).unsubscribe;
          return {
            stop: function () {
              unsubscribeViewEnded();
              unsubscribeViewCreated();
              stopRecording();
              stopSegmentCollection();
            },
          };
        }

        /***/
      },

    /***/ "./src/constants.ts":
      /*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ NodePrivacyLevel: function () {
            return /* binding */ NodePrivacyLevel;
          },
          /* harmony export */ PRIVACY_ATTR_NAME: function () {
            return /* binding */ PRIVACY_ATTR_NAME;
          },
          /* harmony export */ PRIVACY_CLASS_INPUT_IGNORED: function () {
            return /* binding */ PRIVACY_CLASS_INPUT_IGNORED;
          },
          /* harmony export */ PRIVACY_CLASS_INPUT_MASKED: function () {
            return /* binding */ PRIVACY_CLASS_INPUT_MASKED;
          },
          /* harmony export */ PRIVACY_ATTR_VALUE_INPUT_IGNORED: function () {
            return /* binding */ PRIVACY_ATTR_VALUE_INPUT_IGNORED;
          },
          /* harmony export */ PRIVACY_ATTR_VALUE_INPUT_MASKED: function () {
            return /* binding */ PRIVACY_ATTR_VALUE_INPUT_MASKED;
          },
          /* harmony export */ PRIVACY_ATTR_VALUE_ALLOW: function () {
            return /* binding */ PRIVACY_ATTR_VALUE_ALLOW;
          },
          /* harmony export */ PRIVACY_ATTR_VALUE_MASK: function () {
            return /* binding */ PRIVACY_ATTR_VALUE_MASK;
          },
          /* harmony export */ PRIVACY_ATTR_VALUE_MASK_USER_INPUT: function () {
            return /* binding */ PRIVACY_ATTR_VALUE_MASK_USER_INPUT;
          },
          /* harmony export */ PRIVACY_ATTR_VALUE_HIDDEN: function () {
            return /* binding */ PRIVACY_ATTR_VALUE_HIDDEN;
          },
          /* harmony export */ PRIVACY_CLASS_ALLOW: function () {
            return /* binding */ PRIVACY_CLASS_ALLOW;
          },
          /* harmony export */ PRIVACY_CLASS_MASK: function () {
            return /* binding */ PRIVACY_CLASS_MASK;
          },
          /* harmony export */ PRIVACY_CLASS_MASK_USER_INPUT: function () {
            return /* binding */ PRIVACY_CLASS_MASK_USER_INPUT;
          },
          /* harmony export */ PRIVACY_CLASS_HIDDEN: function () {
            return /* binding */ PRIVACY_CLASS_HIDDEN;
          },
          /* harmony export */ CENSORED_STRING_MARK: function () {
            return /* binding */ CENSORED_STRING_MARK;
          },
          /* harmony export */ CENSORED_IMG_MARK: function () {
            return /* binding */ CENSORED_IMG_MARK;
          },
          /* harmony export */ FORM_PRIVATE_TAG_NAMES: function () {
            return /* binding */ FORM_PRIVATE_TAG_NAMES;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/configuration.ts"
          );

        var NodePrivacyLevel = (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
          (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
            {},
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.DefaultPrivacyLevel
          ),
          { IGNORE: "ignore", HIDDEN: "hidden" }
        );
        var PRIVACY_ATTR_NAME = "data-dd-privacy";
        // Deprecate via temporary Alias
        var PRIVACY_CLASS_INPUT_IGNORED = "dd-privacy-input-ignored"; // DEPRECATED, aliased to mask-user-input
        var PRIVACY_CLASS_INPUT_MASKED = "dd-privacy-input-masked"; // DEPRECATED, aliased to mask-user-input
        var PRIVACY_ATTR_VALUE_INPUT_IGNORED = "input-ignored"; // DEPRECATED, aliased to mask-user-input
        var PRIVACY_ATTR_VALUE_INPUT_MASKED = "input-masked"; // DEPRECATED, aliased to mask-user-input
        // Privacy Attrs
        var PRIVACY_ATTR_VALUE_ALLOW = "allow";
        var PRIVACY_ATTR_VALUE_MASK = "mask";
        var PRIVACY_ATTR_VALUE_MASK_USER_INPUT = "mask-user-input";
        var PRIVACY_ATTR_VALUE_HIDDEN = "hidden";
        // Privacy Classes - not all customers can set plain HTML attributes, so support classes too
        var PRIVACY_CLASS_ALLOW = "dd-privacy-allow";
        var PRIVACY_CLASS_MASK = "dd-privacy-mask";
        var PRIVACY_CLASS_MASK_USER_INPUT = "dd-privacy-mask-user-input";
        var PRIVACY_CLASS_HIDDEN = "dd-privacy-hidden";
        // Private Replacement Templates
        var CENSORED_STRING_MARK = "***";
        var CENSORED_IMG_MARK =
          "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
        var FORM_PRIVATE_TAG_NAMES = {
          INPUT: true,
          OUTPUT: true,
          TEXTAREA: true,
          SELECT: true,
          OPTION: true,
          DATALIST: true,
          OPTGROUP: true,
        };

        /***/
      },

    /***/ "./src/domain/record/index.ts":
      /*!************************************!*\
  !*** ./src/domain/record/index.ts ***!
  \************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ record: function () {
            return /* reexport safe */ _record__WEBPACK_IMPORTED_MODULE_0__.record;
          },
          /* harmony export */
        });
        /* harmony import */ var _record__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./record */ "./src/domain/record/record.ts");

        /***/
      },

    /***/ "./src/domain/record/mutationBatch.ts":
      /*!********************************************!*\
  !*** ./src/domain/record/mutationBatch.ts ***!
  \********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ createMutationBatch: function () {
            return /* binding */ createMutationBatch;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );

        /**
         * Maximum duration to wait before processing mutations. If the browser is idle, mutations will be
         * processed more quickly. If the browser is busy executing small tasks (ex: rendering frames), the
         * mutations will wait MUTATION_PROCESS_MAX_DELAY milliseconds before being processed. If the
         * browser is busy executing a longer task, mutations will be processed after this task.
         */
        var MUTATION_PROCESS_MAX_DELAY = 100;
        function createMutationBatch(processMutationBatch) {
          var cancelScheduledFlush =
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.noop;
          var pendingMutations = [];
          function flush() {
            cancelScheduledFlush();
            processMutationBatch(pendingMutations);
            pendingMutations = [];
          }
          return {
            addMutations: function (mutations) {
              if (pendingMutations.length === 0) {
                cancelScheduledFlush = scheduleMutationFlush(flush);
              }
              pendingMutations.push.apply(pendingMutations, mutations);
            },
            flush: flush,
            stop: function () {
              cancelScheduledFlush();
            },
          };
        }
        function scheduleMutationFlush(flush) {
          var browserWindow = window;
          // Use 'requestIdleCallback' when available: it will throttle the mutation processing if the
          // browser is busy rendering frames (ex: when frames are below 60fps). When not available, the
          // fallback on 'requestAnimationFrame' will still ensure the mutations are processed after any
          // browser rendering process (Layout, Recalculate Style, etc.), so we can serialize DOM nodes
          // efficiently.
          if (browserWindow.requestIdleCallback) {
            var id_1 = browserWindow.requestIdleCallback(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.monitor)(
                flush
              ),
              { timeout: MUTATION_PROCESS_MAX_DELAY }
            );
            return function () {
              return browserWindow.cancelIdleCallback(id_1);
            };
          }
          var id = browserWindow.requestAnimationFrame(
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.monitor)(
              flush
            )
          );
          return function () {
            return browserWindow.cancelAnimationFrame(id);
          };
        }

        /***/
      },

    /***/ "./src/domain/record/mutationObserver.ts":
      /*!***********************************************!*\
  !*** ./src/domain/record/mutationObserver.ts ***!
  \***********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startMutationObserver: function () {
            return /* binding */ startMutationObserver;
          },
          /* harmony export */ MutationController: function () {
            return /* binding */ MutationController;
          },
          /* harmony export */ sortAddedAndMovedNodes: function () {
            return /* binding */ sortAddedAndMovedNodes;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-rum-core */ "../rum-core/src/index.ts"
          );
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../../constants */ "./src/constants.ts");
        /* harmony import */ var _privacy__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./privacy */ "./src/domain/record/privacy.ts"
          );
        /* harmony import */ var _serializationUtils__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./serializationUtils */ "./src/domain/record/serializationUtils.ts"
          );
        /* harmony import */ var _serialize__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./serialize */ "./src/domain/record/serialize.ts"
          );
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(/*! ./utils */ "./src/domain/record/utils.ts");
        /* harmony import */ var _mutationBatch__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./mutationBatch */ "./src/domain/record/mutationBatch.ts"
          );

        /**
         * Buffers and aggregate mutations generated by a MutationObserver into MutationPayload
         */
        function startMutationObserver(
          controller,
          mutationCallback,
          defaultPrivacyLevel
        ) {
          var MutationObserver = (0,
          _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__.getMutationObserverConstructor)();
          if (!MutationObserver) {
            return {
              stop: _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.noop,
            };
          }
          var mutationBatch = (0,
          _mutationBatch__WEBPACK_IMPORTED_MODULE_6__.createMutationBatch)(
            function (mutations) {
              processMutations(
                mutations.concat(observer.takeRecords()),
                mutationCallback,
                defaultPrivacyLevel
              );
            }
          );
          var observer = new MutationObserver(
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.monitor)(
              mutationBatch.addMutations
            )
          );
          observer.observe(document, {
            attributeOldValue: true,
            attributes: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true,
          });
          controller.onFlush(mutationBatch.flush);
          return {
            stop: function () {
              observer.disconnect();
              mutationBatch.stop();
            },
          };
        }
        /**
         * Controls how mutations are processed, allowing to flush pending mutations.
         */
        var MutationController = /** @class */ (function () {
          function MutationController() {}
          MutationController.prototype.flush = function () {
            var _a;
            (_a = this.flushListener) === null || _a === void 0
              ? void 0
              : _a.call(this);
          };
          MutationController.prototype.onFlush = function (listener) {
            this.flushListener = listener;
          };
          return MutationController;
        })();

        function processMutations(
          mutations,
          mutationCallback,
          defaultPrivacyLevel
        ) {
          // Discard any mutation with a 'target' node that:
          // * isn't injected in the current document or isn't known/serialized yet: those nodes are likely
          // part of a mutation occurring in a parent Node
          // * should be hidden or ignored
          var filteredMutations = mutations.filter(function (mutation) {
            return (
              document.contains(mutation.target) &&
              (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.nodeAndAncestorsHaveSerializedNode)(
                mutation.target
              ) &&
              (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
                mutation.target,
                defaultPrivacyLevel
              ) !==
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.HIDDEN
            );
          });
          var _a = processChildListMutations(
              filteredMutations.filter(function (mutation) {
                return mutation.type === "childList";
              }),
              defaultPrivacyLevel
            ),
            adds = _a.adds,
            removes = _a.removes,
            hasBeenSerialized = _a.hasBeenSerialized;
          var texts = processCharacterDataMutations(
            filteredMutations.filter(function (mutation) {
              return (
                mutation.type === "characterData" &&
                !hasBeenSerialized(mutation.target)
              );
            }),
            defaultPrivacyLevel
          );
          var attributes = processAttributesMutations(
            filteredMutations.filter(function (mutation) {
              return (
                mutation.type === "attributes" &&
                !hasBeenSerialized(mutation.target)
              );
            }),
            defaultPrivacyLevel
          );
          if (
            !texts.length &&
            !attributes.length &&
            !removes.length &&
            !adds.length
          ) {
            return;
          }
          mutationCallback({
            adds: adds,
            removes: removes,
            texts: texts,
            attributes: attributes,
          });
        }
        function processChildListMutations(mutations, defaultPrivacyLevel) {
          // First, we iterate over mutations to collect:
          //
          // * nodes that have been added in the document and not removed by a subsequent mutation
          // * nodes that have been removed from the document but were not added in a previous mutation
          //
          // For this second category, we also collect their previous parent (mutation.target) because we'll
          // need it to emit a 'remove' mutation.
          //
          // Those two categories may overlap: if a node moved from a position to another, it is reported as
          // two mutation records, one with a "removedNodes" and the other with "addedNodes". In this case,
          // the node will be in both sets.
          var addedAndMovedNodes = new Set();
          var removedNodes = new Map();
          var _loop_1 = function (mutation) {
            (0, _utils__WEBPACK_IMPORTED_MODULE_5__.forEach)(
              mutation.addedNodes,
              function (node) {
                addedAndMovedNodes.add(node);
              }
            );
            (0, _utils__WEBPACK_IMPORTED_MODULE_5__.forEach)(
              mutation.removedNodes,
              function (node) {
                if (!addedAndMovedNodes.has(node)) {
                  removedNodes.set(node, mutation.target);
                }
                addedAndMovedNodes.delete(node);
              }
            );
          };
          for (
            var _i = 0, mutations_1 = mutations;
            _i < mutations_1.length;
            _i++
          ) {
            var mutation = mutations_1[_i];
            _loop_1(mutation);
          }
          // Then, we sort nodes that are still in the document by topological order, for two reasons:
          //
          // * We will serialize each added nodes with their descendants. We don't want to serialize a node
          // twice, so we need to iterate over the parent nodes first and skip any node that is contained in
          // a precedent node.
          //
          // * To emit "add" mutations, we need references to the parent and potential next sibling of each
          // added node. So we need to iterate over the parent nodes first, and when multiple nodes are
          // siblings, we want to iterate from last to first. This will ensure that any "next" node is
          // already serialized and have an id.
          var sortedAddedAndMovedNodes = Array.from(addedAndMovedNodes);
          sortAddedAndMovedNodes(sortedAddedAndMovedNodes);
          // Then, we iterate over our sorted node sets to emit mutations. We collect the newly serialized
          // node ids in a set to be able to skip subsequent related mutations.
          var serializedNodeIds = new Set();
          var addedNodeMutations = [];
          for (
            var _a = 0, sortedAddedAndMovedNodes_1 = sortedAddedAndMovedNodes;
            _a < sortedAddedAndMovedNodes_1.length;
            _a++
          ) {
            var node = sortedAddedAndMovedNodes_1[_a];
            if (hasBeenSerialized(node)) {
              continue;
            }
            var parentNodePrivacyLevel = (0,
            _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
              node.parentNode,
              defaultPrivacyLevel
            );
            if (
              parentNodePrivacyLevel ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel
                  .HIDDEN ||
              parentNodePrivacyLevel ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.IGNORE
            ) {
              continue;
            }
            var serializedNode = (0,
            _serialize__WEBPACK_IMPORTED_MODULE_4__.serializeNodeWithId)(node, {
              document: document,
              serializedNodeIds: serializedNodeIds,
              parentNodePrivacyLevel: parentNodePrivacyLevel,
            });
            if (!serializedNode) {
              continue;
            }
            addedNodeMutations.push({
              nextId: getNextSibling(node),
              parentId: (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                node.parentNode
              ),
              node: serializedNode,
            });
          }
          // Finally, we emit remove mutations.
          var removedNodeMutations = [];
          removedNodes.forEach(function (parent, node) {
            if (
              (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                node
              )
            ) {
              removedNodeMutations.push({
                parentId: (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                  parent
                ),
                id: (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                  node
                ),
              });
            }
          });
          return {
            adds: addedNodeMutations,
            removes: removedNodeMutations,
            hasBeenSerialized: hasBeenSerialized,
          };
          function hasBeenSerialized(node) {
            return (
              (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                node
              ) &&
              serializedNodeIds.has(
                (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                  node
                )
              )
            );
          }
          function getNextSibling(node) {
            var nextSibling = node.nextSibling;
            while (nextSibling) {
              if (
                (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                  nextSibling
                )
              ) {
                return (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                  nextSibling
                );
              }
              nextSibling = nextSibling.nextSibling;
            }
            return null;
          }
        }
        function processCharacterDataMutations(mutations, defaultPrivacyLevel) {
          var _a;
          var textMutations = [];
          // Deduplicate mutations based on their target node
          var handledNodes = new Set();
          var filteredMutations = mutations.filter(function (mutation) {
            if (handledNodes.has(mutation.target)) {
              return false;
            }
            handledNodes.add(mutation.target);
            return true;
          });
          // Emit mutations
          for (
            var _i = 0, filteredMutations_1 = filteredMutations;
            _i < filteredMutations_1.length;
            _i++
          ) {
            var mutation = filteredMutations_1[_i];
            var value = mutation.target.textContent;
            if (value === mutation.oldValue) {
              continue;
            }
            var parentNodePrivacyLevel = (0,
            _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
              mutation.target.parentNode,
              defaultPrivacyLevel
            );
            if (
              parentNodePrivacyLevel ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel
                  .HIDDEN ||
              parentNodePrivacyLevel ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.IGNORE
            ) {
              continue;
            }
            textMutations.push({
              id: (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                mutation.target
              ),
              // TODO: pass a valid "ignoreWhiteSpace" argument
              value:
                (_a = (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.getTextContent)(
                  mutation.target,
                  false,
                  parentNodePrivacyLevel
                )) !== null && _a !== void 0
                  ? _a
                  : null,
            });
          }
          return textMutations;
        }
        function processAttributesMutations(mutations, defaultPrivacyLevel) {
          var attributeMutations = [];
          // Deduplicate mutations based on their target node and changed attribute
          var handledElements = new Map();
          var filteredMutations = mutations.filter(function (mutation) {
            var handledAttributes = handledElements.get(mutation.target);
            if (
              handledAttributes === null || handledAttributes === void 0
                ? void 0
                : handledAttributes.has(mutation.attributeName)
            ) {
              return false;
            }
            if (!handledAttributes) {
              handledElements.set(
                mutation.target,
                new Set([mutation.attributeName])
              );
            } else {
              handledAttributes.add(mutation.attributeName);
            }
            return true;
          });
          // Emit mutations
          var emittedMutations = new Map();
          for (
            var _i = 0, filteredMutations_2 = filteredMutations;
            _i < filteredMutations_2.length;
            _i++
          ) {
            var mutation = filteredMutations_2[_i];
            var uncensoredValue = mutation.target.getAttribute(
              mutation.attributeName
            );
            if (uncensoredValue === mutation.oldValue) {
              continue;
            }
            var privacyLevel = (0,
            _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
              mutation.target,
              defaultPrivacyLevel
            );
            var attributeValue = (0,
            _serialize__WEBPACK_IMPORTED_MODULE_4__.serializeAttribute)(
              mutation.target,
              privacyLevel,
              mutation.attributeName
            );
            var transformedValue = void 0;
            if (mutation.attributeName === "value") {
              var inputValue = (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getElementInputValue)(
                mutation.target,
                privacyLevel
              );
              if (inputValue === undefined) {
                continue;
              }
              transformedValue = inputValue;
            } else if (attributeValue && typeof attributeValue === "string") {
              transformedValue = attributeValue;
            } else {
              transformedValue = null;
            }
            var emittedMutation = emittedMutations.get(mutation.target);
            if (!emittedMutation) {
              emittedMutation = {
                id: (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                  mutation.target
                ),
                attributes: {},
              };
              attributeMutations.push(emittedMutation);
              emittedMutations.set(mutation.target, emittedMutation);
            }
            emittedMutation.attributes[mutation.attributeName] =
              transformedValue;
          }
          return attributeMutations;
        }
        function sortAddedAndMovedNodes(nodes) {
          nodes.sort(function (a, b) {
            var position = a.compareDocumentPosition(b);
            /* eslint-disable no-bitwise */
            if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
              return -1;
            } else if (position & Node.DOCUMENT_POSITION_CONTAINS) {
              return 1;
            } else if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
              return 1;
            } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
              return -1;
            }
            /* eslint-enable no-bitwise */
            return 0;
          });
        }

        /***/
      },

    /***/ "./src/domain/record/observer.ts":
      /*!***************************************!*\
  !*** ./src/domain/record/observer.ts ***!
  \***************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ initObservers: function () {
            return /* binding */ initObservers;
          },
          /* harmony export */ INPUT_TAGS: function () {
            return /* binding */ INPUT_TAGS;
          },
          /* harmony export */ initInputObserver: function () {
            return /* binding */ initInputObserver;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../../constants */ "./src/constants.ts");
        /* harmony import */ var _privacy__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./privacy */ "./src/domain/record/privacy.ts"
          );
        /* harmony import */ var _serializationUtils__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./serializationUtils */ "./src/domain/record/serializationUtils.ts"
          );
        /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(/*! ./types */ "./src/domain/record/types.ts");
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(/*! ./utils */ "./src/domain/record/utils.ts");
        /* harmony import */ var _mutationObserver__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./mutationObserver */ "./src/domain/record/mutationObserver.ts"
          );
        /* harmony import */ var _viewports__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! ./viewports */ "./src/domain/record/viewports.ts"
          );
        var _a;

        var MOUSE_MOVE_OBSERVER_THRESHOLD = 50;
        var SCROLL_OBSERVER_THRESHOLD = 100;
        var VISUAL_VIEWPORT_OBSERVER_THRESHOLD = 200;
        function initObservers(o) {
          var mutationHandler = initMutationObserver(
            o.mutationController,
            o.mutationCb,
            o.defaultPrivacyLevel
          );
          var mousemoveHandler = initMoveObserver(o.mousemoveCb);
          var mouseInteractionHandler = initMouseInteractionObserver(
            o.mouseInteractionCb,
            o.defaultPrivacyLevel
          );
          var scrollHandler = initScrollObserver(
            o.scrollCb,
            o.defaultPrivacyLevel
          );
          var viewportResizeHandler = initViewportResizeObserver(
            o.viewportResizeCb
          );
          var inputHandler = initInputObserver(
            o.inputCb,
            o.defaultPrivacyLevel
          );
          var mediaInteractionHandler = initMediaInteractionObserver(
            o.mediaInteractionCb,
            o.defaultPrivacyLevel
          );
          var styleSheetObserver = initStyleSheetObserver(o.styleSheetRuleCb);
          var focusHandler = initFocusObserver(o.focusCb);
          var visualViewportResizeHandler = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.isExperimentalFeatureEnabled)(
            "visualviewport"
          )
            ? initVisualViewportResizeObserver(o.visualViewportResizeCb)
            : _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.noop;
          return function () {
            mutationHandler();
            mousemoveHandler();
            mouseInteractionHandler();
            scrollHandler();
            viewportResizeHandler();
            inputHandler();
            mediaInteractionHandler();
            styleSheetObserver();
            focusHandler();
            visualViewportResizeHandler();
          };
        }
        function initMutationObserver(
          mutationController,
          cb,
          defaultPrivacyLevel
        ) {
          return (0,
          _mutationObserver__WEBPACK_IMPORTED_MODULE_6__.startMutationObserver)(
            mutationController,
            cb,
            defaultPrivacyLevel
          ).stop;
        }
        function initMoveObserver(cb) {
          var updatePosition = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.throttle)(
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.monitor)(
              function (event) {
                var target = event.target;
                if (
                  (0,
                  _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                    target
                  )
                ) {
                  var _a = (0,
                    _utils__WEBPACK_IMPORTED_MODULE_5__.isTouchEvent)(event)
                      ? event.changedTouches[0]
                      : event,
                    clientX = _a.clientX,
                    clientY = _a.clientY;
                  var position = {
                    id: (0,
                    _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                      target
                    ),
                    timeOffset: 0,
                    x: clientX,
                    y: clientY,
                  };
                  if (
                    (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.isExperimentalFeatureEnabled)(
                      "visualviewport"
                    ) &&
                    window.visualViewport
                  ) {
                    var _b = (0,
                      _viewports__WEBPACK_IMPORTED_MODULE_7__.convertMouseEventToLayoutCoordinates)(
                        clientX,
                        clientY
                      ),
                      visualViewportX = _b.visualViewportX,
                      visualViewportY = _b.visualViewportY;
                    position.x = visualViewportX;
                    position.y = visualViewportY;
                  }
                  cb(
                    [position],
                    (0, _utils__WEBPACK_IMPORTED_MODULE_5__.isTouchEvent)(event)
                      ? _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                          .TouchMove
                      : _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                          .MouseMove
                  );
                }
              }
            ),
            MOUSE_MOVE_OBSERVER_THRESHOLD,
            {
              trailing: false,
            }
          ).throttled;
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListeners)(
            document,
            ["mousemove" /* MOUSE_MOVE */, "touchmove" /* TOUCH_MOVE */],
            updatePosition,
            {
              capture: true,
              passive: true,
            }
          ).stop;
        }
        var eventTypeToMouseInteraction =
          ((_a = {}),
          (_a["mouseup" /* MOUSE_UP */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.MouseUp),
          (_a["mousedown" /* MOUSE_DOWN */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.MouseDown),
          (_a["click" /* CLICK */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.Click),
          (_a["contextmenu" /* CONTEXT_MENU */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.ContextMenu),
          (_a["dblclick" /* DBL_CLICK */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.DblClick),
          (_a["focus" /* FOCUS */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.Focus),
          (_a["blur" /* BLUR */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.Blur),
          (_a["touchstart" /* TOUCH_START */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.TouchStart),
          (_a["touchend" /* TOUCH_END */] =
            _types__WEBPACK_IMPORTED_MODULE_4__.MouseInteractions.TouchEnd),
          _a);
        function initMouseInteractionObserver(cb, defaultPrivacyLevel) {
          var handler = function (event) {
            var target = event.target;
            if (
              (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
                target,
                defaultPrivacyLevel
              ) ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel
                  .HIDDEN ||
              !(0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                target
              )
            ) {
              return;
            }
            var _a = (0, _utils__WEBPACK_IMPORTED_MODULE_5__.isTouchEvent)(
                event
              )
                ? event.changedTouches[0]
                : event,
              clientX = _a.clientX,
              clientY = _a.clientY;
            var position = {
              id: (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                target
              ),
              type: eventTypeToMouseInteraction[event.type],
              x: clientX,
              y: clientY,
            };
            if (
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.isExperimentalFeatureEnabled)(
                "visualviewport"
              ) &&
              window.visualViewport
            ) {
              var _b = (0,
                _viewports__WEBPACK_IMPORTED_MODULE_7__.convertMouseEventToLayoutCoordinates)(
                  clientX,
                  clientY
                ),
                visualViewportX = _b.visualViewportX,
                visualViewportY = _b.visualViewportY;
              position.x = visualViewportX;
              position.y = visualViewportY;
            }
            cb(position);
          };
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListeners)(
            document,
            Object.keys(eventTypeToMouseInteraction),
            handler,
            {
              capture: true,
              passive: true,
            }
          ).stop;
        }
        function initScrollObserver(cb, defaultPrivacyLevel) {
          var updatePosition = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.throttle)(
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.monitor)(
              function (event) {
                var target = event.target;
                if (
                  !target ||
                  (0,
                  _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
                    target,
                    defaultPrivacyLevel
                  ) ===
                    _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel
                      .HIDDEN ||
                  !(0,
                  _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                    target
                  )
                ) {
                  return;
                }
                var id = (0,
                _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                  target
                );
                if (target === document) {
                  if (
                    (0,
                    _datadog_browser_core__WEBPACK_IMPORTED_MODULE_8__.isExperimentalFeatureEnabled)(
                      "visualviewport"
                    )
                  ) {
                    cb({
                      id: id,
                      x: (0,
                      _viewports__WEBPACK_IMPORTED_MODULE_7__.getScrollX)(),
                      y: (0,
                      _viewports__WEBPACK_IMPORTED_MODULE_7__.getScrollY)(),
                    });
                  } else {
                    var scrollEl =
                      document.scrollingElement || document.documentElement;
                    cb({
                      id: id,
                      x: scrollEl.scrollLeft,
                      y: scrollEl.scrollTop,
                    });
                  }
                } else {
                  cb({
                    id: id,
                    x: target.scrollLeft,
                    y: target.scrollTop,
                  });
                }
              }
            ),
            SCROLL_OBSERVER_THRESHOLD
          ).throttled;
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListener)(
            document,
            "scroll" /* SCROLL */,
            updatePosition,
            { capture: true, passive: true }
          ).stop;
        }
        function initViewportResizeObserver(cb) {
          var updateDimension = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.throttle)(
            (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.monitor)(
              function () {
                var height = (0,
                _viewports__WEBPACK_IMPORTED_MODULE_7__.getWindowHeight)();
                var width = (0,
                _viewports__WEBPACK_IMPORTED_MODULE_7__.getWindowWidth)();
                cb({
                  height: Number(height),
                  width: Number(width),
                });
              }
            ),
            200
          ).throttled;
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListener)(
            window,
            "resize" /* RESIZE */,
            updateDimension,
            { capture: true, passive: true }
          ).stop;
        }
        var INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
        var lastInputStateMap = new WeakMap();
        function initInputObserver(cb, defaultPrivacyLevel) {
          function eventHandler(event) {
            var target = event.target;
            var nodePrivacyLevel = (0,
            _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
              target,
              defaultPrivacyLevel
            );
            if (
              !target ||
              !target.tagName ||
              !(0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.includes)(
                INPUT_TAGS,
                target.tagName
              ) ||
              nodePrivacyLevel ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.HIDDEN
            ) {
              return;
            }
            var type = target.type;
            var inputState;
            if (type === "radio" || type === "checkbox") {
              if (
                (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.shouldMaskNode)(
                  target,
                  nodePrivacyLevel
                )
              ) {
                return;
              }
              inputState = { isChecked: target.checked };
            } else {
              var value = (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getElementInputValue)(
                target,
                nodePrivacyLevel
              );
              if (value === undefined) {
                return;
              }
              inputState = { text: value };
            }
            // Can be multiple changes on the same node within the same batched mutation observation.
            cbWithDedup(target, inputState);
            // If a radio was checked, other radios with the same name attribute will be unchecked.
            var name = target.name;
            if (type === "radio" && name && target.checked) {
              (0, _utils__WEBPACK_IMPORTED_MODULE_5__.forEach)(
                document.querySelectorAll(
                  'input[type="radio"][name="' + name + '"]'
                ),
                function (el) {
                  if (el !== target) {
                    // TODO: Consider the privacy implications for various differing input privacy levels
                    cbWithDedup(el, { isChecked: false });
                  }
                }
              );
            }
          }
          /**
           * There can be multiple changes on the same node within the same batched mutation observation.
           */
          function cbWithDedup(target, inputState) {
            if (
              !(0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                target
              )
            ) {
              return;
            }
            var lastInputState = lastInputStateMap.get(target);
            if (
              !lastInputState ||
              lastInputState.text !== inputState.text ||
              lastInputState.isChecked !== inputState.isChecked
            ) {
              lastInputStateMap.set(target, inputState);
              cb(
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                    {},
                    inputState
                  ),
                  {
                    id: (0,
                    _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                      target
                    ),
                  }
                )
              );
            }
          }
          var stopEventListeners = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListeners)(
            document,
            ["input" /* INPUT */, "change" /* CHANGE */],
            eventHandler,
            {
              capture: true,
              passive: true,
            }
          ).stop;
          var propertyDescriptor = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
          );
          var hookProperties = [
            [HTMLInputElement.prototype, "value"],
            [HTMLInputElement.prototype, "checked"],
            [HTMLSelectElement.prototype, "value"],
            [HTMLTextAreaElement.prototype, "value"],
            // Some UI library use selectedIndex to set select value
            [HTMLSelectElement.prototype, "selectedIndex"],
          ];
          var hookResetters = [];
          if (propertyDescriptor && propertyDescriptor.set) {
            hookResetters.push.apply(
              hookResetters,
              hookProperties.map(function (p) {
                return (0,
                _utils__WEBPACK_IMPORTED_MODULE_5__.hookSetter)(p[0], p[1], {
                  set: (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.monitor)(
                    function () {
                      // mock to a normal event
                      eventHandler({ target: this });
                    }
                  ),
                });
              })
            );
          }
          return function () {
            hookResetters.forEach(function (h) {
              return h();
            });
            stopEventListeners();
          };
        }
        function initStyleSheetObserver(cb) {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          var insertRule = CSSStyleSheet.prototype.insertRule;
          CSSStyleSheet.prototype.insertRule = function (rule, index) {
            var _this = this;
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.callMonitored)(
              function () {
                if (
                  (0,
                  _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                    _this.ownerNode
                  )
                ) {
                  cb({
                    id: (0,
                    _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                      _this.ownerNode
                    ),
                    adds: [{ rule: rule, index: index }],
                  });
                }
              }
            );
            return insertRule.call(this, rule, index);
          };
          // eslint-disable-next-line @typescript-eslint/unbound-method
          var deleteRule = CSSStyleSheet.prototype.deleteRule;
          CSSStyleSheet.prototype.deleteRule = function (index) {
            var _this = this;
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.callMonitored)(
              function () {
                if (
                  (0,
                  _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                    _this.ownerNode
                  )
                ) {
                  cb({
                    id: (0,
                    _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                      _this.ownerNode
                    ),
                    removes: [{ index: index }],
                  });
                }
              }
            );
            return deleteRule.call(this, index);
          };
          return function () {
            CSSStyleSheet.prototype.insertRule = insertRule;
            CSSStyleSheet.prototype.deleteRule = deleteRule;
          };
        }
        function initMediaInteractionObserver(
          mediaInteractionCb,
          defaultPrivacyLevel
        ) {
          var handler = function (event) {
            var target = event.target;
            if (
              !target ||
              (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodePrivacyLevel)(
                target,
                defaultPrivacyLevel
              ) ===
                _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel
                  .HIDDEN ||
              !(0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.hasSerializedNode)(
                target
              )
            ) {
              return;
            }
            mediaInteractionCb({
              id: (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_3__.getSerializedNodeId)(
                target
              ),
              type:
                event.type === "play" /* PLAY */
                  ? _types__WEBPACK_IMPORTED_MODULE_4__.MediaInteractions.Play
                  : _types__WEBPACK_IMPORTED_MODULE_4__.MediaInteractions.Pause,
            });
          };
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListeners)(
            document,
            ["play" /* PLAY */, "pause" /* PAUSE */],
            handler,
            { capture: true, passive: true }
          ).stop;
        }
        function initFocusObserver(focusCb) {
          return (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListeners)(
            window,
            ["focus" /* FOCUS */, "blur" /* BLUR */],
            function () {
              focusCb({ has_focus: document.hasFocus() });
            }
          ).stop;
        }
        function initVisualViewportResizeObserver(cb) {
          if (!window.visualViewport) {
            return _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.noop;
          }
          var _a = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.throttle)(
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_10__.monitor)(
                function () {
                  cb(
                    (0,
                    _viewports__WEBPACK_IMPORTED_MODULE_7__.getVisualViewport)()
                  );
                }
              ),
              VISUAL_VIEWPORT_OBSERVER_THRESHOLD,
              {
                trailing: false,
              }
            ),
            updateDimension = _a.throttled,
            cancelThrottle = _a.cancel;
          var removeListener = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_9__.addEventListeners)(
            window.visualViewport,
            ["resize" /* RESIZE */, "scroll" /* SCROLL */],
            updateDimension,
            {
              capture: true,
              passive: true,
            }
          ).stop;
          return function stop() {
            removeListener();
            cancelThrottle();
          };
        }

        /***/
      },

    /***/ "./src/domain/record/privacy.ts":
      /*!**************************************!*\
  !*** ./src/domain/record/privacy.ts ***!
  \**************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ MAX_ATTRIBUTE_VALUE_CHAR_LENGTH: function () {
            return /* binding */ MAX_ATTRIBUTE_VALUE_CHAR_LENGTH;
          },
          /* harmony export */ getNodePrivacyLevel: function () {
            return /* binding */ getNodePrivacyLevel;
          },
          /* harmony export */ reducePrivacyLevel: function () {
            return /* binding */ reducePrivacyLevel;
          },
          /* harmony export */ getNodeSelfPrivacyLevel: function () {
            return /* binding */ getNodeSelfPrivacyLevel;
          },
          /* harmony export */ shouldMaskNode: function () {
            return /* binding */ shouldMaskNode;
          },
          /* harmony export */ censorText: function () {
            return /* binding */ censorText;
          },
          /* harmony export */ getTextContent: function () {
            return /* binding */ getTextContent;
          },
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../../constants */ "./src/constants.ts");
        /* harmony import */ var _serializationUtils__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./serializationUtils */ "./src/domain/record/serializationUtils.ts"
          );
        /* harmony import */ var _serialize__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./serialize */ "./src/domain/record/serialize.ts"
          );

        var MAX_ATTRIBUTE_VALUE_CHAR_LENGTH = 100000;

        var TEXT_MASKING_CHAR = "x";
        /**
         * Get node privacy level by iterating over its ancestors. When the direct parent privacy level is
         * know, it is best to use something like:
         *
         * derivePrivacyLevelGivenParent(getNodeSelfPrivacyLevel(node), parentNodePrivacyLevel)
         */
        function getNodePrivacyLevel(node, defaultPrivacyLevel) {
          var parentNodePrivacyLevel = node.parentNode
            ? getNodePrivacyLevel(node.parentNode, defaultPrivacyLevel)
            : defaultPrivacyLevel;
          var selfNodePrivacyLevel = getNodeSelfPrivacyLevel(node);
          return reducePrivacyLevel(
            selfNodePrivacyLevel,
            parentNodePrivacyLevel
          );
        }
        /**
         * Reduces the next privacy level based on self + parent privacy levels
         */
        function reducePrivacyLevel(childPrivacyLevel, parentNodePrivacyLevel) {
          switch (parentNodePrivacyLevel) {
            // These values cannot be overridden
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .HIDDEN:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .IGNORE:
              return parentNodePrivacyLevel;
          }
          switch (childPrivacyLevel) {
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel.ALLOW:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel.MASK:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .MASK_USER_INPUT:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .HIDDEN:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .IGNORE:
              return childPrivacyLevel;
            default:
              return parentNodePrivacyLevel;
          }
        }
        /**
         * Determines the node's own privacy level without checking for ancestors.
         */
        function getNodeSelfPrivacyLevel(node) {
          // Only Element types can be have a privacy level set
          if (!isElement(node)) {
            return;
          }
          var privAttr = node.getAttribute(
            _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_NAME
          );
          // Overrules to enforce end-user protection
          if (node.tagName === "BASE") {
            return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .ALLOW;
          }
          if (node.tagName === "INPUT") {
            var inputElement = node;
            if (
              inputElement.type === "password" ||
              inputElement.type === "email" ||
              inputElement.type === "tel"
            ) {
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .MASK;
            }
            if (inputElement.type === "hidden") {
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .MASK;
            }
            var autocomplete = inputElement.getAttribute("autocomplete");
            // Handle input[autocomplete=cc-number/cc-csc/cc-exp/cc-exp-month/cc-exp-year]
            if (autocomplete && autocomplete.indexOf("cc-") === 0) {
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .MASK;
            }
          }
          // Check HTML privacy attributes
          switch (privAttr) {
            case _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_VALUE_ALLOW:
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .ALLOW;
            case _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_VALUE_MASK:
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .MASK;
            case _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_VALUE_MASK_USER_INPUT:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_VALUE_INPUT_IGNORED: // Deprecated, now aliased
            case _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_VALUE_INPUT_MASKED: // Deprecated, now aliased
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .MASK_USER_INPUT;
            case _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_ATTR_VALUE_HIDDEN:
              return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
                .HIDDEN;
          }
          // Check HTML privacy classes
          if (
            node.classList.contains(
              _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_CLASS_ALLOW
            )
          ) {
            return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .ALLOW;
          } else if (
            node.classList.contains(
              _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_CLASS_MASK
            )
          ) {
            return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .MASK;
          } else if (
            node.classList.contains(
              _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_CLASS_HIDDEN
            )
          ) {
            return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .HIDDEN;
          } else if (
            node.classList.contains(
              _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_CLASS_MASK_USER_INPUT
            ) ||
            node.classList.contains(
              _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_CLASS_INPUT_MASKED
            ) || // Deprecated, now aliased
            node.classList.contains(
              _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_CLASS_INPUT_IGNORED
            ) // Deprecated, now aliased
          ) {
            return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .MASK_USER_INPUT;
          } else if (
            (0, _serialize__WEBPACK_IMPORTED_MODULE_2__.shouldIgnoreElement)(
              node
            )
          ) {
            // such as for scripts
            return _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .IGNORE;
          }
        }
        /**
         * Helper aiming to unify `mask` and `mask-user-input` privacy levels:
         *
         * In the `mask` case, it is trivial: we should mask the element.
         *
         * In the `mask-user-input` case, we should mask the element only if it is a "form" element or the
         * direct parent is a form element for text nodes).
         *
         * Other `shouldMaskNode` cases are edge cases that should not matter too much (ex: should we mask a
         * node if it is ignored or hidden? it doesn't matter since it won't be serialized).
         */
        function shouldMaskNode(node, privacyLevel) {
          switch (privacyLevel) {
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel.MASK:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .HIDDEN:
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .IGNORE:
              return true;
            case _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel
              .MASK_USER_INPUT:
              return isTextNode(node)
                ? isFormElement(node.parentNode)
                : isFormElement(node);
            default:
              return false;
          }
        }
        function isElement(node) {
          return node.nodeType === node.ELEMENT_NODE;
        }
        function isTextNode(node) {
          return node.nodeType === node.TEXT_NODE;
        }
        function isFormElement(node) {
          if (!node || node.nodeType !== node.ELEMENT_NODE) {
            return false;
          }
          var element = node;
          if (element.tagName === "INPUT") {
            switch (element.type) {
              case "button":
              case "color":
              case "reset":
              case "submit":
                return false;
            }
          }
          return !!_constants__WEBPACK_IMPORTED_MODULE_0__
            .FORM_PRIVATE_TAG_NAMES[element.tagName];
        }
        /**
         * Text censoring non-destructively maintains whitespace characters in order to preserve text shape
         * during replay.
         */
        var censorText = function (text) {
          return text.replace(/\S/g, TEXT_MASKING_CHAR);
        };
        function getTextContent(
          textNode,
          ignoreWhiteSpace,
          parentNodePrivacyLevel
        ) {
          var _a;
          // The parent node may not be a html element which has a tagName attribute.
          // So just let it be undefined which is ok in this use case.
          var parentTagName =
            (_a = textNode.parentElement) === null || _a === void 0
              ? void 0
              : _a.tagName;
          var textContent = textNode.textContent || "";
          if (ignoreWhiteSpace && !textContent.trim()) {
            return;
          }
          var nodePrivacyLevel = parentNodePrivacyLevel;
          var isStyle = parentTagName === "STYLE" ? true : undefined;
          var isScript = parentTagName === "SCRIPT";
          if (isScript) {
            // For perf reasons, we don't record script (heuristic)
            textContent =
              _constants__WEBPACK_IMPORTED_MODULE_0__.CENSORED_STRING_MARK;
          } else if (
            nodePrivacyLevel ===
            _constants__WEBPACK_IMPORTED_MODULE_0__.NodePrivacyLevel.HIDDEN
          ) {
            // Should never occur, but just in case, we set to CENSORED_MARK.
            textContent =
              _constants__WEBPACK_IMPORTED_MODULE_0__.CENSORED_STRING_MARK;
          } else if (shouldMaskNode(textNode, nodePrivacyLevel)) {
            if (isStyle) {
              // Style tags are `overruled` (Use `hide` to enforce privacy)
              textContent = (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_1__.makeStylesheetUrlsAbsolute)(
                textContent,
                location.href
              );
            } else if (
              // Scrambling the child list breaks text nodes for DATALIST/SELECT/OPTGROUP
              parentTagName === "DATALIST" ||
              parentTagName === "SELECT" ||
              parentTagName === "OPTGROUP"
            ) {
              if (!textContent.trim()) {
                return;
              }
            } else if (parentTagName === "OPTION") {
              // <Option> has low entropy in charset + text length, so use `CENSORED_STRING_MARK` when masked
              textContent =
                _constants__WEBPACK_IMPORTED_MODULE_0__.CENSORED_STRING_MARK;
            } else {
              textContent = censorText(textContent);
            }
          }
          return textContent;
        }

        /***/
      },

    /***/ "./src/domain/record/record.ts":
      /*!*************************************!*\
  !*** ./src/domain/record/record.ts ***!
  \*************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ record: function () {
            return /* binding */ record;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );
        /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../../types */ "./src/types.ts");
        /* harmony import */ var _serialize__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./serialize */ "./src/domain/record/serialize.ts"
          );
        /* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./observer */ "./src/domain/record/observer.ts"
          );
        /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(/*! ./types */ "./src/domain/record/types.ts");
        /* harmony import */ var _mutationObserver__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(
            /*! ./mutationObserver */ "./src/domain/record/mutationObserver.ts"
          );
        /* harmony import */ var _viewports__WEBPACK_IMPORTED_MODULE_6__ =
          __webpack_require__(
            /*! ./viewports */ "./src/domain/record/viewports.ts"
          );

        function record(options) {
          var emit = options.emit;
          // runtime checks for user options
          if (!emit) {
            throw new Error("emit function is required");
          }
          var mutationController =
            new _mutationObserver__WEBPACK_IMPORTED_MODULE_5__.MutationController();
          var takeFullSnapshot = function () {
            mutationController.flush(); // process any pending mutation before taking a full snapshot
            emit({
              data: {
                height: (0,
                _viewports__WEBPACK_IMPORTED_MODULE_6__.getWindowHeight)(),
                href: window.location.href,
                width: (0,
                _viewports__WEBPACK_IMPORTED_MODULE_6__.getWindowWidth)(),
              },
              type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType.Meta,
            });
            emit({
              data: {
                has_focus: document.hasFocus(),
              },
              type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType.Focus,
            });
            emit({
              data: {
                node: (0,
                _serialize__WEBPACK_IMPORTED_MODULE_2__.serializeDocument)(
                  document,
                  options.defaultPrivacyLevel
                ),
                initialOffset: {
                  left: (0,
                  _viewports__WEBPACK_IMPORTED_MODULE_6__.getScrollX)(),
                  top: (0,
                  _viewports__WEBPACK_IMPORTED_MODULE_6__.getScrollY)(),
                },
              },
              type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType.FullSnapshot,
            });
            if (
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_7__.isExperimentalFeatureEnabled)(
                "visualviewport"
              ) &&
              window.visualViewport
            ) {
              emit({
                data: (0,
                _viewports__WEBPACK_IMPORTED_MODULE_6__.getVisualViewport)(),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .VisualViewport,
              });
            }
          };
          takeFullSnapshot();
          var stopObservers = (0,
          _observer__WEBPACK_IMPORTED_MODULE_3__.initObservers)({
            mutationController: mutationController,
            defaultPrivacyLevel: options.defaultPrivacyLevel,
            inputCb: function (v) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .Input,
                  },
                  v
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            mediaInteractionCb: function (p) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .MediaInteraction,
                  },
                  p
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            mouseInteractionCb: function (d) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .MouseInteraction,
                  },
                  d
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            mousemoveCb: function (positions, source) {
              return emit({
                data: {
                  positions: positions,
                  source: source,
                },
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            mutationCb: function (m) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .Mutation,
                  },
                  m
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            scrollCb: function (p) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .Scroll,
                  },
                  p
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            styleSheetRuleCb: function (r) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .StyleSheetRule,
                  },
                  r
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            viewportResizeCb: function (d) {
              return emit({
                data: (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                  {
                    source:
                      _types__WEBPACK_IMPORTED_MODULE_4__.IncrementalSource
                        .ViewportResize,
                  },
                  d
                ),
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .IncrementalSnapshot,
              });
            },
            focusCb: function (data) {
              return emit({
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType.Focus,
                data: data,
              });
            },
            visualViewportResizeCb: function (data) {
              emit({
                data: data,
                type: _types__WEBPACK_IMPORTED_MODULE_1__.RecordType
                  .VisualViewport,
              });
            },
          });
          return {
            stop: stopObservers,
            takeFullSnapshot: takeFullSnapshot,
            flushMutations: function () {
              return mutationController.flush();
            },
          };
        }

        /***/
      },

    /***/ "./src/domain/record/serializationUtils.ts":
      /*!*************************************************!*\
  !*** ./src/domain/record/serializationUtils.ts ***!
  \*************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ hasSerializedNode: function () {
            return /* binding */ hasSerializedNode;
          },
          /* harmony export */ nodeAndAncestorsHaveSerializedNode: function () {
            return /* binding */ nodeAndAncestorsHaveSerializedNode;
          },
          /* harmony export */ getSerializedNodeId: function () {
            return /* binding */ getSerializedNodeId;
          },
          /* harmony export */ setSerializedNodeId: function () {
            return /* binding */ setSerializedNodeId;
          },
          /* harmony export */ makeStylesheetUrlsAbsolute: function () {
            return /* binding */ makeStylesheetUrlsAbsolute;
          },
          /* harmony export */ makeSrcsetUrlsAbsolute: function () {
            return /* binding */ makeSrcsetUrlsAbsolute;
          },
          /* harmony export */ makeUrlAbsolute: function () {
            return /* binding */ makeUrlAbsolute;
          },
          /* harmony export */ getElementInputValue: function () {
            return /* binding */ getElementInputValue;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/urlPolyfill.ts"
          );
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../../constants */ "./src/constants.ts");
        /* harmony import */ var _privacy__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ./privacy */ "./src/domain/record/privacy.ts"
          );

        var serializedNodeIds = new WeakMap();
        function hasSerializedNode(node) {
          return serializedNodeIds.has(node);
        }
        function nodeAndAncestorsHaveSerializedNode(node) {
          var current = node;
          while (current) {
            if (!hasSerializedNode(current)) {
              return false;
            }
            current = current.parentNode;
          }
          return true;
        }
        function getSerializedNodeId(node) {
          return serializedNodeIds.get(node);
        }
        function setSerializedNodeId(node, serializeNodeId) {
          serializedNodeIds.set(node, serializeNodeId);
        }
        var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")([^"]*)"|([^)]*))\)/gm;
        var ABSOLUTE_URL = /^[A-Za-z]+:|^\/\//;
        var DATA_URI = /^data:.*,/i;
        function makeStylesheetUrlsAbsolute(cssText, baseUrl) {
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.isExperimentalFeatureEnabled)(
              "base-tag"
            )
          ) {
            return cssText;
          }
          return cssText.replace(
            URL_IN_CSS_REF,
            function (origin, quote1, path1, quote2, path2, path3) {
              var filePath = path1 || path2 || path3;
              if (
                !filePath ||
                ABSOLUTE_URL.test(filePath) ||
                DATA_URI.test(filePath)
              ) {
                return origin;
              }
              var maybeQuote = quote1 || quote2 || "";
              return (
                "url(" +
                maybeQuote +
                makeUrlAbsolute(filePath, baseUrl) +
                maybeQuote +
                ")"
              );
            }
          );
        }
        var SRCSET_URLS = /(^\s*|,\s*)([^\s,]+)/g;
        function makeSrcsetUrlsAbsolute(attributeValue, baseUrl) {
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.isExperimentalFeatureEnabled)(
              "base-tag"
            )
          ) {
            return attributeValue;
          }
          return attributeValue.replace(SRCSET_URLS, function (_, prefix, url) {
            return "" + prefix + makeUrlAbsolute(url, baseUrl);
          });
        }
        function makeUrlAbsolute(url, baseUrl) {
          try {
            if (
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.isExperimentalFeatureEnabled)(
                "base-tag"
              )
            ) {
              return url;
            }
            return (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.buildUrl)(
              url.trim(),
              baseUrl
            ).href;
          } catch (_) {
            return url;
          }
        }
        /**
         * Get the element "value" to be serialized as an attribute or an input update record. It respects
         * the input privacy mode of the element.
         * PERFROMANCE OPTIMIZATION: Assumes that privacy level `HIDDEN` is never encountered because of earlier checks.
         */
        function getElementInputValue(element, nodePrivacyLevel) {
          /*
     BROWSER SPEC NOTE: <input>, <select>
     For some <input> elements, the `value` is an exceptional property/attribute that has the
     value synced between el.value and el.getAttribute()
     input[type=button,checkbox,hidden,image,radio,reset,submit]
     */
          var tagName = element.tagName;
          var value = element.value;
          if (
            (0, _privacy__WEBPACK_IMPORTED_MODULE_1__.shouldMaskNode)(
              element,
              nodePrivacyLevel
            )
          ) {
            var type = element.type;
            if (
              tagName === "INPUT" &&
              (type === "button" || type === "submit" || type === "reset")
            ) {
              // Overrule `MASK` privacy level for button-like element values, as they are used during replay
              // to display their label. They can still be hidden via the "hidden" privacy attribute or class name.
              return value;
            } else if (!value || tagName === "OPTION") {
              // <Option> value provides no benefit
              return;
            }
            return _constants__WEBPACK_IMPORTED_MODULE_0__.CENSORED_STRING_MARK;
          }
          if (tagName === "OPTION" || tagName === "SELECT") {
            return element.value;
          }
          if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
            return;
          }
          return value;
        }

        /***/
      },

    /***/ "./src/domain/record/serialize.ts":
      /*!****************************************!*\
  !*** ./src/domain/record/serialize.ts ***!
  \****************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ serializeDocument: function () {
            return /* binding */ serializeDocument;
          },
          /* harmony export */ serializeNodeWithId: function () {
            return /* binding */ serializeNodeWithId;
          },
          /* harmony export */ serializeDocumentNode: function () {
            return /* binding */ serializeDocumentNode;
          },
          /* harmony export */ serializeElementNode: function () {
            return /* binding */ serializeElementNode;
          },
          /* harmony export */ shouldIgnoreElement: function () {
            return /* binding */ shouldIgnoreElement;
          },
          /* harmony export */ serializeChildNodes: function () {
            return /* binding */ serializeChildNodes;
          },
          /* harmony export */ serializeAttribute: function () {
            return /* binding */ serializeAttribute;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../../constants */ "./src/constants.ts");
        /* harmony import */ var _privacy__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./privacy */ "./src/domain/record/privacy.ts"
          );
        /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(/*! ./types */ "./src/domain/record/types.ts");
        /* harmony import */ var _serializationUtils__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! ./serializationUtils */ "./src/domain/record/serializationUtils.ts"
          );
        /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ =
          __webpack_require__(/*! ./utils */ "./src/domain/record/utils.ts");

        function serializeDocument(document, defaultPrivacyLevel) {
          // We are sure that Documents are never ignored, so this function never returns null
          return serializeNodeWithId(document, {
            document: document,
            parentNodePrivacyLevel: defaultPrivacyLevel,
          });
        }
        function serializeNodeWithId(node, options) {
          var serializedNode = serializeNode(node, options);
          if (!serializedNode) {
            return null;
          }
          // Try to reuse the previous id
          var id =
            (0,
            _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.getSerializedNodeId)(
              node
            ) || generateNextId();
          var serializedNodeWithId = serializedNode;
          serializedNodeWithId.id = id;
          (0,
          _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.setSerializedNodeId)(
            node,
            id
          );
          if (options.serializedNodeIds) {
            options.serializedNodeIds.add(id);
          }
          return serializedNodeWithId;
        }
        function serializeNode(node, options) {
          switch (node.nodeType) {
            case node.DOCUMENT_NODE:
              return serializeDocumentNode(node, options);
            case node.DOCUMENT_TYPE_NODE:
              return serializeDocumentTypeNode(node);
            case node.ELEMENT_NODE:
              return serializeElementNode(node, options);
            case node.TEXT_NODE:
              return serializeTextNode(node, options);
            case node.CDATA_SECTION_NODE:
              return serializeCDataNode();
          }
        }
        function serializeDocumentNode(document, options) {
          return {
            type: _types__WEBPACK_IMPORTED_MODULE_3__.NodeType.Document,
            childNodes: serializeChildNodes(document, options),
          };
        }
        function serializeDocumentTypeNode(documentType) {
          return {
            type: _types__WEBPACK_IMPORTED_MODULE_3__.NodeType.DocumentType,
            name: documentType.name,
            publicId: documentType.publicId,
            systemId: documentType.systemId,
          };
        }
        /**
         * Serialzing Element nodes involves capturing:
         * 1. HTML ATTRIBUTES:
         * 2. JS STATE:
         * - scroll offsets
         * - Form fields (input value, checkbox checked, otpion selection, range)
         * - Canvas state,
         * - Media (video/audio) play mode + currentTime
         * - iframe contents
         * - webcomponents
         * 3. CUSTOM PROPERTIES:
         * - height+width for when `hidden` to cover the element
         * 4. EXCLUDED INTERACTION STATE:
         * - focus (possible, but not worth perf impact)
         * - hover (tracked only via mouse activity)
         * - fullscreen mode
         */
        function serializeElementNode(element, options) {
          var _a;
          var tagName = getValidTagName(element.tagName);
          var isSVG = isSVGElement(element) || undefined;
          // For performance reason, we don't use getNodePrivacyLevel directly: we leverage the
          // parentNodePrivacyLevel option to avoid iterating over all parents
          var nodePrivacyLevel = (0,
          _privacy__WEBPACK_IMPORTED_MODULE_2__.reducePrivacyLevel)(
            (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.getNodeSelfPrivacyLevel)(
              element
            ),
            options.parentNodePrivacyLevel
          );
          if (
            nodePrivacyLevel ===
            _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.HIDDEN
          ) {
            var _b = element.getBoundingClientRect(),
              width = _b.width,
              height = _b.height;
            return {
              type: _types__WEBPACK_IMPORTED_MODULE_3__.NodeType.Element,
              tagName: tagName,
              attributes:
                ((_a = {
                  rr_width: width + "px",
                  rr_height: height + "px",
                }),
                (_a[_constants__WEBPACK_IMPORTED_MODULE_1__.PRIVACY_ATTR_NAME] =
                  _constants__WEBPACK_IMPORTED_MODULE_1__.PRIVACY_ATTR_VALUE_HIDDEN),
                _a),
              childNodes: [],
              isSVG: isSVG,
            };
          }
          // Ignore Elements like Script and some Link, Metas
          if (
            nodePrivacyLevel ===
            _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.IGNORE
          ) {
            return;
          }
          var attributes = getAttributesForPrivacyLevel(
            element,
            nodePrivacyLevel
          );
          var childNodes = [];
          if (element.childNodes.length) {
            // OBJECT POOLING OPTIMIZATION:
            // We should not create a new object systematically as it could impact performances. Try to reuse
            // the same object as much as possible, and clone it only if we need to.
            var childNodesSerializationOptions = void 0;
            if (
              options.parentNodePrivacyLevel === nodePrivacyLevel &&
              options.ignoreWhiteSpace === (tagName === "head")
            ) {
              childNodesSerializationOptions = options;
            } else {
              childNodesSerializationOptions = (0,
              tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options),
                {
                  parentNodePrivacyLevel: nodePrivacyLevel,
                  ignoreWhiteSpace: tagName === "head",
                }
              );
            }
            childNodes = serializeChildNodes(
              element,
              childNodesSerializationOptions
            );
          }
          return {
            type: _types__WEBPACK_IMPORTED_MODULE_3__.NodeType.Element,
            tagName: tagName,
            attributes: attributes,
            childNodes: childNodes,
            isSVG: isSVG,
          };
        }
        /**
         * TODO: Preserve CSS element order, and record the presence of the tag, just don't render
         * We don't need this logic on the recorder side.
         * For security related meta's, customer can mask themmanually given they
         * are easy to identify in the HEAD tag.
         */
        function shouldIgnoreElement(element) {
          if (element.nodeName === "SCRIPT") {
            return true;
          }
          if (element.nodeName === "LINK") {
            var relAttribute = getLowerCaseAttribute("rel");
            return (
              // Scripts
              (relAttribute === "preload" &&
                getLowerCaseAttribute("as") === "script") ||
              // Favicons
              relAttribute === "shortcut icon" ||
              relAttribute === "icon"
            );
          }
          if (element.nodeName === "META") {
            var nameAttribute = getLowerCaseAttribute("name");
            var relAttribute = getLowerCaseAttribute("rel");
            var propertyAttribute = getLowerCaseAttribute("property");
            return (
              // Favicons
              /^msapplication-tile(image|color)$/.test(nameAttribute) ||
              nameAttribute === "application-name" ||
              relAttribute === "icon" ||
              relAttribute === "apple-touch-icon" ||
              relAttribute === "shortcut icon" ||
              // Description
              nameAttribute === "keywords" ||
              nameAttribute === "description" ||
              // Social
              /^(og|twitter|fb):/.test(propertyAttribute) ||
              /^(og|twitter):/.test(nameAttribute) ||
              nameAttribute === "pinterest" ||
              // Robots
              nameAttribute === "robots" ||
              nameAttribute === "googlebot" ||
              nameAttribute === "bingbot" ||
              // Http headers. Ex: X-UA-Compatible, Content-Type, Content-Language, cache-control,
              // X-Translated-By
              element.hasAttribute("http-equiv") ||
              // Authorship
              nameAttribute === "author" ||
              nameAttribute === "generator" ||
              nameAttribute === "framework" ||
              nameAttribute === "publisher" ||
              nameAttribute === "progid" ||
              /^article:/.test(propertyAttribute) ||
              /^product:/.test(propertyAttribute) ||
              // Verification
              nameAttribute === "google-site-verification" ||
              nameAttribute === "yandex-verification" ||
              nameAttribute === "csrf-token" ||
              nameAttribute === "p:domain_verify" ||
              nameAttribute === "verify-v1" ||
              nameAttribute === "verification" ||
              nameAttribute === "shopify-checkout-api-token"
            );
          }
          function getLowerCaseAttribute(name) {
            return (element.getAttribute(name) || "").toLowerCase();
          }
          return false;
        }
        /**
         * Text Nodes are dependant on Element nodes
         * Privacy levels are set on elements so we check the parentElement of a text node
         * for privacy level.
         */
        function serializeTextNode(textNode, options) {
          var _a;
          // The parent node may not be a html element which has a tagName attribute.
          // So just let it be undefined which is ok in this use case.
          var parentTagName =
            (_a = textNode.parentElement) === null || _a === void 0
              ? void 0
              : _a.tagName;
          var textContent = (0,
          _privacy__WEBPACK_IMPORTED_MODULE_2__.getTextContent)(
            textNode,
            options.ignoreWhiteSpace || false,
            options.parentNodePrivacyLevel
          );
          if (!textContent) {
            return;
          }
          return {
            type: _types__WEBPACK_IMPORTED_MODULE_3__.NodeType.Text,
            textContent: textContent,
            isStyle: parentTagName === "STYLE" ? true : undefined,
          };
        }
        function serializeCDataNode() {
          return {
            type: _types__WEBPACK_IMPORTED_MODULE_3__.NodeType.CDATA,
            textContent: "",
          };
        }
        function serializeChildNodes(node, options) {
          var result = [];
          (0, _utils__WEBPACK_IMPORTED_MODULE_5__.forEach)(
            node.childNodes,
            function (childNode) {
              var serializedChildNode = serializeNodeWithId(childNode, options);
              if (serializedChildNode) {
                result.push(serializedChildNode);
              }
            }
          );
          return result;
        }
        function serializeAttribute(element, nodePrivacyLevel, attributeName) {
          var _a, _b, _c;
          if (
            nodePrivacyLevel ===
            _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.HIDDEN
          ) {
            // dup condition for direct access case
            return null;
          }
          var attributeValue = element.getAttribute(attributeName);
          if (
            nodePrivacyLevel ===
            _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.MASK
          ) {
            var tagName = element.tagName;
            switch (attributeName) {
              // Mask Attribute text content
              case "title":
              case "alt":
                return _constants__WEBPACK_IMPORTED_MODULE_1__.CENSORED_STRING_MARK;
            }
            // mask image URLs
            if (tagName === "IMG" || tagName === "SOURCE") {
              if (attributeName === "src" || attributeName === "srcset") {
                return _constants__WEBPACK_IMPORTED_MODULE_1__.CENSORED_IMG_MARK;
              }
            }
            // mask <a> URLs
            if (tagName === "A" && attributeName === "href") {
              return _constants__WEBPACK_IMPORTED_MODULE_1__.CENSORED_STRING_MARK;
            }
            // mask data-* attributes
            if (
              attributeValue &&
              attributeName.indexOf("data-") === 0 &&
              attributeName !==
                _constants__WEBPACK_IMPORTED_MODULE_1__.PRIVACY_ATTR_NAME
            ) {
              // Exception: it's safe to reveal the `${PRIVACY_ATTR_NAME}` attr
              return _constants__WEBPACK_IMPORTED_MODULE_1__.CENSORED_STRING_MARK;
            }
          }
          if (!attributeValue || typeof attributeValue !== "string") {
            return attributeValue;
          }
          // Minimum Fix for customer.
          if (
            attributeValue.length >
              _privacy__WEBPACK_IMPORTED_MODULE_2__.MAX_ATTRIBUTE_VALUE_CHAR_LENGTH &&
            attributeValue.slice(0, 5) === "data:"
          ) {
            return "data:truncated";
          }
          // Rebuild absolute URLs from relative (without using <base> tag)
          var doc = element.ownerDocument;
          switch (attributeName) {
            case "src":
            case "href":
              return (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.makeUrlAbsolute)(
                attributeValue,
                (_a = doc.location) === null || _a === void 0 ? void 0 : _a.href
              );
            case "srcset":
              return (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.makeSrcsetUrlsAbsolute)(
                attributeValue,
                (_b = doc.location) === null || _b === void 0 ? void 0 : _b.href
              );
            case "style":
              return (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.makeStylesheetUrlsAbsolute)(
                attributeValue,
                (_c = doc.location) === null || _c === void 0 ? void 0 : _c.href
              );
            default:
              return attributeValue;
          }
        }
        var _nextId = 1;
        function generateNextId() {
          return _nextId++;
        }
        var TAG_NAME_REGEX = /[^a-z1-6-_]/;
        function getValidTagName(tagName) {
          var processedTagName = tagName.toLowerCase().trim();
          if (TAG_NAME_REGEX.test(processedTagName)) {
            // if the tag name is odd and we cannot extract
            // anything from the string, then we return a
            // generic div
            return "div";
          }
          return processedTagName;
        }
        function getCssRulesString(s) {
          try {
            var rules = s.rules || s.cssRules;
            return rules
              ? Array.from(rules).map(getCssRuleString).join("")
              : null;
          } catch (error) {
            return null;
          }
        }
        function getCssRuleString(rule) {
          return isCSSImportRule(rule)
            ? getCssRulesString(rule.styleSheet) || ""
            : rule.cssText;
        }
        function isCSSImportRule(rule) {
          return "styleSheet" in rule;
        }
        function isSVGElement(el) {
          return el.tagName === "svg" || el instanceof SVGElement;
        }
        function getAttributesForPrivacyLevel(element, nodePrivacyLevel) {
          if (
            nodePrivacyLevel ===
            _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.HIDDEN
          ) {
            return {};
          }
          var safeAttrs = {};
          var tagName = getValidTagName(element.tagName);
          var doc = element.ownerDocument;
          for (var i = 0; i < element.attributes.length; i += 1) {
            var attribute = element.attributes.item(i);
            var attributeName = attribute.name;
            var attributeValue = serializeAttribute(
              element,
              nodePrivacyLevel,
              attributeName
            );
            if (attributeValue !== null) {
              safeAttrs[attributeName] = attributeValue;
            }
          }
          if (
            element.value &&
            (tagName === "textarea" ||
              tagName === "select" ||
              tagName === "option" ||
              tagName === "input")
          ) {
            var formValue = (0,
            _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.getElementInputValue)(
              element,
              nodePrivacyLevel
            );
            if (formValue !== undefined) {
              safeAttrs.value = formValue;
            }
          }
          /**
           * <Option> can be selected, which occurs if its `value` matches ancestor `<Select>.value`
           */
          if (
            tagName === "option" &&
            nodePrivacyLevel ===
              _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.ALLOW
          ) {
            // For privacy=`MASK`, all the values would be the same, so skip.
            var optionElement = element;
            if (optionElement.selected) {
              safeAttrs.selected = optionElement.selected;
            }
          }
          // remote css
          if (tagName === "link") {
            var stylesheet = Array.from(doc.styleSheets).find(function (s) {
              return s.href === element.href;
            });
            var cssText = getCssRulesString(stylesheet);
            if (cssText && stylesheet) {
              delete safeAttrs.rel;
              delete safeAttrs.href;
              safeAttrs._cssText = (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.makeStylesheetUrlsAbsolute)(
                cssText,
                stylesheet.href
              );
            }
          }
          // dynamic stylesheet
          if (
            tagName === "style" &&
            element.sheet &&
            // TODO: Currently we only try to get dynamic stylesheet when it is an empty style element
            !(element.innerText || element.textContent || "").trim().length
          ) {
            var cssText = getCssRulesString(element.sheet);
            if (cssText) {
              safeAttrs._cssText = (0,
              _serializationUtils__WEBPACK_IMPORTED_MODULE_4__.makeStylesheetUrlsAbsolute)(
                cssText,
                location.href
              );
            }
          }
          /**
           * Forms: input[type=checkbox,radio]
           * The `checked` property for <input> is a little bit special:
           * 1. el.checked is a setter that returns if truthy.
           * 2. getAttribute returns the string value
           * getAttribute('checked') does not sync with `Element.checked`, so use JS property
           * NOTE: `checked` property exists on `HTMLInputElement`. For serializer assumptions, we check for type=radio|check.
           */
          var inputElement = element;
          if (
            tagName === "input" &&
            (inputElement.type === "radio" || inputElement.type === "checkbox")
          ) {
            if (
              nodePrivacyLevel ===
              _constants__WEBPACK_IMPORTED_MODULE_1__.NodePrivacyLevel.ALLOW
            ) {
              safeAttrs.checked = !!inputElement.checked;
            } else if (
              (0, _privacy__WEBPACK_IMPORTED_MODULE_2__.shouldMaskNode)(
                inputElement,
                nodePrivacyLevel
              )
            ) {
              safeAttrs.checked =
                _constants__WEBPACK_IMPORTED_MODULE_1__.CENSORED_STRING_MARK;
            }
          }
          /**
           * Serialize the media playback state
           */
          if (tagName === "audio" || tagName === "video") {
            var mediaElement = element;
            safeAttrs.rr_mediaState = mediaElement.paused ? "paused" : "played";
          }
          /**
           * Serialize the scroll state for each element
           */
          if (element.scrollLeft) {
            safeAttrs.rr_scrollLeft = Math.round(element.scrollLeft);
          }
          if (element.scrollTop) {
            safeAttrs.rr_scrollTop = Math.round(element.scrollTop);
          }
          return safeAttrs;
        }

        /***/
      },

    /***/ "./src/domain/record/types.ts":
      /*!************************************!*\
  !*** ./src/domain/record/types.ts ***!
  \************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ IncrementalSource: function () {
            return /* binding */ IncrementalSource;
          },
          /* harmony export */ MouseInteractions: function () {
            return /* binding */ MouseInteractions;
          },
          /* harmony export */ MediaInteractions: function () {
            return /* binding */ MediaInteractions;
          },
          /* harmony export */ NodeType: function () {
            return /* binding */ NodeType;
          },
          /* harmony export */
        });
        var IncrementalSource;
        (function (IncrementalSource) {
          IncrementalSource[(IncrementalSource["Mutation"] = 0)] = "Mutation";
          IncrementalSource[(IncrementalSource["MouseMove"] = 1)] = "MouseMove";
          IncrementalSource[(IncrementalSource["MouseInteraction"] = 2)] =
            "MouseInteraction";
          IncrementalSource[(IncrementalSource["Scroll"] = 3)] = "Scroll";
          IncrementalSource[(IncrementalSource["ViewportResize"] = 4)] =
            "ViewportResize";
          IncrementalSource[(IncrementalSource["Input"] = 5)] = "Input";
          IncrementalSource[(IncrementalSource["TouchMove"] = 6)] = "TouchMove";
          IncrementalSource[(IncrementalSource["MediaInteraction"] = 7)] =
            "MediaInteraction";
          IncrementalSource[(IncrementalSource["StyleSheetRule"] = 8)] =
            "StyleSheetRule";
          // CanvasMutation = 9,
          // Font = 10,
        })(IncrementalSource || (IncrementalSource = {}));
        var MouseInteractions = {
          MouseUp: 0,
          MouseDown: 1,
          Click: 2,
          ContextMenu: 3,
          DblClick: 4,
          Focus: 5,
          Blur: 6,
          TouchStart: 7,
          TouchEnd: 9,
        };
        var MediaInteractions = {
          Play: 0,
          Pause: 1,
        };
        var NodeType;
        (function (NodeType) {
          NodeType[(NodeType["Document"] = 0)] = "Document";
          NodeType[(NodeType["DocumentType"] = 1)] = "DocumentType";
          NodeType[(NodeType["Element"] = 2)] = "Element";
          NodeType[(NodeType["Text"] = 3)] = "Text";
          NodeType[(NodeType["CDATA"] = 4)] = "CDATA";
          NodeType[(NodeType["Comment"] = 5)] = "Comment";
        })(NodeType || (NodeType = {}));

        /***/
      },

    /***/ "./src/domain/record/utils.ts":
      /*!************************************!*\
  !*** ./src/domain/record/utils.ts ***!
  \************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ hookSetter: function () {
            return /* binding */ hookSetter;
          },
          /* harmony export */ isTouchEvent: function () {
            return /* binding */ isTouchEvent;
          },
          /* harmony export */ forEach: function () {
            return /* binding */ forEach;
          },
          /* harmony export */
        });
        function hookSetter(target, key, d) {
          var original = Object.getOwnPropertyDescriptor(target, key);
          Object.defineProperty(target, key, {
            set: function (value) {
              var _this = this;
              // put hooked setter into event loop to avoid of set latency
              setTimeout(function () {
                d.set.call(_this, value);
              }, 0);
              if (original && original.set) {
                original.set.call(this, value);
              }
            },
          });
          return function () {
            Object.defineProperty(target, key, original || {});
          };
        }
        function isTouchEvent(event) {
          return Boolean(event.changedTouches);
        }
        function forEach(list, callback) {
          Array.prototype.forEach.call(list, callback);
        }

        /***/
      },

    /***/ "./src/domain/record/viewports.ts":
      /*!****************************************!*\
  !*** ./src/domain/record/viewports.ts ***!
  \****************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ convertMouseEventToLayoutCoordinates:
            function () {
              return /* binding */ convertMouseEventToLayoutCoordinates;
            },
          /* harmony export */ getVisualViewport: function () {
            return /* binding */ getVisualViewport;
          },
          /* harmony export */ getWindowWidth: function () {
            return /* binding */ getWindowWidth;
          },
          /* harmony export */ getWindowHeight: function () {
            return /* binding */ getWindowHeight;
          },
          /* harmony export */ getScrollX: function () {
            return /* binding */ getScrollX;
          },
          /* harmony export */ getScrollY: function () {
            return /* binding */ getScrollY;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/configuration/experimentalFeatures.ts"
          );
        /**
         * Browsers have not standardized various dimension properties. Mobile devices typically report
         * dimensions in reference to the visual viewport, while desktop uses the layout viewport. For example,
         * Mobile Chrome will change innerWidth when a pinch zoom takes place, while Chrome Desktop (mac) will not.
         *
         * With the new Viewport API, we now calculate and normalize dimension properties to the layout viewport.
         * If the VisualViewport API is not supported by a browser, it isn't reasonably possible to detect or normalize
         * which viewport is being measured. Therefore these exported functions will fallback to assuming that the layout
         * viewport is being measured by the browser
         */

        // Scrollbar widths vary across properties on different devices and browsers
        var TOLERANCE = 25;
        /**
         * Use the Visual Viewport API's properties to measure scrollX/Y in reference to the layout viewport
         * in order to determine if window.scrollX/Y is measuring the layout or visual viewport.
         * This finding corresponds to which viewport mouseEvent.clientX/Y and window.innerWidth/Height measures.
         */
        function isVisualViewportFactoredIn() {
          var visual = window.visualViewport;
          return (
            Math.abs(visual.pageTop - visual.offsetTop - window.scrollY) >
              TOLERANCE ||
            Math.abs(visual.pageLeft - visual.offsetLeft - window.scrollX) >
              TOLERANCE
          );
        }
        var convertMouseEventToLayoutCoordinates = function (clientX, clientY) {
          var visual = window.visualViewport;
          var normalised = {
            layoutViewportX: clientX,
            layoutViewportY: clientY,
            visualViewportX: clientX,
            visualViewportY: clientY,
          };
          if (!visual) {
            // On old browsers, we cannot normalise, so fallback to clientX/Y
            return normalised;
          } else if (isVisualViewportFactoredIn()) {
            // Typically Mobile Devices
            normalised.layoutViewportX = Math.round(
              clientX + visual.offsetLeft
            );
            normalised.layoutViewportY = Math.round(clientY + visual.offsetTop);
          } else {
            // Typically Desktop Devices
            normalised.visualViewportX = Math.round(
              clientX - visual.offsetLeft
            );
            normalised.visualViewportY = Math.round(clientY - visual.offsetTop);
          }
          return normalised;
        };
        var getVisualViewport = function () {
          var visual = window.visualViewport;
          return {
            scale: visual.scale,
            offsetLeft: visual.offsetLeft,
            offsetTop: visual.offsetTop,
            pageLeft: visual.pageLeft,
            pageTop: visual.pageTop,
            height: visual.height,
            width: visual.width,
          };
        };
        // excludes the width of any rendered classic scrollbar that is fixed to the visual viewport
        function getWindowWidth() {
          var visual = window.visualViewport;
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.isExperimentalFeatureEnabled)(
              "visualviewport"
            ) &&
            visual
          ) {
            return visual.width * visual.scale;
          }
          return window.innerWidth || 0;
        }
        // excludes the height of any rendered classic scrollbar that is fixed to the visual viewport
        function getWindowHeight() {
          var visual = window.visualViewport;
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.isExperimentalFeatureEnabled)(
              "visualviewport"
            ) &&
            visual
          ) {
            return visual.height * visual.scale;
          }
          return window.innerHeight || 0;
        }
        function getScrollX() {
          var visual = window.visualViewport;
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.isExperimentalFeatureEnabled)(
              "visualviewport"
            ) &&
            visual
          ) {
            return visual.pageLeft - visual.offsetLeft;
          }
          if (window.scrollX !== undefined) {
            return window.scrollX;
          }
          return window.pageXOffset || 0;
        }
        function getScrollY() {
          var visual = window.visualViewport;
          if (
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.isExperimentalFeatureEnabled)(
              "visualviewport"
            ) &&
            visual
          ) {
            return visual.pageTop - visual.offsetTop;
          }
          if (window.scrollY !== undefined) {
            return window.scrollY;
          }
          return window.pageYOffset || 0;
        }

        /***/
      },

    /***/ "./src/domain/replayStats.ts":
      /*!***********************************!*\
  !*** ./src/domain/replayStats.ts ***!
  \***********************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ MAX_STATS_HISTORY: function () {
            return /* binding */ MAX_STATS_HISTORY;
          },
          /* harmony export */ addSegment: function () {
            return /* binding */ addSegment;
          },
          /* harmony export */ addRecord: function () {
            return /* binding */ addRecord;
          },
          /* harmony export */ addWroteData: function () {
            return /* binding */ addWroteData;
          },
          /* harmony export */ getReplayStats: function () {
            return /* binding */ getReplayStats;
          },
          /* harmony export */ resetReplayStats: function () {
            return /* binding */ resetReplayStats;
          },
          /* harmony export */
        });
        var MAX_STATS_HISTORY = 10;
        var statsPerView;
        function addSegment(viewId) {
          getOrCreateReplayStats(viewId).segments_count += 1;
        }
        function addRecord(viewId) {
          getOrCreateReplayStats(viewId).records_count += 1;
        }
        function addWroteData(viewId, additionalRawSize) {
          getOrCreateReplayStats(viewId).segments_total_raw_size +=
            additionalRawSize;
        }
        function getReplayStats(viewId) {
          return statsPerView === null || statsPerView === void 0
            ? void 0
            : statsPerView.get(viewId);
        }
        function resetReplayStats() {
          statsPerView = undefined;
        }
        function getOrCreateReplayStats(viewId) {
          if (!statsPerView) {
            statsPerView = new Map();
          }
          var replayStats;
          if (statsPerView.has(viewId)) {
            replayStats = statsPerView.get(viewId);
          } else {
            replayStats = {
              records_count: 0,
              segments_count: 0,
              segments_total_raw_size: 0,
            };
            statsPerView.set(viewId, replayStats);
            if (statsPerView.size > MAX_STATS_HISTORY) {
              deleteOldestStats();
            }
          }
          return replayStats;
        }
        function deleteOldestStats() {
          if (!statsPerView) {
            return;
          }
          if (statsPerView.keys) {
            statsPerView.delete(statsPerView.keys().next().value);
          } else {
            // IE11 doesn't support map.keys
            var isFirst_1 = true;
            statsPerView.forEach(function (_value, key) {
              if (isFirst_1) {
                statsPerView.delete(key);
                isFirst_1 = false;
              }
            });
          }
        }

        /***/
      },

    /***/ "./src/domain/segmentCollection/index.ts":
      /*!***********************************************!*\
  !*** ./src/domain/segmentCollection/index.ts ***!
  \***********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startSegmentCollection: function () {
            return /* reexport safe */ _segmentCollection__WEBPACK_IMPORTED_MODULE_0__.startSegmentCollection;
          },
          /* harmony export */
        });
        /* harmony import */ var _segmentCollection__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./segmentCollection */ "./src/domain/segmentCollection/segmentCollection.ts"
          );

        /***/
      },

    /***/ "./src/domain/segmentCollection/segment.ts":
      /*!*************************************************!*\
  !*** ./src/domain/segmentCollection/segment.ts ***!
  \*************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Segment: function () {
            return /* binding */ Segment;
          },
          /* harmony export */
        });
        /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! tslib */ "../../node_modules/tslib/tslib.es6.js"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../../types */ "./src/types.ts");
        /* harmony import */ var _replayStats__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ../replayStats */ "./src/domain/replayStats.ts"
          );

        var nextId = 0;
        var Segment = /** @class */ (function () {
          function Segment(
            worker,
            context,
            creationReason,
            initialRecord,
            onWrote,
            onFlushed
          ) {
            var _this = this;
            this.worker = worker;
            this.context = context;
            this.creationReason = creationReason;
            this.isFlushed = false;
            this.id = nextId++;
            this.start = initialRecord.timestamp;
            this.end = initialRecord.timestamp;
            this.recordsCount = 1;
            this.hasFullSnapshot =
              initialRecord.type ===
              _types__WEBPACK_IMPORTED_MODULE_1__.RecordType.FullSnapshot;
            var viewId = this.context.view.id;
            _replayStats__WEBPACK_IMPORTED_MODULE_2__.addSegment(viewId);
            _replayStats__WEBPACK_IMPORTED_MODULE_2__.addRecord(viewId);
            var listener = (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.monitor)(
              function (_a) {
                var data = _a.data;
                if (data.type === "errored" || data.type === "initialized") {
                  return;
                }
                if (data.id === _this.id) {
                  _replayStats__WEBPACK_IMPORTED_MODULE_2__.addWroteData(
                    viewId,
                    data.additionalRawSize
                  );
                  if (data.type === "flushed") {
                    onFlushed(data.result, data.rawSize);
                    worker.removeEventListener("message", listener);
                  } else {
                    onWrote(data.compressedSize);
                  }
                } else if (data.id > _this.id) {
                  // Messages should be received in the same order as they are sent, so if we receive a
                  // message with an id superior to this Segment instance id, we know that another, more
                  // recent Segment instance is being used.
                  //
                  // In theory, a "flush" response should have been received at this point, so the listener
                  // should already have been removed. But if something goes wrong and we didn't receive a
                  // "flush" response, remove the listener to avoid any leak, and send a monitor message to
                  // help investigate the issue.
                  worker.removeEventListener("message", listener);
                  (0,
                  _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.addMonitoringMessage)(
                    "Segment did not receive a 'flush' response before being replaced."
                  );
                }
              }
            );
            worker.addEventListener("message", listener);
            this.worker.postMessage({
              data: '{"records":[' + JSON.stringify(initialRecord),
              id: this.id,
              action: "write",
            });
          }
          Segment.prototype.addRecord = function (record) {
            this.end = record.timestamp;
            this.recordsCount += 1;
            _replayStats__WEBPACK_IMPORTED_MODULE_2__.addRecord(
              this.context.view.id
            );
            this.hasFullSnapshot ||
              (this.hasFullSnapshot =
                record.type ===
                _types__WEBPACK_IMPORTED_MODULE_1__.RecordType.FullSnapshot);
            this.worker.postMessage({
              data: "," + JSON.stringify(record),
              id: this.id,
              action: "write",
            });
          };
          Segment.prototype.flush = function (reason) {
            this.worker.postMessage({
              data: "]," + JSON.stringify(this.meta).slice(1) + "\n",
              id: this.id,
              action: "flush",
            });
            this.isFlushed = true;
            this.flushReason = reason;
          };
          Object.defineProperty(Segment.prototype, "meta", {
            get: function () {
              return (0, tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)(
                {
                  creation_reason: this.creationReason,
                  end: this.end,
                  has_full_snapshot: this.hasFullSnapshot,
                  records_count: this.recordsCount,
                  start: this.start,
                },
                this.context
              );
            },
            enumerable: false,
            configurable: true,
          });
          return Segment;
        })();

        /***/
      },

    /***/ "./src/domain/segmentCollection/segmentCollection.ts":
      /*!***********************************************************!*\
  !*** ./src/domain/segmentCollection/segmentCollection.ts ***!
  \***********************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ MAX_SEGMENT_DURATION: function () {
            return /* binding */ MAX_SEGMENT_DURATION;
          },
          /* harmony export */ startSegmentCollection: function () {
            return /* binding */ startSegmentCollection;
          },
          /* harmony export */ doStartSegmentCollection: function () {
            return /* binding */ doStartSegmentCollection;
          },
          /* harmony export */ computeSegmentContext: function () {
            return /* binding */ computeSegmentContext;
          },
          /* harmony export */ setMaxSegmentSize: function () {
            return /* binding */ setMaxSegmentSize;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-rum-core */ "../rum-core/src/index.ts"
          );
        /* harmony import */ var _transport_send__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! ../../transport/send */ "./src/transport/send.ts"
          );
        /* harmony import */ var _segment__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./segment */ "./src/domain/segmentCollection/segment.ts"
          );

        var MAX_SEGMENT_DURATION = 30000;
        var MAX_SEGMENT_SIZE =
          _transport_send__WEBPACK_IMPORTED_MODULE_1__.SEND_BEACON_BYTE_LENGTH_LIMIT;
        // Segments are the main data structure for session replays. They contain context information used
        // for indexing or UI needs, and a list of records (RRWeb 'events', renamed to avoid confusing
        // namings). They are stored without any processing from the intake, and fetched one after the
        // other while a session is being replayed. Their encoding (deflate) are carefully crafted to allow
        // concatenating multiple segments together. Segments have a size overhead (meta), so our goal is to
        // build segments containing as much records as possible while complying with the various flush
        // strategies to guarantee a good replay quality.
        //
        // When the recording starts, a segment is initially created.  The segment is flushed (finalized and
        // sent) based on various events (non-exhaustive list):
        //
        // * the page visibility change or becomes to unload
        // * the segment duration reaches a limit
        // * the encoded segment size reaches a limit
        // * ...
        //
        // A segment cannot be created without its context.  If the RUM session ends and no session id is
        // available when creating a new segment, records will be ignored, until the session is renewed and
        // a new session id is available.
        //
        // Empty segments (segments with no record) aren't useful and should be ignored.
        //
        // To help investigate session replays issues, each segment is created with a "creation reason",
        // indicating why the session has been created.
        function startSegmentCollection(
          lifeCycle,
          applicationId,
          session,
          parentContexts,
          send,
          worker
        ) {
          return doStartSegmentCollection(
            lifeCycle,
            function () {
              return computeSegmentContext(
                applicationId,
                session,
                parentContexts
              );
            },
            send,
            worker
          );
        }
        function doStartSegmentCollection(
          lifeCycle,
          getSegmentContext,
          send,
          worker,
          emitter
        ) {
          if (emitter === void 0) {
            emitter = window;
          }
          var state = {
            status: 0 /* WaitingForInitialRecord */,
            nextSegmentCreationReason: "init",
          };
          var unsubscribeViewCreated = lifeCycle.subscribe(
            _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__
              .LifeCycleEventType.VIEW_CREATED,
            function () {
              flushSegment("view_change");
            }
          ).unsubscribe;
          var unsubscribeBeforeUnload = lifeCycle.subscribe(
            _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__
              .LifeCycleEventType.BEFORE_UNLOAD,
            function () {
              flushSegment("before_unload");
            }
          ).unsubscribe;
          var unsubscribeVisibilityChange = (0,
          _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.addEventListener)(
            emitter,
            "visibilitychange" /* VISIBILITY_CHANGE */,
            function () {
              if (document.visibilityState === "hidden") {
                flushSegment("visibility_hidden");
              }
            },
            { capture: true }
          ).stop;
          function flushSegment(nextSegmentCreationReason) {
            if (state.status === 1 /* SegmentPending */) {
              state.segment.flush(nextSegmentCreationReason || "sdk_stopped");
              clearTimeout(state.expirationTimeoutId);
            }
            if (nextSegmentCreationReason) {
              state = {
                status: 0 /* WaitingForInitialRecord */,
                nextSegmentCreationReason: nextSegmentCreationReason,
              };
            } else {
              state = {
                status: 2 /* Stopped */,
              };
            }
          }
          function createNewSegment(creationReason, initialRecord) {
            var context = getSegmentContext();
            if (!context) {
              return;
            }
            var segment = new _segment__WEBPACK_IMPORTED_MODULE_2__.Segment(
              worker,
              context,
              creationReason,
              initialRecord,
              function (compressedSegmentSize) {
                if (
                  !segment.isFlushed &&
                  compressedSegmentSize > MAX_SEGMENT_SIZE
                ) {
                  flushSegment("max_size");
                }
              },
              function (data, rawSegmentSize) {
                send(data, segment.meta, rawSegmentSize, segment.flushReason);
              }
            );
            state = {
              status: 1 /* SegmentPending */,
              segment: segment,
              expirationTimeoutId: setTimeout(
                (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.monitor)(
                  function () {
                    flushSegment("max_duration");
                  }
                ),
                MAX_SEGMENT_DURATION
              ),
            };
          }
          return {
            addRecord: function (record) {
              switch (state.status) {
                case 0 /* WaitingForInitialRecord */:
                  createNewSegment(state.nextSegmentCreationReason, record);
                  break;
                case 1 /* SegmentPending */:
                  state.segment.addRecord(record);
                  break;
              }
            },
            stop: function () {
              flushSegment();
              unsubscribeViewCreated();
              unsubscribeBeforeUnload();
              unsubscribeVisibilityChange();
            },
          };
        }
        function computeSegmentContext(applicationId, session, parentContexts) {
          if (!session.isTracked()) {
            return undefined;
          }
          var viewContext = parentContexts.findView();
          if (
            !(viewContext === null || viewContext === void 0
              ? void 0
              : viewContext.session.id) ||
            viewContext.session.id !== session.getId()
          ) {
            return undefined;
          }
          return {
            application: {
              id: applicationId,
            },
            session: {
              id: viewContext.session.id,
            },
            view: {
              id: viewContext.view.id,
            },
          };
        }
        function setMaxSegmentSize(newSize) {
          if (newSize === void 0) {
            newSize =
              _transport_send__WEBPACK_IMPORTED_MODULE_1__.SEND_BEACON_BYTE_LENGTH_LIMIT;
          }
          MAX_SEGMENT_SIZE = newSize;
        }

        /***/
      },

    /***/ "./src/domain/segmentCollection/startDeflateWorker.ts":
      /*!************************************************************!*\
  !*** ./src/domain/segmentCollection/startDeflateWorker.ts ***!
  \************************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ startDeflateWorker: function () {
            return /* binding */ startDeflateWorker;
          },
          /* harmony export */ resetDeflateWorkerState: function () {
            return /* binding */ resetDeflateWorkerState;
          },
          /* harmony export */ doStartDeflateWorker: function () {
            return /* binding */ doStartDeflateWorker;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/domain/internalMonitoring.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/display.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );
        /* harmony import */ var _deflateWorker__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./deflateWorker */ "./src/domain/segmentCollection/deflateWorker.js"
          );

        var state = { status: 0 /* Nil */ };
        function startDeflateWorker(callback, createDeflateWorkerImpl) {
          if (createDeflateWorkerImpl === void 0) {
            createDeflateWorkerImpl =
              _deflateWorker__WEBPACK_IMPORTED_MODULE_0__.createDeflateWorker;
          }
          switch (state.status) {
            case 0 /* Nil */:
              state = { status: 1 /* Loading */, callbacks: [callback] };
              doStartDeflateWorker(createDeflateWorkerImpl);
              break;
            case 1 /* Loading */:
              state.callbacks.push(callback);
              break;
            case 2 /* Error */:
              callback();
              break;
            case 3 /* Initialized */:
              callback(state.worker);
              break;
          }
        }
        function resetDeflateWorkerState() {
          state = { status: 0 /* Nil */ };
        }
        /**
         * Starts the deflate worker and handle messages and errors
         *
         * The spec allow browsers to handle worker errors differently:
         * - Chromium throws an exception
         * - Firefox fires an error event
         *
         * more details: https://bugzilla.mozilla.org/show_bug.cgi?id=1736865#c2
         */
        function doStartDeflateWorker(createDeflateWorkerImpl) {
          if (createDeflateWorkerImpl === void 0) {
            createDeflateWorkerImpl =
              _deflateWorker__WEBPACK_IMPORTED_MODULE_0__.createDeflateWorker;
          }
          try {
            var worker_1 = createDeflateWorkerImpl();
            worker_1.addEventListener(
              "error",
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.monitor)(
                onError
              )
            );
            worker_1.addEventListener(
              "message",
              (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.monitor)(
                function (_a) {
                  var data = _a.data;
                  if (data.type === "errored") {
                    onError(data.error);
                  } else if (data.type === "initialized") {
                    onInitialized(worker_1);
                  }
                }
              )
            );
            worker_1.postMessage({ action: "init" });
            return worker_1;
          } catch (error) {
            onError(error);
          }
        }
        function onInitialized(worker) {
          if (state.status === 1 /* Loading */) {
            state.callbacks.forEach(function (callback) {
              return callback(worker);
            });
            state = { status: 3 /* Initialized */, worker: worker };
          }
        }
        function onError(error) {
          if (state.status === 1 /* Loading */) {
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.display.error(
              "Session Replay recording failed to start: an error occurred while creating the Worker:",
              error
            );
            if (
              error instanceof Event ||
              (error instanceof Error &&
                (0,
                _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.includes)(
                  error.message,
                  "Content Security Policy"
                ))
            ) {
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_2__.display.error(
                "Please make sure CSP is correctly configured " +
                  "https://docs.datadoghq.com/real_user_monitoring/faq/content_security_policy"
              );
            } else {
              (0,
              _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.addErrorToMonitoringBatch)(
                error
              );
            }
            state.callbacks.forEach(function (callback) {
              return callback();
            });
            state = { status: 2 /* Error */ };
          } else {
            (0,
            _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.addErrorToMonitoringBatch)(
              error
            );
          }
        }

        /***/
      },

    /***/ "./src/transport/send.ts":
      /*!*******************************!*\
  !*** ./src/transport/send.ts ***!
  \*******************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ SEND_BEACON_BYTE_LENGTH_LIMIT: function () {
            return /* binding */ SEND_BEACON_BYTE_LENGTH_LIMIT;
          },
          /* harmony export */ send: function () {
            return /* binding */ send;
          },
          /* harmony export */ toFormEntries: function () {
            return /* binding */ toFormEntries;
          },
          /* harmony export */
        });
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/transport/httpRequest.ts"
          );
        /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(
            /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
          );

        var SEND_BEACON_BYTE_LENGTH_LIMIT = 60000;
        function send(
          endpointBuilder,
          data,
          meta,
          rawSegmentSize,
          flushReason
        ) {
          var formData = new FormData();
          formData.append(
            "segment",
            new Blob([data], {
              type: "application/octet-stream",
            }),
            meta.session.id + "-" + meta.start
          );
          toFormEntries(meta, function (key, value) {
            return formData.append(key, value);
          });
          formData.append("raw_segment_size", rawSegmentSize.toString());
          var request =
            new _datadog_browser_core__WEBPACK_IMPORTED_MODULE_0__.HttpRequest(
              endpointBuilder,
              SEND_BEACON_BYTE_LENGTH_LIMIT
            );
          request.send(formData, data.byteLength, flushReason);
        }
        function toFormEntries(input, onEntry, prefix) {
          if (prefix === void 0) {
            prefix = "";
          }
          (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_1__.objectEntries)(
            input
          ).forEach(function (_a) {
            var key = _a[0],
              value = _a[1];
            if (typeof value === "object" && value !== null) {
              toFormEntries(value, onEntry, "" + prefix + key + ".");
            } else {
              onEntry("" + prefix + key, String(value));
            }
          });
        }

        /***/
      },

    /***/ "./src/types.ts":
      /*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ IncrementalSource: function () {
            return /* reexport safe */ _domain_record_types__WEBPACK_IMPORTED_MODULE_0__.IncrementalSource;
          },
          /* harmony export */ RecordType: function () {
            return /* binding */ RecordType;
          },
          /* harmony export */
        });
        /* harmony import */ var _domain_record_types__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./domain/record/types */ "./src/domain/record/types.ts"
          );

        var RecordType = {
          FullSnapshot: 2,
          IncrementalSnapshot: 3,
          Meta: 4,
          Focus: 6,
          ViewEnd: 7,
          VisualViewport: 8,
        };

        /***/
      },

    /***/ "./src/domain/segmentCollection/deflateWorker.js":
      /*!*******************************************************!*\
  !*** ./src/domain/segmentCollection/deflateWorker.js ***!
  \*******************************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ createDeflateWorker: function () {
            return /* binding */ createDeflateWorker;
          },
          /* harmony export */
        });
        /* eslint-disable */
        var workerURL;
        function createDeflateWorker() {
          // Lazily compute the worker URL to allow importing the SDK in NodeJS
          if (!workerURL) {
            workerURL = URL.createObjectURL(
              new Blob(["(" + workerCodeFn + ")(self)"])
            );
          }
          return new Worker(workerURL);
        }
        function workerCodeFn() {
          monitor(function () {
            var _a = makePakoDeflate(),
              Deflate = _a.Deflate,
              constants = _a.constants;
            var deflate = new Deflate();
            var rawSize = 0;
            self.addEventListener(
              "message",
              monitor(function (event) {
                var data = event.data;
                switch (data.action) {
                  case "init":
                    self.postMessage({
                      type: "initialized",
                    });
                    break;
                  case "write":
                    var additionalRawSize = pushData(data.data);
                    self.postMessage({
                      type: "wrote",
                      id: data.id,
                      compressedSize: deflate.chunks.reduce(function (
                        total,
                        chunk
                      ) {
                        return total + chunk.length;
                      },
                      0),
                      additionalRawSize: additionalRawSize,
                    });
                    break;
                  case "flush":
                    var additionalRawSize = data.data ? pushData(data.data) : 0;
                    deflate.push("", constants.Z_FINISH);
                    self.postMessage({
                      type: "flushed",
                      id: data.id,
                      result: deflate.result,
                      additionalRawSize: additionalRawSize,
                      rawSize: rawSize,
                    });
                    deflate = new Deflate();
                    rawSize = 0;
                    break;
                }
              })
            );
            function pushData(data) {
              var binaryData = new TextEncoder().encode(data);
              deflate.push(binaryData, constants.Z_SYNC_FLUSH);
              rawSize += binaryData.length;
              return binaryData.length;
            }
          })();
          function monitor(fn) {
            return function () {
              try {
                return fn.apply(this, arguments);
              } catch (e) {
                try {
                  self.postMessage({
                    type: "errored",
                    error: e,
                  });
                } catch (_) {
                  // DATA_CLONE_ERR, cf https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
                  self.postMessage({
                    type: "errored",
                    error: "" + e,
                  });
                }
              }
            };
          }
          // https://github.com/nodeca/pako/blob/034669ba0f1a4c0590e45f7c2820128200f972b3/dist/pako_deflate.es5.js
          function makePakoDeflate() {
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            /* eslint-disable space-unary-ops */
            /* Public constants ========================================================== */
            /* =========================================================================== */
            // const Z_FILTERED          = 1;
            // const Z_HUFFMAN_ONLY      = 2;
            // const Z_RLE               = 3;
            var Z_FIXED = 4; // const Z_DEFAULT_STRATEGY  = 0;
            /* Possible values of the data_type field (though see inflate()) */
            var Z_BINARY = 0;
            var Z_TEXT = 1; // const Z_ASCII             = 1; // = Z_TEXT
            var Z_UNKNOWN = 2;
            /* ============================================================================ */
            function zero(buf) {
              var len = buf.length;
              while (--len >= 0) {
                buf[len] = 0;
              }
            } // From zutil.h
            var STORED_BLOCK = 0;
            var STATIC_TREES = 1;
            var DYN_TREES = 2;
            /* The three kinds of block type */
            var MIN_MATCH = 3;
            var MAX_MATCH = 258;
            /* The minimum and maximum match lengths */
            // From deflate.h
            /* ===========================================================================
             * Internal compression state.
             */
            var LENGTH_CODES = 29;
            /* number of length codes, not counting the special END_BLOCK code */
            var LITERALS = 256;
            /* number of literal bytes 0..255 */
            var L_CODES = LITERALS + 1 + LENGTH_CODES;
            /* number of Literal or Length codes, including the END_BLOCK code */
            var D_CODES = 30;
            /* number of distance codes */
            var BL_CODES = 19;
            /* number of codes used to transfer the bit lengths */
            var HEAP_SIZE = 2 * L_CODES + 1;
            /* maximum heap size */
            var MAX_BITS = 15;
            /* All codes must not exceed MAX_BITS bits */
            var Buf_size = 16;
            /* size of bit buffer in bi_buf */
            /* ===========================================================================
             * Constants
             */
            var MAX_BL_BITS = 7;
            /* Bit length codes must not exceed MAX_BL_BITS bits */
            var END_BLOCK = 256;
            /* end of block literal code */
            var REP_3_6 = 16;
            /* repeat previous bit length 3-6 times (2 bits of repeat count) */
            var REPZ_3_10 = 17;
            /* repeat a zero length 3-10 times  (3 bits of repeat count) */
            var REPZ_11_138 = 18;
            /* repeat a zero length 11-138 times  (7 bits of repeat count) */
            /* eslint-disable comma-spacing,array-bracket-spacing */
            var extra_lbits =
              /* extra bits for each length code */
              new Uint8Array([
                0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
                4, 4, 4, 5, 5, 5, 5, 0,
              ]);
            var extra_dbits =
              /* extra bits for each distance code */
              new Uint8Array([
                0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
                9, 10, 10, 11, 11, 12, 12, 13, 13,
              ]);
            var extra_blbits =
              /* extra bits for each bit length code */
              new Uint8Array([
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7,
              ]);
            var bl_order = new Uint8Array([
              16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
            ]);
            /* eslint-enable comma-spacing,array-bracket-spacing */
            /* The lengths of the bit length codes are sent in order of decreasing
             * probability, to avoid transmitting the lengths for unused bit length codes.
             */
            /* ===========================================================================
             * Local data. These are initialized only once.
             */
            // We pre-fill arrays with 0 to avoid uninitialized gaps
            var DIST_CODE_LEN = 512;
            /* see definition of array dist_code below */
            // !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
            var static_ltree = new Array((L_CODES + 2) * 2);
            zero(static_ltree);
            /* The static literal tree. Since the bit lengths are imposed, there is no
             * need for the L_CODES extra codes used during heap construction. However
             * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
             * below).
             */
            var static_dtree = new Array(D_CODES * 2);
            zero(static_dtree);
            /* The static distance tree. (Actually a trivial tree since all codes use
             * 5 bits.)
             */
            var _dist_code = new Array(DIST_CODE_LEN);
            zero(_dist_code);
            /* Distance codes. The first 256 values correspond to the distances
             * 3 .. 258, the last 256 values correspond to the top 8 bits of
             * the 15 bit distances.
             */
            var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
            zero(_length_code);
            /* length code for each normalized match length (0 == MIN_MATCH) */
            var base_length = new Array(LENGTH_CODES);
            zero(base_length);
            /* First normalized length for each code (0 = MIN_MATCH) */
            var base_dist = new Array(D_CODES);
            zero(base_dist);
            /* First normalized distance for each code (0 = distance of 1) */
            function StaticTreeDesc(
              static_tree,
              extra_bits,
              extra_base,
              elems,
              max_length
            ) {
              this.static_tree = static_tree;
              /* static tree or NULL */
              this.extra_bits = extra_bits;
              /* extra bits for each code or NULL */
              this.extra_base = extra_base;
              /* base index for extra_bits */
              this.elems = elems;
              /* max number of elements in the tree */
              this.max_length = max_length;
              /* max bit length for the codes */
              // show if `static_tree` has data or dummy - needed for monomorphic objects
              this.has_stree = static_tree && static_tree.length;
            }
            var static_l_desc;
            var static_d_desc;
            var static_bl_desc;
            function TreeDesc(dyn_tree, stat_desc) {
              this.dyn_tree = dyn_tree;
              /* the dynamic tree */
              this.max_code = 0;
              /* largest code with non zero frequency */
              this.stat_desc = stat_desc;
              /* the corresponding static tree */
            }
            var d_code = function d_code(dist) {
              return dist < 256
                ? _dist_code[dist]
                : _dist_code[256 + (dist >>> 7)];
            };
            /* ===========================================================================
             * Output a short LSB first on the stream.
             * IN assertion: there is enough room in pendingBuf.
             */
            var put_short = function put_short(s, w) {
              //    put_byte(s, (uch)((w) & 0xff));
              //    put_byte(s, (uch)((ush)(w) >> 8));
              s.pending_buf[s.pending++] = w & 0xff;
              s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
            };
            /* ===========================================================================
             * Send a value on a given number of bits.
             * IN assertion: length <= 16 and value fits in length bits.
             */
            var send_bits = function send_bits(s, value, length) {
              if (s.bi_valid > Buf_size - length) {
                s.bi_buf |= (value << s.bi_valid) & 0xffff;
                put_short(s, s.bi_buf);
                s.bi_buf = value >> (Buf_size - s.bi_valid);
                s.bi_valid += length - Buf_size;
              } else {
                s.bi_buf |= (value << s.bi_valid) & 0xffff;
                s.bi_valid += length;
              }
            };
            var send_code = function send_code(s, c, tree) {
              send_bits(
                s,
                tree[c * 2],
                /* .Code */
                tree[c * 2 + 1]
                /* .Len */
              );
            };
            /* ===========================================================================
             * Reverse the first len bits of a code, using straightforward code (a faster
             * method would use a table)
             * IN assertion: 1 <= len <= 15
             */
            var bi_reverse = function bi_reverse(code, len) {
              var res = 0;
              do {
                res |= code & 1;
                code >>>= 1;
                res <<= 1;
              } while (--len > 0);
              return res >>> 1;
            };
            /* ===========================================================================
             * Flush the bit buffer, keeping at most 7 bits in it.
             */
            var bi_flush = function bi_flush(s) {
              if (s.bi_valid === 16) {
                put_short(s, s.bi_buf);
                s.bi_buf = 0;
                s.bi_valid = 0;
              } else if (s.bi_valid >= 8) {
                s.pending_buf[s.pending++] = s.bi_buf & 0xff;
                s.bi_buf >>= 8;
                s.bi_valid -= 8;
              }
            };
            /* ===========================================================================
             * Compute the optimal bit lengths for a tree and update the total bit length
             * for the current block.
             * IN assertion: the fields freq and dad are set, heap[heap_max] and
             *    above are the tree nodes sorted by increasing frequency.
             * OUT assertions: the field len is set to the optimal bit length, the
             *     array bl_count contains the frequencies for each bit length.
             *     The length opt_len is updated; static_len is also updated if stree is
             *     not null.
             */
            var gen_bitlen = function gen_bitlen(
              s,
              desc //    deflate_state *s; //    tree_desc *desc;    /* the tree descriptor */
            ) {
              var tree = desc.dyn_tree;
              var max_code = desc.max_code;
              var stree = desc.stat_desc.static_tree;
              var has_stree = desc.stat_desc.has_stree;
              var extra = desc.stat_desc.extra_bits;
              var base = desc.stat_desc.extra_base;
              var max_length = desc.stat_desc.max_length;
              var h;
              /* heap index */
              var n;
              var m;
              /* iterate over the tree elements */
              var bits;
              /* bit length */
              var xbits;
              /* extra bits */
              var f;
              /* frequency */
              var overflow = 0;
              /* number of elements with bit length too large */
              for (bits = 0; bits <= MAX_BITS; bits++) {
                s.bl_count[bits] = 0;
              }
              /* In a first pass, compute the optimal bit lengths (which may
               * overflow in the case of the bit length tree).
               */
              tree[s.heap[s.heap_max] * 2 + 1] =
                /* .Len */
                0;
              /* root of the heap */
              for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
                n = s.heap[h];
                bits =
                  tree[
                    tree[n * 2 + 1] *
                      /* .Dad */
                      2 +
                      1
                  ] +
                  /* .Len */
                  1;
                if (bits > max_length) {
                  bits = max_length;
                  overflow++;
                }
                tree[n * 2 + 1] =
                  /* .Len */
                  bits;
                /* We overwrite tree[n].Dad which is no longer needed */
                if (n > max_code) {
                  continue;
                }
                /* not a leaf node */
                s.bl_count[bits]++;
                xbits = 0;
                if (n >= base) {
                  xbits = extra[n - base];
                }
                f = tree[n * 2];
                /* .Freq */
                s.opt_len += f * (bits + xbits);
                if (has_stree) {
                  s.static_len +=
                    f *
                    (stree[n * 2 + 1] +
                      /* .Len */
                      xbits);
                }
              }
              if (overflow === 0) {
                return;
              } // Trace((stderr,"\nbit length overflow\n"));
              /* This happens for example on obj2 and pic of the Calgary corpus */
              /* Find the first bit length which could increase: */
              do {
                bits = max_length - 1;
                while (s.bl_count[bits] === 0) {
                  bits--;
                }
                s.bl_count[bits]--;
                /* move one leaf down the tree */
                s.bl_count[bits + 1] += 2;
                /* move one overflow item as its brother */
                s.bl_count[max_length]--;
                /* The brother of the overflow item also moves one step up,
                 * but this does not affect bl_count[max_length]
                 */
                overflow -= 2;
              } while (overflow > 0);
              /* Now recompute all bit lengths, scanning in increasing frequency.
               * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
               * lengths instead of fixing only the wrong ones. This idea is taken
               * from 'ar' written by Haruhiko Okumura.)
               */
              for (bits = max_length; bits !== 0; bits--) {
                n = s.bl_count[bits];
                while (n !== 0) {
                  m = s.heap[--h];
                  if (m > max_code) {
                    continue;
                  }
                  if (
                    tree[m * 2 + 1] !==
                    /* .Len */
                    bits
                  ) {
                    // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
                    s.opt_len +=
                      (bits - tree[m * 2 + 1]) *
                      /* .Len */
                      tree[m * 2];
                    /* .Freq */
                    tree[m * 2 + 1] =
                      /* .Len */
                      bits;
                  }
                  n--;
                }
              }
            };
            /* ===========================================================================
             * Generate the codes for a given tree and bit counts (which need not be
             * optimal).
             * IN assertion: the array bl_count contains the bit length statistics for
             * the given tree and the field len is set for all tree elements.
             * OUT assertion: the field code is set for all tree elements of non
             *     zero code length.
             */
            var gen_codes = function gen_codes(
              tree,
              max_code,
              bl_count //    ct_data *tree;             /* the tree to decorate */ //    int max_code;              /* largest code with non zero frequency */ //    ushf *bl_count;            /* number of codes at each bit length */
            ) {
              var next_code = new Array(MAX_BITS + 1);
              /* next code value for each bit length */
              var code = 0;
              /* running code value */
              var bits;
              /* bit index */
              var n;
              /* code index */
              /* The distribution counts are first used to generate the code values
               * without bit reversal.
               */
              for (bits = 1; bits <= MAX_BITS; bits++) {
                next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
              }
              /* Check that the bit counts in bl_count are consistent. The last code
               * must be all ones.
               */
              // Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
              //        "inconsistent bit counts");
              // Tracev((stderr,"\ngen_codes: max_code %d ", max_code));
              for (n = 0; n <= max_code; n++) {
                var len = tree[n * 2 + 1];
                /* .Len */
                if (len === 0) {
                  continue;
                }
                /* Now reverse the bits */
                tree[n * 2] =
                  /* .Code */
                  bi_reverse(next_code[len]++, len); // Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
                //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
              }
            };
            /* ===========================================================================
             * Initialize the various 'constant' tables.
             */
            var tr_static_init = function tr_static_init() {
              var n;
              /* iterates over tree elements */
              var bits;
              /* bit counter */
              var length;
              /* length value */
              var code;
              /* code value */
              var dist;
              /* distance index */
              var bl_count = new Array(MAX_BITS + 1);
              /* number of codes at each bit length for an optimal tree */
              // do check in _tr_init()
              // if (static_init_done) return;
              /* For some embedded targets, global variables are not initialized: */
              /* #ifdef NO_INIT_GLOBAL_POINTERS
            static_l_desc.static_tree = static_ltree;
            static_l_desc.extra_bits = extra_lbits;
            static_d_desc.static_tree = static_dtree;
            static_d_desc.extra_bits = extra_dbits;
            static_bl_desc.extra_bits = extra_blbits;
          #endif */
              /* Initialize the mapping length (0..255) -> length code (0..28) */
              length = 0;
              for (code = 0; code < LENGTH_CODES - 1; code++) {
                base_length[code] = length;
                for (n = 0; n < 1 << extra_lbits[code]; n++) {
                  _length_code[length++] = code;
                }
              } // Assert (length == 256, "tr_static_init: length != 256");
              /* Note that the length 255 (match length 258) can be represented
               * in two different ways: code 284 + 5 bits or code 285, so we
               * overwrite length_code[255] to use the best encoding:
               */
              _length_code[length - 1] = code;
              /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
              dist = 0;
              for (code = 0; code < 16; code++) {
                base_dist[code] = dist;
                for (n = 0; n < 1 << extra_dbits[code]; n++) {
                  _dist_code[dist++] = code;
                }
              } // Assert (dist == 256, "tr_static_init: dist != 256");
              dist >>= 7;
              /* from now on, all distances are divided by 128 */
              for (; code < D_CODES; code++) {
                base_dist[code] = dist << 7;
                for (n = 0; n < 1 << (extra_dbits[code] - 7); n++) {
                  _dist_code[256 + dist++] = code;
                }
              } // Assert (dist == 256, "tr_static_init: 256+dist != 512");
              /* Construct the codes of the static literal tree */
              for (bits = 0; bits <= MAX_BITS; bits++) {
                bl_count[bits] = 0;
              }
              n = 0;
              while (n <= 143) {
                static_ltree[n * 2 + 1] =
                  /* .Len */
                  8;
                n++;
                bl_count[8]++;
              }
              while (n <= 255) {
                static_ltree[n * 2 + 1] =
                  /* .Len */
                  9;
                n++;
                bl_count[9]++;
              }
              while (n <= 279) {
                static_ltree[n * 2 + 1] =
                  /* .Len */
                  7;
                n++;
                bl_count[7]++;
              }
              while (n <= 287) {
                static_ltree[n * 2 + 1] =
                  /* .Len */
                  8;
                n++;
                bl_count[8]++;
              }
              /* Codes 286 and 287 do not exist, but we must include them in the
               * tree construction to get a canonical Huffman tree (longest code
               * all ones)
               */
              gen_codes(static_ltree, L_CODES + 1, bl_count);
              /* The static distance tree is trivial: */
              for (n = 0; n < D_CODES; n++) {
                static_dtree[n * 2 + 1] =
                  /* .Len */
                  5;
                static_dtree[n * 2] =
                  /* .Code */
                  bi_reverse(n, 5);
              } // Now data ready and we can init static trees
              static_l_desc = new StaticTreeDesc(
                static_ltree,
                extra_lbits,
                LITERALS + 1,
                L_CODES,
                MAX_BITS
              );
              static_d_desc = new StaticTreeDesc(
                static_dtree,
                extra_dbits,
                0,
                D_CODES,
                MAX_BITS
              );
              static_bl_desc = new StaticTreeDesc(
                new Array(0),
                extra_blbits,
                0,
                BL_CODES,
                MAX_BL_BITS
              ); // static_init_done = true;
            };
            /* ===========================================================================
             * Initialize a new block.
             */
            var init_block = function init_block(s) {
              var n;
              /* iterates over tree elements */
              /* Initialize the trees. */
              for (n = 0; n < L_CODES; n++) {
                s.dyn_ltree[n * 2] =
                  /* .Freq */
                  0;
              }
              for (n = 0; n < D_CODES; n++) {
                s.dyn_dtree[n * 2] =
                  /* .Freq */
                  0;
              }
              for (n = 0; n < BL_CODES; n++) {
                s.bl_tree[n * 2] =
                  /* .Freq */
                  0;
              }
              s.dyn_ltree[END_BLOCK * 2] =
                /* .Freq */
                1;
              s.opt_len = s.static_len = 0;
              s.last_lit = s.matches = 0;
            };
            /* ===========================================================================
             * Flush the bit buffer and align the output on a byte boundary
             */
            var bi_windup = function bi_windup(s) {
              if (s.bi_valid > 8) {
                put_short(s, s.bi_buf);
              } else if (s.bi_valid > 0) {
                // put_byte(s, (Byte)s->bi_buf);
                s.pending_buf[s.pending++] = s.bi_buf;
              }
              s.bi_buf = 0;
              s.bi_valid = 0;
            };
            /* ===========================================================================
             * Copy a stored block, storing first the length and its
             * one's complement if requested.
             */
            var copy_block = function copy_block(
              s,
              buf,
              len,
              header // DeflateState *s; //charf    *buf;    /* the input data */ //unsigned len;     /* its length */ //int      header;  /* true if block header must be written */
            ) {
              bi_windup(s);
              /* align on byte boundary */
              if (header) {
                put_short(s, len);
                put_short(s, ~len);
              } //  while (len--) {
              //    put_byte(s, *buf++);
              //  }
              s.pending_buf.set(s.window.subarray(buf, buf + len), s.pending);
              s.pending += len;
            };
            /* ===========================================================================
             * Compares to subtrees, using the tree depth as tie breaker when
             * the subtrees have equal frequency. This minimizes the worst case length.
             */
            var smaller = function smaller(tree, n, m, depth) {
              var _n2 = n * 2;
              var _m2 = m * 2;
              return (
                tree[_n2] <
                  /* .Freq */
                  tree[_m2] ||
                /* .Freq */
                (tree[_n2] ===
                  /* .Freq */
                  tree[_m2] &&
                  /* .Freq */
                  depth[n] <= depth[m])
              );
            };
            /* ===========================================================================
             * Restore the heap property by moving down the tree starting at node k,
             * exchanging a node with the smallest of its two sons if necessary, stopping
             * when the heap property is re-established (each father smaller than its
             * two sons).
             */
            var pqdownheap = function pqdownheap(
              s,
              tree,
              k //    deflate_state *s; //    ct_data *tree;  /* the tree to restore */ //    int k;               /* node to move down */
            ) {
              var v = s.heap[k];
              var j = k << 1;
              /* left son of k */
              while (j <= s.heap_len) {
                /* Set j to the smallest of the two sons: */
                if (
                  j < s.heap_len &&
                  smaller(tree, s.heap[j + 1], s.heap[j], s.depth)
                ) {
                  j++;
                }
                /* Exit if v is smaller than both sons */
                if (smaller(tree, v, s.heap[j], s.depth)) {
                  break;
                }
                /* Exchange v with the smallest son */
                s.heap[k] = s.heap[j];
                k = j;
                /* And continue down the tree, setting j to the left son of k */
                j <<= 1;
              }
              s.heap[k] = v;
            }; // inlined manually
            // const SMALLEST = 1;
            /* ===========================================================================
             * Send the block data compressed using the given Huffman trees
             */
            var compress_block = function compress_block(
              s,
              ltree,
              dtree //    deflate_state *s; //    const ct_data *ltree; /* literal tree */ //    const ct_data *dtree; /* distance tree */
            ) {
              var dist;
              /* distance of matched string */
              var lc;
              /* match length or unmatched char (if dist == 0) */
              var lx = 0;
              /* running index in l_buf */
              var code;
              /* the code to send */
              var extra;
              /* number of extra bits to send */
              if (s.last_lit !== 0) {
                do {
                  dist =
                    (s.pending_buf[s.d_buf + lx * 2] << 8) |
                    s.pending_buf[s.d_buf + lx * 2 + 1];
                  lc = s.pending_buf[s.l_buf + lx];
                  lx++;
                  if (dist === 0) {
                    send_code(s, lc, ltree);
                    /* send a literal byte */
                    // Tracecv(isgraph(lc), (stderr," '%c' ", lc));
                  } else {
                    /* Here, lc is the match length - MIN_MATCH */
                    code = _length_code[lc];
                    send_code(s, code + LITERALS + 1, ltree);
                    /* send the length code */
                    extra = extra_lbits[code];
                    if (extra !== 0) {
                      lc -= base_length[code];
                      send_bits(s, lc, extra);
                      /* send the extra length bits */
                    }
                    dist--;
                    /* dist is now the match distance - 1 */
                    code = d_code(dist); // Assert (code < D_CODES, "bad d_code");
                    send_code(s, code, dtree);
                    /* send the distance code */
                    extra = extra_dbits[code];
                    if (extra !== 0) {
                      dist -= base_dist[code];
                      send_bits(s, dist, extra);
                      /* send the extra distance bits */
                    }
                  }
                  /* literal or match pair ? */
                  /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
                  // Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
                  //       "pendingBuf overflow");
                } while (lx < s.last_lit);
              }
              send_code(s, END_BLOCK, ltree);
            };
            /* ===========================================================================
             * Construct one Huffman tree and assigns the code bit strings and lengths.
             * Update the total bit length for the current block.
             * IN assertion: the field freq is set for all tree elements.
             * OUT assertions: the fields len and code are set to the optimal bit length
             *     and corresponding code. The length opt_len is updated; static_len is
             *     also updated if stree is not null. The field max_code is set.
             */
            var build_tree = function build_tree(
              s,
              desc //    deflate_state *s; //    tree_desc *desc; /* the tree descriptor */
            ) {
              var tree = desc.dyn_tree;
              var stree = desc.stat_desc.static_tree;
              var has_stree = desc.stat_desc.has_stree;
              var elems = desc.stat_desc.elems;
              var n;
              var m;
              /* iterate over heap elements */
              var max_code = -1;
              /* largest code with non zero frequency */
              var node;
              /* new node being created */
              /* Construct the initial heap, with least frequent element in
               * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
               * heap[0] is not used.
               */
              s.heap_len = 0;
              s.heap_max = HEAP_SIZE;
              for (n = 0; n < elems; n++) {
                if (
                  tree[n * 2] !==
                  /* .Freq */
                  0
                ) {
                  s.heap[++s.heap_len] = max_code = n;
                  s.depth[n] = 0;
                } else {
                  tree[n * 2 + 1] =
                    /* .Len */
                    0;
                }
              }
              /* The pkzip format requires that at least one distance code exists,
               * and that at least one bit should be sent even if there is only one
               * possible code. So to avoid special checks later on we force at least
               * two codes of non zero frequency.
               */
              while (s.heap_len < 2) {
                node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
                tree[node * 2] =
                  /* .Freq */
                  1;
                s.depth[node] = 0;
                s.opt_len--;
                if (has_stree) {
                  s.static_len -= stree[node * 2 + 1];
                  /* .Len */
                }
                /* node is 0 or 1 so it does not have extra bits */
              }
              desc.max_code = max_code;
              /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
               * establish sub-heaps of increasing lengths:
               */
              for (
                n = s.heap_len >> 1;
                /* int /2 */
                n >= 1;
                n--
              ) {
                pqdownheap(s, tree, n);
              }
              /* Construct the Huffman tree by repeatedly combining the least two
               * frequent nodes.
               */
              node = elems;
              /* next internal node of the tree */
              do {
                // pqremove(s, tree, n);  /* n = node of least frequency */
                /** * pqremove ** */
                n = s.heap[1];
                /* SMALLEST */
                s.heap[1] = s.heap[s.heap_len--];
                /* SMALLEST */
                pqdownheap(
                  s,
                  tree,
                  1
                  /* SMALLEST */
                );
                /***/
                m = s.heap[1];
                /* SMALLEST */
                /* m = node of next least frequency */
                s.heap[--s.heap_max] = n;
                /* keep the nodes sorted by frequency */
                s.heap[--s.heap_max] = m;
                /* Create a new node father of n and m */
                tree[node * 2] =
                  /* .Freq */
                  tree[n * 2] +
                  /* .Freq */
                  tree[m * 2];
                /* .Freq */
                s.depth[node] =
                  (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
                tree[n * 2 + 1] =
                  /* .Dad */
                  tree[m * 2 + 1] =
                    /* .Dad */
                    node;
                /* and insert the new node in the heap */
                s.heap[1] = node++;
                /* SMALLEST */
                pqdownheap(
                  s,
                  tree,
                  1
                  /* SMALLEST */
                );
              } while (s.heap_len >= 2);
              s.heap[--s.heap_max] = s.heap[1];
              /* SMALLEST */
              /* At this point, the fields freq and dad are set. We can now
               * generate the bit lengths.
               */
              gen_bitlen(s, desc);
              /* The field len is now set, we can generate the bit codes */
              gen_codes(tree, max_code, s.bl_count);
            };
            /* ===========================================================================
             * Scan a literal or distance tree to determine the frequencies of the codes
             * in the bit length tree.
             */
            var scan_tree = function scan_tree(
              s,
              tree,
              max_code //    deflate_state *s; //    ct_data *tree;   /* the tree to be scanned */ //    int max_code;    /* and its largest code of non zero frequency */
            ) {
              var n;
              /* iterates over all tree elements */
              var prevlen = -1;
              /* last emitted length */
              var curlen;
              /* length of current code */
              var nextlen = tree[0 * 2 + 1];
              /* .Len */
              /* length of next code */
              var count = 0;
              /* repeat count of the current code */
              var max_count = 7;
              /* max repeat count */
              var min_count = 4;
              /* min repeat count */
              if (nextlen === 0) {
                max_count = 138;
                min_count = 3;
              }
              tree[(max_code + 1) * 2 + 1] =
                /* .Len */
                0xffff;
              /* guard */
              for (n = 0; n <= max_code; n++) {
                curlen = nextlen;
                nextlen = tree[(n + 1) * 2 + 1];
                /* .Len */
                if (++count < max_count && curlen === nextlen) {
                  continue;
                } else if (count < min_count) {
                  s.bl_tree[curlen * 2] +=
                    /* .Freq */
                    count;
                } else if (curlen !== 0) {
                  if (curlen !== prevlen) {
                    s.bl_tree[curlen * 2] /* .Freq */++;
                  }
                  s.bl_tree[REP_3_6 * 2] /* .Freq */++;
                } else if (count <= 10) {
                  s.bl_tree[REPZ_3_10 * 2] /* .Freq */++;
                } else {
                  s.bl_tree[REPZ_11_138 * 2] /* .Freq */++;
                }
                count = 0;
                prevlen = curlen;
                if (nextlen === 0) {
                  max_count = 138;
                  min_count = 3;
                } else if (curlen === nextlen) {
                  max_count = 6;
                  min_count = 3;
                } else {
                  max_count = 7;
                  min_count = 4;
                }
              }
            };
            /* ===========================================================================
             * Send a literal or distance tree in compressed form, using the codes in
             * bl_tree.
             */
            var send_tree = function send_tree(
              s,
              tree,
              max_code //    deflate_state *s; //    ct_data *tree; /* the tree to be scanned */ //    int max_code;       /* and its largest code of non zero frequency */
            ) {
              var n;
              /* iterates over all tree elements */
              var prevlen = -1;
              /* last emitted length */
              var curlen;
              /* length of current code */
              var nextlen = tree[0 * 2 + 1];
              /* .Len */
              /* length of next code */
              var count = 0;
              /* repeat count of the current code */
              var max_count = 7;
              /* max repeat count */
              var min_count = 4;
              /* min repeat count */
              /* tree[max_code+1].Len = -1; */
              /* guard already set */
              if (nextlen === 0) {
                max_count = 138;
                min_count = 3;
              }
              for (n = 0; n <= max_code; n++) {
                curlen = nextlen;
                nextlen = tree[(n + 1) * 2 + 1];
                /* .Len */
                if (++count < max_count && curlen === nextlen) {
                  continue;
                } else if (count < min_count) {
                  do {
                    send_code(s, curlen, s.bl_tree);
                  } while (--count !== 0);
                } else if (curlen !== 0) {
                  if (curlen !== prevlen) {
                    send_code(s, curlen, s.bl_tree);
                    count--;
                  } // Assert(count >= 3 && count <= 6, " 3_6?");
                  send_code(s, REP_3_6, s.bl_tree);
                  send_bits(s, count - 3, 2);
                } else if (count <= 10) {
                  send_code(s, REPZ_3_10, s.bl_tree);
                  send_bits(s, count - 3, 3);
                } else {
                  send_code(s, REPZ_11_138, s.bl_tree);
                  send_bits(s, count - 11, 7);
                }
                count = 0;
                prevlen = curlen;
                if (nextlen === 0) {
                  max_count = 138;
                  min_count = 3;
                } else if (curlen === nextlen) {
                  max_count = 6;
                  min_count = 3;
                } else {
                  max_count = 7;
                  min_count = 4;
                }
              }
            };
            /* ===========================================================================
             * Construct the Huffman tree for the bit lengths and return the index in
             * bl_order of the last bit length code to send.
             */
            var build_bl_tree = function build_bl_tree(s) {
              var max_blindex;
              /* index of last bit length code of non zero freq */
              /* Determine the bit length frequencies for literal and distance trees */
              scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
              scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
              /* Build the bit length tree: */
              build_tree(s, s.bl_desc);
              /* opt_len now includes the length of the tree representations, except
               * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
               */
              /* Determine the number of bit length codes to send. The pkzip format
               * requires that at least 4 bit length codes be sent. (appnote.txt says
               * 3 but the actual value used is 4.)
               */
              for (
                max_blindex = BL_CODES - 1;
                max_blindex >= 3;
                max_blindex--
              ) {
                if (
                  s.bl_tree[bl_order[max_blindex] * 2 + 1] !==
                  /* .Len */
                  0
                ) {
                  break;
                }
              }
              /* Update opt_len to include the bit length tree and counts */
              s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4; // Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
              //        s->opt_len, s->static_len));
              return max_blindex;
            };
            /* ===========================================================================
             * Send the header for a block using dynamic Huffman trees: the counts, the
             * lengths of the bit length codes, the literal tree and the distance tree.
             * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
             */
            var send_all_trees = function send_all_trees(
              s,
              lcodes,
              dcodes,
              blcodes //    deflate_state *s; //    int lcodes, dcodes, blcodes; /* number of codes for each tree */
            ) {
              var rank;
              /* index in bl_order */
              // Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
              // Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
              //        "too many codes");
              // Tracev((stderr, "\nbl counts: "));
              send_bits(s, lcodes - 257, 5);
              /* not +255 as stated in appnote.txt */
              send_bits(s, dcodes - 1, 5);
              send_bits(s, blcodes - 4, 4);
              /* not -3 as stated in appnote.txt */
              for (rank = 0; rank < blcodes; rank++) {
                // Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
                send_bits(
                  s,
                  s.bl_tree[bl_order[rank] * 2 + 1],
                  /* .Len */
                  3
                );
              } // Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));
              send_tree(s, s.dyn_ltree, lcodes - 1);
              /* literal tree */
              // Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));
              send_tree(s, s.dyn_dtree, dcodes - 1);
              /* distance tree */
              // Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
            };
            /* ===========================================================================
             * Check if the data type is TEXT or BINARY, using the following algorithm:
             * - TEXT if the two conditions below are satisfied:
             *    a) There are no non-portable control characters belonging to the
             *       "black list" (0..6, 14..25, 28..31).
             *    b) There is at least one printable character belonging to the
             *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
             * - BINARY otherwise.
             * - The following partially-portable control characters form a
             *   "gray list" that is ignored in this detection algorithm:
             *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
             * IN assertion: the fields Freq of dyn_ltree are set.
             */
            var detect_data_type = function detect_data_type(s) {
              /* black_mask is the bit mask of black-listed bytes
               * set bits 0..6, 14..25, and 28..31
               * 0xf3ffc07f = binary 11110011111111111100000001111111
               */
              var black_mask = 0xf3ffc07f;
              var n;
              /* Check for non-textual ("black-listed") bytes. */
              for (n = 0; n <= 31; n++, black_mask >>>= 1) {
                if (
                  black_mask & 1 &&
                  s.dyn_ltree[n * 2] !==
                    /* .Freq */
                    0
                ) {
                  return Z_BINARY;
                }
              }
              /* Check for textual ("white-listed") bytes. */
              if (
                s.dyn_ltree[9 * 2] !==
                  /* .Freq */
                  0 ||
                s.dyn_ltree[10 * 2] !==
                  /* .Freq */
                  0 ||
                s.dyn_ltree[13 * 2] !==
                  /* .Freq */
                  0
              ) {
                return Z_TEXT;
              }
              for (n = 32; n < LITERALS; n++) {
                if (
                  s.dyn_ltree[n * 2] !==
                  /* .Freq */
                  0
                ) {
                  return Z_TEXT;
                }
              }
              /* There are no "black-listed" or "white-listed" bytes:
               * this stream either is empty or has tolerated ("gray-listed") bytes only.
               */
              return Z_BINARY;
            };
            var static_init_done = false;
            /* ===========================================================================
             * Initialize the tree data structures for a new zlib stream.
             */
            var _tr_init = function _tr_init(s) {
              if (!static_init_done) {
                tr_static_init();
                static_init_done = true;
              }
              s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
              s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
              s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
              s.bi_buf = 0;
              s.bi_valid = 0;
              /* Initialize the first block of the first file: */
              init_block(s);
            };
            /* ===========================================================================
             * Send a stored block
             */
            var _tr_stored_block = function _tr_stored_block(
              s,
              buf,
              stored_len,
              last // DeflateState *s; //charf *buf;       /* input block */ //ulg stored_len;   /* length of input block */ //int last;         /* one if this is the last block for a file */
            ) {
              send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
              /* send block type */
              copy_block(s, buf, stored_len, true);
              /* with header */
            };
            /* ===========================================================================
             * Send one empty static block to give enough lookahead for inflate.
             * This takes 10 bits, of which 7 may remain in the bit buffer.
             */
            var _tr_align = function _tr_align(s) {
              send_bits(s, STATIC_TREES << 1, 3);
              send_code(s, END_BLOCK, static_ltree);
              bi_flush(s);
            };
            /* ===========================================================================
             * Determine the best encoding for the current block: dynamic trees, static
             * trees or store, and output the encoded block to the zip file.
             */
            var _tr_flush_block = function _tr_flush_block(
              s,
              buf,
              stored_len,
              last // DeflateState *s; //charf *buf;       /* input block, or NULL if too old */ //ulg stored_len;   /* length of input block */ //int last;         /* one if this is the last block for a file */
            ) {
              var opt_lenb;
              var static_lenb;
              /* opt_len and static_len in bytes */
              var max_blindex = 0;
              /* index of last bit length code of non zero freq */
              /* Build the Huffman trees unless a stored block is forced */
              if (s.level > 0) {
                /* Check if the file is binary or text */
                if (s.strm.data_type === Z_UNKNOWN) {
                  s.strm.data_type = detect_data_type(s);
                }
                /* Construct the literal and distance trees */
                build_tree(s, s.l_desc); // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
                //        s->static_len));
                build_tree(s, s.d_desc); // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
                //        s->static_len));
                /* At this point, opt_len and static_len are the total bit lengths of
                 * the compressed block data, excluding the tree representations.
                 */
                /* Build the bit length tree for the above two trees, and get the index
                 * in bl_order of the last bit length code to send.
                 */
                max_blindex = build_bl_tree(s);
                /* Determine the best encoding. Compute the block lengths in bytes. */
                opt_lenb = (s.opt_len + 3 + 7) >>> 3;
                static_lenb = (s.static_len + 3 + 7) >>> 3; // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
                //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
                //        s->last_lit));
                if (static_lenb <= opt_lenb) {
                  opt_lenb = static_lenb;
                }
              } else {
                // Assert(buf != (char*)0, "lost buf");
                opt_lenb = static_lenb = stored_len + 5;
                /* force a stored block */
              }
              if (stored_len + 4 <= opt_lenb && buf !== -1) {
                /* 4: two words for the lengths */
                /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
                 * Otherwise we can't have processed more than WSIZE input bytes since
                 * the last block flush, because compression would have been
                 * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
                 * transform a block into a stored block.
                 */
                _tr_stored_block(s, buf, stored_len, last);
              } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
                send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
                compress_block(s, static_ltree, static_dtree);
              } else {
                send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
                send_all_trees(
                  s,
                  s.l_desc.max_code + 1,
                  s.d_desc.max_code + 1,
                  max_blindex + 1
                );
                compress_block(s, s.dyn_ltree, s.dyn_dtree);
              } // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
              /* The above check is made mod 2^32, for files larger than 512 MB
               * and uLong implemented on 32 bits.
               */
              init_block(s);
              if (last) {
                bi_windup(s);
              } // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
              //       s->compressed_len-7*last));
            };
            /* ===========================================================================
             * Save the match info and tally the frequency counts. Return true if
             * the current block must be flushed.
             */
            var _tr_tally = function _tr_tally(
              s,
              dist,
              lc //    deflate_state *s; //    unsigned dist;  /* distance of matched string */ //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
            ) {
              // let out_length, in_length, dcode;
              s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff;
              s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;
              s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
              s.last_lit++;
              if (dist === 0) {
                /* lc is the unmatched char */
                s.dyn_ltree[lc * 2] /* .Freq */++;
              } else {
                s.matches++;
                /* Here, lc is the match length - MIN_MATCH */
                dist--;
                /* dist = match distance - 1 */
                // Assert((ush)dist < (ush)MAX_DIST(s) &&
                //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
                //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");
                s.dyn_ltree[
                  (_length_code[lc] + LITERALS + 1) * 2
                ] /* .Freq */++;
                s.dyn_dtree[d_code(dist) * 2] /* .Freq */++;
              } // (!) This block is disabled in zlib defaults,
              // don't enable it for binary compatibility
              // #ifdef TRUNCATE_BLOCK
              //  /* Try to guess if it is profitable to stop the current block here */
              //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
              //    /* Compute an upper bound for the compressed length */
              //    out_length = s.last_lit*8;
              //    in_length = s.strstart - s.block_start;
              //
              //    for (dcode = 0; dcode < D_CODES; dcode++) {
              //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
              //    }
              //    out_length >>>= 3;
              //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
              //    //       s->last_lit, in_length, out_length,
              //    //       100L - out_length*100L/in_length));
              //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
              //      return true;
              //    }
              //  }
              // #endif
              return s.last_lit === s.lit_bufsize - 1;
              /* We avoid equality with lit_bufsize because of wraparound at 64K
               * on 16 bit machines and because stored blocks are restricted to
               * 64K-1 bytes.
               */
            };
            var _tr_init_1 = _tr_init;
            var _tr_stored_block_1 = _tr_stored_block;
            var _tr_flush_block_1 = _tr_flush_block;
            var _tr_tally_1 = _tr_tally;
            var _tr_align_1 = _tr_align;
            var trees = {
              _tr_init: _tr_init_1,
              _tr_stored_block: _tr_stored_block_1,
              _tr_flush_block: _tr_flush_block_1,
              _tr_tally: _tr_tally_1,
              _tr_align: _tr_align_1,
            };
            // It isn't worth it to make additional optimizations as in original.
            // Small size is preferable.
            // (C) 1995-2013 Jean-loup Gailly and Mark Adler
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            var adler32 = function adler32(adler, buf, len, pos) {
              var s1 = (adler & 0xffff) | 0;
              var s2 = ((adler >>> 16) & 0xffff) | 0;
              var n = 0;
              while (len !== 0) {
                // Set limit ~ twice less than 5552, to keep
                // s2 in 31-bits, because we force signed ints.
                // in other case %= will fail.
                n = len > 2000 ? 2000 : len;
                len -= n;
                do {
                  s1 = (s1 + buf[pos++]) | 0;
                  s2 = (s2 + s1) | 0;
                } while (--n);
                s1 %= 65521;
                s2 %= 65521;
              }
              return s1 | (s2 << 16) | 0;
            };
            var adler32_1 = adler32;
            // So write code to minimize size - no pregenerated tables
            // and array tools dependencies.
            // (C) 1995-2013 Jean-loup Gailly and Mark Adler
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            // Use ordinary array, since untyped makes no boost here
            var makeTable = function makeTable() {
              var c;
              var table = [];
              for (var n = 0; n < 256; n++) {
                c = n;
                for (var k = 0; k < 8; k++) {
                  c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
                }
                table[n] = c;
              }
              return table;
            }; // Create table on load. Just 255 signed longs. Not a problem.
            var crcTable = new Uint32Array(makeTable());
            var crc32 = function crc32(crc, buf, len, pos) {
              var t = crcTable;
              var end = pos + len;
              crc ^= -1;
              for (var i = pos; i < end; i++) {
                crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xff];
              }
              return crc ^ -1; // >>> 0;
            };
            var crc32_1 = crc32;
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            var messages = {
              2: "need dictionary",
              /* Z_NEED_DICT       2  */
              1: "stream end",
              /* Z_STREAM_END      1  */
              0: "",
              /* Z_OK              0  */
              "-1": "file error",
              /* Z_ERRNO         (-1) */
              "-2": "stream error",
              /* Z_STREAM_ERROR  (-2) */
              "-3": "data error",
              /* Z_DATA_ERROR    (-3) */
              "-4": "insufficient memory",
              /* Z_MEM_ERROR     (-4) */
              "-5": "buffer error",
              /* Z_BUF_ERROR     (-5) */
              "-6": "incompatible version",
            };
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            var constants = {
              /* Allowed flush values; see deflate() and inflate() below for details */
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              /* Return codes for the compression/decompression functions. Negative values
               * are errors, positive values are used for special but normal events.
               */
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_MEM_ERROR: -4,
              Z_BUF_ERROR: -5,
              // Z_VERSION_ERROR: -6,
              /* compression levels */
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              /* Possible values of the data_type field (though see inflate()) */
              Z_BINARY: 0,
              Z_TEXT: 1,
              // Z_ASCII:                1, // = Z_TEXT (deprecated)
              Z_UNKNOWN: 2,
              /* The deflate compression method */
              Z_DEFLATED: 8,
            };
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            var _tr_init$1 = trees._tr_init;
            var _tr_stored_block$1 = trees._tr_stored_block;
            var _tr_flush_block$1 = trees._tr_flush_block;
            var _tr_tally$1 = trees._tr_tally;
            var _tr_align$1 = trees._tr_align;
            /* Public constants ========================================================== */
            /* =========================================================================== */
            var Z_NO_FLUSH = constants.Z_NO_FLUSH;
            var Z_PARTIAL_FLUSH = constants.Z_PARTIAL_FLUSH;
            var Z_FULL_FLUSH = constants.Z_FULL_FLUSH;
            var Z_FINISH = constants.Z_FINISH;
            var Z_BLOCK = constants.Z_BLOCK;
            var Z_OK = constants.Z_OK;
            var Z_STREAM_END = constants.Z_STREAM_END;
            var Z_STREAM_ERROR = constants.Z_STREAM_ERROR;
            var Z_DATA_ERROR = constants.Z_DATA_ERROR;
            var Z_BUF_ERROR = constants.Z_BUF_ERROR;
            var Z_DEFAULT_COMPRESSION = constants.Z_DEFAULT_COMPRESSION;
            var Z_FILTERED = constants.Z_FILTERED;
            var Z_HUFFMAN_ONLY = constants.Z_HUFFMAN_ONLY;
            var Z_RLE = constants.Z_RLE;
            var Z_FIXED$1 = constants.Z_FIXED;
            var Z_DEFAULT_STRATEGY = constants.Z_DEFAULT_STRATEGY;
            var Z_UNKNOWN$1 = constants.Z_UNKNOWN;
            var Z_DEFLATED = constants.Z_DEFLATED;
            /* ============================================================================ */
            var MAX_MEM_LEVEL = 9;
            /* Maximum value for memLevel in deflateInit2 */
            var MAX_WBITS = 15;
            /* 32K LZ77 window */
            var DEF_MEM_LEVEL = 8;
            var LENGTH_CODES$1 = 29;
            /* number of length codes, not counting the special END_BLOCK code */
            var LITERALS$1 = 256;
            /* number of literal bytes 0..255 */
            var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
            /* number of Literal or Length codes, including the END_BLOCK code */
            var D_CODES$1 = 30;
            /* number of distance codes */
            var BL_CODES$1 = 19;
            /* number of codes used to transfer the bit lengths */
            var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
            /* maximum heap size */
            var MAX_BITS$1 = 15;
            /* All codes must not exceed MAX_BITS bits */
            var MIN_MATCH$1 = 3;
            var MAX_MATCH$1 = 258;
            var MIN_LOOKAHEAD = MAX_MATCH$1 + MIN_MATCH$1 + 1;
            var PRESET_DICT = 0x20;
            var INIT_STATE = 42;
            var EXTRA_STATE = 69;
            var NAME_STATE = 73;
            var COMMENT_STATE = 91;
            var HCRC_STATE = 103;
            var BUSY_STATE = 113;
            var FINISH_STATE = 666;
            var BS_NEED_MORE = 1;
            /* block not completed, need more input or more output */
            var BS_BLOCK_DONE = 2;
            /* block flush performed */
            var BS_FINISH_STARTED = 3;
            /* finish started, need only more output at next deflate */
            var BS_FINISH_DONE = 4;
            /* finish done, accept no more input or output */
            var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.
            var err = function err(strm, errorCode) {
              strm.msg = messages[errorCode];
              return errorCode;
            };
            var rank = function rank(f) {
              return (f << 1) - (f > 4 ? 9 : 0);
            };
            var zero$1 = function zero(buf) {
              var len = buf.length;
              while (--len >= 0) {
                buf[len] = 0;
              }
            };
            /* eslint-disable new-cap */
            var HASH_ZLIB = function HASH_ZLIB(s, prev, data) {
              return ((prev << s.hash_shift) ^ data) & s.hash_mask;
            }; // This hash causes less collisions, https://github.com/nodeca/pako/issues/135
            // But breaks binary compatibility
            // let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
            var HASH = HASH_ZLIB;
            /* =========================================================================
             * Flush as much pending output as possible. All deflate() output goes
             * through this function so some applications may wish to modify it
             * to avoid allocating a large strm->output buffer and copying into it.
             * (See also read_buf()).
             */
            var flush_pending = function flush_pending(strm) {
              var s = strm.state; // _tr_flush_bits(s);
              var len = s.pending;
              if (len > strm.avail_out) {
                len = strm.avail_out;
              }
              if (len === 0) {
                return;
              }
              strm.output.set(
                s.pending_buf.subarray(s.pending_out, s.pending_out + len),
                strm.next_out
              );
              strm.next_out += len;
              s.pending_out += len;
              strm.total_out += len;
              strm.avail_out -= len;
              s.pending -= len;
              if (s.pending === 0) {
                s.pending_out = 0;
              }
            };
            var flush_block_only = function flush_block_only(s, last) {
              _tr_flush_block$1(
                s,
                s.block_start >= 0 ? s.block_start : -1,
                s.strstart - s.block_start,
                last
              );
              s.block_start = s.strstart;
              flush_pending(s.strm);
            };
            var put_byte = function put_byte(s, b) {
              s.pending_buf[s.pending++] = b;
            };
            /* =========================================================================
             * Put a short in the pending buffer. The 16-bit value is put in MSB order.
             * IN assertion: the stream state is correct and there is enough room in
             * pending_buf.
             */
            var putShortMSB = function putShortMSB(s, b) {
              //  put_byte(s, (Byte)(b >> 8));
              //  put_byte(s, (Byte)(b & 0xff));
              s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
              s.pending_buf[s.pending++] = b & 0xff;
            };
            /* ===========================================================================
             * Read a new buffer from the current input stream, update the adler32
             * and total number of bytes read.  All deflate() input goes through
             * this function so some applications may wish to modify it to avoid
             * allocating a large strm->input buffer and copying from it.
             * (See also flush_pending()).
             */
            var read_buf = function read_buf(strm, buf, start, size) {
              var len = strm.avail_in;
              if (len > size) {
                len = size;
              }
              if (len === 0) {
                return 0;
              }
              strm.avail_in -= len; // zmemcpy(buf, strm->next_in, len);
              buf.set(
                strm.input.subarray(strm.next_in, strm.next_in + len),
                start
              );
              if (strm.state.wrap === 1) {
                strm.adler = adler32_1(strm.adler, buf, len, start);
              } else if (strm.state.wrap === 2) {
                strm.adler = crc32_1(strm.adler, buf, len, start);
              }
              strm.next_in += len;
              strm.total_in += len;
              return len;
            };
            /* ===========================================================================
             * Set match_start to the longest match starting at the given string and
             * return its length. Matches shorter or equal to prev_length are discarded,
             * in which case the result is equal to prev_length and match_start is
             * garbage.
             * IN assertions: cur_match is the head of the hash chain for the current
             *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
             * OUT assertion: the match length is not greater than s->lookahead.
             */
            var longest_match = function longest_match(s, cur_match) {
              var chain_length = s.max_chain_length;
              /* max hash chain length */
              var scan = s.strstart;
              /* current string */
              var match;
              /* matched string */
              var len;
              /* length of current match */
              var best_len = s.prev_length;
              /* best match length so far */
              var nice_match = s.nice_match;
              /* stop if match long enough */
              var limit =
                s.strstart > s.w_size - MIN_LOOKAHEAD
                  ? s.strstart - (s.w_size - MIN_LOOKAHEAD)
                  : 0;
              /* NIL */
              var _win = s.window; // shortcut
              var wmask = s.w_mask;
              var prev = s.prev;
              /* Stop when cur_match becomes <= limit. To simplify the code,
               * we prevent matches with the string of window index 0.
               */
              var strend = s.strstart + MAX_MATCH$1;
              var scan_end1 = _win[scan + best_len - 1];
              var scan_end = _win[scan + best_len];
              /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
               * It is easy to get rid of this optimization if necessary.
               */
              // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");
              /* Do not waste too much time if we already have a good match: */
              if (s.prev_length >= s.good_match) {
                chain_length >>= 2;
              }
              /* Do not look for matches beyond the end of the input. This is necessary
               * to make deflate deterministic.
               */
              if (nice_match > s.lookahead) {
                nice_match = s.lookahead;
              } // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");
              do {
                // Assert(cur_match < s->strstart, "no future");
                match = cur_match;
                /* Skip to next match if the match length cannot increase
                 * or if the match length is less than 2.  Note that the checks below
                 * for insufficient lookahead only occur occasionally for performance
                 * reasons.  Therefore uninitialized memory will be accessed, and
                 * conditional jumps will be made that depend on those values.
                 * However the length of the match is limited to the lookahead, so
                 * the output of deflate is not affected by the uninitialized values.
                 */
                if (
                  _win[match + best_len] !== scan_end ||
                  _win[match + best_len - 1] !== scan_end1 ||
                  _win[match] !== _win[scan] ||
                  _win[++match] !== _win[scan + 1]
                ) {
                  continue;
                }
                /* The check at best_len-1 can be removed because it will be made
                 * again later. (This heuristic is not always a win.)
                 * It is not necessary to compare scan[2] and match[2] since they
                 * are always equal when the other bytes match, given that
                 * the hash keys are equal and that HASH_BITS >= 8.
                 */
                scan += 2;
                match++; // Assert(*scan == *match, "match[2]?");
                /* We check for insufficient lookahead only every 8th comparison;
                 * the 256th check will be made at strstart+258.
                 */
                do {
                  /* jshint noempty:false */
                } while (
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  _win[++scan] === _win[++match] &&
                  scan < strend
                ); // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");
                len = MAX_MATCH$1 - (strend - scan);
                scan = strend - MAX_MATCH$1;
                if (len > best_len) {
                  s.match_start = cur_match;
                  best_len = len;
                  if (len >= nice_match) {
                    break;
                  }
                  scan_end1 = _win[scan + best_len - 1];
                  scan_end = _win[scan + best_len];
                }
              } while (
                (cur_match = prev[cur_match & wmask]) > limit &&
                --chain_length !== 0
              );
              if (best_len <= s.lookahead) {
                return best_len;
              }
              return s.lookahead;
            };
            /* ===========================================================================
             * Fill the window when the lookahead becomes insufficient.
             * Updates strstart and lookahead.
             *
             * IN assertion: lookahead < MIN_LOOKAHEAD
             * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
             *    At least one byte has been read, or avail_in == 0; reads are
             *    performed for at least two bytes (required for the zip translate_eol
             *    option -- not supported here).
             */
            var fill_window = function fill_window(s) {
              var _w_size = s.w_size;
              var p;
              var n;
              var m;
              var more;
              var str; // Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");
              do {
                more = s.window_size - s.lookahead - s.strstart; // JS ints have 32 bit, block below not needed
                /* Deal with !@#$% 64K limit: */
                // if (sizeof(int) <= 2) {
                //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
                //        more = wsize;
                //
                //  } else if (more == (unsigned)(-1)) {
                //        /* Very unlikely, but possible on 16 bit machine if
                //         * strstart == 0 && lookahead == 1 (input done a byte at time)
                //         */
                //        more--;
                //    }
                // }
                /* If the window is almost full and there is insufficient lookahead,
                 * move the upper half to the lower one to make room in the upper half.
                 */
                if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
                  s.window.set(
                    s.window.subarray(_w_size, _w_size + _w_size),
                    0
                  );
                  s.match_start -= _w_size;
                  s.strstart -= _w_size;
                  /* we now have strstart >= MAX_DIST */
                  s.block_start -= _w_size;
                  /* Slide the hash table (could be avoided with 32 bit values
                   at the expense of memory usage). We slide even when level == 0
                   to keep the hash table consistent if we switch back to level > 0
                   later. (Using level 0 permanently is not an optimal usage of
                   zlib, so we don't care about this pathological case.)
                   */
                  n = s.hash_size;
                  p = n;
                  do {
                    m = s.head[--p];
                    s.head[p] = m >= _w_size ? m - _w_size : 0;
                  } while (--n);
                  n = _w_size;
                  p = n;
                  do {
                    m = s.prev[--p];
                    s.prev[p] = m >= _w_size ? m - _w_size : 0;
                    /* If n is not on any hash chain, prev[n] is garbage but
                     * its value will never be used.
                     */
                  } while (--n);
                  more += _w_size;
                }
                if (s.strm.avail_in === 0) {
                  break;
                }
                /* If there was no sliding:
                 *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
                 *    more == window_size - lookahead - strstart
                 * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
                 * => more >= window_size - 2*WSIZE + 2
                 * In the BIG_MEM or MMAP case (not yet supported),
                 *   window_size == input_size + MIN_LOOKAHEAD  &&
                 *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
                 * Otherwise, window_size == 2*WSIZE so more >= 2.
                 * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
                 */
                // Assert(more >= 2, "more < 2");
                n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
                s.lookahead += n;
                /* Initialize the hash value now that we have some input: */
                if (s.lookahead + s.insert >= MIN_MATCH$1) {
                  str = s.strstart - s.insert;
                  s.ins_h = s.window[str];
                  /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
                  s.ins_h = HASH(s, s.ins_h, s.window[str + 1]); // #if MIN_MATCH != 3
                  //        Call update_hash() MIN_MATCH-3 more times
                  // #endif
                  while (s.insert) {
                    /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
                    s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH$1 - 1]);
                    s.prev[str & s.w_mask] = s.head[s.ins_h];
                    s.head[s.ins_h] = str;
                    str++;
                    s.insert--;
                    if (s.lookahead + s.insert < MIN_MATCH$1) {
                      break;
                    }
                  }
                }
                /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
                 * but this is not important since only literal bytes will be emitted.
                 */
              } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
              /* If the WIN_INIT bytes after the end of the current data have never been
               * written, then zero those bytes in order to avoid memory check reports of
               * the use of uninitialized (or uninitialised as Julian writes) bytes by
               * the longest match routines.  Update the high water mark for the next
               * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
               * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
               */
              //  if (s.high_water < s.window_size) {
              //    const curr = s.strstart + s.lookahead;
              //    let init = 0;
              //
              //    if (s.high_water < curr) {
              //      /* Previous high water mark below current data -- zero WIN_INIT
              //       * bytes or up to end of window, whichever is less.
              //       */
              //      init = s.window_size - curr;
              //      if (init > WIN_INIT)
              //        init = WIN_INIT;
              //      zmemzero(s->window + curr, (unsigned)init);
              //      s->high_water = curr + init;
              //    }
              //    else if (s->high_water < (ulg)curr + WIN_INIT) {
              //      /* High water mark at or above current data, but below current data
              //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
              //       * to end of window, whichever is less.
              //       */
              //      init = (ulg)curr + WIN_INIT - s->high_water;
              //      if (init > s->window_size - s->high_water)
              //        init = s->window_size - s->high_water;
              //      zmemzero(s->window + s->high_water, (unsigned)init);
              //      s->high_water += init;
              //    }
              //  }
              //
              //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
              //    "not enough room for search");
            };
            /* ===========================================================================
             * Copy without compression as much as possible from the input stream, return
             * the current block state.
             * This function does not insert new strings in the dictionary since
             * uncompressible data is probably not useful. This function is used
             * only for the level=0 compression option.
             * NOTE: this function should be optimized to avoid extra copying from
             * window to pending_buf.
             */
            var deflate_stored = function deflate_stored(s, flush) {
              /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
               * to pending_buf_size, and each stored block has a 5 byte header:
               */
              var max_block_size = 0xffff;
              if (max_block_size > s.pending_buf_size - 5) {
                max_block_size = s.pending_buf_size - 5;
              }
              /* Copy as much as possible from input to output: */
              for (;;) {
                /* Fill the window as much as possible: */
                if (s.lookahead <= 1) {
                  // Assert(s->strstart < s->w_size+MAX_DIST(s) ||
                  //  s->block_start >= (long)s->w_size, "slide too late");
                  //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
                  //        s.block_start >= s.w_size)) {
                  //        throw  new Error("slide too late");
                  //      }
                  fill_window(s);
                  if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                  }
                  if (s.lookahead === 0) {
                    break;
                  }
                  /* flush the current block */
                } // Assert(s->block_start >= 0L, "block gone");
                //    if (s.block_start < 0) throw new Error("block gone");
                s.strstart += s.lookahead;
                s.lookahead = 0;
                /* Emit a stored block if pending_buf will be full: */
                var max_start = s.block_start + max_block_size;
                if (s.strstart === 0 || s.strstart >= max_start) {
                  /* strstart == 0 is possible when wraparound on 16-bit machine */
                  s.lookahead = s.strstart - max_start;
                  s.strstart = max_start;
                  /** * FLUSH_BLOCK(s, 0); ** */
                  flush_block_only(s, false);
                  if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                  }
                  /***/
                }
                /* Flush if we may have to slide, otherwise block_start may become
                 * negative and the data will be gone:
                 */
                if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
                  /** * FLUSH_BLOCK(s, 0); ** */
                  flush_block_only(s, false);
                  if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                  }
                  /***/
                }
              }
              s.insert = 0;
              if (flush === Z_FINISH) {
                /** * FLUSH_BLOCK(s, 1); ** */
                flush_block_only(s, true);
                if (s.strm.avail_out === 0) {
                  return BS_FINISH_STARTED;
                }
                /***/
                return BS_FINISH_DONE;
              }
              if (s.strstart > s.block_start) {
                /** * FLUSH_BLOCK(s, 0); ** */
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                  return BS_NEED_MORE;
                }
                /***/
              }
              return BS_NEED_MORE;
            };
            /* ===========================================================================
             * Compress as much as possible from the input stream, return the current
             * block state.
             * This function does not perform lazy evaluation of matches and inserts
             * new strings in the dictionary only for unmatched strings or for short
             * matches. It is used only for the fast compression options.
             */
            var deflate_fast = function deflate_fast(s, flush) {
              var hash_head;
              /* head of the hash chain */
              var bflush;
              /* set if current block must be flushed */
              for (;;) {
                /* Make sure that we always have enough lookahead, except
                 * at the end of the input file. We need MAX_MATCH bytes
                 * for the next match, plus MIN_MATCH bytes to insert the
                 * string following the next match.
                 */
                if (s.lookahead < MIN_LOOKAHEAD) {
                  fill_window(s);
                  if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                  }
                  if (s.lookahead === 0) {
                    break;
                    /* flush the current block */
                  }
                }
                /* Insert the string window[strstart .. strstart+2] in the
                 * dictionary, and set hash_head to the head of the hash chain:
                 */
                hash_head = 0;
                /* NIL */
                if (s.lookahead >= MIN_MATCH$1) {
                  /** * INSERT_STRING(s, s.strstart, hash_head); ** */
                  s.ins_h = HASH(
                    s,
                    s.ins_h,
                    s.window[s.strstart + MIN_MATCH$1 - 1]
                  );
                  hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                  s.head[s.ins_h] = s.strstart;
                  /***/
                }
                /* Find the longest match, discarding those <= prev_length.
                 * At this point we have always match_length < MIN_MATCH
                 */
                if (
                  hash_head !== 0 &&
                  /* NIL */
                  s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD
                ) {
                  /* To simplify the code, we prevent matches with the string
                   * of window index 0 (in particular we have to avoid a match
                   * of the string with itself at the start of the input file).
                   */
                  s.match_length = longest_match(s, hash_head);
                  /* longest_match() sets match_start */
                }
                if (s.match_length >= MIN_MATCH$1) {
                  // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only
                  /** * _tr_tally_dist(s, s.strstart - s.match_start,
                                 s.match_length - MIN_MATCH, bflush); ** */
                  bflush = _tr_tally$1(
                    s,
                    s.strstart - s.match_start,
                    s.match_length - MIN_MATCH$1
                  );
                  s.lookahead -= s.match_length;
                  /* Insert new strings in the hash table only if the match length
                   * is not too large. This saves time but degrades compression.
                   */
                  if (
                    s.match_length <= s.max_lazy_match &&
                    /* max_insert_length */
                    s.lookahead >= MIN_MATCH$1
                  ) {
                    s.match_length--;
                    /* string at strstart already in table */
                    do {
                      s.strstart++;
                      /** * INSERT_STRING(s, s.strstart, hash_head); ** */
                      s.ins_h = HASH(
                        s,
                        s.ins_h,
                        s.window[s.strstart + MIN_MATCH$1 - 1]
                      );
                      hash_head = s.prev[s.strstart & s.w_mask] =
                        s.head[s.ins_h];
                      s.head[s.ins_h] = s.strstart;
                      /***/
                      /* strstart never exceeds WSIZE-MAX_MATCH, so there are
                       * always MIN_MATCH bytes ahead.
                       */
                    } while (--s.match_length !== 0);
                    s.strstart++;
                  } else {
                    s.strstart += s.match_length;
                    s.match_length = 0;
                    s.ins_h = s.window[s.strstart];
                    /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
                    s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]); // #if MIN_MATCH != 3
                    //                Call UPDATE_HASH() MIN_MATCH-3 more times
                    // #endif
                    /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
                     * matter since it will be recomputed at next deflate call.
                     */
                  }
                } else {
                  /* No match, output a literal byte */
                  // Tracevv((stderr,"%c", s.window[s.strstart]));
                  /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ** */
                  bflush = _tr_tally$1(s, 0, s.window[s.strstart]);
                  s.lookahead--;
                  s.strstart++;
                }
                if (bflush) {
                  /** * FLUSH_BLOCK(s, 0); ** */
                  flush_block_only(s, false);
                  if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                  }
                  /***/
                }
              }
              s.insert =
                s.strstart < MIN_MATCH$1 - 1 ? s.strstart : MIN_MATCH$1 - 1;
              if (flush === Z_FINISH) {
                /** * FLUSH_BLOCK(s, 1); ** */
                flush_block_only(s, true);
                if (s.strm.avail_out === 0) {
                  return BS_FINISH_STARTED;
                }
                /***/
                return BS_FINISH_DONE;
              }
              if (s.last_lit) {
                /** * FLUSH_BLOCK(s, 0); ** */
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                  return BS_NEED_MORE;
                }
                /***/
              }
              return BS_BLOCK_DONE;
            };
            /* ===========================================================================
             * Same as above, but achieves better compression. We use a lazy
             * evaluation for matches: a match is finally adopted only if there is
             * no better match at the next window position.
             */
            var deflate_slow = function deflate_slow(s, flush) {
              var hash_head;
              /* head of hash chain */
              var bflush;
              /* set if current block must be flushed */
              var max_insert;
              /* Process the input block. */
              for (;;) {
                /* Make sure that we always have enough lookahead, except
                 * at the end of the input file. We need MAX_MATCH bytes
                 * for the next match, plus MIN_MATCH bytes to insert the
                 * string following the next match.
                 */
                if (s.lookahead < MIN_LOOKAHEAD) {
                  fill_window(s);
                  if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                  }
                  if (s.lookahead === 0) {
                    break;
                  }
                  /* flush the current block */
                }
                /* Insert the string window[strstart .. strstart+2] in the
                 * dictionary, and set hash_head to the head of the hash chain:
                 */
                hash_head = 0;
                /* NIL */
                if (s.lookahead >= MIN_MATCH$1) {
                  /** * INSERT_STRING(s, s.strstart, hash_head); ** */
                  s.ins_h = HASH(
                    s,
                    s.ins_h,
                    s.window[s.strstart + MIN_MATCH$1 - 1]
                  );
                  hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                  s.head[s.ins_h] = s.strstart;
                  /***/
                }
                /* Find the longest match, discarding those <= prev_length.
                 */
                s.prev_length = s.match_length;
                s.prev_match = s.match_start;
                s.match_length = MIN_MATCH$1 - 1;
                if (
                  hash_head !== 0 &&
                  /* NIL */
                  s.prev_length < s.max_lazy_match &&
                  s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD
                  /* MAX_DIST(s) */
                ) {
                  /* To simplify the code, we prevent matches with the string
                   * of window index 0 (in particular we have to avoid a match
                   * of the string with itself at the start of the input file).
                   */
                  s.match_length = longest_match(s, hash_head);
                  /* longest_match() sets match_start */
                  if (
                    s.match_length <= 5 &&
                    (s.strategy === Z_FILTERED ||
                      (s.match_length === MIN_MATCH$1 &&
                        s.strstart - s.match_start > 4096))
                    /* TOO_FAR */
                  ) {
                    /* If prev_match is also MIN_MATCH, match_start is garbage
                     * but we will ignore the current match anyway.
                     */
                    s.match_length = MIN_MATCH$1 - 1;
                  }
                }
                /* If there was a match at the previous step and the current
                 * match is not better, output the previous match:
                 */
                if (
                  s.prev_length >= MIN_MATCH$1 &&
                  s.match_length <= s.prev_length
                ) {
                  max_insert = s.strstart + s.lookahead - MIN_MATCH$1;
                  /* Do not insert strings in hash table beyond this. */
                  // check_match(s, s.strstart-1, s.prev_match, s.prev_length);
                  /** *_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                                 s.prev_length - MIN_MATCH, bflush);** */
                  bflush = _tr_tally$1(
                    s,
                    s.strstart - 1 - s.prev_match,
                    s.prev_length - MIN_MATCH$1
                  );
                  /* Insert in hash table all strings up to the end of the match.
                   * strstart-1 and strstart are already inserted. If there is not
                   * enough lookahead, the last two strings are not inserted in
                   * the hash table.
                   */
                  s.lookahead -= s.prev_length - 1;
                  s.prev_length -= 2;
                  do {
                    if (++s.strstart <= max_insert) {
                      /** * INSERT_STRING(s, s.strstart, hash_head); ** */
                      s.ins_h = HASH(
                        s,
                        s.ins_h,
                        s.window[s.strstart + MIN_MATCH$1 - 1]
                      );
                      hash_head = s.prev[s.strstart & s.w_mask] =
                        s.head[s.ins_h];
                      s.head[s.ins_h] = s.strstart;
                      /***/
                    }
                  } while (--s.prev_length !== 0);
                  s.match_available = 0;
                  s.match_length = MIN_MATCH$1 - 1;
                  s.strstart++;
                  if (bflush) {
                    /** * FLUSH_BLOCK(s, 0); ** */
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                      return BS_NEED_MORE;
                    }
                    /***/
                  }
                } else if (s.match_available) {
                  /* If there was no match at the previous position, output a
                   * single literal. If there was a match but the current match
                   * is longer, truncate the previous match to a single literal.
                   */
                  // Tracevv((stderr,"%c", s->window[s->strstart-1]));
                  /** * _tr_tally_lit(s, s.window[s.strstart-1], bflush); ** */
                  bflush = _tr_tally$1(s, 0, s.window[s.strstart - 1]);
                  if (bflush) {
                    /** * FLUSH_BLOCK_ONLY(s, 0) ** */
                    flush_block_only(s, false);
                    /***/
                  }
                  s.strstart++;
                  s.lookahead--;
                  if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                  }
                } else {
                  /* There is no previous match to compare with, wait for
                   * the next step to decide.
                   */
                  s.match_available = 1;
                  s.strstart++;
                  s.lookahead--;
                }
              } // Assert (flush != Z_NO_FLUSH, "no flush?");
              if (s.match_available) {
                // Tracevv((stderr,"%c", s->window[s->strstart-1]));
                /** * _tr_tally_lit(s, s.window[s.strstart-1], bflush); ** */
                bflush = _tr_tally$1(s, 0, s.window[s.strstart - 1]);
                s.match_available = 0;
              }
              s.insert =
                s.strstart < MIN_MATCH$1 - 1 ? s.strstart : MIN_MATCH$1 - 1;
              if (flush === Z_FINISH) {
                /** * FLUSH_BLOCK(s, 1); ** */
                flush_block_only(s, true);
                if (s.strm.avail_out === 0) {
                  return BS_FINISH_STARTED;
                }
                /***/
                return BS_FINISH_DONE;
              }
              if (s.last_lit) {
                /** * FLUSH_BLOCK(s, 0); ** */
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                  return BS_NEED_MORE;
                }
                /***/
              }
              return BS_BLOCK_DONE;
            };
            /* ===========================================================================
             * For Z_RLE, simply look for runs of bytes, generate matches only of distance
             * one.  Do not maintain a hash table.  (It will be regenerated if this run of
             * deflate switches away from Z_RLE.)
             */
            var deflate_rle = function deflate_rle(s, flush) {
              var bflush;
              /* set if current block must be flushed */
              var prev;
              /* byte at distance one to match */
              var scan;
              var strend;
              /* scan goes up to strend for length of run */
              var _win = s.window;
              for (;;) {
                /* Make sure that we always have enough lookahead, except
                 * at the end of the input file. We need MAX_MATCH bytes
                 * for the longest run, plus one for the unrolled loop.
                 */
                if (s.lookahead <= MAX_MATCH$1) {
                  fill_window(s);
                  if (s.lookahead <= MAX_MATCH$1 && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                  }
                  if (s.lookahead === 0) {
                    break;
                  }
                  /* flush the current block */
                }
                /* See how many times the previous byte repeats */
                s.match_length = 0;
                if (s.lookahead >= MIN_MATCH$1 && s.strstart > 0) {
                  scan = s.strstart - 1;
                  prev = _win[scan];
                  if (
                    prev === _win[++scan] &&
                    prev === _win[++scan] &&
                    prev === _win[++scan]
                  ) {
                    strend = s.strstart + MAX_MATCH$1;
                    do {
                      /* jshint noempty:false */
                    } while (
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      prev === _win[++scan] &&
                      scan < strend
                    );
                    s.match_length = MAX_MATCH$1 - (strend - scan);
                    if (s.match_length > s.lookahead) {
                      s.match_length = s.lookahead;
                    }
                  } // Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
                }
                /* Emit match if have run of MIN_MATCH or longer, else emit literal */
                if (s.match_length >= MIN_MATCH$1) {
                  // check_match(s, s.strstart, s.strstart - 1, s.match_length);
                  /** * _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ** */
                  bflush = _tr_tally$1(s, 1, s.match_length - MIN_MATCH$1);
                  s.lookahead -= s.match_length;
                  s.strstart += s.match_length;
                  s.match_length = 0;
                } else {
                  /* No match, output a literal byte */
                  // Tracevv((stderr,"%c", s->window[s->strstart]));
                  /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ** */
                  bflush = _tr_tally$1(s, 0, s.window[s.strstart]);
                  s.lookahead--;
                  s.strstart++;
                }
                if (bflush) {
                  /** * FLUSH_BLOCK(s, 0); ** */
                  flush_block_only(s, false);
                  if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                  }
                  /***/
                }
              }
              s.insert = 0;
              if (flush === Z_FINISH) {
                /** * FLUSH_BLOCK(s, 1); ** */
                flush_block_only(s, true);
                if (s.strm.avail_out === 0) {
                  return BS_FINISH_STARTED;
                }
                /***/
                return BS_FINISH_DONE;
              }
              if (s.last_lit) {
                /** * FLUSH_BLOCK(s, 0); ** */
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                  return BS_NEED_MORE;
                }
                /***/
              }
              return BS_BLOCK_DONE;
            };
            /* ===========================================================================
             * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
             * (It will be regenerated if this run of deflate switches away from Huffman.)
             */
            var deflate_huff = function deflate_huff(s, flush) {
              var bflush;
              /* set if current block must be flushed */
              for (;;) {
                /* Make sure that we have a literal to write. */
                if (s.lookahead === 0) {
                  fill_window(s);
                  if (s.lookahead === 0) {
                    if (flush === Z_NO_FLUSH) {
                      return BS_NEED_MORE;
                    }
                    break;
                    /* flush the current block */
                  }
                }
                /* Output a literal byte */
                s.match_length = 0; // Tracevv((stderr,"%c", s->window[s->strstart]));
                /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ** */
                bflush = _tr_tally$1(s, 0, s.window[s.strstart]);
                s.lookahead--;
                s.strstart++;
                if (bflush) {
                  /** * FLUSH_BLOCK(s, 0); ** */
                  flush_block_only(s, false);
                  if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                  }
                  /***/
                }
              }
              s.insert = 0;
              if (flush === Z_FINISH) {
                /** * FLUSH_BLOCK(s, 1); ** */
                flush_block_only(s, true);
                if (s.strm.avail_out === 0) {
                  return BS_FINISH_STARTED;
                }
                /***/
                return BS_FINISH_DONE;
              }
              if (s.last_lit) {
                /** * FLUSH_BLOCK(s, 0); ** */
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                  return BS_NEED_MORE;
                }
                /***/
              }
              return BS_BLOCK_DONE;
            };
            /* Values for max_lazy_match, good_match and max_chain_length, depending on
             * the desired pack level (0..9). The values given below have been tuned to
             * exclude worst case performance for pathological files. Better values may be
             * found for specific files.
             */
            function Config(
              good_length,
              max_lazy,
              nice_length,
              max_chain,
              func
            ) {
              this.good_length = good_length;
              this.max_lazy = max_lazy;
              this.nice_length = nice_length;
              this.max_chain = max_chain;
              this.func = func;
            }
            var configuration_table = [
              /*      good lazy nice chain */
              new Config(0, 0, 0, 0, deflate_stored),
              /* 0 store only */
              new Config(4, 4, 8, 4, deflate_fast),
              /* 1 max speed, no lazy matches */
              new Config(4, 5, 16, 8, deflate_fast),
              /* 2 */
              new Config(4, 6, 32, 32, deflate_fast),
              /* 3 */
              new Config(4, 4, 16, 16, deflate_slow),
              /* 4 lazy matches */
              new Config(8, 16, 32, 32, deflate_slow),
              /* 5 */
              new Config(8, 16, 128, 128, deflate_slow),
              /* 6 */
              new Config(8, 32, 128, 256, deflate_slow),
              /* 7 */
              new Config(32, 128, 258, 1024, deflate_slow),
              /* 8 */
              new Config(32, 258, 258, 4096, deflate_slow),
            ];
            /* ===========================================================================
             * Initialize the "longest match" routines for a new zlib stream
             */
            var lm_init = function lm_init(s) {
              s.window_size = 2 * s.w_size;
              /** * CLEAR_HASH(s); ** */
              zero$1(s.head); // Fill with NIL (= 0);
              /* Set the default configuration parameters:
               */
              s.max_lazy_match = configuration_table[s.level].max_lazy;
              s.good_match = configuration_table[s.level].good_length;
              s.nice_match = configuration_table[s.level].nice_length;
              s.max_chain_length = configuration_table[s.level].max_chain;
              s.strstart = 0;
              s.block_start = 0;
              s.lookahead = 0;
              s.insert = 0;
              s.match_length = s.prev_length = MIN_MATCH$1 - 1;
              s.match_available = 0;
              s.ins_h = 0;
            };
            function DeflateState() {
              this.strm = null;
              /* pointer back to this zlib stream */
              this.status = 0;
              /* as the name implies */
              this.pending_buf = null;
              /* output still pending */
              this.pending_buf_size = 0;
              /* size of pending_buf */
              this.pending_out = 0;
              /* next pending byte to output to the stream */
              this.pending = 0;
              /* nb of bytes in the pending buffer */
              this.wrap = 0;
              /* bit 0 true for zlib, bit 1 true for gzip */
              this.gzhead = null;
              /* gzip header information to write */
              this.gzindex = 0;
              /* where in extra, name, or comment */
              this.method = Z_DEFLATED;
              /* can only be DEFLATED */
              this.last_flush = -1;
              /* value of flush param for previous deflate call */
              this.w_size = 0;
              /* LZ77 window size (32K by default) */
              this.w_bits = 0;
              /* log2(w_size)  (8..16) */
              this.w_mask = 0;
              /* w_size - 1 */
              this.window = null;
              /* Sliding window. Input bytes are read into the second half of the window,
               * and move to the first half later to keep a dictionary of at least wSize
               * bytes. With this organization, matches are limited to a distance of
               * wSize-MAX_MATCH bytes, but this ensures that IO is always
               * performed with a length multiple of the block size.
               */
              this.window_size = 0;
              /* Actual size of window: 2*wSize, except when the user input buffer
               * is directly used as sliding window.
               */
              this.prev = null;
              /* Link to older string with same hash index. To limit the size of this
               * array to 64K, this link is maintained only for the last 32K strings.
               * An index in this array is thus a window index modulo 32K.
               */
              this.head = null;
              /* Heads of the hash chains or NIL. */
              this.ins_h = 0;
              /* hash index of string to be inserted */
              this.hash_size = 0;
              /* number of elements in hash table */
              this.hash_bits = 0;
              /* log2(hash_size) */
              this.hash_mask = 0;
              /* hash_size-1 */
              this.hash_shift = 0;
              /* Number of bits by which ins_h must be shifted at each input
               * step. It must be such that after MIN_MATCH steps, the oldest
               * byte no longer takes part in the hash key, that is:
               *   hash_shift * MIN_MATCH >= hash_bits
               */
              this.block_start = 0;
              /* Window position at the beginning of the current output block. Gets
               * negative when the window is moved backwards.
               */
              this.match_length = 0;
              /* length of best match */
              this.prev_match = 0;
              /* previous match */
              this.match_available = 0;
              /* set if previous match exists */
              this.strstart = 0;
              /* start of string to insert */
              this.match_start = 0;
              /* start of matching string */
              this.lookahead = 0;
              /* number of valid bytes ahead in window */
              this.prev_length = 0;
              /* Length of the best match at previous step. Matches not greater than this
               * are discarded. This is used in the lazy match evaluation.
               */
              this.max_chain_length = 0;
              /* To speed up deflation, hash chains are never searched beyond this
               * length.  A higher limit improves compression ratio but degrades the
               * speed.
               */
              this.max_lazy_match = 0;
              /* Attempt to find a better match only when the current match is strictly
               * smaller than this value. This mechanism is used only for compression
               * levels >= 4.
               */
              // That's alias to max_lazy_match, don't use directly
              // this.max_insert_length = 0;
              /* Insert new strings in the hash table only if the match length is not
               * greater than this length. This saves time but degrades compression.
               * max_insert_length is used only for compression levels <= 3.
               */
              this.level = 0;
              /* compression level (1..9) */
              this.strategy = 0;
              /* favor or force Huffman coding */
              this.good_match = 0;
              /* Use a faster search when the previous match is longer than this */
              this.nice_match = 0;
              /* Stop searching when current match exceeds this */
              /* used by trees.c: */
              /* Didn't use ct_data typedef below to suppress compiler warning */
              // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
              // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
              // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
              // Use flat array of DOUBLE size, with interleaved fata,
              // because JS does not support effective
              this.dyn_ltree = new Uint16Array(HEAP_SIZE$1 * 2);
              this.dyn_dtree = new Uint16Array((2 * D_CODES$1 + 1) * 2);
              this.bl_tree = new Uint16Array((2 * BL_CODES$1 + 1) * 2);
              zero$1(this.dyn_ltree);
              zero$1(this.dyn_dtree);
              zero$1(this.bl_tree);
              this.l_desc = null;
              /* desc. for literal tree */
              this.d_desc = null;
              /* desc. for distance tree */
              this.bl_desc = null;
              /* desc. for bit length tree */
              // ush bl_count[MAX_BITS+1];
              this.bl_count = new Uint16Array(MAX_BITS$1 + 1);
              /* number of codes at each bit length for an optimal tree */
              // int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
              this.heap = new Uint16Array(2 * L_CODES$1 + 1);
              /* heap used to build the Huffman trees */
              zero$1(this.heap);
              this.heap_len = 0;
              /* number of elements in the heap */
              this.heap_max = 0;
              /* element of largest frequency */
              /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
               * The same heap array is used to build all trees.
               */
              this.depth = new Uint16Array(2 * L_CODES$1 + 1); // uch depth[2*L_CODES+1];
              zero$1(this.depth);
              /* Depth of each subtree used as tie breaker for trees of equal frequency
               */
              this.l_buf = 0;
              /* buffer index for literals or lengths */
              this.lit_bufsize = 0;
              /* Size of match buffer for literals/lengths.  There are 4 reasons for
               * limiting lit_bufsize to 64K:
               *   - frequencies can be kept in 16 bit counters
               *   - if compression is not successful for the first block, all input
               *     data is still in the window so we can still emit a stored block even
               *     when input comes from standard input.  (This can also be done for
               *     all blocks if lit_bufsize is not greater than 32K.)
               *   - if compression is not successful for a file smaller than 64K, we can
               *     even emit a stored file instead of a stored block (saving 5 bytes).
               *     This is applicable only for zip (not gzip or zlib).
               *   - creating new Huffman trees less frequently may not provide fast
               *     adaptation to changes in the input data statistics. (Take for
               *     example a binary file with poorly compressible code followed by
               *     a highly compressible string table.) Smaller buffer sizes give
               *     fast adaptation but have of course the overhead of transmitting
               *     trees more frequently.
               *   - I can't count above 4
               */
              this.last_lit = 0;
              /* running index in l_buf */
              this.d_buf = 0;
              /* Buffer index for distances. To simplify the code, d_buf and l_buf have
               * the same number of elements. To use different lengths, an extra flag
               * array would be necessary.
               */
              this.opt_len = 0;
              /* bit length of current block with optimal trees */
              this.static_len = 0;
              /* bit length of current block with static trees */
              this.matches = 0;
              /* number of string matches in current block */
              this.insert = 0;
              /* bytes at end of window left to insert */
              this.bi_buf = 0;
              /* Output buffer. bits are inserted starting at the bottom (least
               * significant bits).
               */
              this.bi_valid = 0;
              /* Number of valid bits in bi_buf.  All bits above the last valid bit
               * are always zero.
               */
              // Used for window memory init. We safely ignore it for JS. That makes
              // sense only for pointers and memory check tools.
              // this.high_water = 0;
              /* High water mark offset in window for initialized bytes -- bytes above
               * this are set to zero in order to avoid memory check warnings when
               * longest match routines access bytes past the input.  This is then
               * updated to the new high water mark.
               */
            }
            var deflateResetKeep = function deflateResetKeep(strm) {
              if (!strm || !strm.state) {
                return err(strm, Z_STREAM_ERROR);
              }
              strm.total_in = strm.total_out = 0;
              strm.data_type = Z_UNKNOWN$1;
              var s = strm.state;
              s.pending = 0;
              s.pending_out = 0;
              if (s.wrap < 0) {
                s.wrap = -s.wrap;
                /* was made negative by deflate(..., Z_FINISH); */
              }
              s.status = s.wrap ? INIT_STATE : BUSY_STATE;
              strm.adler =
                s.wrap === 2
                  ? 0 // crc32(0, Z_NULL, 0)
                  : 1; // adler32(0, Z_NULL, 0)
              s.last_flush = Z_NO_FLUSH;
              _tr_init$1(s);
              return Z_OK;
            };
            var deflateReset = function deflateReset(strm) {
              var ret = deflateResetKeep(strm);
              if (ret === Z_OK) {
                lm_init(strm.state);
              }
              return ret;
            };
            var deflateSetHeader = function deflateSetHeader(strm, head) {
              if (!strm || !strm.state) {
                return Z_STREAM_ERROR;
              }
              if (strm.state.wrap !== 2) {
                return Z_STREAM_ERROR;
              }
              strm.state.gzhead = head;
              return Z_OK;
            };
            var deflateInit2 = function deflateInit2(
              strm,
              level,
              method,
              windowBits,
              memLevel,
              strategy
            ) {
              if (!strm) {
                // === Z_NULL
                return Z_STREAM_ERROR;
              }
              var wrap = 1;
              if (level === Z_DEFAULT_COMPRESSION) {
                level = 6;
              }
              if (windowBits < 0) {
                /* suppress zlib wrapper */
                wrap = 0;
                windowBits = -windowBits;
              } else if (windowBits > 15) {
                wrap = 2;
                /* write gzip wrapper instead */
                windowBits -= 16;
              }
              if (
                memLevel < 1 ||
                memLevel > MAX_MEM_LEVEL ||
                method !== Z_DEFLATED ||
                windowBits < 8 ||
                windowBits > 15 ||
                level < 0 ||
                level > 9 ||
                strategy < 0 ||
                strategy > Z_FIXED$1
              ) {
                return err(strm, Z_STREAM_ERROR);
              }
              if (windowBits === 8) {
                windowBits = 9;
              }
              /* until 256-byte window bug fixed */
              var s = new DeflateState();
              strm.state = s;
              s.strm = strm;
              s.wrap = wrap;
              s.gzhead = null;
              s.w_bits = windowBits;
              s.w_size = 1 << s.w_bits;
              s.w_mask = s.w_size - 1;
              s.hash_bits = memLevel + 7;
              s.hash_size = 1 << s.hash_bits;
              s.hash_mask = s.hash_size - 1;
              s.hash_shift = ~~((s.hash_bits + MIN_MATCH$1 - 1) / MIN_MATCH$1);
              s.window = new Uint8Array(s.w_size * 2);
              s.head = new Uint16Array(s.hash_size);
              s.prev = new Uint16Array(s.w_size); // Don't need mem init magic for JS.
              // s.high_water = 0;  /* nothing written to s->window yet */
              s.lit_bufsize = 1 << (memLevel + 6);
              /* 16K elements by default */
              s.pending_buf_size = s.lit_bufsize * 4; // overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
              // s->pending_buf = (uchf *) overlay;
              s.pending_buf = new Uint8Array(s.pending_buf_size); // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
              // s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
              s.d_buf = 1 * s.lit_bufsize; // s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
              s.l_buf = (1 + 2) * s.lit_bufsize;
              s.level = level;
              s.strategy = strategy;
              s.method = method;
              return deflateReset(strm);
            };
            var deflateInit = function deflateInit(strm, level) {
              return deflateInit2(
                strm,
                level,
                Z_DEFLATED,
                MAX_WBITS,
                DEF_MEM_LEVEL,
                Z_DEFAULT_STRATEGY
              );
            };
            var deflate = function deflate(strm, flush) {
              var beg;
              var val; // for gzip header write only
              if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
                return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
              }
              var s = strm.state;
              if (
                !strm.output ||
                (!strm.input && strm.avail_in !== 0) ||
                (s.status === FINISH_STATE && flush !== Z_FINISH)
              ) {
                return err(
                  strm,
                  strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR
                );
              }
              s.strm = strm;
              /* just in case */
              var old_flush = s.last_flush;
              s.last_flush = flush;
              /* Write the header */
              if (s.status === INIT_STATE) {
                if (s.wrap === 2) {
                  // GZIP header
                  strm.adler = 0; // crc32(0L, Z_NULL, 0);
                  put_byte(s, 31);
                  put_byte(s, 139);
                  put_byte(s, 8);
                  if (!s.gzhead) {
                    // s->gzhead == Z_NULL
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(
                      s,
                      s.level === 9
                        ? 2
                        : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2
                        ? 4
                        : 0
                    );
                    put_byte(s, OS_CODE);
                    s.status = BUSY_STATE;
                  } else {
                    put_byte(
                      s,
                      (s.gzhead.text ? 1 : 0) +
                        (s.gzhead.hcrc ? 2 : 0) +
                        (!s.gzhead.extra ? 0 : 4) +
                        (!s.gzhead.name ? 0 : 8) +
                        (!s.gzhead.comment ? 0 : 16)
                    );
                    put_byte(s, s.gzhead.time & 0xff);
                    put_byte(s, (s.gzhead.time >> 8) & 0xff);
                    put_byte(s, (s.gzhead.time >> 16) & 0xff);
                    put_byte(s, (s.gzhead.time >> 24) & 0xff);
                    put_byte(
                      s,
                      s.level === 9
                        ? 2
                        : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2
                        ? 4
                        : 0
                    );
                    put_byte(s, s.gzhead.os & 0xff);
                    if (s.gzhead.extra && s.gzhead.extra.length) {
                      put_byte(s, s.gzhead.extra.length & 0xff);
                      put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
                    }
                    if (s.gzhead.hcrc) {
                      strm.adler = crc32_1(
                        strm.adler,
                        s.pending_buf,
                        s.pending,
                        0
                      );
                    }
                    s.gzindex = 0;
                    s.status = EXTRA_STATE;
                  }
                } // DEFLATE header
                else {
                  var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
                  var level_flags = -1;
                  if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
                    level_flags = 0;
                  } else if (s.level < 6) {
                    level_flags = 1;
                  } else if (s.level === 6) {
                    level_flags = 2;
                  } else {
                    level_flags = 3;
                  }
                  header |= level_flags << 6;
                  if (s.strstart !== 0) {
                    header |= PRESET_DICT;
                  }
                  header += 31 - (header % 31);
                  s.status = BUSY_STATE;
                  putShortMSB(s, header);
                  /* Save the adler32 of the preset dictionary: */
                  if (s.strstart !== 0) {
                    putShortMSB(s, strm.adler >>> 16);
                    putShortMSB(s, strm.adler & 0xffff);
                  }
                  strm.adler = 1; // adler32(0L, Z_NULL, 0);
                }
              } // #ifdef GZIP
              if (s.status === EXTRA_STATE) {
                if (
                  s.gzhead.extra
                  /* != Z_NULL */
                ) {
                  beg = s.pending;
                  /* start of bytes to update crc */
                  while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
                    if (s.pending === s.pending_buf_size) {
                      if (s.gzhead.hcrc && s.pending > beg) {
                        strm.adler = crc32_1(
                          strm.adler,
                          s.pending_buf,
                          s.pending - beg,
                          beg
                        );
                      }
                      flush_pending(strm);
                      beg = s.pending;
                      if (s.pending === s.pending_buf_size) {
                        break;
                      }
                    }
                    put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
                    s.gzindex++;
                  }
                  if (s.gzhead.hcrc && s.pending > beg) {
                    strm.adler = crc32_1(
                      strm.adler,
                      s.pending_buf,
                      s.pending - beg,
                      beg
                    );
                  }
                  if (s.gzindex === s.gzhead.extra.length) {
                    s.gzindex = 0;
                    s.status = NAME_STATE;
                  }
                } else {
                  s.status = NAME_STATE;
                }
              }
              if (s.status === NAME_STATE) {
                if (
                  s.gzhead.name
                  /* != Z_NULL */
                ) {
                  beg = s.pending;
                  /* start of bytes to update crc */
                  // int val;
                  do {
                    if (s.pending === s.pending_buf_size) {
                      if (s.gzhead.hcrc && s.pending > beg) {
                        strm.adler = crc32_1(
                          strm.adler,
                          s.pending_buf,
                          s.pending - beg,
                          beg
                        );
                      }
                      flush_pending(strm);
                      beg = s.pending;
                      if (s.pending === s.pending_buf_size) {
                        val = 1;
                        break;
                      }
                    } // JS specific: little magic to add zero terminator to end of string
                    if (s.gzindex < s.gzhead.name.length) {
                      val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
                    } else {
                      val = 0;
                    }
                    put_byte(s, val);
                  } while (val !== 0);
                  if (s.gzhead.hcrc && s.pending > beg) {
                    strm.adler = crc32_1(
                      strm.adler,
                      s.pending_buf,
                      s.pending - beg,
                      beg
                    );
                  }
                  if (val === 0) {
                    s.gzindex = 0;
                    s.status = COMMENT_STATE;
                  }
                } else {
                  s.status = COMMENT_STATE;
                }
              }
              if (s.status === COMMENT_STATE) {
                if (
                  s.gzhead.comment
                  /* != Z_NULL */
                ) {
                  beg = s.pending;
                  /* start of bytes to update crc */
                  // int val;
                  do {
                    if (s.pending === s.pending_buf_size) {
                      if (s.gzhead.hcrc && s.pending > beg) {
                        strm.adler = crc32_1(
                          strm.adler,
                          s.pending_buf,
                          s.pending - beg,
                          beg
                        );
                      }
                      flush_pending(strm);
                      beg = s.pending;
                      if (s.pending === s.pending_buf_size) {
                        val = 1;
                        break;
                      }
                    } // JS specific: little magic to add zero terminator to end of string
                    if (s.gzindex < s.gzhead.comment.length) {
                      val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
                    } else {
                      val = 0;
                    }
                    put_byte(s, val);
                  } while (val !== 0);
                  if (s.gzhead.hcrc && s.pending > beg) {
                    strm.adler = crc32_1(
                      strm.adler,
                      s.pending_buf,
                      s.pending - beg,
                      beg
                    );
                  }
                  if (val === 0) {
                    s.status = HCRC_STATE;
                  }
                } else {
                  s.status = HCRC_STATE;
                }
              }
              if (s.status === HCRC_STATE) {
                if (s.gzhead.hcrc) {
                  if (s.pending + 2 > s.pending_buf_size) {
                    flush_pending(strm);
                  }
                  if (s.pending + 2 <= s.pending_buf_size) {
                    put_byte(s, strm.adler & 0xff);
                    put_byte(s, (strm.adler >> 8) & 0xff);
                    strm.adler = 0; // crc32(0L, Z_NULL, 0);
                    s.status = BUSY_STATE;
                  }
                } else {
                  s.status = BUSY_STATE;
                }
              } // #endif
              /* Flush as much pending output as possible */
              if (s.pending !== 0) {
                flush_pending(strm);
                if (strm.avail_out === 0) {
                  /* Since avail_out is 0, deflate will be called again with
                   * more output space, but possibly with both pending and
                   * avail_in equal to zero. There won't be anything to do,
                   * but this is not an error situation so make sure we
                   * return OK instead of BUF_ERROR at next call of deflate:
                   */
                  s.last_flush = -1;
                  return Z_OK;
                }
                /* Make sure there is something to do and avoid duplicate consecutive
                 * flushes. For repeated and useless calls with Z_FINISH, we keep
                 * returning Z_STREAM_END instead of Z_BUF_ERROR.
                 */
              } else if (
                strm.avail_in === 0 &&
                rank(flush) <= rank(old_flush) &&
                flush !== Z_FINISH
              ) {
                return err(strm, Z_BUF_ERROR);
              }
              /* User must not provide more input after the first FINISH: */
              if (s.status === FINISH_STATE && strm.avail_in !== 0) {
                return err(strm, Z_BUF_ERROR);
              }
              /* Start a new block or continue the current one.
               */
              if (
                strm.avail_in !== 0 ||
                s.lookahead !== 0 ||
                (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)
              ) {
                var bstate =
                  s.strategy === Z_HUFFMAN_ONLY
                    ? deflate_huff(s, flush)
                    : s.strategy === Z_RLE
                    ? deflate_rle(s, flush)
                    : configuration_table[s.level].func(s, flush);
                if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
                  s.status = FINISH_STATE;
                }
                if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
                  if (strm.avail_out === 0) {
                    s.last_flush = -1;
                    /* avoid BUF_ERROR next call, see above */
                  }
                  return Z_OK;
                  /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
                   * of deflate should use the same flush parameter to make sure
                   * that the flush is complete. So we don't have to output an
                   * empty block here, this will be done at next call. This also
                   * ensures that for a very small output buffer, we emit at most
                   * one empty block.
                   */
                }
                if (bstate === BS_BLOCK_DONE) {
                  if (flush === Z_PARTIAL_FLUSH) {
                    _tr_align$1(s);
                  } else if (flush !== Z_BLOCK) {
                    /* FULL_FLUSH or SYNC_FLUSH */
                    _tr_stored_block$1(s, 0, 0, false);
                    /* For a full flush, this empty block will be recognized
                     * as a special marker by inflate_sync().
                     */
                    if (flush === Z_FULL_FLUSH) {
                      /** * CLEAR_HASH(s); ** */
                      /* forget history */
                      zero$1(s.head); // Fill with NIL (= 0);
                      if (s.lookahead === 0) {
                        s.strstart = 0;
                        s.block_start = 0;
                        s.insert = 0;
                      }
                    }
                  }
                  flush_pending(strm);
                  if (strm.avail_out === 0) {
                    s.last_flush = -1;
                    /* avoid BUF_ERROR at next call, see above */
                    return Z_OK;
                  }
                }
              } // Assert(strm->avail_out > 0, "bug2");
              // if (strm.avail_out <= 0) { throw new Error("bug2");}
              if (flush !== Z_FINISH) {
                return Z_OK;
              }
              if (s.wrap <= 0) {
                return Z_STREAM_END;
              }
              /* Write the trailer */
              if (s.wrap === 2) {
                put_byte(s, strm.adler & 0xff);
                put_byte(s, (strm.adler >> 8) & 0xff);
                put_byte(s, (strm.adler >> 16) & 0xff);
                put_byte(s, (strm.adler >> 24) & 0xff);
                put_byte(s, strm.total_in & 0xff);
                put_byte(s, (strm.total_in >> 8) & 0xff);
                put_byte(s, (strm.total_in >> 16) & 0xff);
                put_byte(s, (strm.total_in >> 24) & 0xff);
              } else {
                putShortMSB(s, strm.adler >>> 16);
                putShortMSB(s, strm.adler & 0xffff);
              }
              flush_pending(strm);
              /* If avail_out is zero, the application will call deflate again
               * to flush the rest.
               */
              if (s.wrap > 0) {
                s.wrap = -s.wrap;
              }
              /* write the trailer only once! */
              return s.pending !== 0 ? Z_OK : Z_STREAM_END;
            };
            var deflateEnd = function deflateEnd(strm) {
              if (
                !strm ||
                /* == Z_NULL */
                !strm.state
                /* == Z_NULL */
              ) {
                return Z_STREAM_ERROR;
              }
              var status = strm.state.status;
              if (
                status !== INIT_STATE &&
                status !== EXTRA_STATE &&
                status !== NAME_STATE &&
                status !== COMMENT_STATE &&
                status !== HCRC_STATE &&
                status !== BUSY_STATE &&
                status !== FINISH_STATE
              ) {
                return err(strm, Z_STREAM_ERROR);
              }
              strm.state = null;
              return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
            };
            /* =========================================================================
             * Initializes the compression dictionary from the given byte
             * sequence without producing any compressed output.
             */
            var deflateSetDictionary = function deflateSetDictionary(
              strm,
              dictionary
            ) {
              var dictLength = dictionary.length;
              if (
                !strm ||
                /* == Z_NULL */
                !strm.state
                /* == Z_NULL */
              ) {
                return Z_STREAM_ERROR;
              }
              var s = strm.state;
              var wrap = s.wrap;
              if (
                wrap === 2 ||
                (wrap === 1 && s.status !== INIT_STATE) ||
                s.lookahead
              ) {
                return Z_STREAM_ERROR;
              }
              /* when using zlib wrappers, compute Adler-32 for provided dictionary */
              if (wrap === 1) {
                /* adler32(strm->adler, dictionary, dictLength); */
                strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
              }
              s.wrap = 0;
              /* avoid computing Adler-32 in read_buf */
              /* if dictionary would fill window, just replace the history */
              if (dictLength >= s.w_size) {
                if (wrap === 0) {
                  /* already empty otherwise */
                  /** * CLEAR_HASH(s); ** */
                  zero$1(s.head); // Fill with NIL (= 0);
                  s.strstart = 0;
                  s.block_start = 0;
                  s.insert = 0;
                }
                /* use the tail */
                // dictionary = dictionary.slice(dictLength - s.w_size);
                var tmpDict = new Uint8Array(s.w_size);
                tmpDict.set(
                  dictionary.subarray(dictLength - s.w_size, dictLength),
                  0
                );
                dictionary = tmpDict;
                dictLength = s.w_size;
              }
              /* insert dictionary into window and hash */
              var avail = strm.avail_in;
              var next = strm.next_in;
              var input = strm.input;
              strm.avail_in = dictLength;
              strm.next_in = 0;
              strm.input = dictionary;
              fill_window(s);
              while (s.lookahead >= MIN_MATCH$1) {
                var str = s.strstart;
                var n = s.lookahead - (MIN_MATCH$1 - 1);
                do {
                  /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
                  s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH$1 - 1]);
                  s.prev[str & s.w_mask] = s.head[s.ins_h];
                  s.head[s.ins_h] = str;
                  str++;
                } while (--n);
                s.strstart = str;
                s.lookahead = MIN_MATCH$1 - 1;
                fill_window(s);
              }
              s.strstart += s.lookahead;
              s.block_start = s.strstart;
              s.insert = s.lookahead;
              s.lookahead = 0;
              s.match_length = s.prev_length = MIN_MATCH$1 - 1;
              s.match_available = 0;
              strm.next_in = next;
              strm.input = input;
              strm.avail_in = avail;
              s.wrap = wrap;
              return Z_OK;
            };
            var deflateInit_1 = deflateInit;
            var deflateInit2_1 = deflateInit2;
            var deflateReset_1 = deflateReset;
            var deflateResetKeep_1 = deflateResetKeep;
            var deflateSetHeader_1 = deflateSetHeader;
            var deflate_2 = deflate;
            var deflateEnd_1 = deflateEnd;
            var deflateSetDictionary_1 = deflateSetDictionary;
            var deflateInfo = "pako deflate (from Nodeca project)";
            /* Not implemented
      module.exports.deflateBound = deflateBound;
      module.exports.deflateCopy = deflateCopy;
      module.exports.deflateParams = deflateParams;
      module.exports.deflatePending = deflatePending;
      module.exports.deflatePrime = deflatePrime;
      module.exports.deflateTune = deflateTune;
      */
            var deflate_1 = {
              deflateInit: deflateInit_1,
              deflateInit2: deflateInit2_1,
              deflateReset: deflateReset_1,
              deflateResetKeep: deflateResetKeep_1,
              deflateSetHeader: deflateSetHeader_1,
              deflate: deflate_2,
              deflateEnd: deflateEnd_1,
              deflateSetDictionary: deflateSetDictionary_1,
              deflateInfo: deflateInfo,
            };
            function _typeof(obj) {
              "@babel/helpers - typeof";
              if (
                typeof Symbol === "function" &&
                typeof Symbol.iterator === "symbol"
              ) {
                _typeof = function (obj) {
                  return typeof obj;
                };
              } else {
                _typeof = function (obj) {
                  return obj &&
                    typeof Symbol === "function" &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? "symbol"
                    : typeof obj;
                };
              }
              return _typeof(obj);
            }
            var _has = function _has(obj, key) {
              return Object.prototype.hasOwnProperty.call(obj, key);
            };
            var assign = function assign(
              obj
              /* from1, from2, from3, ... */
            ) {
              var sources = Array.prototype.slice.call(arguments, 1);
              while (sources.length) {
                var source = sources.shift();
                if (!source) {
                  continue;
                }
                if (_typeof(source) !== "object") {
                  throw new TypeError(source + "must be non-object");
                }
                for (var p in source) {
                  if (_has(source, p)) {
                    obj[p] = source[p];
                  }
                }
              }
              return obj;
            }; // Join array of chunks to single array.
            var flattenChunks = function flattenChunks(chunks) {
              // calculate data length
              var len = 0;
              for (var i = 0, l = chunks.length; i < l; i++) {
                len += chunks[i].length;
              } // join chunks
              var result = new Uint8Array(len);
              for (var _i = 0, pos = 0, _l = chunks.length; _i < _l; _i++) {
                var chunk = chunks[_i];
                result.set(chunk, pos);
                pos += chunk.length;
              }
              return result;
            };
            var common = {
              assign: assign,
              flattenChunks: flattenChunks,
            };
            // String encode/decode helpers
            //
            // - apply(Array) can fail on Android 2.2
            // - apply(Uint8Array) can fail on iOS 5.1 Safari
            //
            var STR_APPLY_UIA_OK = true;
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (__) {
              STR_APPLY_UIA_OK = false;
            } // Table with utf8 lengths (calculated by first byte of sequence)
            // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
            // because max possible codepoint is 0x10ffff
            var _utf8len = new Uint8Array(256);
            for (var q = 0; q < 256; q++) {
              _utf8len[q] =
                q >= 252
                  ? 6
                  : q >= 248
                  ? 5
                  : q >= 240
                  ? 4
                  : q >= 224
                  ? 3
                  : q >= 192
                  ? 2
                  : 1;
            }
            _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start
            // convert string to array (typed, when possible)
            // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
            //
            // This software is provided 'as-is', without any express or implied
            // warranty. In no event will the authors be held liable for any damages
            // arising from the use of this software.
            //
            // Permission is granted to anyone to use this software for any purpose,
            // including commercial applications, and to alter it and redistribute it
            // freely, subject to the following restrictions:
            //
            // 1. The origin of this software must not be misrepresented; you must not
            //   claim that you wrote the original software. If you use this software
            //   in a product, an acknowledgment in the product documentation would be
            //   appreciated but is not required.
            // 2. Altered source versions must be plainly marked as such, and must not be
            //   misrepresented as being the original software.
            // 3. This notice may not be removed or altered from any source distribution.
            function ZStream() {
              /* next input byte */
              this.input = null; // JS specific, because we have no pointers
              this.next_in = 0;
              /* number of bytes available at input */
              this.avail_in = 0;
              /* total number of input bytes read so far */
              this.total_in = 0;
              /* next output byte should be put there */
              this.output = null; // JS specific, because we have no pointers
              this.next_out = 0;
              /* remaining free space at output */
              this.avail_out = 0;
              /* total number of bytes output so far */
              this.total_out = 0;
              /* last error message, NULL if no error */
              this.msg = "";
              /* Z_NULL */
              /* not visible by applications */
              this.state = null;
              /* best guess about the data type: binary or text */
              this.data_type = 2;
              /* Z_UNKNOWN */
              /* adler32 value of the uncompressed data */
              this.adler = 0;
            }
            var zstream = ZStream;
            // eslint-disable-next-line @typescript-eslint/unbound-method
            var toString = Object.prototype.toString;
            /* Public constants ========================================================== */
            /* =========================================================================== */
            var Z_NO_FLUSH$1 = constants.Z_NO_FLUSH;
            var Z_SYNC_FLUSH = constants.Z_SYNC_FLUSH;
            var Z_FULL_FLUSH$1 = constants.Z_FULL_FLUSH;
            var Z_FINISH$1 = constants.Z_FINISH;
            var Z_OK$1 = constants.Z_OK;
            var Z_STREAM_END$1 = constants.Z_STREAM_END;
            var Z_DEFAULT_COMPRESSION$1 = constants.Z_DEFAULT_COMPRESSION;
            var Z_DEFAULT_STRATEGY$1 = constants.Z_DEFAULT_STRATEGY;
            var Z_DEFLATED$1 = constants.Z_DEFLATED;
            /* =========================================================================== */
            /**
             * class Deflate
             *
             * Generic JS-style wrapper for zlib calls. If you don't need
             * streaming behaviour - use more simple functions: [[deflate]],
             * [[deflateRaw]] and [[gzip]].
             * */
            /* internal
             * Deflate.chunks -> Array
             *
             * Chunks of output data, if [[Deflate#onData]] not overridden.
             * */
            /**
             * Deflate.result -> Uint8Array
             *
             * Compressed result, generated by default [[Deflate#onData]]
             * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
             * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
             * */
            /**
             * Deflate.err -> Number
             *
             * Error code after deflate finished. 0 (Z_OK) on success.
             * You will not need it in real life, because deflate errors
             * are possible only on wrong options or bad `onData` / `onEnd`
             * custom handlers.
             * */
            /**
             * Deflate.msg -> String
             *
             * Error message, if [[Deflate.err]] != 0
             * */
            /**
             * new Deflate(options)
             * - options (Object): zlib deflate options.
             *
             * Creates new deflator instance with specified params. Throws exception
             * on bad params. Supported options:
             *
             * - `level`
             * - `windowBits`
             * - `memLevel`
             * - `strategy`
             * - `dictionary`
             *
             * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
             * for more information on these.
             *
             * Additional options, for internal needs:
             *
             * - `chunkSize` - size of generated data chunks (16K by default)
             * - `raw` (Boolean) - do raw deflate
             * - `gzip` (Boolean) - create gzip wrapper
             * - `header` (Object) - custom header for gzip
             *   - `text` (Boolean) - true if compressed data believed to be text
             *   - `time` (Number) - modification time, unix timestamp
             *   - `os` (Number) - operation system code
             *   - `extra` (Array) - array of bytes with extra data (max 65536)
             *   - `name` (String) - file name (binary string)
             *   - `comment` (String) - comment (binary string)
             *   - `hcrc` (Boolean) - true if header crc should be added
             *
             * ##### Example:
             *
             * ```javascript
             * const pako = require('pako')
             *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
             *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
             *
             * const deflate = new pako.Deflate({ level: 3});
             *
             * deflate.push(chunk1, false);
             * deflate.push(chunk2, true);  // true -> last chunk
             *
             * if (deflate.err) { throw new Error(deflate.err); }
             *
             * console.log(deflate.result);
             * ```
             * */
            function Deflate(options) {
              this.options = common.assign(
                {
                  level: Z_DEFAULT_COMPRESSION$1,
                  method: Z_DEFLATED$1,
                  chunkSize: 16384,
                  windowBits: 15,
                  memLevel: 8,
                  strategy: Z_DEFAULT_STRATEGY$1,
                },
                options || {}
              );
              var opt = this.options;
              if (opt.raw && opt.windowBits > 0) {
                opt.windowBits = -opt.windowBits;
              } else if (
                opt.gzip &&
                opt.windowBits > 0 &&
                opt.windowBits < 16
              ) {
                opt.windowBits += 16;
              }
              this.err = 0; // error code, if happens (0 = Z_OK)
              this.msg = ""; // error message
              this.ended = false; // used to avoid multiple onEnd() calls
              this.chunks = []; // chunks of compressed data
              this.strm = new zstream();
              this.strm.avail_out = 0;
              var status = deflate_1.deflateInit2(
                this.strm,
                opt.level,
                opt.method,
                opt.windowBits,
                opt.memLevel,
                opt.strategy
              );
              if (status !== Z_OK$1) {
                throw new Error(messages[status]);
              }
              if (opt.header) {
                deflate_1.deflateSetHeader(this.strm, opt.header);
              }
              if (opt.dictionary) {
                var dict; // Convert data if needed
                if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
                  dict = new Uint8Array(opt.dictionary);
                } else {
                  dict = opt.dictionary;
                }
                status = deflate_1.deflateSetDictionary(this.strm, dict);
                if (status !== Z_OK$1) {
                  throw new Error(messages[status]);
                }
                this._dict_set = true;
              }
            }
            /**
             * Deflate#push(data[, flush_mode]) -> Boolean
             * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
             *   converted to utf8 byte sequence.
             * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
             *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
             *
             * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
             * new compressed chunks. Returns `true` on success. The last data block must
             * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
             * buffers and call [[Deflate#onEnd]].
             *
             * On fail call [[Deflate#onEnd]] with error code and return false.
             *
             * ##### Example
             *
             * ```javascript
             * push(chunk, false); // push one of data chunks
             * ...
             * push(chunk, true);  // push last chunk
             * ```
             * */
            Deflate.prototype.push = function (data, flush_mode) {
              var strm = this.strm;
              var chunkSize = this.options.chunkSize;
              var status;
              var _flush_mode;
              if (this.ended) {
                return false;
              }
              if (flush_mode === ~~flush_mode) {
                _flush_mode = flush_mode;
              } else {
                _flush_mode = flush_mode === true ? Z_FINISH$1 : Z_NO_FLUSH$1;
              } // Convert data if needed
              if (toString.call(data) === "[object ArrayBuffer]") {
                strm.input = new Uint8Array(data);
              } else {
                strm.input = data;
              }
              strm.next_in = 0;
              strm.avail_in = strm.input.length;
              for (;;) {
                if (strm.avail_out === 0) {
                  strm.output = new Uint8Array(chunkSize);
                  strm.next_out = 0;
                  strm.avail_out = chunkSize;
                } // Make sure avail_out > 6 to avoid repeating markers
                if (
                  (_flush_mode === Z_SYNC_FLUSH ||
                    _flush_mode === Z_FULL_FLUSH$1) &&
                  strm.avail_out <= 6
                ) {
                  this.onData(strm.output.subarray(0, strm.next_out));
                  strm.avail_out = 0;
                  continue;
                }
                status = deflate_1.deflate(strm, _flush_mode); // Ended => flush and finish
                if (status === Z_STREAM_END$1) {
                  if (strm.next_out > 0) {
                    this.onData(strm.output.subarray(0, strm.next_out));
                  }
                  status = deflate_1.deflateEnd(this.strm);
                  this.onEnd(status);
                  this.ended = true;
                  return status === Z_OK$1;
                } // Flush if out buffer full
                if (strm.avail_out === 0) {
                  this.onData(strm.output);
                  continue;
                } // Flush if requested and has data
                if (_flush_mode > 0 && strm.next_out > 0) {
                  this.onData(strm.output.subarray(0, strm.next_out));
                  strm.avail_out = 0;
                  continue;
                }
                if (strm.avail_in === 0) {
                  break;
                }
              }
              return true;
            };
            /**
             * Deflate#onData(chunk) -> Void
             * - chunk (Uint8Array): output data.
             *
             * By default, stores data blocks in `chunks[]` property and glue
             * those in `onEnd`. Override this handler, if you need another behaviour.
             * */
            Deflate.prototype.onData = function (chunk) {
              this.chunks.push(chunk);
            };
            /**
             * Deflate#onEnd(status) -> Void
             * - status (Number): deflate status. 0 (Z_OK) on success,
             *   other if not.
             *
             * Called once after you tell deflate that the input stream is
             * complete (Z_FINISH). By default - join collected chunks,
             * free memory and fill `results` / `err` properties.
             * */
            Deflate.prototype.onEnd = function (status) {
              // On success - join
              if (status === Z_OK$1) {
                this.result = common.flattenChunks(this.chunks);
              }
              this.chunks = [];
              this.err = status;
              this.msg = this.strm.msg;
            };
            /**
             * deflate(data[, options]) -> Uint8Array
             * - data (Uint8Array|String): input data to compress.
             * - options (Object): zlib deflate options.
             *
             * Compress `data` with deflate algorithm and `options`.
             *
             * Supported options are:
             *
             * - level
             * - windowBits
             * - memLevel
             * - strategy
             * - dictionary
             *
             * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
             * for more information on these.
             *
             * Sugar (options):
             *
             * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
             *   negative windowBits implicitly.
             *
             * ##### Example:
             *
             * ```javascript
             * const pako = require('pako')
             * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
             *
             * console.log(pako.deflate(data));
             * ```
             * */
            function deflate$1(input, options) {
              var deflator = new Deflate(options);
              deflator.push(input, true); // That will never happens, if you don't cheat with options :)
              if (deflator.err) {
                throw deflator.msg || messages[deflator.err];
              }
              return deflator.result;
            }
            /**
             * deflateRaw(data[, options]) -> Uint8Array
             * - data (Uint8Array|String): input data to compress.
             * - options (Object): zlib deflate options.
             *
             * The same as [[deflate]], but creates raw data, without wrapper
             * (header and adler32 crc).
             * */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            function deflateRaw(input, options) {
              options = options || {};
              options.raw = true;
              return deflate$1(input, options);
            }
            /**
             * gzip(data[, options]) -> Uint8Array
             * - data (Uint8Array|String): input data to compress.
             * - options (Object): zlib deflate options.
             *
             * The same as [[deflate]], but create gzip wrapper instead of
             * deflate one.
             * */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            function gzip(input, options) {
              options = options || {};
              options.gzip = true;
              return deflate$1(input, options);
            }
            return { Deflate: Deflate, constants: constants };
          }
        }

        /***/
      },

    /***/ "../../node_modules/tslib/tslib.es6.js":
      /*!*********************************************!*\
  !*** ../../node_modules/tslib/tslib.es6.js ***!
  \*********************************************/
      /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ __extends: function () {
            return /* binding */ __extends;
          },
          /* harmony export */ __assign: function () {
            return /* binding */ __assign;
          },
          /* harmony export */ __rest: function () {
            return /* binding */ __rest;
          },
          /* harmony export */ __decorate: function () {
            return /* binding */ __decorate;
          },
          /* harmony export */ __param: function () {
            return /* binding */ __param;
          },
          /* harmony export */ __metadata: function () {
            return /* binding */ __metadata;
          },
          /* harmony export */ __awaiter: function () {
            return /* binding */ __awaiter;
          },
          /* harmony export */ __generator: function () {
            return /* binding */ __generator;
          },
          /* harmony export */ __exportStar: function () {
            return /* binding */ __exportStar;
          },
          /* harmony export */ __values: function () {
            return /* binding */ __values;
          },
          /* harmony export */ __read: function () {
            return /* binding */ __read;
          },
          /* harmony export */ __spread: function () {
            return /* binding */ __spread;
          },
          /* harmony export */ __spreadArrays: function () {
            return /* binding */ __spreadArrays;
          },
          /* harmony export */ __await: function () {
            return /* binding */ __await;
          },
          /* harmony export */ __asyncGenerator: function () {
            return /* binding */ __asyncGenerator;
          },
          /* harmony export */ __asyncDelegator: function () {
            return /* binding */ __asyncDelegator;
          },
          /* harmony export */ __asyncValues: function () {
            return /* binding */ __asyncValues;
          },
          /* harmony export */ __makeTemplateObject: function () {
            return /* binding */ __makeTemplateObject;
          },
          /* harmony export */ __importStar: function () {
            return /* binding */ __importStar;
          },
          /* harmony export */ __importDefault: function () {
            return /* binding */ __importDefault;
          },
          /* harmony export */
        });
        /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
        /* global Reflect, Promise */

        var extendStatics = function (d, b) {
          extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (d, b) {
                d.__proto__ = b;
              }) ||
            function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
          return extendStatics(d, b);
        };

        function __extends(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype =
            b === null
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __());
        }

        var __assign = function () {
          __assign =
            Object.assign ||
            function __assign(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
              }
              return t;
            };
          return __assign.apply(this, arguments);
        };

        function __rest(s, e) {
          var t = {};
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
              t[p] = s[p];
          if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (
              var i = 0, p = Object.getOwnPropertySymbols(s);
              i < p.length;
              i++
            ) {
              if (
                e.indexOf(p[i]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(s, p[i])
              )
                t[p[i]] = s[p[i]];
            }
          return t;
        }

        function __decorate(decorators, target, key, desc) {
          var c = arguments.length,
            r =
              c < 3
                ? target
                : desc === null
                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                : desc,
            d;
          if (
            typeof Reflect === "object" &&
            typeof Reflect.decorate === "function"
          )
            r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if ((d = decorators[i]))
                r =
                  (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) ||
                  r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        }

        function __param(paramIndex, decorator) {
          return function (target, key) {
            decorator(target, key, paramIndex);
          };
        }

        function __metadata(metadataKey, metadataValue) {
          if (
            typeof Reflect === "object" &&
            typeof Reflect.metadata === "function"
          )
            return Reflect.metadata(metadataKey, metadataValue);
        }

        function __awaiter(thisArg, _arguments, P, generator) {
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : new P(function (resolve) {
                    resolve(result.value);
                  }).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        }

        function __generator(thisArg, body) {
          var _ = {
              label: 0,
              sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
              },
              trys: [],
              ops: [],
            },
            f,
            y,
            t,
            g;
          return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === "function" &&
              (g[Symbol.iterator] = function () {
                return this;
              }),
            g
          );
          function verb(n) {
            return function (v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (
                  ((f = 1),
                  y &&
                    (t =
                      op[0] & 2
                        ? y["return"]
                        : op[0]
                        ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                        : y.next) &&
                    !(t = t.call(y, op[1])).done)
                )
                  return t;
                if (((y = 0), t)) op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (
                      !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                      (op[0] === 6 || op[0] === 2)
                    ) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        }

        function __exportStar(m, exports) {
          for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }

        function __values(o) {
          var m = typeof Symbol === "function" && o[Symbol.iterator],
            i = 0;
          if (m) return m.call(o);
          return {
            next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
            },
          };
        }

        function __read(o, n) {
          var m = typeof Symbol === "function" && o[Symbol.iterator];
          if (!m) return o;
          var i = m.call(o),
            r,
            ar = [],
            e;
          try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
              ar.push(r.value);
          } catch (error) {
            e = { error: error };
          } finally {
            try {
              if (r && !r.done && (m = i["return"])) m.call(i);
            } finally {
              if (e) throw e.error;
            }
          }
          return ar;
        }

        function __spread() {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
          return ar;
        }

        function __spreadArrays() {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
          return r;
        }

        function __await(v) {
          return this instanceof __await
            ? ((this.v = v), this)
            : new __await(v);
        }

        function __asyncGenerator(thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var g = generator.apply(thisArg, _arguments || []),
            i,
            q = [];
          return (
            (i = {}),
            verb("next"),
            verb("throw"),
            verb("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function verb(n) {
            if (g[n])
              i[n] = function (v) {
                return new Promise(function (a, b) {
                  q.push([n, v, a, b]) > 1 || resume(n, v);
                });
              };
          }
          function resume(n, v) {
            try {
              step(g[n](v));
            } catch (e) {
              settle(q[0][3], e);
            }
          }
          function step(r) {
            r.value instanceof __await
              ? Promise.resolve(r.value.v).then(fulfill, reject)
              : settle(q[0][2], r);
          }
          function fulfill(value) {
            resume("next", value);
          }
          function reject(value) {
            resume("throw", value);
          }
          function settle(f, v) {
            if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
          }
        }

        function __asyncDelegator(o) {
          var i, p;
          return (
            (i = {}),
            verb("next"),
            verb("throw", function (e) {
              throw e;
            }),
            verb("return"),
            (i[Symbol.iterator] = function () {
              return this;
            }),
            i
          );
          function verb(n, f) {
            i[n] = o[n]
              ? function (v) {
                  return (p = !p)
                    ? { value: __await(o[n](v)), done: n === "return" }
                    : f
                    ? f(v)
                    : v;
                }
              : f;
          }
        }

        function __asyncValues(o) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var m = o[Symbol.asyncIterator],
            i;
          return m
            ? m.call(o)
            : ((o =
                typeof __values === "function"
                  ? __values(o)
                  : o[Symbol.iterator]()),
              (i = {}),
              verb("next"),
              verb("throw"),
              verb("return"),
              (i[Symbol.asyncIterator] = function () {
                return this;
              }),
              i);
          function verb(n) {
            i[n] =
              o[n] &&
              function (v) {
                return new Promise(function (resolve, reject) {
                  (v = o[n](v)), settle(resolve, reject, v.done, v.value);
                });
              };
          }
          function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function (v) {
              resolve({ value: v, done: d });
            }, reject);
          }
        }

        function __makeTemplateObject(cooked, raw) {
          if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
          } else {
            cooked.raw = raw;
          }
          return cooked;
        }

        function __importStar(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null)
            for (var k in mod)
              if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
          result.default = mod;
          return result;
        }

        function __importDefault(mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        }

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ !(function () {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = function (exports, definition) {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ !(function () {
    /******/ __webpack_require__.o = function (obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ !(function () {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = function (exports) {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  !(function () {
    /*!*******************************!*\
  !*** ./src/boot/rum.entry.ts ***!
  \*******************************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ datadogRum: function () {
        return /* binding */ datadogRum;
      },
      /* harmony export */
    });
    /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__ =
      __webpack_require__(
        /*! @datadog/browser-core */ "../core/src/boot/init.ts"
      );
    /* harmony import */ var _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__ =
      __webpack_require__(
        /*! @datadog/browser-core */ "../core/src/tools/utils.ts"
      );
    /* harmony import */ var _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(
        /*! @datadog/browser-rum-core */ "../rum-core/src/index.ts"
      );
    /* harmony import */ var _startRecording__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(
        /*! ./startRecording */ "./src/boot/startRecording.ts"
      );
    /* harmony import */ var _recorderApi__WEBPACK_IMPORTED_MODULE_2__ =
      __webpack_require__(/*! ./recorderApi */ "./src/boot/recorderApi.ts");

    var recorderApi = (0,
    _recorderApi__WEBPACK_IMPORTED_MODULE_2__.makeRecorderApi)(
      _startRecording__WEBPACK_IMPORTED_MODULE_1__.startRecording
    );
    var datadogRum = (0,
    _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__.makeRumPublicApi)(
      _datadog_browser_rum_core__WEBPACK_IMPORTED_MODULE_0__.startRum,
      recorderApi
    );
    (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_3__.defineGlobal)(
      (0, _datadog_browser_core__WEBPACK_IMPORTED_MODULE_4__.getGlobalObject)(),
      "DD_RUM",
      datadogRum
    );
  })();
  /******/
})();