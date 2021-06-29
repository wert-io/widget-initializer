/**
  * @jest-environment jsdom
*/

let widget, widgetLink

const getScript = (url) => {
  return new Promise((resolve, reject) => {

    const http = require('http'), https = require('https')

    const client = url.startsWith('https') ? https : http

    client.get(url, (resp) => {
        let data = ''

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => data += chunk)

        // The whole response has been received. Print out the result.
        resp.on('end', () => resolve(data))

    }).on("error", (err) => reject(err))
  })
}

beforeEach((done) => {

  getScript(`https://javascript.wert.io/wert-${require('./package.json').version}.js`)
    .then(data => {

      eval(data)

      widget = new WertWidget({
        container_id: 'widget',
      })

      widgetLink = widget.getEmbedUrl()

    })
    .finally(done)

})


test('load page via link', () => {

  return expect(getScript(widgetLink))
    .resolves.not.toBe('')

})

test('mount iframe', () => {

  const startWidget = `<div id="widget">`
  const endWidget = `</div>`

  document.body.innerHTML = startWidget + endWidget

  widget.mount()

  expect(document.body.innerHTML)
    .toBe(`${startWidget}<iframe style="width: 100%; height: 100%;" src="${widgetLink}"></iframe>${endWidget}`)

})
