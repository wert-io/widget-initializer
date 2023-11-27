import { version } from './package.json';
import { EventTypes, Options, WidgetEvents, SetThemeParameters } from './types';

const externalStaticOrigin = 'https://javascript.wert.io';

class WertWidget {
  private iframe: HTMLIFrameElement = document.createElement('iframe');
  private widgetWindow: Window | null = null;
  private checkIntervalId?: number;
  private widget_layout_mode = 'Modal' as const
  private await_data = false

  constructor(private options: Options) {
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

  open(): void {
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
    this.iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-forms allow-popups allow-same-origin'
    );

    document.body.appendChild(this.iframe);

    this.widgetWindow = this.iframe.contentWindow;

    this.listenWidget();
  }

  addEventListeners(listeners: Options['listeners']): void {
    this.options.listeners = {...this.options.listeners, ...listeners};
  }

  removeEventListeners(type: EventTypes): void
  removeEventListeners(types: Array<EventTypes>): void
  removeEventListeners(): void
  removeEventListeners(types?: EventTypes | Array<EventTypes>): void {
    if (typeof types === 'undefined') {
      delete this.options.listeners;
    } else if (typeof types === 'string') {
      delete this.options.listeners?.[types];
    } else {
      for (const type of types) {
        delete this.options.listeners?.[type];
      }
    }
  }

  updateTheme(data: SetThemeParameters): void {
    if (!data || !Object.keys(data).length) return;

    this.sendEvent('theme', data);
  }

  private listenWidget(): void {
    window.addEventListener('message', this.onMessage);

    const checkLiveliness = (): void => {
      const alive = this.widgetWindow && !this.widgetWindow.closed;

      if (alive) return;

      this.unListenWidget();
    };

    this.checkIntervalId = window.setInterval(checkLiveliness, 200);
  }

  private unListenWidget(): void {
    if (!this.checkIntervalId) return;

    clearInterval(this.checkIntervalId);

    this.checkIntervalId = undefined;

    window.removeEventListener('message', this.onMessage);
  }

  private onMessage(event: MessageEvent<WidgetEvents>): void {
    const thisWidgetEvent = event.source === this.widgetWindow;
    const isDataObject = typeof event.data === 'object';

    if (!thisWidgetEvent || !isDataObject) return;

    switch (event.data.type) {
      case 'loaded':
        this.sendEvent('extra', this.options.extra);
        this.options.listeners?.[event.data.type]?.();

        break;

      case "payment-status":
        this.options.listeners?.[event.data.type]?.(event.data.data);

        break;

      case "position":
        this.options.listeners?.[event.data.type]?.(event.data.data);

        break;

      case "rate-update":
        this.options.listeners?.[event.data.type]?.(event.data.data);

        break;

      case 'close':
        document.body.removeChild(this.iframe);
        document.body.style.overflow = '';
        this.unListenWidget();
        this.options.listeners?.[event.data.type]?.();

        break;

      case "error":
        this.options.listeners?.[event.data.type]?.(event.data.data);

        break;
    }
  }

  private sendEvent(type: string, data: any): void {
    if (!data) return;

    this.widgetWindow?.postMessage(
      { data, type },
      this.options.origin!
    );
  }

  private getEmbedCode(): string {
    const br = '\n';
    const fileScriptOpen = `<script type="text/javascript" src="${externalStaticOrigin}/wert-${version}.js">`;
    const scriptEnd = '<' + '/script>';
    const codeScriptOpen = '<script type="text/javascript">';
    const codeScriptContent1 = `const wertWidget = new WertWidget(${JSON.stringify(
      this.options,
      null,
      2
    )});`;
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

  private getEmbedUrl(): string {
    const parametersString = this.getParametersString();

    return `${this.options.origin}/${this.options.origin}/widget${parametersString}`;
  }

  private getParametersString(): string {
    return Object.entries({
      ...this.options,
      widget_layout_mode: this.widget_layout_mode,
      ...(this.await_data && { await_data: this.await_data })
    }).reduce(
      (accum, [key, value]) => {
        if (value === undefined || typeof value === 'object' || ['origin', 'partner_id'].includes(key)) {
          return accum;
        }

        const startSymbol = accum.length ? '&' : '?';

        return accum + startSymbol + key + '=' + encodeURIComponent(value);
      },
      ''
    );
  }
}

export = WertWidget;
