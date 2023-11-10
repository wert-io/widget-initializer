interface options {
    partner_id?: string;
    origin?: string;
    address?: string;
    theme?: string;
    currency?: string;
    currency_amount?: number;
    commodity?: string;
    commodity_amount?: number;
    [x: string]: any;
}
interface extraOptions {
    [x: string]: any;
}
declare type EventTypes = 'close' | 'error' | 'loaded' | 'payment-status' | 'position' | 'rate-update';
declare type EventTypesArray = (EventTypes)[];
declare type OptionalEventTypesArray = Exclude<EventTypes, 'close' | 'loaded'>[];
declare type EventData = {
    type: EventTypes;
    data?: {
        [x: string]: any;
    };
};
declare type customListener = (data?: EventData['data']) => void;
declare type setThemeData = {
    theme?: string;
    colors?: {
        [x: string]: string;
    };
};
declare class WertWidget {
    private iframe;
    partner_id?: string;
    origin: string;
    options: options;
    extraOptions: extraOptions;
    listeners: {
        [key in EventTypes]?: customListener;
    };
    ignoredEventTypes: OptionalEventTypesArray;
    widgetWindow: Window | null;
    checkIntervalId: number | undefined;
    static get eventTypes(): EventTypesArray;
    constructor(givenOptions?: options);
    mount(): void;
    unsubscribe(types?: OptionalEventTypesArray): void;
    private listenWidget;
    private unlistenWidget;
    private onMessage;
    private sendEvent;
    getEmbedCode(): string;
    private getEmbedUrl;
    private getParametersString;
    setTheme(data: setThemeData): void;
}
export = WertWidget;
