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
declare class WertWidget {
    partner_id?: string;
    container_id?: string;
    origin?: string;
    width?: number;
    height?: number;
    options: options;
    constructor(givenOptions?: options);
    mount(): void;
    getEmbedCode(): string;
    getEmbedUrl(): string;
    getRedirectUrl(): string;
    getParametersString(): string;
}
export = WertWidget;
