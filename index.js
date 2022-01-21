"use strict";
const package_json_1 = require("./package.json");
const externalStaticOrigin = 'https://javascript.wert.io';
class WertWidget {
    constructor(givenOptions = {}) {
        this.onMessage = (event) => {
            var _a;
            const thisWidgetEvent = event.source === this.widgetWindow;
            const isDataObject = typeof event.data === 'object';
            console.log(`message event in parent\n\t${[
                `event origin: ${event.origin}`,
                `expected origin: ${this.origin}`,
                `event origin equals expected origin: ${event.origin === this.origin}`,
                `event source equals expected source: ${thisWidgetEvent}`,
                `event data:\n\t${`event.data:\n\t\t${JSON.stringify(event.data, null, 2).replace(/\n/g, '\n\t\t')}`}`
            ].join('\n\t')}`);
            if (!thisWidgetEvent || !isDataObject)
                return;
            switch (event.data.type) {
                case 'loaded':
                    this.sendTypeExtraEvent({
                        origin: event.origin,
                        data: this.extraOptions,
                    });
                    (_a = this.widgetWindow) === null || _a === void 0 ? void 0 : _a.addEventListener('pagehide', event => this.onWidgetClose(event));
                    break;
                default:
                    break;
            }
        };
        this.onWidgetClose = (event) => {
            console.log('pagehide event:', event);
            if (event.persisted)
                return;
            // if we are here it means widget will be closed
            // TODO: we logout user with page refresh, which fires this event too
            //       in this case we do not need remove event listener
            setTimeout(() => {
                var _a;
                console.log('pagehide timeout...');
                if (this.widgetWindow && !this.widgetWindow.closed)
                    return;
                console.log('widget closed');
                window.removeEventListener('message', this.onMessage);
                (_a = this.widgetWindow) === null || _a === void 0 ? void 0 : _a.removeEventListener('pagehide', this.onWidgetClose);
            }, 100);
        };
        const options = Object.assign({}, givenOptions);
        this.partner_id = options.partner_id;
        this.container_id = options.container_id;
        this.origin = options.origin || 'https://widget.wert.io';
        this.width = options.autosize ? undefined : options.width;
        this.height = options.autosize ? undefined : options.height;
        this.extraOptions = options.extra ? Object.assign({}, options.extra) : undefined;
        this.widgetWindow = null;
        delete options.partner_id;
        delete options.container_id;
        delete options.origin;
        delete options.width;
        delete options.height;
        delete options.autosize;
        delete options.extra;
        options.await_data = (options.await_data || this.extraOptions) ? '1' : undefined;
        this.options = options;
    }
    mount() {
        if (!this.container_id) {
            throw Error('No container_id was provided');
        }
        const containerEl = document.querySelector('#' + this.container_id);
        if (!containerEl) {
            throw Error('Container wasn\'t found');
        }
        const iframe = document.createElement('iframe');
        const backgroundNeeded = Boolean(this.options.color_background || this.options.theme === 'dark');
        iframe.style.border = 'none';
        iframe.style.width = this.width ? (this.width + 'px') : '100%';
        iframe.style.height = this.height ? (this.height + 'px') : '100%';
        iframe.setAttribute('src', this.getEmbedUrl());
        iframe.setAttribute('allow', 'camera *; microphone *');
        if (backgroundNeeded) {
            iframe.style.background = this.options.color_background || '#040405';
        }
        containerEl.innerHTML = '';
        containerEl.appendChild(iframe);
        this.widgetWindow = iframe.contentWindow;
        this.listenWidget();
    }
    open() {
        const url = this.getRedirectUrl();
        this.widgetWindow = window.open(url);
        this.listenWidget();
    }
    listenWidget() {
        window.addEventListener('message', this.onMessage);
    }
    sendTypeExtraEvent(options) {
        var _a;
        if (!options.data)
            return;
        (_a = this.widgetWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: 'extra',
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
}
module.exports = WertWidget;
