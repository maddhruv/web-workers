class WebWorker {
	constructor(script) {
    if (!script) {
      throw new Error("The script is required")
    }
    this._script = script
    const code = this._script.toString();
    const blob = new Blob(['('+code+')()']);
		return new Worker(URL.createObjectURL(blob));
	}
}

module.exports = WebWorker
