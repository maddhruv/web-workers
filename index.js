function WebWorker (script, options) {
  this._options = options || {}
  if (!script) {
    throw new Error('The script is required in `new WebWorker()`')
  }
  this._message = this._options.message || null
  this._script = script
  this._code = this._script.toString()
  const blob = new Blob(['(' + this._code + ')()'])
  this._url = URL.createObjectURL(blob)
  this._worker = new Worker(this._url)
}

WebWorker.prototype.send = function (message) {
  if (message && typeof message !== 'string') {
    throw new Error(`Can't send ${typeof message} with this method. Rather use the \`worker.json()\` method`)
  }
  this.postMessage(message)
}

WebWorker.prototype.clearMessage = function () {
  this._message = null
}

WebWorker.prototype.append = function (message) {
  if (typeof message !== typeof this._message) {
    throw new Error(`Cant't append ${typeof message} message with ${typeof this._message} messagea already created. Use \`worker.clearMessage()\` `)
  }
  // TODO append for all the data type - Object(assign), Arrray(concat)
  // working for string and numbers
  this._message += message
}

WebWorker.prototype.message = function (message) {
  this._message = message
}

WebWorker.prototype.postMessage = function (message) {
  this._worker.postMessage(message || this._message)
}

export default WebWorker
