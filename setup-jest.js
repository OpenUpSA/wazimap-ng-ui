import "regenerator-runtime/runtime";

import $ from 'jquery';
global.$ = global.jQuery = $;

global.$.fn.tooltip = jest.fn(() => $());
