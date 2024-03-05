# WertWidget initializer

`@wert-io/widget-initializer` is a helper that assists you with integrating the Wert widget into your web app.

- [WertWidget initializer](#wertwidget-initializer)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Options](#options)
    - [General options](#general-options)
    - [Smart contract options](#smart-contract-options)
    - [Pre-filling user data](#pre-filling-user-data)
    - [Appearance and restrictions](#appearance-and-restrictions)
    - [Extra object structure](#extra-object-structure)
      - [Adding NFT information](#adding-nft-information)
      - [Adding default wallets](#adding-default-wallets)
    - [Listeners](#listeners)
      - [Initial event listeners](#initial-event-listeners)
      - [Events](#events)
  - [Widget class methods](#widget-class-methods)
    - [Showing the module](#showing-the-module)
    - [Closing the module](#closing-the-module)
    - [Switching themes without reload](#switching-themes-without-reload)
    - [Adding event listeners](#adding-event-listeners)
    - [Removing event listeners](#removing-event-listeners)
  - [Additional notes](#additional-notes)
    - [Boolean usage](#boolean-usage)


## Installation

```
npm install @wert-io/widget-initializer
```

## Usage

```
import WertWidget from '@wert-io/widget-initializer';
```

First of all, you need to create a widget class:

```
const wertWidget = new WertWidget(options);
```

## Options

### General options

<table>
  <tr>
    <th>Property</th>
    <th>Required</th>
    <th>Type</th>
    <th>Default value</th>
    <th>Possible value(s)</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><strong>partner_id</strong></td>
    <td>required</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>-</td>
    <td><strong>partner_id</strong> will be given to you upon your registration as our partner. It's required to track your commission and statistics. If you don't have one, <a href="https://wert.io/for-partners" target="_blank">contact us</a>.</td>
  </tr>
  <tr>
    <td><strong>click_id</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><code>uuid_v4()</code></td>
    <td>Unique identifier for the order that lets you track it and helps us with troubleshooting.</td>
  </tr>
  <tr>
    <td><strong>listeners</strong></td>
    <td>optional</td>
    <td><i>Object</i></td>
    <td>-</td>
    <td>See the <a href="#adding-event-listeners">listeners object structure</a></td>
    <td>Use this if you want to listen to some module events and react to them.</td>
  </tr>
  <tr>
    <td><strong>origin</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td><code>https://widget.wert.io</code></td>
    <td><code>https://sandbox.wert.io</code></td>
    <td>Required to initialize the module in the specific environment.</td>
  </tr>
  <tr>
    <td><strong>redirect_url</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><code>https://origin.us/item_id</code></td>
    <td>Full url string (with protocol). This link will be used for user redirection.</td>
  </tr>
</table>

### Smart contract options

<table>
  <tr>
    <th>Property</th>
    <th>Required</th>
    <th>Type</th>
    <th>Default value</th>
    <th>Possible value(s)</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><strong>sc_address</strong></td>
    <td>required for smart contracts</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>-</td>
    <td>Address of the smart contract where the transaction should be sent to.</td>
  </tr>
  <tr>
    <td><strong>sc_input_data</strong></td>
    <td>required for smart contracts	</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>-</td>
    <td>Input data to be executed by the smart contract, in hex format. For Tezos, it must be Michelson code passed as JSON transformed into hex format.</td>
  </tr>
  <tr>
    <td><strong>signature</strong></td>
    <td>required for smart contracts	</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>-</td>
    <td>Signature to sign the data for the smart contract execution. You can use our <a href ="https://www.npmjs.com/package/@wert-io/widget-sc-signer" target="_blank">signature helper</a>.</td>
  </tr>
</table>

### Pre-filling user data

<table>
  <tr>
    <th>Property</th>
    <th>Required</th>
    <th>Type</th>
    <th>Default value</th>
    <th>Possible value(s)</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><strong>address</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>-</td>
    <td>User's wallet address. The address is checked for validity based on the chosen <strong>commodity</strong>. <code>BTC</code> address format is used by default. If the address is invalid, this option is ignored.</td>
  </tr>
  <tr>
    <td><strong>commodity</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td><code>BTC</code></td>
    <td><a href="https://docs.wert.io/docs/supported-coins-and-blockchains" target="_blank">List of supported currencies</a></td>
    <td>Default commodity that will be selected in the module.</td>
  </tr>
  <tr>
    <td><strong>network</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td><code>bitcoin</code></td>
    <td><a href="https://docs.wert.io/docs/supported-coins-and-blockchains" target="_blank">List of supported currencies</a></td>
    <td>Network that will be selected for default commodity.</td>
  </tr>
  <tr>
    <td><strong>commodity_amount</strong></td>
    <td>optional</td>
    <td><i>Number</i></td>
    <td>-</td>
    <td>-</td>
    <td>Default commodity amount that will be pre-filled in the module. This option is ignored if the <strong>currency_amount</strong> has been set.</td>
  </tr>
    <tr>
    <td><strong>commodities</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><a href="https://docs.wert.io/docs/supported-coins-and-blockchains" target="_blank">List of supported currencies</a></td>
    <td>Commodities that will be available in the module. By default, all commodities are present. Should contain a stringified JSON of an array of objects with commodity and network fields. Fields are filled with the same values as a default commodity and network, e.g. <code>JSON.stringify([{ commodity: 'USDC', network: 'ethereum' }])</code>.</td>
  </tr>
  <tr>
    <td><strong>currency</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td><code>USD</code></td>
    <td><code>USD</code></td>
    <td>Default currency which will be selected when the module opens.</td>
  </tr>
  <tr>
    <td><strong>currency_amount</strong></td>
    <td>optional</td>
    <td><i>Number</i></td>
    <td>-</td>
    <td>-</td>
    <td>Default currency amount that can be pre-filled in the module.</td>
  </tr>
  <tr>
    <td><strong>country_of_residence</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>code of the country</td>
    <td>User's country of residence.</td>
  </tr>
  <tr>
    <td><strong>state_of_residence</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>code of USA state</td>
    <td>User's state of residence (for the USA).</td>
  </tr>
  <tr>
    <td><strong>date_of_birth</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><code>DD/MM/YYYY</code> / <code>MM/DD/YYYY</code> (USA)	</td>
    <td>User's date of birth.</td>
  </tr>
  <tr>
    <td><strong>email</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><code>test@test.com</code></td>
    <td>User's email address.</td>
  </tr>
  <tr>
    <td><strong>full_name</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td>min 3, max 69 letters; <code>RegExp(/(\w+\s)\w+/)</code></td>
    <td>User's first and last name.</td>
  </tr>
  <tr>
    <td><strong>phone</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><code>+11014321111</code> / <code>11014321111</code></td>
    <td>User's phone number in the international format (E. 164 standard). Can be with or without +.</td>
  </tr>
</table>

### Appearance and restrictions

<table>
  <tr>
    <th>Property</th>
    <th>Required</th>
    <th>Type</th>
    <th>Default value</th>
    <th>Possible value(s)</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><strong>lang</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td><code>en</code></td>
    <td><code>en</code>, <code>fr</code></td>
    <td>Defines the language in the module.</td>
  </tr>
  <tr>
    <td><strong>is_crypto_hidden</strong></td>
    <td>optional</td>
    <td><i>Boolean</i></td>
    <td><code>undefined</code></td>
    <td><code>true</code></td>
    <td>
      Allows to hide crypto mentions and exchange rate for NFT purchases if it is enabled for your partner_id.
      <br/><br/>
      <i>- Please check the <a href="#boolean-usage">boolean usage note</a></i>
    </td>
  </tr>
  <tr>
    <td><strong>is_warranty_disabled</strong></td>
    <td>optional</td>
    <td><i>Boolean</i></td>
    <td><code>undefined</code></td>
    <td><code>true</code></td>
    <td>
      Allows to disable NFT warranty option for a specific widget mount, even if it is enabled for your partner_id and smart contract.
      <br/><br/>
      <i>- Please check the <a href="#boolean-usage">boolean usage note</a></i>
    </td>
  </tr>
  <tr>
    <td><strong>skip_init_navigation</strong></td>
    <td>optional</td>
    <td><i>Boolean</i></td>
    <td><code>undefined</code></td>
    <td><code>true</code></td>
    <td>
      By default, module will try to provide the closest to purchase starting route depending on provided parameters. If <code>true</code>, this navigation logic will be skipped.
      <br/><br/>
      <i>- Please check the <a href="#boolean-usage">boolean usage note</a></i>
    </td>
  </tr>
  <tr>
    <td><strong>theme</strong></td>
    <td>optional</td>
    <td><i>String</i></td>
    <td><code>undefined</code></td>
    <td><code>dark</code></td>
    <td>The theme used in the module (uses the light theme by default).</td>
  </tr>
  <tr>
    <td>
      <strong>
        buttons_border_radius <br/>
        secondary_buttons_border_radius <br/>
      </strong>
    </td>
    <td>optional</td>
    <td><i>Number</i></td>
    <td><code>4</code></td>
    <td>-</td>
    <td>Custom radius of elements (in pixels).</td>
  </tr>
  <tr>
    <td>
      <strong>
        color_background <br/>
        color_buttons <br/>
        color_buttons_text <br/>
        color_secondary_buttons <br/>
        color_secondary_buttons_text <br/>
        color_main_text <br/>
        color_secondary_text <br/>
        color_icons <br/>
        color_links <br/>
        color_success <br/>
        color_warning <br/>
        color_error <br/>
      </strong>
    </td>
    <td>optional</td>
    <td><i>String</i></td>
    <td>-</td>
    <td><code>red</code> / <code>#FF0000</code> / <code>rgb(255,255,0)</code></td>
    <td>Custom colors of elements. Can be in any suitable format (string, HEX, rgb etc.).</td>
  </tr>
</table>

### Extra object structure

The `extra` object is an optional object that can contain some additional data.

```
extra: {
  item_info: Object,
  wallets: Array,
}
```

#### Adding NFT information
You can add the following parameters to the **item_info** to display your NFT's name, image, the author’s avatar, the author’s name and the seller’s name in the widget.

| Property            | Type   | Description                                                                            |
|---------------------|--------|----------------------------------------------------------------------------------------|
| author_image_url    | String | The URL of the author's avatar. Example: `https://something.com/images/image.jpg`      |
| author              | String | The name of the author                                                                 |
| image_url           | String | The URL of the NFT's image                                                             |
| name                | String | The name of the NFT                                                                    |
| category            | String | The category of the NFT                                                                |
| seller              | String | The name of the NFT's seller                                                           |

#### Adding default wallets
You can define the array of default **wallets** that will be prefilled when the user changes cryptocurrency. Non-valid addresses will be ignored.

The wallet object structure:

| Property | Type   | Description                                                                                                             |
|----------|--------|-------------------------------------------------------------------------------------------------------------------------|
| name     | String | Example: `ETH`. See the [list of supported currencies](https://docs.wert.io/docs/supported-coins-and-blockchains).      |
| network  | String | Example: `ethereum`. See the [list of supported currencies](https://docs.wert.io/docs/supported-coins-and-blockchains). |
| address  | String | The wallet address. Non-valid addresses will be ignored.                                                                |

### Listeners

#### Initial event listeners

Simply include the `listeners` object in the following format, where the key is the event type and the value is your callback.

```
const widget = new WertWidget({
  ...options,
  listeners: {
    position: data => console.log('step:', data.step),
  },
});
```

#### Events

<table>
  <tr>
    <th>Event type</th>
    <th>Data</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <strong>close</strong>
    </td>
    <td>
      <code> undefined </code>
    </td>
    <td>
      An event raised by module when the user closes a widget.
    </td>
  </tr>
  <tr>
    <td>
      <strong>error</strong>
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
      <strong>loaded</strong>
    </td>
    <td>
      <code> undefined </code>
    </td>
    <td>
     The module has the necessary data and is ready to work. In case extra data was used, it's ready to receive it. This event can be duplicated if there was a 3D Secure redirection.
    </td>
  </tr>
  <tr>
    <td>
      <strong>payment-status</strong>
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
      Possible statuses: <code>pending</code>, <code>canceled</code>, <code>failed</code>, <code>success</code>, <code>failover</code>. Event for each status can be not unique.
    </td>
  </tr>
  <tr>
    <td>
      <strong>position</strong>
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
  <tr>
    <td>
      <strong>rate-update</strong>
    </td>
  <td>

  ```
  { 
    ticker: String, 
    fee_percent: String,
    currency_amount: String,
    fee_amount: String,
    commodity_amount: String,
    purchase_amount: String,
    miner_fee: String,
    currency_miner_fee: String
  }
  ```

  </td>
    <td>
      Information on when does the widget updates the rate.
    </td>
  </tr>
</table>

## Widget class methods

| Method                   | Description                               |
|--------------------------|-------------------------------------------|
| **open**                 | Mounts module in DOM and makes it visible |
| **updateTheme**          | Switches the theme without reload         |
| **addEventListeners**    | Adds event listeners                      |
| **removeEventListeners** | Removes event listeners                   |
| **close**                | Closes the widget                         |

### Showing the module

After creating an instance of the widget class, you can call the `open` method to show the module to the user:

```
wertWidget.open();
```

### Closing the module

You can call the `close` method to close and remove the widget modal at any time:

```
wertWidget.close();
```

### Switching themes without reload

To switch to another theme without reloading the whole widget you can use the `updateTheme` method:

```
wertWidget.updateTheme({
  theme: 'dark', // undefined — for the default light theme 
  colors: {
    // supported colors listed in options table above 
    color_buttons: 'red',
  },
});
```

Please note that this **method should be called only after the widget is fully loaded**.

### Adding event listeners

If you want to listen to the [widget events](#events), you can use the `addEventListeners` method. Pass an object of 
listeners to add listeners, potentially rewriting the existing listeners of the same type:

```
wertWidget.addEventListeners({
  position: data => console.log('step:', data.step),
});
```

### Removing event listeners

If you want to stop listening to the [widget events](#events), you can use the `removeEventListeners` method. Pass an event 
type, array of 
the event types or nothing to remove a listener, multiple listeners or all listeners:

```
wertWidget.removeEventListeners('rate-update');
```
or
```
wertWidget.removeEventListeners([ 'rate-update', 'payment-status' ]);
```
or
```
wertWidget.removeEventListeners();
```

## Additional notes

*Additional information about the library usage*

### Boolean usage

Please note that any value passed to the property with the boolean type will be considered <code>true</code>.<br/>
Example: <code>is_crypto_hidden: "test"</code> will be equal to <code>is_crypto_hidden: true</code>.
