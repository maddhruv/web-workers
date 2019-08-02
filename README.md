# Web Workers Kit

Run your code easily in web workers

## Features

- :zero: Zero Dependencies
- :v: Promise based architecture
- :cloud: Light Weight [![BundlePhobia Web Workes](https://badgen.net/bundlephobia/minzip/web-workers)](https://bundlephobia.com/result?p=web-workers@0.7.0)

## Install

NPM -

```shell
npm i web-workers
```

or
CDN -

```js
<script src="https://unpkg.com/web-workers@0.6.0/dist.js"></script>
```

## Usage

```js
const lunar = () => {
  async function get () {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    return res.json()
  }
}

const lunarMission = WebWorker(lunar)

lunarMission.get().then(d => console.log(d))
```

## API Documentations

### `WebWorker`

The `WebWorker` constructor is used invoke/spawn a web worker with the script you pass.
And will return promises for all underlying methods of the script.

```js
const WebWorker = require('web-workers')

const script = function () {
  console.log('Web Worker is Invocked')

  function add(a, b) {
    return a + b
  }
}

const worker = WebWorker(script)
```

#### Params

- script - script to run in the worker thread

### `worker.call()` and `worker[method]`

The `call()` or `[method]` can be used to call underlying functions/methods which are also promise based

```js
worker.add(1, 2) // 3

worker.call('add', 2, 3) // 5
```

#### Params

- ...args - arguments to pass to the method

### `worker.message()`

The method is used to add a message to the worker :warning: but not post/send it.
The same message you can use and append later in the stage and post.

```js
worker.message('Hello')

worker.message({
  data: [],
  errors: []
})
```

To clear the message use `message` with no params :wink:

#### Params

- message - message to set - can be of any type - string, object, array

### `worker.append()`

This method is used to append the passed message to the earlier set message

```js
worker.message('Hello')

worker.append(' World!')
```

#### Params

- message - message to append - can be of any type - string, object, array but should be matching the already set message

### `worker.getMessage()`

`getMessage()` returns the current message with worker

```js
worker.message('Hello')

worker.getMessage() // 'Hello'
```

### `worker.kill()`

`kill()` will terminate your worker thread
:warning: The kill method will kill the worker even if there is some execution happening

```js
worker.kill()
```

### `worker.onerror(fn)`

`onerror` is an error event handler, i.e. if any error happens at the worker thread, you can listen to it right here

```js
worker.onerror((err) => {
  console.log(err)
})
```

### `worker.ondata(fn)`

Use this method to access the message posted in the worker thread, using `postMessage()`

```js
worker.ondata((data) => {
  console.log(data)
})
```

### `ondata`



```js
ondata = (data) => {
  console.log(data)
}
```
