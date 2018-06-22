(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

System.register('perfMetrics/MetricsService.js', [], function (_export, _context) {
	var _slicedToArray, _createClass, METRICSSERVICE_VERSION, IDLE_RETRIES, MetricsService;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [],
		execute: function () {
			_slicedToArray = function () {
				function sliceIterator(arr, i) {
					var _arr = [];
					var _n = true;
					var _d = false;
					var _e = undefined;

					try {
						for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
							_arr.push(_s.value);

							if (i && _arr.length === i) break;
						}
					} catch (err) {
						_d = true;
						_e = err;
					} finally {
						try {
							if (!_n && _i["return"]) _i["return"]();
						} finally {
							if (_d) throw _e;
						}
					}

					return _arr;
				}

				return function (arr, i) {
					if (Array.isArray(arr)) {
						return arr;
					} else if (Symbol.iterator in Object(arr)) {
						return sliceIterator(arr, i);
					} else {
						throw new TypeError("Invalid attempt to destructure non-iterable instance");
					}
				};
			}();

			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			METRICSSERVICE_VERSION = 1;

			_export('IDLE_RETRIES', IDLE_RETRIES = 2);

			_export('IDLE_RETRIES', IDLE_RETRIES);

			_export('MetricsService', MetricsService = function () {
				function MetricsService() {
					_classCallCheck(this, MetricsService);
				}

				_createClass(MetricsService, [{
					key: 'startTransaction',
					value: function startTransaction(msg) {
						if (this.canGatherMetrics() && this._isNotStarted()) {
							this._init();

							this._queueIdleCallback();
							console.log(msg || 'CPQ Performance Metrics Service: started ept');
						}
					}
				}, {
					key: 'startServiceRequest',
					value: function startServiceRequest(actionName, additionalInfo) {
						if (this._isNotStarted()) return null;

						window.sb.MetricsService.internal.sptNum += 1;

						var id = this._getUniqueId();
						if (actionName === undefined) {
							actionName = '';
						}

						if (additionalInfo !== undefined) {
							actionName = actionName + '/' + additionalInfo;
						}
						window.sb.MetricsService.internal.actions.set(id, this._buildTransportAction(actionName));

						console.log('CPQ Performance Metrics Service: started service call');
						return id;
					}
				}, {
					key: '_buildTransportAction',
					value: function _buildTransportAction(actionName) {
						return {
							"context": {
								"actionDefs": [actionName]
							},
							"pageStartTime": Date.now(),
							"ts": this._getTime(),
							"name": "request",
							"ns": "transport"
						};
					}
				}, {
					key: 'stopServiceRequest',
					value: function stopServiceRequest(id) {
						var sptTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

						if (this._isNotStarted()) return;

						window.sb.MetricsService.internal.sptNum -= 1;

						window.sb.MetricsService.internal.idleRetries = IDLE_RETRIES;

						if (window.sb.MetricsService.internal.idleStart > 0) {
							window.sb.MetricsService.internal.idleTime += this._getTime() - window.sb.MetricsService.internal.idleStart;
							window.sb.MetricsService.internal.idleStart = 0;
						}
						this._populateTransportAction(id);
						window.sb.MetricsService.internal.sptTime += sptTime;
						console.log('CPQ Performance Metrics Service: ended service call', sptTime);
					}
				}, {
					key: '_init',
					value: function _init() {
						var entityId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

						var now = Date.now();
						var perfNow = this._getTime();

						window.sb = window.sb || {};
						if (window.sb != null && window.sb.MetricsService == null) {
							window.sb.MetricsService = {};

							window.sb.MetricsService.bootstrap = {
								"bootstrapEPT": perfNow,
								"appStartTime": now - perfNow };
						} else {
							window.sb.MetricsService.bootstrap = {};
						}

						window.sb.MetricsService.internal = {
							lastIdleEndTime: perfNow,
							sptNum: 0,
							idleStart: 0,
							idleTime: 0,
							sptTime: 0,
							idleRetries: IDLE_RETRIES,
							actions: new Map()
						};

						window.sb.MetricsService.currentPage = {
							"ept": undefined,
							"bpt": undefined,
							"spt": undefined,
							"pageStartTime": now,
							"ts": perfNow,
							"page": {
								"attributes": {
									"app": {
										"appName": "SteelBrick",
										"appType": "Standard"
									},
									"url": window.location.href
								},
								"entity": entityId
							}
						};
					}
				}, {
					key: '_idle',
					value: function _idle() {
						if (this._isNotStarted()) return;

						if (window.sb.MetricsService.internal.sptNum === 0) {
							if (window.sb.MetricsService.internal.idleRetries !== 0) {
								if (window.sb.MetricsService.internal.idleRetries == IDLE_RETRIES) {
									window.sb.MetricsService.internal.lastIdleEndTime = this._getTime();
								}
								window.sb.MetricsService.internal.idleRetries--;
							} else {
								this._calcAndDisplayMetrics();
								return;
							}
						}

						if (window.sb.MetricsService.internal.idleStart === 0) window.sb.MetricsService.internal.idleStart = this._getTime();

						this._queueIdleCallback();
					}
				}, {
					key: '_populateTransportAction',
					value: function _populateTransportAction(id) {
						if (!id) return;
						var transportAction = window.sb.MetricsService.internal.actions.get(id);
						if (transportAction) {
							transportAction.duration = parseInt(this._getTime() - transportAction.ts);
						}
					}
				}, {
					key: '_queueIdleCallback',
					value: function _queueIdleCallback() {
						if (this.canGatherMetrics()) {
							window.requestIdleCallback(this._idle.bind(this));
						}
					}
				}, {
					key: '_calcAndDisplayMetrics',
					value: function _calcAndDisplayMetrics() {
						var eptTime = window.sb.MetricsService.internal.lastIdleEndTime - window.sb.MetricsService.currentPage.ts;
						var bptTime = eptTime - window.sb.MetricsService.internal.idleTime;
						var sptTime = window.sb.MetricsService.internal.sptTime;
						var transports = [];
						var allResources = null;
						if (window.performance && window.performance.getEntriesByType) {
							allResources = window.performance.getEntriesByType("resource");
						}

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = window.sb.MetricsService.internal.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var _step$value = _slicedToArray(_step.value, 2),
								    key = _step$value[0],
								    value = _step$value[1];

								if (value.name != null && value.name !== '' && allResources != null) {
									var resource = allResources.filter(function (res) {
										return res.name.indexOf(value.name) !== -1;
									})[0];

									if (resource != null) {
										value.xhrDuration = parseInt(resource.responseEnd - resource.startTime, 10);
										value.xhrStall = parseInt(resource.requestStart - resource.startTime, 10);
										value.startTime = parseInt(resource.startTime, 10);
										value.fetchStart = parseInt(resource.fetchStart, 10);
										value.requestStart = parseInt(resource.requestStart, 10);
										value.dns = parseInt(resource.domainLookupEnd - resource.domainLookupStart, 10);
										value.tcp = parseInt(resource.connectEnd - resource.connectStart, 10);
										value.ttfb = parseInt(resource.responseStart - resource.startTime, 10);
										value.transfer = parseInt(resource.responseEnd - resource.responseStart, 10);
									}
								}
								transports.push(value);
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}

						window.sb.MetricsService.internal = null;
						window.sb.MetricsService.currentPage.ept = eptTime;
						window.sb.MetricsService.currentPage.bpt = bptTime;
						window.sb.MetricsService.currentPage.spt = sptTime;
						window.sb.MetricsService.currentPage.marks = {
							"transport": transports
						};

						console.log('CPQ Performance Metrics Service: ', window.sb.MetricsService.bootstrap, window.sb.MetricsService.currentPage);
						var metricsChangedEvent = new CustomEvent('metrics-changed', {
							'detail': window.sb.MetricsService.currentPage,
							'bootstrap': window.sb.MetricsService.bootstrap
						});
						document.dispatchEvent(metricsChangedEvent);
					}
				}, {
					key: 'canGatherMetrics',
					value: function canGatherMetrics() {
						if (window.sb == null || window.sb.mode == null || window.sb.mode.debugMode == null || window.sb.mode.debugMode === false) return false;

						return typeof window.requestIdleCallback === 'function';
					}
				}, {
					key: '_isNotStarted',
					value: function _isNotStarted() {
						return window.sb == null || window.sb.MetricsService == null || window.sb.MetricsService.internal == null || window.sb.MetricsService.internal.sptNum == null;
					}
				}, {
					key: '_getTime',
					value: function _getTime() {
						if (window.performance) {
							return window.performance.now();
						} else {
							return Date.now();
						}
					}
				}, {
					key: '_getUniqueId',
					value: function _getUniqueId() {
						return this._getRandomInt(1, 10000);
					}
				}, {
					key: '_getRandomInt',
					value: function _getRandomInt(min, max) {
						return Math.floor(Math.random() * (max - min + 1)) + min;
					}
				}]);

				return MetricsService;
			}());

			_export('MetricsService', MetricsService);
		}
	};
});

},{}]},{},[1]);
