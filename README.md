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
<script src="https://unpkg.com/web-workers@0.6.0/dist.js"></script>
```

## Usage

```js
const WebWorkers = require('web-workers')

const lunar = () => {
async function get () {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  return res.json()
}

const subtract = (a, b) => {
  console.log(a-b)
}

const division = function (a, b) {
  console.log(a/b)
}
}

const lunarMission = WebWorker(lunar)

lunarMission.get().then(d => console.log(d))

lunarMission.subtract(4, 2)

lunarMission.call('division', 6, 3)
```
