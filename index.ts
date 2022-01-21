import { version } from './package.json';

const externalStaticOrigin = 'https://javascript.wert.io';

interface options {
  partner_id?: string
  container_id?: string
  origin?: string
  width?: number
  height?: number
  autosize?: boolean
  address?: string
  theme?: string
  currency?: string
  currency_amount?: number
  commodity?: string
  commodity_amount?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

interface extraOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

interface eventOptions {
  origin: string
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
  }
}

class WertWidget {

  partner_id?: string;
  container_id?: string;
  origin?: string;
  width?: number;
  height?: number;
  options: options;
  extraOptions: extraOptions;
  widgetWindow: Window | null;

  constructor(givenOptions: options = {}) {
    const options: options = { ...givenOptions };

    this.partner_id = options.partner_id;
    this.container_id = options.container_id;
    this.origin = options.origin || 'https://widget.wert.io';
    this.width = options.autosize ? undefined : options.width;
    this.height = options.autosize ? undefined : options.height;
    this.extraOptions = options.extra ? { ...options.extra } : undefined;
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

  mount(): void {
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

  open(): void {
    const url = this.getRedirectUrl();

    this.widgetWindow = window.open(url);

    this.listenWidget();
  }

  private onMessage = (event: MessageEvent): void => {
    const thisWidgetEvent = event.source === this.widgetWindow;
    const isDataObject = typeof event.data === 'object';

    console.log(`message event in parent\n\t${[
      `event origin: ${event.origin}`,
      `expected origin: ${this.origin}`,
      `event origin equals expected origin: ${event.origin === this.origin}`,
      `event source equals expected source: ${thisWidgetEvent}`,
      `event data:\n\t${`event.data:\n\t\t${JSON.stringify(event.data, null, 2).replace(/\n/g, '\n\t\t')}`}`
    ].join('\n\t')}`);

    if (!thisWidgetEvent || !isDataObject) return;

    switch (event.data.type) {
      case 'loaded':
        this.sendTypeExtraEvent({
          origin: event.origin,
          data: this.extraOptions,
        });

        this.widgetWindow?.addEventListener('pagehide', event => this.onWidgetClose(event));

        break;
      default:
        break;
    }
  }

  private onWidgetClose = (event: PageTransitionEvent): void => {
    console.log('pagehide event:', event);

    if (event.persisted) return;
    // if we are here it means widget will be closed

    // TODO: we logout user with page refresh, which fires this event too
    //       in this case we do not need remove event listener
    setTimeout(() => {
      console.log('pagehide timeout...');

      if (this.widgetWindow && !this.widgetWindow.closed) return;

      console.log('widget closed');

      window.removeEventListener('message', this.onMessage);
      this.widgetWindow?.removeEventListener('pagehide', this.onWidgetClose);
    }, 100);
  }

  private listenWidget(): void {
    window.addEventListener('message', this.onMessage);
  }

  sendTypeExtraEvent(options: eventOptions): void {
    if (!options.data) return;

    this.widgetWindow?.postMessage({
      type: 'extra',
      data: options.data,
    }, options.origin);
  }

  getEmbedCode(): string {
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

  getEmbedUrl(): string {
    const parametersString = this.getParametersString();

    const url = this.origin + '/' + this.partner_id + '/widget' + parametersString;

    return url;
  }

  getRedirectUrl(): string {
    const parametersString = this.getParametersString();
    const url = this.origin + '/' + this.partner_id + '/redirect' + parametersString;

    return url;
  }

  getParametersString(): string {
    const parametersString = Object.entries(this.options)
      .reduce((accum, [key, value]) => {
        if (value === undefined) return accum;

        const startSymbol = accum.length ? '&' : '?';

        return (accum + startSymbol + key + '=' + encodeURIComponent(value));
      }, '');

    return parametersString;
  }
}

export = WertWidget;
