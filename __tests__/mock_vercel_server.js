/* Mock vercel server because `vercel dev` wants to connect to a
  vercel project when run in CI, and we don't want that.

  Basically

  - serve any app routes
  - serve any static files
*/

const path = require('path');
const app = require ('../api/index.js');
const express = require('express');

const staticDir = path.join(process.cwd(), 'dist');

app.use(express.static(staticDir));

app.listen(1234);
