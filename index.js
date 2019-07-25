module.exports = function (script) {
  if (!script) {
    throw new Error('The script is required')
  }
  this._script = script
  const code = this._script.toString()
  const blob = new Blob(['(' + code + ')()'])
  this._worker = new Worker(URL.createObjectURL(blob))
  return this._worker
}
