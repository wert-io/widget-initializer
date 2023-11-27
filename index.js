"use strict";
const package_json_1 = require("./package.json");
const externalStaticOrigin = 'https://javascript.wert.io';
class WertWidget {
    constructor(options) {
        this.options = options;
        this.iframe = document.createElement('iframe');
        this.widgetWindow = null;
        this.widget_layout_mode = 'Modal';
        this.await_data = false;
        // THis is required for showing error during old integration usages
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this.options.container_id) {
            console.error('container_id is no longer supported');
        }
        if (!this.options.partner_id) {
            throw Error("Please provide a partner_id in order for widget to work correctly");
        }
        if (!this.options.origin) {
            this.options.origin = 'https://widget.wert.io';
        }
        if (this.options.extra) {
            this.await_data = true;
        }
    }
    open() {
        this.iframe.style.border = 'none';
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.bottom = '0';
        this.iframe.style.right = '0';
        this.iframe.style.position = 'fixed';
        this.iframe.style.zIndex = '10000';
        document.body.style.overflow = 'hidden';
        this.iframe.setAttribute('src', this.getEmbedUrl());
        this.iframe.setAttribute('allow', 'camera *; microphone *');
        this.iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin');
        document.body.appendChild(this.iframe);
        this.widgetWindow = this.iframe.contentWindow;
        this.listenWidget();
    }
    addEventListeners(listeners) {
        this.options.listeners = Object.assign(Object.assign({}, this.options.listeners), listeners);
    }
    removeEventListeners(types) {
        var _a, _b;
        if (typeof types === 'undefined') {
            delete this.options.listeners;
        }
        else if (typeof types === 'string') {
            (_a = this.options.listeners) === null || _a === void 0 ? true : delete _a[types];
        }
        else {
            for (const type of types) {
                (_b = this.options.listeners) === null || _b === void 0 ? true : delete _b[type];
            }
        }
    }
    updateTheme(data) {
        if (!data || !Object.keys(data).length)
            return;
        this.sendEvent('theme', data);
    }
    listenWidget() {
        window.addEventListener('message', this.onMessage);
        const checkLiveliness = () => {
            const alive = this.widgetWindow && !this.widgetWindow.closed;
            if (alive)
                return;
            this.unListenWidget();
        };
        this.checkIntervalId = window.setInterval(checkLiveliness, 200);
    }
    unListenWidget() {
        if (!this.checkIntervalId)
            return;
        clearInterval(this.checkIntervalId);
        this.checkIntervalId = undefined;
        window.removeEventListener('message', this.onMessage);
    }
    onMessage(event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const thisWidgetEvent = event.source === this.widgetWindow;
        const isDataObject = typeof event.data === 'object';
        if (!thisWidgetEvent || !isDataObject)
            return;
        switch (event.data.type) {
            case 'loaded':
                this.sendEvent('extra', this.options.extra);
                (_b = (_a = this.options.listeners) === null || _a === void 0 ? void 0 : _a[event.data.type]) === null || _b === void 0 ? void 0 : _b.call(_a);
                break;
            case "payment-status":
                (_d = (_c = this.options.listeners) === null || _c === void 0 ? void 0 : _c[event.data.type]) === null || _d === void 0 ? void 0 : _d.call(_c, event.data.data);
                break;
            case "position":
                (_f = (_e = this.options.listeners) === null || _e === void 0 ? void 0 : _e[event.data.type]) === null || _f === void 0 ? void 0 : _f.call(_e, event.data.data);
                break;
            case "rate-update":
                (_h = (_g = this.options.listeners) === null || _g === void 0 ? void 0 : _g[event.data.type]) === null || _h === void 0 ? void 0 : _h.call(_g, event.data.data);
                break;
            case 'close':
                document.body.removeChild(this.iframe);
                document.body.style.overflow = '';
                this.unListenWidget();
                (_k = (_j = this.options.listeners) === null || _j === void 0 ? void 0 : _j[event.data.type]) === null || _k === void 0 ? void 0 : _k.call(_j);
                break;
            case "error":
                (_m = (_l = this.options.listeners) === null || _l === void 0 ? void 0 : _l[event.data.type]) === null || _m === void 0 ? void 0 : _m.call(_l, event.data.data);
                break;
        }
    }
    sendEvent(type, data) {
        var _a;
        if (!data)
            return;
        (_a = this.widgetWindow) === null || _a === void 0 ? void 0 : _a.postMessage({ data, type }, this.options.origin);
    }
    getEmbedCode() {
        const br = '\n';
        const fileScriptOpen = `<script type="text/javascript" src="${externalStaticOrigin}/wert-${package_json_1.version}.js">`;
        const scriptEnd = '<' + '/script>';
        const codeScriptOpen = '<script type="text/javascript">';
        const codeScriptContent1 = `const wertWidget = new WertWidget(${JSON.stringify(this.options, null, 2)});`;
        const codeScriptContent2 = 'wertWidget.open();';
        return fileScriptOpen +
            scriptEnd +
            br +
            codeScriptOpen +
            br +
            codeScriptContent1 +
            br +
            codeScriptContent2 +
            br +
            scriptEnd;
    }
    getEmbedUrl() {
        const parametersString = this.getParametersString();
        return `${this.options.origin}/${this.options.origin}/widget${parametersString}`;
    }
    getParametersString() {
        return Object.entries(Object.assign(Object.assign({}, this.options), { await_data: this.await_data, widget_layout_mode: this.widget_layout_mode })).reduce((accum, [key, value]) => {
            if (value === undefined || typeof value === 'object' || ['origin', 'partner_id'].includes(key)) {
                return accum;
            }
            const startSymbol = accum.length ? '&' : '?';
            return accum + startSymbol + key + '=' + encodeURIComponent(value);
        }, '');
    }
}
module.exports = WertWidget;
