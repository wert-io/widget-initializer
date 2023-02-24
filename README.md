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

| Property                                                                                                                                                                                                                                         |           Required           |   Type    |      Default value       |                                                 Possible value(s)                                                 | Description                                                                                                                                                                                                                                                                                                                           |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------:|:---------:|:------------------------:|:-----------------------------------------------------------------------------------------------------------------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **partner_id**                                                                                                                                                                                                                                   |           required           | *String*  |                          |                                                                                                                   | **partner_id** will be given to you upon your registration as partner. It's required to track your commission and statistics. If you don't have one, [contact us](https://wert.io/for-partners)                                                                                                                                       |
| **container_id**                                                                                                                                                                                                                                 |     required / optional      | *String*  |                          |                                                                                                                   | ID of the parent DOM element of the module. Required if you want to use the **mount** method.                                                                                                                                                                                                                                         |
| **origin**                                                                                                                                                                                                                                       |           optional           | *String*  | `https://widget.wert.io` |                                             `https://sandbox.wert.io`                                             | Required to initialise the module in the specific environment.                                                                                                                                                                                                                                                                        |
| **autosize**                                                                                                                                                                                                                                     |           optional           | *Boolean* |         `false`          |                                                   `true, false`                                                   | By default, module will use 100% of the width and 100% of the height of the parent element. If 'true', width and height options are ignored.                                                                                                                                                                                          |
| **width**                                                                                                                                                                                                                                        |           optional           | *Number*  |                          |                                                                                                                   | Fixed module width, in pixels.                                                                                                                                                                                                                                                                                                        |
| **height**                                                                                                                                                                                                                                       |           optional           | *Number*  |                          |                                                                                                                   | Fixed module height, in pixels.                                                                                                                                                                                                                                                                                                       |
| **lang**                                                                                                                                                                                                                                         |           optional           | *String*  |                          |                                                     `en, fr`                                                      | Defines the language in the module.                                                                                                                                                                                                                                                                                                   |
| **theme**                                                                                                                                                                                                                                        |           optional           | *String*  |                          |                                                      `dark`                                                       | Module will use theme colors as a basis.                                                                                                                                                                                                                                                                                              |
| **currency**                                                                                                                                                                                                                                     |           optional           | *String*  |          `USD`           |                                                    `USD, EUR`                                                     | Default currency which will be selected when the module opens.                                                                                                                                                                                                                                                                        |
| **currency_amount**                                                                                                                                                                                                                              |           optional           | *Number*  |                          |                                                                                                                   | Default currency amount that can be pre-filled in the module.                                                                                                                                                                                                                                                                         |
| **commodity**                                                                                                                                                                                                                                    |           optional           | *String*  |          `BTC`           | [List of supported currencies](https://wert-io.notion.site/Supported-Currencies-8a2a5f6a6ccb49709419793d34d86223) | Default commodity that will be selected in the module.                                                                                                                                                                                                                                                                                |
| **network**                                                                                                                                                                                                                                      |           optional           | *String*  |        `Bitcoin`         | [List of supported currencies](https://wert-io.notion.site/Supported-Currencies-8a2a5f6a6ccb49709419793d34d86223) | Network that will be selected for default commodity.                                                                                                                                                                                                                                                                                  |
| **commodities**                                                                                                                                                                                                                                  |           optional           | *String*  |                          | [List of supported currencies](https://wert-io.notion.site/Supported-Currencies-8a2a5f6a6ccb49709419793d34d86223) | Commodities that will be available in the module. By default, all commodities are present. Should contain a stringified JSON of an array of objects with commodity and network fields. Fields are filled with the same values as a default commodity and network, e.g. `JSON.stringify([{ commodity: 'USDC', network: 'ethereum' }])` | |
| **commodity_amount**                                                                                                                                                                                                                             |           optional           | *Number*  |                          |                                                                                                                   | Default commodity amount that will be pre-filled in the module. This option is ignored if **currency_amount** has been set                                                                                                                                                                                                            |
| **address**                                                                                                                                                                                                                                      |           optional           | *String*  |          `BTC`           |                                                                                                                   | User's wallet address. Address is checked for validity based on the chosen **commodity.** BTC address format  is used by default. If address is invalid, this option is ignored.                                                                                                                                                      |
| **phone**                                                                                                                                                                                                                                        |           optional           | *String*  |                          |                                                  `+11014321111`                                                   | User's phone number in international format (E. 164 standard). Can go with or without +                                                                                                                                                                                                                                               |
| **email**                                                                                                                                                                                                                                        |           optional           | *String*  |                          |                                                  `test@test.com`                                                  | User's email address.                                                                                                                                                                                                                                                                                                                 |
| **sc_id**                                                                                                                                                                                                                                        | required for smart contracts | *String*  |                          |                                                                                                                   | Unique ID of the smart contract invocation — uuid4.hex generated on your side.                                                                                                                                                                                                                                                        |
| **sc_address**                                                                                                                                                                                                                                   | required for smart contracts | *String*  |                          |                                                                                                                   | Address of the smart contract where the transaction should be sent.                                                                                                                                                                                                                                                                   |
| **sc_input_data**                                                                                                                                                                                                                                | required for smart contracts | *String*  |                          |                                                                                                                   | Input data to be executed by smart contract, in hex format. For Tezos, it must be Michelson code passed as JSON transformed into hex format.                                                                                                                                                                                          |
| **pk_id**                                                                                                                                                                                                                                        | required for smart contracts | *String*  |                          |                                                                                                                   | It's 'key1' at the moment.                                                                                                                                                                                                                                                                                                            |
| **redirect_url**                                                                                                                                                                                                                                 |           optional           | *String*  |                          |                                            `https://origin.us/item_id`                                            | Full url string (with protocol) where user will be redirected from KYC emails to proceed payment                                                                                                                                                                                                                                      |
| **signature**                                                                                                                                                                                                                                    | required for smart contracts | *String*  |                          |                                                                                                                   | Signature to sign data for the smart contract execution. [Signature helper](https://www.npmjs.com/package/@wert-io/widget-sc-signer).                                                                                                                                                                                                 |
| **extra**                                                                                                                                                                                                                                        |           optional           | *Object*  |                          |                               See [extra object structure](#extra-object-structure)                               | Additional data that will be sent through **window.postMessage** method                                                                                                                                                                                                                                                               |
| **listeners**                                                                                                                                                                                                                                    |           optional           | *Object*  |                          |                                   See [listeners object structure](#listeners)                                    | Use this if you want to listen to some module events and react to them                                                                                                                                                                                                                                                                |
| **color_background<br>color_buttons<br>color_buttons_text<br>color_secondary_buttons<br>color_secondary_buttons_text<br>color_main_text<br>color_secondary_text<br>color_icons<br>color_links<br>color_success<br>color_warning<br>color_error** |           optional           | *String*  |                          |                                                                                                                   | Custom colors of elements                                                                                                                                                                                                                                                                                                             |
| **buttons_border_radius<br>secondary_buttons_border_radius**                                                                                                                                                                                     |           optional           | *Number*  |           `4`            |                                                                                                                   | Custom radius of elements (in pixels)                                                                                                                                                                                                                                                                                                 |
| **skip_init_navigation**                                                                                                                                                                                                                         |           optional           | *Boolean* |         `false`          |                                                   `true, false`                                                   | By default, module will try to provide the closest to purchase starting route depending on provided parameters. If 'true', this navigation logic will be skipped.                                                                                                                                                                     |

### Extra object structure

With extra option you can provide additional data about the NFT (in **item_info** property) and add more default wallets which will be prefilled when user changes cryptocurrency (in **wallets** property, non-valid addresses will be ignored).

```
{
  item_info: {
    author_image_url: String // example: https://something.com/images/image.jpg
    author: String
    image_url: String
    name: String
    seller: String
  },
  wallets: [
    {
      name: String, // case-ignored, example: 'ETH'
      blockchain: String, // case-ignored, example: 'Ethereum'
      address: String,
    },
    ...
  ],
}
```

### Listeners

To get the whole list of available events, call a static property **eventTypes** on helper:

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
An event raised by module when it's time to close it (by flow logic). The module won't close itself, it only raises an event.
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
Information about an error that occurred in the module.
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
The module has the necessary data and is ready to work. In case extra data was used, it's ready to receive it. This event can be duplicated if there was a 3D Secure redirection.
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
  tx_id: String // if available
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
Informs about the changes in user's position in the flow.
</td>
    </tr>
</table>

### Configuration object methods

After creating a configuration object, you can call **mount** method to show the module to the user (in this case, make sure that you've set **container_id** option).

```
wertWidget.mount();
```

or

```
wertWidget.open();
```

### Switching theme without reload

For switching theme without reloading whole widget you can use method `setTheme`:

```
wertWidget.setTheme({
  theme: 'dark', // undefined — for default white theme 
  colors: {
    // supported colors listed in options table above 
    color_buttons: 'red',
  },
});
```

<br>

| Method | Description |
| --- | --- |
| **mount** | Mounts module in DOM element with given **container_id** |
| **open** | Opens module in new browser tab |
| **setTheme** | Switches theme without reload |
