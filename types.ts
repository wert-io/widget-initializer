// Main options types
export type GivenOptions = {
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
  isWarrantyDisabled?: boolean;
  isCryptoHidden?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
} & SCOptions &
  ColorsOptions & BordersOptions;

type SCOptions = {
  sc_address?: string;
  sc_input_data?: string;
  signature?: string;
};

export type WidgetOptions = Omit<
  GivenOptions,
  'partner_id' | 'origin' | 'extra' | 'listeners'
>;

export interface ExtraOptions {
  item_info?: ItemInfo;
  wallets?: Wallet[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export type OptionalEventTypes = Exclude<EventTypes, 'close' | 'loaded'>;

interface BaseEvent<Type extends EventTypes> {
  type: Type;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface CloseEvent extends BaseEvent<'close'> {
  data: undefined;
}

interface ErrorEvent extends BaseEvent<'error'> {
  data: { name: string; message: string };
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
  data: { step: string };
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

export type WidgetEvent =
  | CloseEvent
  | ErrorEvent
  | LoadedEvent
  | PaymentStatusEvent
  | PositionEvent
  | RateUpdateEvent;

export type EventReturnValues = {
  [EventType in EventTypes]: Extract<WidgetEvent, { type: EventType }>['data'];
};

export type CustomListener<T extends EventTypes> = (
  data: EventReturnValues[T]
) => void;

export type EventListeners = {
  [EventType in EventTypes]?: CustomListener<EventType>;
};

export interface SendEventParameters {
  type: string;
  origin: string;
  data?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
  };
}
