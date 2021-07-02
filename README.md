# WertWidget initializer

`@wert-io/widget-initializer` is a helper that allows you to integrate WertWidget into your web app.

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

First of all you need to create a configuration object:

```
const wertWidget = new WertWidget(options);
```

### Options

| Property | Required | Type | Default value | Possible value(s) | Description |
| :--- | :---: | :---: | :---: | :---: | --- |
| **partner_id** | required | *String* | | | **partner_id** will be given after registering you as a partner, it's needed to track your comissions and statistics. If you don't have one, [contact us](https://wert.io/for-partners) |
| **container_id** | required / optional | *String* | | | id of widget parent DOM element, needed if you want to use **mount** method |
| **origin** | optional | *String* | `https://widget.wert.io/` | `https://sandbox.wert.io/` | Needed to initialize widget on specific environment |
| **autosize** | optional | *Boolean* | `false` | `true, false` | Widget will use 100% width and 100% height of parent element, if "true" **width** and **height** options are ignored |
| **width** | optional | *Number* | | | Widget width in pixels |
| **height** | optional | *Number* | | | Widget height in pixels |
| **theme** | optional | *String* | | `dark` | Widget will use theme colors as base, ability to set colors for specific elements will be available soon |
| **currency** | optional | *String* | `USD` | `USD, EUR` | Default currency that will be selected in widget |
| **currency_amount** | optional | *Number* | | | Default currency amount that will be prefilled in widget |
| **commodity** | optional | *String* | `BTC` | `BTC, ETH, XTZ` | Default commodity that will be selected in widget |
| **commodities** | optional | *String* | | | Comma separated commodity values that will be available for user for selection |
| **commodity_amount** | optional | *Number* | | | Default commodity amount that will be prefilled in widget, ignored if **currency_amount** was set |
| **address** | optional | *String* | | | Address is checked for validity based on which **commodity** is set, if commodity is not set then BTC is used by default. If address is invalid - this option is ignored |

### Configuration object methods

After creation of configuration object you can call **mount** method to show the widget to the user (in this case make sure that you've set **container_id** option).

```
wertWidget.mount();
```

If for some reason you want to handle widget **iframe** by yourself (for example you use **React** or other framework that doesn't respect working with DOM directly) you can call **getEmbedUrl** and set it to **iframe** src attribute. In this case you should set **iframe** width and height by yourself.

```
const iframeSrc = wertWidget.getEmbedUrl();
```

In addition, if you want to open widget in separate window (in this case tips will be available), call **getRedirectUrl** and send user to it. Widget will look like [this](https://widget.wert.io/default/redirect).

```
const redirectUrl = wertWidget.getRedirectUrl();
```

<br>

| Method | Description |
| --- | --- |
| **mount** | Mounts widget in DOM element with given **container_id** |
| **getEmdedUrl** | Returns embed widget url |
| **getRedirectUrl** | Returns redirect widget url |