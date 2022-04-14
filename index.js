"use strict";
const package_json_1 = require("./package.json");
const externalStaticOrigin = 'https://javascript.wert.io';
class WertWidget {
    constructor(givenOptions = {}) {
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
                default:
                    break;
            }
            const customListener = this.listeners[event.data.type];
            if (customListener)
                customListener(event.data.data);
        };
        const options = Object.assign({}, givenOptions);
        this.partner_id = options.partner_id;
        this.container_id = options.container_id;
        this.origin = options.origin || 'https://widget.wert.io';
        this.width = options.autosize ? undefined : options.width;
        this.height = options.autosize ? undefined : options.height;
        this.extraOptions = options.extra ? Object.assign({}, options.extra) : undefined;
        this.listeners = options.listeners || {};
        this.widgetWindow = null;
        this.checkIntervalId = undefined;
        delete options.partner_id;
        delete options.container_id;
        delete options.origin;
        delete options.width;
        delete options.height;
        delete options.autosize;
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
        ];
    }
    mount() {
        if (!this.container_id) {
            throw Error('No container_id was provided');
        }
        const containerEl = document.querySelector('#' + this.container_id);
        if (!containerEl) {
            throw Error('Container wasn\'t found');
        }
        this.unlistenWidget();
        const iframe = document.createElement('iframe');
        const backgroundNeeded = Boolean(this.options.color_background || this.options.theme === 'dark');
        iframe.style.border = 'none';
        iframe.style.width = this.width ? (this.width + 'px') : '100%';
        iframe.style.height = this.height ? (this.height + 'px') : '100%';
        iframe.setAttribute('src', this.getEmbedUrl());
        iframe.setAttribute('allow', 'camera *; microphone *');
        iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin');
        if (backgroundNeeded) {
            iframe.style.background = this.options.color_background || '#040405';
        }
        containerEl.innerHTML = '';
        containerEl.appendChild(iframe);
        this.widgetWindow = iframe.contentWindow;
        this.listenWidget();
    }
    open() {
        this.unlistenWidget();
        const url = this.getRedirectUrl();
        this.widgetWindow = window.open(url);
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
        const widgetOptions = Object.assign({ partner_id: this.partner_id, container_id: this.container_id, origin: this.origin, width: this.width, height: this.height }, this.options);
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
    getRedirectUrl() {
        const parametersString = this.getParametersString();
        const url = this.origin + '/' + this.partner_id + '/redirect' + parametersString;
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
