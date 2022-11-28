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
declare type customListener = (data: {
    [x: string]: any;
}) => void;
declare type setThemeData = {
    theme?: string;
    colors?: {
        [x: string]: string;
    };
};
declare class WertWidget {
    private iframe;
    partner_id?: string;
    container_id?: string;
    origin: string;
    width?: number;
    height?: number;
    options: options;
    extraOptions: extraOptions;
    listeners: {
        [x: string]: customListener;
    };
    widgetWindow: Window | null;
    checkIntervalId: number | undefined;
    static get eventTypes(): string[];
    constructor(givenOptions?: options);
    mount(): void;
    open(): void;
    destroy(): void;
    private listenWidget;
    private unlistenWidget;
    private onMessage;
    private sendEvent;
    getEmbedCode(): string;
    private getEmbedUrl;
    private getRedirectUrl;
    private getParametersString;
    setTheme(data: setThemeData): void;
}
export = WertWidget;
