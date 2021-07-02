(function () {
  'use strict';

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

  var name = "@wert-io/widget-initializer";
  var version = "0.1.0";
  var description = "WertWidget helper";
  var main = "index.js";
  var types = "index.d.ts";
  var repository = {
  	type: "git",
  	url: "https://github.com/wert-io/widget-initializer.git"
  };
  var scripts = {
  	build: "tsc -p .",
  	"build-script": "rollup -c",
  	test: "jest"
  };
  var author = "@wert-io";
  var license = "ISC";
  var devDependencies = {
  	"@babel/core": "^7.13.16",
  	"@babel/preset-env": "^7.13.15",
  	"@rollup/plugin-babel": "^5.3.0",
  	"@rollup/plugin-commonjs": "^18.0.0",
  	"@rollup/plugin-json": "^4.1.0",
  	"@typescript-eslint/eslint-plugin": "^4.28.1",
  	"@typescript-eslint/parser": "^4.28.1",
  	eslint: "^7.25.0",
  	"eslint-plugin-import": "^2.22.1",
  	jest: "^27.0.5",
  	rollup: "^2.45.2",
  	typescript: "^4.3.5"
  };
  var package_json_1 = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	types: types,
  	repository: repository,
  	scripts: scripts,
  	author: author,
  	license: license,
  	devDependencies: devDependencies
  };

  var externalStaticOrigin = 'https://javascript.wert.io';

  var WertWidget = /*#__PURE__*/function () {
    function WertWidget() {
      var givenOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, WertWidget);

      var options = Object.assign({}, givenOptions);
      this.partner_id = options.partner_id;
      this.container_id = options.container_id;
      this.origin = options.origin || 'https://widget.wert.io';
      this.width = options.autosize ? undefined : options.width;
      this.height = options.autosize ? undefined : options.height;
      delete options.partner_id;
      delete options.container_id;
      delete options.origin;
      delete options.width;
      delete options.height;
      delete options.autosize;
      this.options = options;
    }

    _createClass(WertWidget, [{
      key: "mount",
      value: function mount() {
        if (!this.container_id) {
          throw Error('No container_id was provided');
        }

        var containerEl = document.querySelector('#' + this.container_id);

        if (!containerEl) {
          throw Error('Container wasn\'t found');
        }

        var iframe = document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = this.width ? this.width + 'px' : '100%';
        iframe.style.height = this.height ? this.height + 'px' : '100%';
        iframe.setAttribute('src', this.getEmbedUrl());
        containerEl.innerHTML = '';
        containerEl.appendChild(iframe);
      }
    }, {
      key: "getEmbedCode",
      value: function getEmbedCode() {
        var br = '\n';
        var fileScriptOpen = "<script type=\"text/javascript\" src=\"".concat(externalStaticOrigin, "/wert-").concat(package_json_1.version, ".js\">");
        var scriptEnd = '<' + '/script>'; // eslint-disable-line

        var codeScriptOpen = '<script type="text/javascript">';
        var widgetOptions = Object.assign({
          partner_id: this.partner_id,
          container_id: this.container_id,
          origin: this.origin,
          width: this.width,
          height: this.height
        }, this.options);
        var codeScriptContent1 = "const wertWidget = new WertWidget(".concat(JSON.stringify(widgetOptions, null, 2), ");");
        var codeScriptContent2 = 'wertWidget.mount();';
        var code = fileScriptOpen + scriptEnd + br + codeScriptOpen + br + codeScriptContent1 + br + codeScriptContent2 + br + scriptEnd;
        return code;
      }
    }, {
      key: "getEmbedUrl",
      value: function getEmbedUrl() {
        var parametersString = this.getParametersString();
        var url = this.origin + '/' + this.partner_id + '/widget' + parametersString;
        return url;
      }
    }, {
      key: "getRedirectUrl",
      value: function getRedirectUrl() {
        var parametersString = this.getParametersString();
        var url = this.origin + '/' + this.partner_id + '/redirect' + parametersString;
        return url;
      }
    }, {
      key: "getParametersString",
      value: function getParametersString() {
        var parametersString = Object.entries(this.options).reduce(function (accum, _ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          if (value === undefined) return accum;
          var startSymbol = accum.length ? '&' : '?';
          return accum + startSymbol + key + '=' + encodeURIComponent(value);
        }, '');
        return parametersString;
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
