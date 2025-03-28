export declare type Options = {
    partner_id: string;
    click_id?: string;
    origin?: string;
    lang?: string;
    address?: string;
    theme?: ThemeType;
    brand_color?: string;
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
    listeners?: EventListeners<WidgetEvents>;
    skip_init_navigation?: boolean;
    is_crypto_hidden?: boolean;
    session_id?: string;
    terms_on_payment?: boolean;
} & CardBillingAddressOptions & SCOptions;
declare type CardBillingAddressOptions = {
    card_country_code?: string;
    card_city?: string;
    card_state_code?: string;
    card_post_code?: string;
    card_street?: string;
};
declare type SCOptions = {
    sc_address?: string;
    sc_input_data?: string;
    signature?: string;
};
export interface ExtraOptions {
    item_info?: ItemInfo;
    wallets?: Wallet[];
}
interface ItemInfo {
    author_image_url?: string;
    author?: string;
    image_url?: string;
    name?: string;
    category?: string;
    seller?: string;
    header?: string;
}
interface Wallet {
    name: string;
    network: string;
    address: string;
}
declare type ThemeType = 'dark' | undefined;
export declare type SetThemeParameters = {
    theme?: ThemeType;
    brand_color?: string;
};
export declare type EventTypes = 'close' | 'error' | 'loaded' | 'payment-status' | 'position' | 'rate-update';
export declare type InternalEventTypes = '3ds-start' | '3ds-end';
interface WidgetEvent<EventType extends EventTypes | InternalEventTypes> {
    type: EventType;
}
declare type CloseEvent = WidgetEvent<"close">;
declare type LoadedEvent = WidgetEvent<"loaded">;
interface ErrorEvent extends WidgetEvent<"error"> {
    data: {
        name: string;
        message: string;
    };
}
interface PaymentStatusEvent extends WidgetEvent<"payment-status"> {
    data: {
        status: string;
        payment_id: string;
        order_id: string;
        tx_id?: string;
    };
}
interface PositionEvent extends WidgetEvent<"position"> {
    data: {
        step: string;
    };
}
interface RateUpdateEvent extends WidgetEvent<"rate-update"> {
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
declare type Start3dsEvent = WidgetEvent<"3ds-start">;
declare type End3dsEvent = WidgetEvent<"3ds-end">;
export declare type WidgetEvents = CloseEvent | ErrorEvent | LoadedEvent | PaymentStatusEvent | PositionEvent | RateUpdateEvent;
export declare type InternalWidgetEvents = Start3dsEvent | End3dsEvent;
declare type EventListeners<Events extends {
    type: string;
    data?: Record<string, unknown>;
}> = {
    [E in Events as E["type"]]?: E extends {
        data: Record<string, unknown>;
    } ? (event: E["data"]) => any : () => any;
};
export {};
