// Main options types
export type Options = {
  partner_id: string;
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
  listeners?: EventListeners<WidgetEvents>;
  skip_init_navigation?: boolean;
  is_warranty_disabled?: boolean;
  is_crypto_hidden?: boolean;
} & SCOptions &
  ColorsOptions & BordersOptions;

type SCOptions = {
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
}
interface Wallet {
  name: string;
  network: string;
  address: string;
}

// Theme types
type ColorPrefix = 'color_';
type ElementWithColor =
  | 'background'
  | 'buttons'
  | 'buttons_text'
  | 'secondary_buttons'
  | 'secondary_buttons_text'
  | 'main_text'
  | 'secondary_text'
  | 'icons'
  | 'links'
  | 'success'
  | 'warning'
  | 'error';
type ElementWithColorType = `${ColorPrefix}${ElementWithColor}`;
type ColorsOptions = {
  [key in ElementWithColorType]?: string;
};

type BorderSuffix = '_border_radius';
type ElementWithBorders = 'buttons' | 'secondary_buttons';
type ElementWithBordersType = `${ElementWithBorders}${BorderSuffix}`;
type BordersOptions = {
  [key in ElementWithBordersType]?: number;
}

type ThemeType = 'dark' | undefined;

export type SetThemeParameters = {
  theme?: ThemeType;
  colors?: ColorsOptions;
};

// Event Types
export type EventTypes =
  | 'close'
  | 'error'
  | 'loaded'
  | 'payment-status'
  | 'position'
  | 'rate-update';

interface WidgetEvent<EventType extends EventTypes> {
  type: EventType;
}

type CloseEvent = WidgetEvent<"close">

type LoadedEvent = WidgetEvent<"loaded">

interface ErrorEvent extends WidgetEvent<"error"> {
  data: { name: string; message: string };
}

interface PaymentStatusEvent extends WidgetEvent<"payment-status"> {
  data: {
    status: string;
    payment_id: string;
    order_id: string;
    tx_id: string;
  };
}

interface PositionEvent extends WidgetEvent<"position"> {
  data: { step: string };
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

export type WidgetEvents =
  | CloseEvent
  | ErrorEvent
  | LoadedEvent
  | PaymentStatusEvent
  | PositionEvent
  | RateUpdateEvent;

type EventListeners<Events extends { type: string; data?: Record<string, unknown> }> = {
  [E in Events as E["type"]]?: E extends { data: Record<string, unknown> } ? (event: E["data"]) => any : () => any;
}
