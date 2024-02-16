/* eslint-disable @typescript-eslint/no-var-requires */

const { describe, expect, test, beforeEach, afterEach } = require('@jest/globals');
const { ALL_OPTIONS_FILLED, MINIMUM_OPTIONS_FILLED, COMMODITIES } = require('./mocks/options.js');

let widget;
let widgetLink;
const WertWidget = require('../index.js');

const getScript = (url) => {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const https = require('https');
    const client = url.startsWith('https') ? https : http;

    client.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => data += chunk); // A chunk of data has been recieved
        resp.on('end', () => resolve(data)); // The whole response has been received

    }).on('error', (err) => reject(err));
  });
};

describe('widget starts properly', () => {
  beforeEach((done) => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
  
    widgetLink = widget.getEmbedUrl();
  
    done();
  });
  afterEach(() => {
    widget = null;
    widgetLink = null;
  });
  
  test('widget loads via link', () => {
    return expect(getScript(widgetLink))
      .resolves.not.toBe('');
  });
  test('widget is not opened without partner_id', () => {
    const setEmptyOptions = () => widget = new WertWidget();
    expect(setEmptyOptions).toThrow();
  });
  test('widget iframe is mounted', () => {
    widget.open();

    expect(widget.widgetWindow).toEqual(document.body.children[0].contentWindow);
    expect(document.body.innerHTML)
      .toBe(`<iframe style="width: 100%; height: 100%; bottom: 0px; right: 0px; position: fixed; z-index: 10000;" src="${widgetLink}" allow="camera *; microphone *" sandbox="allow-scripts allow-forms allow-popups allow-same-origin"></iframe>`);
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
describe('getEmbedUrl correctly generates the URL', () => {
  afterEach(() => {
    widget = null;
    widgetLink = null;
  });
  test('URL contains origin and partner_id', () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();

    expect(widgetLink.startsWith(`${MINIMUM_OPTIONS_FILLED.origin}/${MINIMUM_OPTIONS_FILLED.partner_id}/`)).toBe(true);
  }); 
  test('all truthy options are included in the URL query', () => {
    const options = { ...ALL_OPTIONS_FILLED };
    widget = new WertWidget(ALL_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();
    delete options.partner_id;
    delete options.origin;

    const allOptionsArePresent = checkOptionsPresenceInURL(options, widgetLink);

    expect(allOptionsArePresent).toBe(true);
  }); 
  test('undefined options are missing in the URL query', () => {
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, theme: undefined, 'click_id': undefined });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);
    const noFalsyValuesFound = ['theme', 'click_id'].every((key) => !searchParams.has(key));

    expect(noFalsyValuesFound).toBe(true);
  });
  test('objects are missing in the URL query', () => {
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED,
      listeners: {
        loaded: () => { console.log('loaded'); },
      },
      extra: {
        item_info: {
          author: 'TEST'
        },
      },
    });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);
    const noObjectsFound = ['listeners', 'extra'].every((key) => !searchParams.has(key));

    expect(noObjectsFound).toBe(true);
  });
  test('widget_layout_mode is always present in the URL query', () => {
    widget = new WertWidget(MINIMUM_OPTIONS_FILLED);
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);

    expect(searchParams.has('widget_layout_mode')).toBe(true);
  });
  test('if extra param is present, await_data appears in the URL query', () => {
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED,
      extra: {
        item_info: {
          author: 'TEST'
        },
      },
    });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);

    expect(searchParams.has('await_data')).toBe(true);
  });
  test('commodities are correctly displayed in the URL query', () => {
    widget = new WertWidget({ ...MINIMUM_OPTIONS_FILLED, commodities: JSON.stringify(COMMODITIES) });
    widgetLink = widget.getEmbedUrl();

    const searchParams = new URLSearchParams(widgetLink.split('?')[1]);
    const commoditiesFromUrl = JSON.parse(searchParams.get('commodities'));

    const arraysAreEqual = JSON.stringify(COMMODITIES) === JSON.stringify(commoditiesFromUrl);

    expect(arraysAreEqual).toBe(true);
  }); 
});
