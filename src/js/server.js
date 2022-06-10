const express = require('express');
const handlebars = require('express-handlebars');

const port = process.env.PORT || 3000;

const app = express();
app.disable('x-powered-by');

app.engine('.html', handlebars.engine({extname: '.html'}));
app.set('view engine', '.html');
app.set('views', './dist');

app.get('/', (req, res) => {
  res.render('index', {
    title: "bob",
  });
});

app.use(express.static('dist'));

app.listen(port);
