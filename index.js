/* eslint-disable prefer-template, prefer-destructuring */

import { version } from './package.json';

const externalStaticOrigin = 'https://javascript.wert.io';

class WertWidget {
  constructor(givenOptions = {}) {
    const options = { ...givenOptions };

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

  mount() {
    if (!this.container_id) {
      throw Error('No container_id was provided');
    }

    const containerEl = document.querySelector('#' + this.container_id);

    if (!containerEl) {
      throw Error('Container wasn\'t found');
    }

    const iframe = document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = this.width ? (this.width + 'px') : '100%';
    iframe.style.height = this.height ? (this.height + 'px') : '100%';
    iframe.setAttribute('src', this.getEmbedUrl());

    containerEl.innerHTML = '';
    containerEl.appendChild(iframe);
  }

  getEmbedCode() {
    const br = '\n';
    const fileScriptOpen = `<script type="text/javascript" src="${externalStaticOrigin}/wert-${version}.js">`;
    const scriptEnd = '<' + '/script>'; // eslint-disable-line
    const codeScriptOpen = '<script type="text/javascript">';
    const widgetOptions = {
      partner_id: this.partner_id,
      container_id: this.container_id,
      origin: this.origin,
      width: this.width,
      height: this.height,
      ...this.options,
    };
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
        if (value === undefined) return accum;

        const startSymbol = accum.length ? '&' : '?';

        return (accum + startSymbol + key + '=' + encodeURIComponent(value));
      }, '');

    return parametersString;
  }
}

module.exports = WertWidget;
