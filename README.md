# Express Handlebars Hot Reload

🔥 Automatically reload handlebars templates when they change.

## Installation

```bash
npm install express-handlebars-hotreload
```

## Usage

```js
const { hotreload, engine } = require('express-handlebars-hotreload');
const express = require('express');

if (process.env.NODE_ENV !== 'production') hotreload();

const app = express();

app.engine('handlebars', engine({
  hotreload: process.env.NODE_ENV !== 'production',
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(4200);
```

## Options

If you want to specifiy the websocket port, you can pass an object to the `hotreload` function and the `engine` function.

### `hotreload`
```js
hotreload({
  port: number /** Websocket port - default is 8080 */
})
```

### `engine`
```js
engine({
  hotreload: boolean /** Enable hot reload - default is false */
})

// or
engine({
  hotreload: {
    port: number /** Websocket port - default is 8080 */
  }
})
```

`hotreload` will actually return the `port` that it is using, so you can use that to pass to the `engine` function.

```js
let port;
if (process.env.NODE_ENV !== 'production') port = hotreload();

app.engine('handlebars', engine({
  ...(process.env.NODE_ENV !== 'production') && {
    hotreload: {
      port
    }
  },
}));
```

## Handlebars

The handlebars engine is the same as the [express-handlebars](https://github.com/ericf/express-handlebars) engine.