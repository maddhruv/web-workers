const CheckWebWorker = require('check-web-workers-support')
class WebWorker {
  constructor (script) {
    CheckWebWorker(() => {
      console.log('Web Workers are supported')
    })

    if (!script) {
      throw new Error('The script is required')
    }
    this._script = script
    const code = this._script.toString()
    const blob = new Blob(['(' + code + ')()'])
    this._worker = new Worker(URL.createObjectURL(blob))
    return this._worker
  }
}

module.exports = WebWorker
