export declare type GivenOptions = {
    partner_id?: string;
    click_id?: string;
    origin?: string;
    lang?: 'en' | 'fr';
    address?: string;
    theme?: ThemeType;
    currency?: 'USD';
    currency_amount?: number;
    country_of_residence?: string;
    state_of_residence?: string;
    date_of_birth?: string;
    full_name?: string;
    commodity?: string;
    commodity_amount?: number;
    network?: string;
    commodities?: string;
    phone?: string;
    email?: string;
    redirect_url?: string;
    extra?: ExtraOptions;
    listeners?: EventListeners;
    skip_init_navigation?: boolean;
    is_warranty_disabled?: boolean;
    is_crypto_hidden?: boolean;
    [x: string]: any;
} & SCOptions & ColorsOptions & BordersOptions;
declare type SCOptions = {
    sc_address?: string;
    sc_input_data?: string;
    signature?: string;
};
export declare type WidgetOptions = Omit<GivenOptions, 'partner_id' | 'origin' | 'extra' | 'listeners'>;
export interface ExtraOptions {
    item_info?: ItemInfo;
    wallets?: Wallet[];
    [x: string]: any;
}
interface ItemInfo {
    author_image_url?: string;
    author?: string;
    image_url?: string;
    name?: string;
    seller?: string;
}
interface Wallet {
    name: string;
    blockchain: string;
    address: string;
}
declare type ColorPrefix = 'color_';
declare type ElementWithColor = 'background' | 'buttons' | 'buttons_text' | 'secondary_buttons' | 'secondary_buttons_text' | 'main_text' | 'secondary_text' | 'icons' | 'links' | 'success' | 'warning' | 'error';
declare type ElementWithColorType = `${ColorPrefix}${ElementWithColor}`;
declare type ColorsOptions = {
    [key in ElementWithColorType]?: string;
};
declare type BorderSuffix = '_border_radius';
declare type ElementWithBorders = 'buttons' | 'secondary_buttons';
declare type ElementWithBordersType = `${ElementWithBorders}${BorderSuffix}`;
declare type BordersOptions = {
    [key in ElementWithBordersType]?: number;
};
declare type ThemeType = 'dark' | undefined;
export declare type SetThemeParameters = {
    theme?: ThemeType;
    colors?: ColorsOptions;
};
export declare type EventTypes = 'close' | 'error' | 'loaded' | 'payment-status' | 'position' | 'rate-update';
export declare type OptionalEventTypes = Exclude<EventTypes, 'close' | 'loaded'>;
interface BaseEvent<Type extends EventTypes> {
    type: Type;
    data: any;
}
interface CloseEvent extends BaseEvent<'close'> {
    data: undefined;
}
interface ErrorEvent extends BaseEvent<'error'> {
    data: {
        name: string;
        message: string;
    };
}
interface LoadedEvent extends BaseEvent<'loaded'> {
    data: undefined;
}
interface PaymentStatusEvent extends BaseEvent<'payment-status'> {
    data: {
        status: string;
        payment_id: string;
        order_id: string;
        tx_id: string;
    };
}
interface PositionEvent extends BaseEvent<'position'> {
    data: {
        step: string;
    };
}
interface RateUpdateEvent extends BaseEvent<'rate-update'> {
    data: {
        ticker: string;
        fee_percent: string;
        currency_amount: string;
        fee_amount: string;
        commodity_amount: string;
        purchase_amount: string;
        miner_fee: string;
        currency_miner_fee: string;
    };
}
export declare type WidgetEvent = CloseEvent | ErrorEvent | LoadedEvent | PaymentStatusEvent | PositionEvent | RateUpdateEvent;
export declare type EventReturnValues = {
    [EventType in EventTypes]: Extract<WidgetEvent, {
        type: EventType;
    }>['data'];
};
export declare type CustomListener<T extends EventTypes> = (data: EventReturnValues[T]) => void;
export declare type EventListeners = {
    [EventType in EventTypes]?: CustomListener<EventType>;
};
export interface SendEventParameters {
    type: string;
    origin: string;
    data?: {
        [x: string]: any;
    };
}
export {};
