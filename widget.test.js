/**
  * @jest-environment jsdom
*/

let widget;
let widgetLink;
const WertWidget = require('./index.js');

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
}

beforeEach((done) => {
  widget = new WertWidget({
    container_id: 'widget',
    partner_id: 'default',
  });

  widgetLink = widget.getEmbedUrl();

  done();
});

test('Load widget via link', () => {
  return expect(getScript(widgetLink))
    .resolves.not.toBe('');
});

test('Mount iframe', () => {
  const startWidget = `<div id="widget">`;
  const endWidget = `</div>`;

  document.body.innerHTML = startWidget + endWidget;

  widget.mount();

  expect(document.body.innerHTML)
    .toBe(`${startWidget}<iframe style="width: 100%; height: 100%;" src="${widgetLink}" allow="camera *; microphone *"></iframe>${endWidget}`)
});
