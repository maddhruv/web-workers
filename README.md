# Web Workers Kit

Run your code easily in web workers

## Install

NPM -

```shell
npm i web-workers
```

or
CDN -

```js
<script src="https://unpkg.com/web-workers@0.4.0/dist.js"></script>
```

## Usage

```js
const WebWorkers = require('web-worker')

const mathematics = () => {
  function add (a, b) {
    console.log(a+b)
  }

  const subtract = (a, b) => {
    console.log(a-b)
  }

  const division = function (a, b) {
    console.log(a/b)
  }
}

const mathsWorker = WebWorker(mathematics)

mathsWorker.add(1, 2).then(result => console.log(result))

mathsWorker.subtract(4, 2)

mathsWorker.call('division', 6, 3)
```
