const express = require('express');
const handlebars = require('express-handlebars');
const axios = require('axios');
var morgan = require('morgan');

const port = process.env.PORT || 1234;

const app = express();
app.disable('x-powered-by');

app.use(morgan('short'));

app.engine('.html', handlebars.engine({extname: '.html'}));
app.set('view engine', '.html');
app.set('views', './dist');


const apiUrl = process.env.API_URL || "https://production.wazimap-ng.openup.org.za";

function index(req, res, next) {
  axios.get(`${apiUrl}/api/v1/profile_by_url/?format=json`, {
    headers: {
      'wm-hostname': req.hostname,
    }
  })
    .then(response => {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
      res.render('index', {
        'title': response.data.name,
      });
    })
    .catch(err => {
      if (err.response.status == 404) {
        res.sendStatus(404);
      } else {
        next(err);
      }
    });
}


app.get('/', index);
app.get('/server-side', index);

app.use(express.static('dist'));

module.exports = app;
