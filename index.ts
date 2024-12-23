import { version } from './package.json';
import { EventTypes, Options, WidgetEvents, SetThemeParameters, InternalWidgetEvents } from './types';

const externalStaticOrigin = 'https://javascript.wert.io';

class WertWidget {
  private iframe: HTMLIFrameElement = document.createElement('iframe');
  private widgetWindow: Window | null = null;
  private checkIntervalId?: number;
  private widget_layout_mode = 'Modal' as const
  private await_data = false

  constructor(private options: Options) {
    this.validateOptions(options);

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
    this.iframe.setAttribute('allow', 'camera *; microphone *; payment');
    this.iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-forms allow-popups allow-same-origin'
    );
    this.iframe.setAttribute('data-version', version);

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

  close(): void {
    document.body.removeChild(this.iframe);
    document.body.style.overflow = '';
    this.unListenWidget();
    this.options.listeners?.close?.();
  }

  private validateOptions(options: Options) {
    const maxNameLength = 40;
    const maxCategoryLength = 40;
    if (!options.partner_id) {
      throw Error("Please provide a partner_id in order for the widget to work correctly");
    }
    // This is required for showing error during old integration usages
    if ((options as any).container_id) {
      console.error('container_id is no longer supported');
    }
    if (options.extra?.item_info?.name && options.extra.item_info.name.length > maxNameLength) {
      console.error(`Max length of the extra.item_info.name value is ${maxNameLength} characters`);
    }
    if (options.extra?.item_info?.category && options.extra.item_info.category.length > maxCategoryLength) {
      console.error(`Max length of the extra.item_info.category value is ${maxCategoryLength} characters`);
    }
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

  private onMessage = (event: MessageEvent<WidgetEvents | InternalWidgetEvents>): void => {
    const thisWidgetEvent = event.source === this.widgetWindow;
    const isDataObject = typeof event.data === 'object';

    if (!thisWidgetEvent || !isDataObject) return;

    switch (event.data.type) {
      case 'loaded':
        this.sendEvent('allow-redirect', {
          redirectAllowed: false
        });
        this.sendEvent('extra', this.options.extra);
        this.sendEvent('parent-hostname', { hostname: window.location.hostname });
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
        this.close();

        break;

      case "error":
        this.options.listeners?.[event.data.type]?.(event.data.data);

        break;
      case "3ds-start":
        this.iframe.style.background = "#fff";

        break;
      case "3ds-end":
        this.iframe.style.background = "transparent";

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

  private getEmbedUrl(): string {
    const parametersString = this.getParametersString();

    return `${this.options.origin}/${this.options.partner_id}/widget${parametersString}`;
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
