"use strict";
const package_json_1 = require("./package.json");
const externalStaticOrigin = 'https://javascript.wert.io';
class WertWidget {
    constructor(givenOptions = {}) {
        this.iframe = document.createElement('iframe');
        this.onMessage = (event) => {
            const thisWidgetEvent = event.source === this.widgetWindow;
            // const expectedOrigin = event.origin === this.origin;
            const isDataObject = typeof event.data === 'object';
            if (!thisWidgetEvent || !isDataObject)
                return;
            switch (event.data.type) {
                case 'loaded':
                    this.sendEvent({
                        type: 'extra',
                        origin: event.origin,
                        data: this.extraOptions,
                    });
                    break;
                case 'close':
                    document.body.removeChild(this.iframe);
                    document.body.style.overflow = '';
                    break;
                default:
                    break;
            }
            const customListener = this.listeners[event.data.type];
            if (customListener)
                customListener(event.data.data);
        };
        const options = Object.assign({}, givenOptions);
        if (options.container_id) {
            console.error('container_id is no longer supported');
        }
        this.partner_id = options.partner_id;
        this.origin = options.origin || 'https://widget.wert.io';
        this.extraOptions = options.extra ? Object.assign({}, options.extra) : undefined;
        this.listeners = options.listeners || {};
        this.widgetWindow = null;
        this.checkIntervalId = undefined;
        options.widgetLayoutMode = 'Modal';
        delete options.partner_id;
        delete options.origin;
        delete options.extra;
        delete options.listeners;
        options.await_data = (options.await_data || this.extraOptions) ? '1' : undefined;
        this.options = options;
    }
    static get eventTypes() {
        return [
            'close',
            'error',
            'loaded',
            'payment-status',
            'position',
            'rate-update',
        ];
    }
    mount() {
        this.unlistenWidget();
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
    destroy() {
        this.unlistenWidget();
    }
    listenWidget() {
        window.addEventListener('message', this.onMessage);
        const checkLiveness = () => {
            const alive = this.widgetWindow && !this.widgetWindow.closed;
            if (alive)
                return;
            this.unlistenWidget();
        };
        this.checkIntervalId = window.setInterval(checkLiveness, 200);
    }
    unlistenWidget() {
        if (!this.checkIntervalId)
            return;
        clearInterval(this.checkIntervalId);
        this.checkIntervalId = undefined;
        window.removeEventListener('message', this.onMessage);
    }
    sendEvent(options) {
        var _a;
        if (!options.data)
            return;
        (_a = this.widgetWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: options.type,
            data: options.data,
        }, options.origin);
    }
    getEmbedCode() {
        const br = '\n';
        const fileScriptOpen = `<script type="text/javascript" src="${externalStaticOrigin}/wert-${package_json_1.version}.js">`;
        const scriptEnd = '<' + '/script>'; // eslint-disable-line
        const codeScriptOpen = '<script type="text/javascript">';
        const widgetOptions = Object.assign({ partner_id: this.partner_id, origin: this.origin }, this.options);
        const codeScriptContent1 = `const wertWidget = new WertWidget(${JSON.stringify(widgetOptions, null, 2)});`;
        const codeScriptContent2 = 'wertWidget.mount();';
        const code = fileScriptOpen + scriptEnd + br
            + codeScriptOpen + br
            + codeScriptContent1 + br
            + codeScriptContent2 + br
            + scriptEnd;
        return code;
    }
    getEmbedUrl() {
        const parametersString = this.getParametersString();
        const url = this.origin + '/' + this.partner_id + '/widget' + parametersString;
        return url;
    }
    getParametersString() {
        const parametersString = Object.entries(this.options)
            .reduce((accum, [key, value]) => {
            if (value === undefined)
                return accum;
            const startSymbol = accum.length ? '&' : '?';
            return (accum + startSymbol + key + '=' + encodeURIComponent(value));
        }, '');
        return parametersString;
    }
    setTheme(data) {
        if (!data || !Object.keys(data).length)
            return;
        this.sendEvent({
            type: 'theme',
            origin: this.origin,
            // origin: '*',
            data,
        });
    }
}
module.exports = WertWidget;
