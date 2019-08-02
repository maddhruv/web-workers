const inbuiltMethods = ['append', 'message', 'postMessage', 'call', 'onerror', 'kill', 'getMessage', 'ondata']

function WebWorker (script, options) {
  this._options = options || {}
  if (!script) {
    throw new Error('The script is required in `WebWorker()`')
  }
  this._exports = []
  this._message = this._options.message || null
  this._script = script
  this._code = insideFunction(this._script.toString())
  this._listen = insideFunction(internalSetup.toString())
  const namespace = {}
  let method = null
  this._code.replace(/^(\s*)\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/mg, (o) => {
    const occurence = o.trim().split(' ')
    method = occurence[occurence.length - 1]
    if (inbuiltMethods.includes(method)) {
      throw new Error(`${method} is an in-built function/api, please rename it to something else`)
    }
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
      Promise.resolve()
        .then(() => eval(data.method).apply(null, data.args))
        .then(result => {
          if (result) {
            this.postMessage({
              type: 'CALL_RETURN',
              result: result
            })
          }
        })
    } else {
      eval('ondata').call(this, data)
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
      Promise.resolve()
        .then(() => data.result)
        .then(result => r(result))
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

WebWorker.prototype.append = function (message) {
  if (typeof message !== typeof this._message) {
    throw new Error(`Can't append ${typeof message} message with ${typeof this._message} message already created. Use \`worker.clearMessage()\` `)
  }
  if (Array.isArray(message)) {
    this._message = this._message.concat(message)
  } else if (typeof message === 'object') {
    this._message = Object.assign({}, this._message, message)
  } else {
    this._message += message
  }
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

WebWorker.prototype.getMessage = function () {
  return this._message
}

WebWorker.prototype.kill = function () {
  this._worker.terminate()
}

WebWorker.prototype.onerror = function (cb) {
  this._worker.addEventListener('error', cb)
}

export default (script, options) => {
  return new WebWorker(script, options)
}
