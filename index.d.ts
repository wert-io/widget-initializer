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
    origin: string;
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
    destroy(): void;
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
