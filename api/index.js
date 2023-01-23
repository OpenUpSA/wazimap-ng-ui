import path from 'path';

const express = require('express');
const handlebars = require('express-handlebars');
const axios = require('axios');
var morgan = require('morgan');

const staticDir = path.join(process.cwd(), 'dist');

const app = express();

// Security best practice
app.disable('x-powered-by');

app.use(morgan('short')); // Basic HTTP request logging

app.engine('.html', handlebars.engine({extname: '.html'}));
app.set('view engine', '.html');
app.set('views', staticDir);


const apiUrl = process.env.API_URL || "https://production.wazimap-ng.openup.org.za";


function index(req, res, next) {
  const hostname = process.env.HOSTNAME || req.hostname;
  axios.get(`${apiUrl}/api/v1/profile_by_url/?format=json`, {
    headers: {
      'wm-hostname': hostname,
    }
  })
    .then(response => {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
      res.render('app-shell', {
        'title': response.data.name,
      });
    })
    .catch(err => {
      if (err.response.status == 404) {
        res.status(404).send(`Profile not found for hostname ${hostname}`);
      } else {
        next(err);
      }
    });
}


app.get('/', index);

app.use(express.static(staticDir));

module.exports = app;
