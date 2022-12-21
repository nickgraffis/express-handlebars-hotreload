# Express Handlebars Hot Reload

🔥 Automatically reload handlebars templates when they change.

## Installation

```bash
npm install express-handlebars-hotreload
```

## Usage

```js
// index.js or server.js
const { hotreload, engine } = require('express-handlebars-hotreload');
const express = require('express');

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

```json
// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "hotrelader \"nodemon index.js\""
  }
}
```

## Options

If you want to specifiy the websocket port, you can pass an object to the `hotreload` function and the `engine` function.

### `hotreload`
```json
{
  "scripts": {
    "dev": "hotrelader \"nodemon index.js\" --port 8085"
  }
}
```

_The default port is 8080_

You can also specify the glob pattern to watch for changes.

```json
{
  "scripts": {
    "dev": "hotrelader \"nodemon index.js\" --pattern \"./views/**/*.hbs\""
  }
}
```

_The default pattern is `./**/*`_


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

## Handlebars

The handlebars engine is the same as the [express-handlebars](https://github.com/ericf/express-handlebars) engine.