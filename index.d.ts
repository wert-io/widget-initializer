import { EventTypes, Options, SetThemeParameters } from './types';
declare class WertWidget {
    private options;
    private iframe;
    private widgetWindow;
    private checkIntervalId?;
    private widget_layout_mode;
    private await_data;
    constructor(options: Options);
    open(): void;
    addEventListeners(listeners: Options['listeners']): void;
    removeEventListeners(type: EventTypes): void;
    removeEventListeners(types: Array<EventTypes>): void;
    removeEventListeners(): void;
    updateTheme(data: SetThemeParameters): void;
    close(): void;
    private validateOptions;
    private listenWidget;
    private unListenWidget;
    private onMessage;
    private sendEvent;
    private getEmbedUrl;
    private getParametersString;
}
export = WertWidget;
