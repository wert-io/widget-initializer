(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var WertWidget = /*#__PURE__*/function () {
    function WertWidget(options) {
      var _this = this;

      _classCallCheck(this, WertWidget);

      this.options = options;
      this.iframe = document.createElement('iframe');
      this.widgetWindow = null;
      this.widget_layout_mode = 'Modal';
      this.await_data = false;

      this.onMessage = function (event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;

        var thisWidgetEvent = event.source === _this.widgetWindow;
        var isDataObject = _typeof(event.data) === 'object';
        if (!thisWidgetEvent || !isDataObject) return;

        switch (event.data.type) {
          case 'loaded':
            _this.sendEvent('allow-redirect', {
              redirectAllowed: false
            });

            _this.sendEvent('extra', _this.options.extra);

            (_b = (_a = _this.options.listeners) === null || _a === void 0 ? void 0 : _a[event.data.type]) === null || _b === void 0 ? void 0 : _b.call(_a);
            break;

          case "payment-status":
            (_d = (_c = _this.options.listeners) === null || _c === void 0 ? void 0 : _c[event.data.type]) === null || _d === void 0 ? void 0 : _d.call(_c, event.data.data);
            break;

          case "position":
            (_f = (_e = _this.options.listeners) === null || _e === void 0 ? void 0 : _e[event.data.type]) === null || _f === void 0 ? void 0 : _f.call(_e, event.data.data);
            break;

          case "rate-update":
            (_h = (_g = _this.options.listeners) === null || _g === void 0 ? void 0 : _g[event.data.type]) === null || _h === void 0 ? void 0 : _h.call(_g, event.data.data);
            break;

          case 'close':
            _this.close();

            break;

          case "error":
            (_k = (_j = _this.options.listeners) === null || _j === void 0 ? void 0 : _j[event.data.type]) === null || _k === void 0 ? void 0 : _k.call(_j, event.data.data);
            break;

          case "3ds-start":
            _this.iframe.style.background = "#fff";
            break;

          case "3ds-end":
            _this.iframe.style.background = "transparent";
            break;
        }
      };

      this.validateOptions(options);

      if (!this.options.origin) {
        this.options.origin = 'https://widget.wert.io';
      }

      if (this.options.extra) {
        this.await_data = true;
      }
    }

    _createClass(WertWidget, [{
      key: "open",
      value: function open() {
        this.iframe.style.border = 'none';
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.bottom = '0';
        this.iframe.style.right = '0';
        this.iframe.style.position = 'fixed';
        this.iframe.style.zIndex = '10000';
        document.body.style.overflow = 'hidden';
        this.iframe.setAttribute('src', this.getEmbedUrl());
        this.iframe.setAttribute('allow', 'camera *; microphone *; payment');
        this.iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin');
        document.body.appendChild(this.iframe);
        this.widgetWindow = this.iframe.contentWindow;
        this.listenWidget();
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners(listeners) {
        this.options.listeners = Object.assign(Object.assign({}, this.options.listeners), listeners);
      }
    }, {
      key: "removeEventListeners",
      value: function removeEventListeners(types) {
        var _a, _b;

        if (typeof types === 'undefined') {
          delete this.options.listeners;
        } else if (typeof types === 'string') {
          (_a = this.options.listeners) === null || _a === void 0 ? true : delete _a[types];
        } else {
          var _iterator = _createForOfIteratorHelper(types),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var type = _step.value;
              (_b = this.options.listeners) === null || _b === void 0 ? true : delete _b[type];
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    }, {
      key: "updateTheme",
      value: function updateTheme(data) {
        if (!data || !Object.keys(data).length) return;
        this.sendEvent('theme', data);
      }
    }, {
      key: "close",
      value: function close() {
        var _a, _b;

        document.body.removeChild(this.iframe);
        document.body.style.overflow = '';
        this.unListenWidget();
        (_b = (_a = this.options.listeners) === null || _a === void 0 ? void 0 : _a.close) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    }, {
      key: "validateOptions",
      value: function validateOptions(options) {
        var _a, _b, _c, _d;

        var maxNameLength = 40;
        var maxCategoryLength = 40;

        if (!options.partner_id) {
          throw Error("Please provide a partner_id in order for the widget to work correctly");
        } // This is required for showing error during old integration usages


        if (options.container_id) {
          console.error('container_id is no longer supported');
        }

        if (((_b = (_a = options.extra) === null || _a === void 0 ? void 0 : _a.item_info) === null || _b === void 0 ? void 0 : _b.name) && options.extra.item_info.name.length > maxNameLength) {
          console.error("Max length of the extra.item_info.name value is ".concat(maxNameLength, " characters"));
        }

        if (((_d = (_c = options.extra) === null || _c === void 0 ? void 0 : _c.item_info) === null || _d === void 0 ? void 0 : _d.category) && options.extra.item_info.category.length > maxCategoryLength) {
          console.error("Max length of the extra.item_info.category value is ".concat(maxCategoryLength, " characters"));
        }
      }
    }, {
      key: "listenWidget",
      value: function listenWidget() {
        var _this2 = this;

        window.addEventListener('message', this.onMessage);

        var checkLiveliness = function checkLiveliness() {
          var alive = _this2.widgetWindow && !_this2.widgetWindow.closed;
          if (alive) return;

          _this2.unListenWidget();
        };

        this.checkIntervalId = window.setInterval(checkLiveliness, 200);
      }
    }, {
      key: "unListenWidget",
      value: function unListenWidget() {
        if (!this.checkIntervalId) return;
        clearInterval(this.checkIntervalId);
        this.checkIntervalId = undefined;
        window.removeEventListener('message', this.onMessage);
      }
    }, {
      key: "sendEvent",
      value: function sendEvent(type, data) {
        var _a;

        if (!data) return;
        (_a = this.widgetWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
          data: data,
          type: type
        }, this.options.origin);
      }
    }, {
      key: "getEmbedUrl",
      value: function getEmbedUrl() {
        var parametersString = this.getParametersString();
        return "".concat(this.options.origin, "/").concat(this.options.partner_id, "/widget").concat(parametersString);
      }
    }, {
      key: "getParametersString",
      value: function getParametersString() {
        return Object.entries(Object.assign(Object.assign(Object.assign({}, this.options), {
          widget_layout_mode: this.widget_layout_mode
        }), this.await_data && {
          await_data: this.await_data
        })).reduce(function (accum, _ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          if (value === undefined || _typeof(value) === 'object' || ['origin', 'partner_id'].includes(key)) {
            return accum;
          }

          var startSymbol = accum.length ? '&' : '?';
          return accum + startSymbol + key + '=' + encodeURIComponent(value);
        }, '');
      }
    }]);

    return WertWidget;
  }();

  var widgetInitializer = WertWidget;

  if (!window.WertWidget) {
    window.WertWidget = widgetInitializer;
  }

  var browserScriptEntry = {};

  return browserScriptEntry;

}());