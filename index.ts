import { version } from './package.json';

const externalStaticOrigin = 'https://javascript.wert.io';

interface options {
  partner_id?: string
  origin?: string
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
  type: string
  origin: string
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
  }
}

type customListener = (data: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}) => void;

type setThemeData = {
  theme?: string
  colors?: {
    [x: string]: string
  }
};

class WertWidget {

  private iframe: HTMLIFrameElement = document.createElement('iframe');

  partner_id?: string;
  origin: string;
  options: options;
  extraOptions: extraOptions;
  listeners: {
    [x: string]: customListener;
  };
  widgetWindow: Window | null;
  checkIntervalId: number | undefined;


  static get eventTypes(): string[] {
    return [
      'close',
      'error',
      'loaded',
      'payment-status',
      'position',
      'rate-update',
    ];
  }

  constructor(givenOptions: options = {}) {
    const options: options = { ...givenOptions };

    if (options.container_id) {
      console.error('container_id is no longer supported')
    }

    this.partner_id = options.partner_id;
    this.origin = options.origin || 'https://widget.wert.io';
    this.extraOptions = options.extra ? { ...options.extra } : undefined;
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

  mount(): void {
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

    document.body.appendChild(this.iframe)

    this.widgetWindow = this.iframe.contentWindow;

    this.listenWidget();
  }

  destroy(): void {
    this.unlistenWidget();
  }

  private listenWidget(): void {
    window.addEventListener('message', this.onMessage);

    const checkLiveness = (): void => {
      const alive = this.widgetWindow && !this.widgetWindow.closed;

      if (alive) return;

      this.unlistenWidget();
    };

    this.checkIntervalId = window.setInterval(checkLiveness, 200);
  }

  private unlistenWidget(): void {
    if (!this.checkIntervalId) return;

    clearInterval(this.checkIntervalId);

    this.checkIntervalId = undefined;

    window.removeEventListener('message', this.onMessage);

  }

  private onMessage = (event: MessageEvent): void => {
    const thisWidgetEvent = event.source === this.widgetWindow;
    // const expectedOrigin = event.origin === this.origin;
    const isDataObject = typeof event.data === 'object';

    if (!thisWidgetEvent || !isDataObject) return;

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

    if (customListener) customListener(event.data.data);
  }

  private sendEvent(options: eventOptions): void {
    if (!options.data) return;

    this.widgetWindow?.postMessage({
      type: options.type,
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
      origin: this.origin,
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

  private getEmbedUrl(): string {
    const parametersString = this.getParametersString();

    const url = this.origin + '/' + this.partner_id + '/widget' + parametersString;

    return url;
  }

  private getParametersString(): string {
    const parametersString = Object.entries(this.options)
      .reduce((accum, [key, value]) => {
        if (value === undefined) return accum;

        const startSymbol = accum.length ? '&' : '?';

        return (accum + startSymbol + key + '=' + encodeURIComponent(value));
      }, '');

    return parametersString;
  }

  setTheme(data: setThemeData): void {
    if (!data || !Object.keys(data).length) return;

    this.sendEvent({
      type: 'theme',
      origin: this.origin,
      // origin: '*',
      data,
    });
  }
}

export = WertWidget;
