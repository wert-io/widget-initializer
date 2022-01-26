interface options {
    partner_id?: string;
    container_id?: string;
    origin?: string;
    width?: number;
    height?: number;
    autosize?: boolean;
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
interface eventOptions {
    origin: string;
    data: {
        [x: string]: any;
    };
}
declare type customListener = (data: {
    [x: string]: any;
}) => void;
declare class WertWidget {
    partner_id?: string;
    container_id?: string;
    origin?: string;
    width?: number;
    height?: number;
    options: options;
    extraOptions: extraOptions;
    listeners: {
        [x: string]: customListener;
    };
    widgetWindow: Window | null;
    static get eventTypes(): string[];
    constructor(givenOptions?: options);
    mount(): void;
    open(): void;
    private onMessage;
    private onWidgetClose;
    private listenWidget;
    sendTypeExtraEvent(options: eventOptions): void;
    getEmbedCode(): string;
    getEmbedUrl(): string;
    getRedirectUrl(): string;
    getParametersString(): string;
}
export = WertWidget;
