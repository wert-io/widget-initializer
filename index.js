"use strict";
/* eslint-disable prefer-template, prefer-destructuring */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var version = '0.0.4';
var externalStaticOrigin = 'https://javascript.wert.io';
var WertWidget = /** @class */ (function () {
    function WertWidget(givenOptions) {
        if (givenOptions === void 0) { givenOptions = {}; }
        var options = __assign({}, givenOptions);
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
    WertWidget.prototype.mount = function () {
        if (!this.container_id) {
            throw Error('No container_id was provided');
        }
        var containerEl = document.querySelector('#' + this.container_id);
        if (!containerEl) {
            throw Error('Container wasn\'t found');
        }
        var iframe = document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = this.width ? (this.width + 'px') : '100%';
        iframe.style.height = this.height ? (this.height + 'px') : '100%';
        iframe.setAttribute('src', this.getEmbedUrl());
        containerEl.innerHTML = '';
        containerEl.appendChild(iframe);
    };
    WertWidget.prototype.getEmbedCode = function () {
        var br = '\n';
        var fileScriptOpen = "<script type=\"text/javascript\" src=\"" + externalStaticOrigin + "/wert-" + version + ".js\">";
        var scriptEnd = '<' + '/script>'; // eslint-disable-line
        var codeScriptOpen = '<script type="text/javascript">';
        var widgetOptions = __assign({ partner_id: this.partner_id, container_id: this.container_id, origin: this.origin, width: this.width, height: this.height }, this.options);
        var codeScriptContent1 = "const wertWidget = new WertWidget(" + JSON.stringify(widgetOptions, null, 2) + ");";
        var codeScriptContent2 = 'wertWidget.mount();';
        var code = fileScriptOpen + scriptEnd + br
            + codeScriptOpen + br
            + codeScriptContent1 + br
            + codeScriptContent2 + br
            + scriptEnd;
        return code;
    };
    WertWidget.prototype.getEmbedUrl = function () {
        var parametersString = this.getParametersString();
        var url = this.origin + '/' + this.partner_id + '/widget' + parametersString;
        return url;
    };
    WertWidget.prototype.getRedirectUrl = function () {
        var parametersString = this.getParametersString();
        var url = this.origin + '/' + this.partner_id + '/redirect' + parametersString;
        return url;
    };
    WertWidget.prototype.getParametersString = function () {
        var parametersString = Object.entries(this.options)
            .reduce(function (accum, _a) {
            var key = _a[0], value = _a[1];
            if (value === undefined)
                return accum;
            var startSymbol = accum.length ? '&' : '?';
            return (accum + startSymbol + key + '=' + encodeURIComponent(value));
        }, '');
        return parametersString;
    };
    return WertWidget;
}());
exports.default = WertWidget;
