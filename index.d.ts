import type { GivenOptions, WidgetOptions, ExtraOptions, EventTypes, OptionalEventTypes, EventListeners, SetThemeParameters } from './types';
declare class WertWidget {
    private iframe;
    partner_id?: string;
    origin: string;
    options: WidgetOptions;
    extraOptions: ExtraOptions;
    listeners: EventListeners;
    ignoredEventTypes: OptionalEventTypes[];
    widgetWindow: Window | null;
    checkIntervalId: number | undefined;
    static get eventTypes(): EventTypes[];
    constructor(givenOptions?: GivenOptions);
    mount(): void;
    unsubscribe(types?: OptionalEventTypes[]): void;
    private listenWidget;
    private unlistenWidget;
    private onMessage;
    private sendEvent;
    getEmbedCode(): string;
    private getEmbedUrl;
    private getParametersString;
    setTheme(data: SetThemeParameters): void;
}
export = WertWidget;
