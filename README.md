# WertWidget initializer

`@wert-io/widget-initializer` is a helper which assists you in integrating WertWidget into your web app.

## Installation

```
yarn add @wert-io/widget-initializer
```

or

```
npm install @wert-io/widget-initializer
```

## Documentation

```
import WertWidget from '@wert-io/widget-initializer';
```

First of all, you need to create a configuration object:

```
const wertWidget = new WertWidget(options);
```

### Options

| Property | Required | Type | Default value | Possible value(s) | Description |
| :--- | :---: | :---: | :---: | :---: | --- |
| **partner_id** | required | *String* | | | **partner_id** will be given to you upon your registration as partner. It's required to track your commission and statistics. If you don't have one, [contact us](https://wert.io/for-partners) |
| **blockchain** | required | *string* | `bitcoin`|`bitcoin, ethereum, tezos, polygon`| Blockchain of a selected commodity. |
| **container_id** | required / optional | *String* | | | ID of the parent DOM element of the widget. Required if you want to use the **mount** method. |
| **origin** | optional | *String* | `https://widget.wert.io/` | `https://sandbox.wert.io/` | Required to initialise a widget in the specific environment. |
| **autosize** | optional | *Boolean* | `false` | `true, false` | By default, widget will use 100% of the width and 100% of the height of the parent element. If 'true', width and height options are ignored. |
| **width** | optional | *Number* | | | Fixed widget width, in pixels. |
| **height** | optional | *Number* | | | Fixed widget height, in pixels. |
| **theme** | optional | *String* | | `dark` | Widget will use theme colors as a basis. |
| **currency** | optional | *String* | `USD` | `USD, EUR` | Default currency which will be selected when the widget opens. |
| **currency_amount** | optional | *Number* | | | Default currency amount that can be pre-filled in the widget. |
| **commodity** | optional | *String* | `BTC` | `BTC, ETH, XTZ, MATIC` | Default commodity that will be selected in the widget. |
| **commodities** | optional | *String* | | | Commodities that will be available in the widget, separated with commas. By default, all commodities are present. |
| **commodity_amount** | optional | *Number* | | | Default commodity amount that will be pre-filled in the widget. This option is ignored if **currency_amount** has been set |
| **address** | optional | *String* |`BTC`| | User's wallet address. Address is checked for validity based on the chosen **commodity.** BTC address format  is used by default. If address is invalid, this option is ignored. |
| **phone** | optional | *String* | | +11014321111 | User's phone number in international format (E. 164 standard). Can go with or without + |
| **email** | optional | *String* | | test@test.com | User's email address. |
| **sc_id** | required for smart contracts | *string* | | | Unique ID of the smart contract invocation — uuid4.hex generated on your side. |
| **sc_address** | required for smart contracts | *string* | | | Address of the smart contract where the transaction should be sent. |
| **sc_input_data** | required for smart contracts | *string* | | | Input data to be executed by smart contract, in hex format. For Tezos, it must be Michelson code passed as JSON transformed into hex format. |
| **pk_id** | required for smart contracts | *string* | | | It's 'key1' at the moment.|
| **signature** | required for smart contracts | *string* | | | Signature to sign data for the smart contract execution. [Signature helper](https://www.npmjs.com/package/@wert-io/widget-sc-signer) . |
| **color_background<br>color_buttons<br>color_buttons_text<br>color_secondary_buttons<br>color_secondary_buttons_text<br>color_main_text<br>color_secondary_text<br>color_icons<br>color_links<br>color_success<br>color_warning<br>color_error** | optional | *String* | | | Custom colors of elements |
| **buttons_border_radius<br>secondary_buttons_border_radius** | optional | *Number* | `4` | | Custom radius of elements (in pixels) |

### Configuration object methods

After creating a configuration object, you can call **mount** method to show the widget to the user (in this case, make sure that you've set **container_id** option).

```
wertWidget.mount();
```

If you want to handle widget **iframe** yourself, (for example, if you use **React** or other framework that doesn't respect working with DOM directly), you can call **getEmbedUrl** and set it to **iframe** src attribute. In this case, you should set **iframe** width and height yourself.

```
const iframeSrc = wertWidget.getEmbedUrl();
```

In addition, if you want to open the widget in a separate window (in this case, tips will be available), call **getRedirectUrl** and send user to it. Widget will look like [this](https://widget.wert.io/default/redirect).

```
const redirectUrl = wertWidget.getRedirectUrl();
```

<br>

| Method | Description |
| --- | --- |
| **mount** | Mounts widget in DOM element with given **container_id** |
| **getEmdedUrl** | Returns embed widget url |
| **getRedirectUrl** | Returns redirect widget url |
