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
| **container_id** | required / optional | *String* | | | ID of the parent DOM element of the widget. Required if you want to use the **mount** method. |
| **origin** | optional | *String* | `https://widget.wert.io` | `https://sandbox.wert.io` | Required to initialise a widget in the specific environment. |
| **autosize** | optional | *Boolean* | `false` | `true, false` | By default, widget will use 100% of the width and 100% of the height of the parent element. If 'true', width and height options are ignored. |
| **width** | optional | *Number* | | | Fixed widget width, in pixels. |
| **height** | optional | *Number* | | | Fixed widget height, in pixels. |
| **theme** | optional | *String* | | `dark` | Widget will use theme colors as a basis. |
| **currency** | optional | *String* | `USD` | `USD, EUR` | Default currency which will be selected when the widget opens. |
| **currency_amount** | optional | *Number* | | | Default currency amount that can be pre-filled in the widget. |
| **commodity** | optional | *String* | `BTC:bitcoin` | [List of supported currencies](https://wert-io.notion.site/Supported-Currencies-8a2a5f6a6ccb49709419793d34d86223) | Default commodity that will be selected in the widget. |
| **commodities** | optional | *String* | | [List of supported currencies](https://wert-io.notion.site/Supported-Currencies-8a2a5f6a6ccb49709419793d34d86223) | Commodities that will be available in the widget, separated with commas. By default, all commodities are present. Indicate blockchain for ERC-20 tokens supported on multiple networks, e.g. `USDC:ethereum` | |
| **commodity_amount** | optional | *Number* | | | Default commodity amount that will be pre-filled in the widget. This option is ignored if **currency_amount** has been set |
| **address** | optional | *String* | `BTC` | | User's wallet address. Address is checked for validity based on the chosen **commodity.** BTC address format  is used by default. If address is invalid, this option is ignored. |
| **phone** | optional | *String* | | `+11014321111` | User's phone number in international format (E. 164 standard). Can go with or without + |
| **email** | optional | *String* | | `test@test.com` | User's email address. |
| **sc_id** | required for smart contracts | *String* | | | Unique ID of the smart contract invocation — uuid4.hex generated on your side. |
| **sc_address** | required for smart contracts | *String* | | | Address of the smart contract where the transaction should be sent. |
| **sc_input_data** | required for smart contracts | *String* | | | Input data to be executed by smart contract, in hex format. For Tezos, it must be Michelson code passed as JSON transformed into hex format. |
| **pk_id** | required for smart contracts | *String* | | | It's 'key1' at the moment. |
| **redirect_url** | optional | *String* | | `https://origin.us/item_id` | Full url string (with protocol) where user will be redirected from KYC emails to proceed payment |
| **signature** | required for smart contracts | *String* | | | Signature to sign data for the smart contract execution. [Signature helper](https://www.npmjs.com/package/@wert-io/widget-sc-signer). |
| **extra** | optional | *Object* | | See [extra object structure](#extra-object-structure) | Additional data that will be sent through **window.postMessage** method |
| **listeners** | optional | *Object* | | See [listeners object structure](#listeners) | Listeners on widget events |
| **color_background<br>color_buttons<br>color_buttons_text<br>color_secondary_buttons<br>color_secondary_buttons_text<br>color_main_text<br>color_secondary_text<br>color_icons<br>color_links<br>color_success<br>color_warning<br>color_error** | optional | *String* | | | Custom colors of elements |
| **buttons_border_radius<br>secondary_buttons_border_radius** | optional | *Number* | `4` | | Custom radius of elements (in pixels) |

### Extra object structure

```
{
  item_info: {
    author_image_url: String // example: https://something.com/images/image.jpg
    author: String
    image_url: String
    name: String
    seller: String
  }
}
```

### Listeners

There is an ability to listen some widget events in order to react on them. Whole list of available events one can get by calling static property **eventTypes** on helper:

```
import WertWidget from '@wert-io/widget-initializer';

console.log(WertWidget.eventTypes);

/* console output:
[
  'close',
  'error',
  'loaded',
  'payment-status',
  'position',
]
*/
```

Subscribing:

```
const widget = new WertWidget({
  ...options,
  listeners: {
    position: data => console.log('step:', data.step),
  },
});
```

Expected data by event:

<table>
  <tr>
    <th>Event type</th>
        <th>Data</th>
        <th>Description</th>
  </tr>
    <tr>
<td>

`close`
</td>
<td>

```
undefined
```
</td>
<td>
Event threw by widget when it's time to close it (by flow logic). Widget won't be closed by itself — it only throws event.
</td>
    </tr>
    <tr>
<td>

`error`
</td>
<td>

```
{
  name: String
    message: String
}
```
</td>
<td>
Information about error occurred in widget.
</td>
    </tr>
    <tr>
<td>

`loaded`
</td>
<td>

```
undefined
```
</td>
<td>
Widget got necessary data and either ready to work or to receive extra data (if it was used). Can be duplicated because of 3DS redirects.
</td>
    </tr>
    <tr>
<td>

`payment-status`
</td>
<td>

```
{
  status: String
  payment_id: String
  order_id: String
}
```
</td>
<td>

Possible statuses: `pending`, `canceled`, `failed`, `success`, `failover`. Event for each status can be not unique.
</td>
    </tr>
    <tr>
<td>

`position`
</td>
<td>

```
{
  step: String
}
```
</td>
<td>
Event informs about changes in user position on the flow.
</td>
    </tr>
</table>

### Configuration object methods

After creating a configuration object, you can call **mount** method to show the widget to the user (in this case, make sure that you've set **container_id** option).

```
wertWidget.mount();
```

or

```
wertWidget.open();
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
| **open** | Opens widget in new browser tab |
| **getEmdedUrl** | Returns embed widget url |
| **getRedirectUrl** | Returns redirect widget url |