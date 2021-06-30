interface options {
    partner_id?: string;
    container_id?: string;
    origin?: string;
    width?: string;
    height?: string;
    autosize?: string;
}
declare class WertWidget {
    partner_id?: string;
    container_id?: string;
    origin?: string;
    width?: string;
    height?: string;
    options: options;
    constructor(givenOptions?: {});
    mount(): void;
    getEmbedCode(): string;
    getEmbedUrl(): string;
    getRedirectUrl(): string;
    getParametersString(): string;
}
export default WertWidget;
