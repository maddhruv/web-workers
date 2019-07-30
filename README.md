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

ondata = (data) => {
  console.log(data)
}
}

const lunarMission = WebWorker(lunar)

lunarMission.get().then(d => console.log(d))

lunarMission.subtract(4, 2)

lunarMission.call('division', 6, 3)

lunarMission.message('Hello')

lunarMission.append(' World')

lunarMission.postMessage()

lunarMission.message({
firstName: 'Dhruv'
})

lunarMission.append({
lastName: 'Jain'
})

lunarMission.postMessage()

lunarMission.message([1])

lunarMission.append([2])

lunarMission.postMessage()
```

## API

### `ondata`

Use this method to access the message posted in the worker thread

```js
ondata = (data) => {
  console.log(data)
}
```
