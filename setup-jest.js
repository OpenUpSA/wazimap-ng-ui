import "regenerator-runtime/runtime";

import $ from 'jquery';
global.$ = global.jQuery = $;

global.mainDocument = preval`
  const fs = require('fs')
  module.exports = fs.readFileSync(require.resolve('./src/index.html'), 'utf8')
`