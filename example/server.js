const { hotreload, engine } = require('../dist');
const express = require('express');
hotreload()

const app = express();

app.engine('handlebars', engine({
  hotreload: true,
}));
app.set('view engine', 'handlebars');
app.set('views', process.cwd() + '/example/views');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(4200);