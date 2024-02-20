const {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} = require('@jest/globals');
const {
  ALL_OPTIONS_FILLED,
  MINIMUM_OPTIONS_FILLED,
  COMMODITIES,
  WALLETS,
} = require('./mocks/options.js');

let widget;
let widgetLink;
const WertWidget = require('../index.js');

afterEach(() => {
  widget = null;
  if (document.body.children[0])
    document.body.removeChild(document.body.children[0]);
});

const getScript = (url) => {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const https = require('https');
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => (data += chunk)); // A chunk of data has been recieved
        resp.on('end', () => resolve(data)); // The whole response has been received
      })
      .on('error', (err) => reject(err));
  });
};
describe('open', () => {
  const validateOptionsSpy = jest.spyOn(
    WertWidget.prototype,
    'validateOptions'
  );
  beforeEach((done) => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();
    done();
  });
  afterEach(() => {
    widgetLink = null;
  });
  test('should call validateOptions', () => {
    expect(validateOptionsSpy).toHaveBeenCalled();
  });
  test('should start listening to the widget events', async () => {
    jest.spyOn(widget, 'listenWidget');

    widget.open();
    expect(widget.listenWidget).toHaveBeenCalled();
  });
  test('the iframe should be mounted', () => {
    widget.open();

    expect(widget.widgetWindow).toEqual(
      document.body.children[0].contentWindow
    );
    expect(document.body.innerHTML).toBe(
      `<iframe style="width: 100%; height: 100%; bottom: 0px; right: 0px; position: fixed; z-index: 10000;" src="${widgetLink}" allow="camera *; microphone *" sandbox="allow-scripts allow-forms allow-popups allow-same-origin"></iframe>`
    );
  });
  test('the widget should load via link', () => {
    return expect(getScript(widgetLink)).resolves.not.toBe('');
  });
});

const checkOptionsPresenceInURL = (options, url) => {
  const searchParams = new URLSearchParams(url.split('?')[1]);
  for (const [key, value] of Object.entries(options)) {
    if (!searchParams.has(key) || searchParams.get(key) !== value.toString()) {
      return false;
    }
  }
  return true;
};
describe('getEmbedUrl & getParametersString', () => {
  afterEach(() => {
    widgetLink = null;
  });
  test('resulting URL should contain origin and partner_id', () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();

    expect(
      widgetLink.startsWith(
        `${MINIMUM_OPTIONS_FILLED.origin}/${MINIMUM_OPTIONS_FILLED.partner_id}/`
      )
    ).toBe(true);
  });
  test('all truthy options should be included in the URL query', () => {
    const options = { ...ALL_OPTIONS_FILLED };
    widget = new WertWidget(ALL_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();
    delete options.partner_id;
    delete options.origin;

    const allOptionsArePresent = checkOptionsPresenceInURL(options, widgetLink);

    expect(allOptionsArePresent).toBe(true);
  });
  test('undefined options should be missing in the URL query', () => {
    widget = new WertWidget({
      ...MINIMUM_OPTIONS_FILLED,
      theme: undefined,
      click_id: undefined,
    });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);
    const noFalsyValuesFound = ['theme', 'click_id'].every(
      (key) => !searchParams.has(key)
    );

    expect(noFalsyValuesFound).toBe(true);
  });
  test('objects should be missing in the URL query', () => {
    widget = new WertWidget({
      ...MINIMUM_OPTIONS_FILLED,
      listeners: {
        loaded: () => {
          console.log('loaded');
        },
      },
      extra: {
        item_info: {
          author: 'TEST',
        },
      },
    });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);
    const noObjectsFound = ['listeners', 'extra'].every(
      (key) => !searchParams.has(key)
    );

    expect(noObjectsFound).toBe(true);
  });
  test('widget_layout_mode should be present in the URL query', () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);

    expect(searchParams.has('widget_layout_mode')).toBe(true);
  });
  test('if the extra param is present, await_data should appear in the URL query', () => {
    widget = new WertWidget({
      ...MINIMUM_OPTIONS_FILLED,
      extra: {
        item_info: {
          author: 'TEST',
        },
      },
    });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);

    expect(searchParams.has('await_data')).toBe(true);
  });
  test('commodities should be correctly displayed in the URL query', () => {
    widget = new WertWidget({
      ...MINIMUM_OPTIONS_FILLED,
      commodities: JSON.stringify(COMMODITIES),
    });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);
    const commoditiesFromUrl = JSON.parse(searchParams.get('commodities'));

    const arraysAreEqual =
      JSON.stringify(COMMODITIES) === JSON.stringify(commoditiesFromUrl);

    expect(arraysAreEqual).toBe(true);
  });
});

describe('listenWidget', () => {
  test('should start listening to the "message" event', async () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    jest.spyOn(window, 'addEventListener');
    widget.open();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'message',
      widget.onMessage
    );
    expect(widget.checkIntervalId).toBeDefined();
  });
});

describe('unlistenWidget', () => {
  test('should stop listening to the "message" event', async () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    jest.spyOn(window, 'removeEventListener');
    widget.open();

    const eventData = { type: 'close' };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'message',
      widget.onMessage
    );
    expect(widget.checkIntervalId).toBe(undefined);
  });
});

describe('onMessage', () => {
  test('should call correct listeners with the correct data', () => {
    const listeners = {
      position: jest.fn(),
    };
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, listeners });
    widget.open();

    const eventData = { type: 'position', data: { step: 'home' } };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(listeners.position).toHaveBeenCalledWith(eventData.data);
  });
  test('should not call unknown event types listeners', () => {
    const listeners = {
      test: jest.fn(),
    };
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, listeners });
    widget.open();

    const eventData = { type: 'test' };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(listeners.test).toBeCalledTimes(0);
  });
  test('should send an "extra" event when iframe sends "loaded" event', () => {
    const extraData = { wallets: WALLETS };
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, extra: extraData });
    jest.spyOn(widget, 'sendEvent');
    widget.open();

    const eventData = { type: 'loaded' };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(widget.sendEvent).toHaveBeenCalledWith('extra', extraData);
  });
  test('should stop listening to the widget and remove an iframe on the "close" event', () => {
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED });
    jest.spyOn(widget, 'unListenWidget');
    widget.open();

    const eventData = { type: 'close' };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(widget.unListenWidget).toHaveBeenCalled();
    expect(document.body.innerHTML).toBeFalsy();
  });
  test('should not proceed with the wrong source', () => {
    const listeners = {
      close: jest.fn(),
    };
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, listeners });
    widget.open();

    const eventData = { type: 'close' };
    const messageEvent = new MessageEvent('message', eventData);

    widget.widgetWindow = 'test';

    widget.onMessage(messageEvent);

    expect(listeners.close).toHaveBeenCalledTimes(0);
  });
});

describe('sendEvent', () => {
  beforeEach(() => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widget.open();
  });

  test('should send an event with valid data', () => {
    const postMessageMock = jest.fn();
    const originalPostMessage = widget.widgetWindow.postMessage;
    widget.widgetWindow.postMessage = postMessageMock;

    widget.sendEvent('testEvent', { value: 'testData' });

    widget.widgetWindow.postMessage = originalPostMessage;

    expect(postMessageMock).toHaveBeenCalledWith(
      { type: 'testEvent', data: { value: 'testData' } },
      MINIMUM_OPTIONS_FILLED.origin
    );
  });

  test('should not send an event if data is null', () => {
    const postMessageMock = jest.fn();
    const originalPostMessage = widget.widgetWindow.postMessage;
    widget.widgetWindow.postMessage = postMessageMock;

    widget.sendEvent('testEvent', null);

    widget.widgetWindow.postMessage = originalPostMessage;

    expect(postMessageMock).not.toHaveBeenCalled();
  });
});

describe('addEventListeners', () => {
  test('the new listener should be called in the onMessage method', async () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widget.open();

    const listeners = {
      position: jest.fn(),
    };
    widget.addEventListeners(listeners);

    const eventData = { type: 'position', data: { step: 'home' } };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(listeners.position).toHaveBeenCalledWith(eventData.data);
  });
  test('the new listener should rewrite the old listener', async () => {
    widget = new WertWidget({
      ...MINIMUM_OPTIONS_FILLED,
      listeners: { 'rate-update': jest.fn() },
    });
    widget.open();

    const listeners = {
      'rate-update': jest.fn(),
    };
    widget.addEventListeners(listeners);

    const eventData = {
      type: 'rate-update',
      data: {
        ticker: 'string',
        fee_percent: 'string',
        currency_amount: 'string',
        fee_amount: 'string',
        commodity_amount: 'string',
        purchase_amount: 'string',
        miner_fee: 'string',
        currency_miner_fee: 'string',
      },
    };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(listeners['rate-update']).toHaveBeenCalledWith(eventData.data);
  });
  test('empty listeners object should not replace the old listeners', async () => {
    const oldListeners = {
      position: jest.fn(),
    };
    widget = new WertWidget({
      ...MINIMUM_OPTIONS_FILLED,
      listeners: oldListeners,
    });
    widget.open();

    widget.addEventListeners({});

    const eventData = { type: 'position', data: { step: 'home' } };
    const messageEvent = new MessageEvent('message', { data: eventData });
    widget.widgetWindow = null;
    widget.onMessage(messageEvent);

    expect(oldListeners.position).toHaveBeenCalled();
  });
});

describe('removeEventListeners', () => {
  const loadedCallback = jest.fn();
  const closeCallback = jest.fn();
  const listeners = {
    loaded: loadedCallback,
    close: closeCallback,
  };
  beforeEach(() => {
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, listeners });
    widget.open();
  });
  test('should remove all listeners if called with no arguments', async () => {
    widget.removeEventListeners();

    const loaded = { type: 'loaded' };
    const loadedEvent = new MessageEvent('message', { data: loaded });
    widget.widgetWindow = null;
    widget.onMessage(loadedEvent);

    const close = { type: 'close' };
    const closeEvent = new MessageEvent('message', { data: close });
    widget.widgetWindow = null;
    widget.onMessage(closeEvent);

    expect(loadedCallback).toHaveBeenCalledTimes(0);
    expect(closeCallback).toHaveBeenCalledTimes(0);
  });
  test('should remove the listener passed as a string', async () => {
    widget.removeEventListeners('close');

    const close = { type: 'close' };
    const closeEvent = new MessageEvent('message', { data: close });
    widget.widgetWindow = null;
    widget.onMessage(closeEvent);

    expect(closeCallback).toHaveBeenCalledTimes(0);
  });
  test('should remove all listeners passed in an array', () => {
    widget.removeEventListeners(['close', 'loaded']);

    const loaded = { type: 'loaded' };
    const loadedEvent = new MessageEvent('message', { data: loaded });
    widget.widgetWindow = null;
    widget.onMessage(loadedEvent);

    const close = { type: 'close' };
    const closeEvent = new MessageEvent('message', { data: close });
    widget.widgetWindow = null;
    widget.onMessage(closeEvent);

    expect(loadedCallback).toHaveBeenCalledTimes(0);
    expect(closeCallback).toHaveBeenCalledTimes(0);
  });
});

describe('updateTheme', () => {
  beforeEach(() => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widget.open();
  });
  test('should send the "theme" event', async () => {
    jest.spyOn(widget, 'sendEvent');

    const testData = { theme: 'dark' };

    widget.updateTheme(testData);
    expect(widget.sendEvent).toHaveBeenCalledWith('theme', testData);
  });
  test('should not send the "theme" event if called incorrectly', async () => {
    jest.spyOn(widget, 'sendEvent');

    const incorrectThemeData = {};

    widget.updateTheme(incorrectThemeData);
    expect(widget.sendEvent).toHaveBeenCalledTimes(0);
  });
});

describe('validateOptions', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    console.error.mockRestore();
  });
  afterEach(() => {
    console.error.mockClear();
  });

  test('should throw an error if partner_id is not provided', () => {
    const options = { partner_id: '' };

    expect(() => new WertWidget(options)).toThrowError(
      'Please provide a partner_id'
    );
  });

  test('should log a warning if container_id is provided (deprecated)', () => {
    const options = { partner_id: 'partner123', container_id: 'container123' };

    widget = new WertWidget(options);

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain(
      'container_id is no longer supported'
    );
  });

  test('should log a warning if extra.item_info.name exceeds maximum length', () => {
    const options = {
      partner_id: 'partner123',
      extra: {
        item_info: {
          name: 'a'.repeat(50),
        },
      },
    };

    widget = new WertWidget(options);

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain(
      `Max length of the extra.item_info.name value is 40 characters`
    );
  });

  test('should log a warning if extra.item_info.category exceeds maximum length', () => {
    const options = {
      partner_id: 'partner123',
      extra: {
        item_info: {
          category: 'a'.repeat(50), // Category exceeds maximum length
        },
      },
    };

    widget = new WertWidget(options);

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain(
      `Max length of the extra.item_info.category value is 40 characters`
    );
  });
});
