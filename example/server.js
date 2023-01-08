const exphbs = require('../');
const express = require('express');
exphbs.hotreload()

const app = express();
const hbs = exphbs.create({
  hotreload: true,
})
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', process.cwd() + '/example/views');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(4241);