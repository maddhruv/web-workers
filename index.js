function WebWorker (script, options) {
  this._options = options || {}
  if (!script) {
    throw new Error('The script is required in `new WebWorker()`')
  }
  this._exports = []
  this._message = this._options.message || null
  this._script = script
  this._code = insideFunction(this._script.toString())
  this._listen = insideFunction(internalSetup.toString())
  const namespace = {}
  let method = null
  this._code.replace(/^(\s*)\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/mg, (o) => {
    method = o.trim().split(' ')[1]
    this._exports.push(method)
    namespace[method] = method
  })
  this._code = `(function () {\nvar namespace = ${JSON.stringify(namespace)};\n${this._code}\n${this._listen}})()`
  const blob = new Blob([this._code])
  this._url = URL.createObjectURL(blob)
  this._worker = new Worker(this._url)
  methodsSetup(this._worker, this._exports)
}

function insideFunction (s) {
  return s.slice(s.indexOf('{') + 1, s.lastIndexOf('}'))
}

function internalSetup () {
  this.onmessage = ({ data }) => {
    if (data.type === 'CALL') {
      this.postMessage({
        type: 'CALL_RETURN',
        result: eval(data.method).apply(null, data.args) // remove eval
      })
    }
  }
}

function methodCall (context, method, args, r) {
  context.postMessage({
    type: 'CALL',
    method: method,
    args: args
  })
  context.addEventListener('message', ({ data }) => {
    if (data.type === 'CALL_RETURN') {
      r(data.result)
    }
  })
}

function methodsSetup (context, fxns) {
  for (let f = 0; f < fxns.length; f++) {
    WebWorker.prototype[fxns[f]] = (...args) => new Promise((resolve, reject) => {
      methodCall(context, fxns[f], args, resolve)
    })
  }
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

WebWorker.prototype.call = function (method, ...args) {
  this._worker.postMessage({
    type: 'CALL',
    method: method,
    args: args
  })
}

export default WebWorker
