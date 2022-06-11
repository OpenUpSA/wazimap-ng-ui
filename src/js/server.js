const express = require('express');
const handlebars = require('express-handlebars');
const axios = require('axios');

const port = process.env.PORT || 3000;

const app = express();
app.disable('x-powered-by');

app.engine('.html', handlebars.engine({extname: '.html'}));
app.set('view engine', '.html');
app.set('views', './dist');


function index(req, res, next) {
  axios.get("https://production.wazimap-ng.openup.org.za/api/v1/profile_by_url/?format=json", {
    headers: {
      'wm-hostname': req.hostname,
    }
  })
    .then(response => {
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

app.use(express.static('dist'));

app.listen(port);
