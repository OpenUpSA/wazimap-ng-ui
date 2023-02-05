const path = require('path');

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

function respond(res, context) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.render('app-shell', context);
};

function index(req, res, next) {
  const hostname = process.env.HOSTNAME || req.hostname;
  axios.get(`${apiUrl}/api/v1/profile_by_url/?format=json`, {
    headers: {
      'wm-hostname': hostname,
    }
  })
    .then(apiResponse => {
      respond(res, {
        'title': apiResponse.data.config?.page_title || apiResponse.data.name,
      });
    })
    .catch(err => {
      if (err?.response?.status == 404) {
        // Render response anyway so that frontend can give user-friendly guidance
        respond(res, {});
        console.info(`Profile not found for hostname ${hostname}`);
      } else {
        console.error(err);
        next(err);
      }
    });
}


app.get('/', index);

module.exports = app;
