// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/d3-selection/src/namespaces.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.xhtml = void 0;
var xhtml = "http://www.w3.org/1999/xhtml";
exports.xhtml = xhtml;
var _default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
exports.default = _default;
},{}],"node_modules/d3-selection/src/namespace.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespaces = _interopRequireDefault(require("./namespaces"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return _namespaces.default.hasOwnProperty(prefix) ? {
    space: _namespaces.default[prefix],
    local: name
  } : name;
}
},{"./namespaces":"node_modules/d3-selection/src/namespaces.js"}],"node_modules/d3-selection/src/creator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = require("./namespaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === _namespaces.xhtml && document.documentElement.namespaceURI === _namespaces.xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function _default(name) {
  var fullname = (0, _namespace.default)(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
},{"./namespace":"node_modules/d3-selection/src/namespace.js","./namespaces":"node_modules/d3-selection/src/namespaces.js"}],"node_modules/d3-selection/src/selector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function none() {}

function _default(selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
}
},{}],"node_modules/d3-selection/src/selection/select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selector.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}
},{"./index":"node_modules/d3-selection/src/selection/index.js","../selector":"node_modules/d3-selection/src/selector.js"}],"node_modules/d3-selection/src/selectorAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function empty() {
  return [];
}

function _default(selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
}
},{}],"node_modules/d3-selection/src/selection/selectAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selectorAll = _interopRequireDefault(require("../selectorAll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selectorAll.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, parents);
}
},{"./index":"node_modules/d3-selection/src/selection/index.js","../selectorAll":"node_modules/d3-selection/src/selectorAll.js"}],"node_modules/d3-selection/src/matcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(selector) {
  return function () {
    return this.matches(selector);
  };
}
},{}],"node_modules/d3-selection/src/selection/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _matcher = _interopRequireDefault(require("../matcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(match) {
  if (typeof match !== "function") match = (0, _matcher.default)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}
},{"./index":"node_modules/d3-selection/src/selection/index.js","../matcher":"node_modules/d3-selection/src/matcher.js"}],"node_modules/d3-selection/src/selection/sparse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(update) {
  return new Array(update.length);
}
},{}],"node_modules/d3-selection/src/selection/enter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.EnterNode = EnterNode;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._enter || this._groups.map(_sparse.default), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function (child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function (child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function (selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function (selector) {
    return this._parent.querySelectorAll(selector);
  }
};
},{"./sparse":"node_modules/d3-selection/src/selection/sparse.js","./index":"node_modules/d3-selection/src/selection/index.js"}],"node_modules/d3-selection/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"node_modules/d3-selection/src/selection/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _enter = require("./enter");

var _constant = _interopRequireDefault(require("../constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length; // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.

  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Put any non-null nodes that don’t fit into exit.


  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue; // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.

  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);

      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  } // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.


  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);

    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Add any remaining nodes that were not bound to data to exit.


  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

function _default(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;
  if (typeof value !== "function") value = (0, _constant.default)(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key); // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.

    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;

        while (!(next = updateGroup[i1]) && ++i1 < dataLength);

        previous._next = next || null;
      }
    }
  }

  update = new _index.Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
},{"./index":"node_modules/d3-selection/src/selection/index.js","./enter":"node_modules/d3-selection/src/selection/enter.js","../constant":"node_modules/d3-selection/src/constant.js"}],"node_modules/d3-selection/src/selection/exit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._exit || this._groups.map(_sparse.default), this._parents);
}
},{"./sparse":"node_modules/d3-selection/src/selection/sparse.js","./index":"node_modules/d3-selection/src/selection/index.js"}],"node_modules/d3-selection/src/selection/join.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(onenter, onupdate, onexit) {
  var enter = this.enter(),
      update = this,
      exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove();else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}
},{}],"node_modules/d3-selection/src/selection/merge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(selection) {
  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Selection(merges, this._parents);
}
},{"./index":"node_modules/d3-selection/src/selection/index.js"}],"node_modules/d3-selection/src/selection/order.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}
},{}],"node_modules/d3-selection/src/selection/sort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }

    sortgroup.sort(compareNode);
  }

  return new _index.Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
},{"./index":"node_modules/d3-selection/src/selection/index.js"}],"node_modules/d3-selection/src/selection/call.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}
},{}],"node_modules/d3-selection/src/selection/nodes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
}
},{}],"node_modules/d3-selection/src/selection/node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}
},{}],"node_modules/d3-selection/src/selection/size.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
}
},{}],"node_modules/d3-selection/src/selection/empty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return !this.node();
}
},{}],"node_modules/d3-selection/src/selection/each.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}
},{}],"node_modules/d3-selection/src/selection/attr.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("../namespace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function _default(name, value) {
  var fullname = (0, _namespace.default)(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}
},{"../namespace":"node_modules/d3-selection/src/namespace.js"}],"node_modules/d3-selection/src/window.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
  node.document && node // node is a Window
  || node.defaultView; // node is a Document
}
},{}],"node_modules/d3-selection/src/selection/style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.styleValue = styleValue;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

function _default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name) || (0, _window.default)(node).getComputedStyle(node, null).getPropertyValue(name);
}
},{"../window":"node_modules/d3-selection/src/window.js"}],"node_modules/d3-selection/src/selection/property.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

function _default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
},{}],"node_modules/d3-selection/src/selection/classed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function (name) {
    var i = this._names.indexOf(name);

    if (i < 0) {
      this._names.push(name);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function (name) {
    var i = this._names.indexOf(name);

    if (i >= 0) {
      this._names.splice(i, 1);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function (name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function _default(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;

    while (++i < n) if (!list.contains(names[i])) return false;

    return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
},{}],"node_modules/d3-selection/src/selection/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}
},{}],"node_modules/d3-selection/src/selection/html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
},{}],"node_modules/d3-selection/src/selection/raise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function _default() {
  return this.each(raise);
}
},{}],"node_modules/d3-selection/src/selection/lower.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function _default() {
  return this.each(lower);
}
},{}],"node_modules/d3-selection/src/selection/append.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
}
},{"../creator":"node_modules/d3-selection/src/creator.js"}],"node_modules/d3-selection/src/selection/insert.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constantNull() {
  return null;
}

function _default(name, before) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name),
      select = before == null ? constantNull : typeof before === "function" ? before : (0, _selector.default)(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}
},{"../creator":"node_modules/d3-selection/src/creator.js","../selector":"node_modules/d3-selection/src/selector.js"}],"node_modules/d3-selection/src/selection/remove.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function _default() {
  return this.each(remove);
}
},{}],"node_modules/d3-selection/src/selection/clone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function selection_cloneShallow() {
  var clone = this.cloneNode(false),
      parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true),
      parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function _default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
},{}],"node_modules/d3-selection/src/selection/datum.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
},{}],"node_modules/d3-selection/src/selection/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.customEvent = customEvent;
exports.event = void 0;
var filterEvents = {};
var event = null;
exports.event = event;

if (typeof document !== "undefined") {
  var element = document.documentElement;

  if (!("onmouseenter" in element)) {
    filterEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;

    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).

    exports.event = event = event1;

    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {
      type: t,
      name: name
    };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;

    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }

    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {
      type: typename.type,
      name: typename.name,
      value: value,
      listener: listener,
      capture: capture
    };
    if (!on) this.__on = [o];else on.push(o);
  };
}

function _default(typename, value, capture) {
  var typenames = parseTypenames(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;

    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;

  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));

  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  exports.event = event = event1;

  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event = event0;
  }
}
},{}],"node_modules/d3-selection/src/selection/dispatch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatchEvent(node, type, params) {
  var window = (0, _window.default)(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function _default(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
},{"../window":"node_modules/d3-selection/src/window.js"}],"node_modules/d3-selection/src/selection/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selection = Selection;
exports.default = exports.root = void 0;

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _filter = _interopRequireDefault(require("./filter"));

var _data = _interopRequireDefault(require("./data"));

var _enter = _interopRequireDefault(require("./enter"));

var _exit = _interopRequireDefault(require("./exit"));

var _join = _interopRequireDefault(require("./join"));

var _merge = _interopRequireDefault(require("./merge"));

var _order = _interopRequireDefault(require("./order"));

var _sort = _interopRequireDefault(require("./sort"));

var _call = _interopRequireDefault(require("./call"));

var _nodes = _interopRequireDefault(require("./nodes"));

var _node = _interopRequireDefault(require("./node"));

var _size = _interopRequireDefault(require("./size"));

var _empty = _interopRequireDefault(require("./empty"));

var _each = _interopRequireDefault(require("./each"));

var _attr = _interopRequireDefault(require("./attr"));

var _style = _interopRequireDefault(require("./style"));

var _property = _interopRequireDefault(require("./property"));

var _classed = _interopRequireDefault(require("./classed"));

var _text = _interopRequireDefault(require("./text"));

var _html = _interopRequireDefault(require("./html"));

var _raise = _interopRequireDefault(require("./raise"));

var _lower = _interopRequireDefault(require("./lower"));

var _append = _interopRequireDefault(require("./append"));

var _insert = _interopRequireDefault(require("./insert"));

var _remove = _interopRequireDefault(require("./remove"));

var _clone = _interopRequireDefault(require("./clone"));

var _datum = _interopRequireDefault(require("./datum"));

var _on = _interopRequireDefault(require("./on"));

var _dispatch = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = [null];
exports.root = root;

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  data: _data.default,
  enter: _enter.default,
  exit: _exit.default,
  join: _join.default,
  merge: _merge.default,
  order: _order.default,
  sort: _sort.default,
  call: _call.default,
  nodes: _nodes.default,
  node: _node.default,
  size: _size.default,
  empty: _empty.default,
  each: _each.default,
  attr: _attr.default,
  style: _style.default,
  property: _property.default,
  classed: _classed.default,
  text: _text.default,
  html: _html.default,
  raise: _raise.default,
  lower: _lower.default,
  append: _append.default,
  insert: _insert.default,
  remove: _remove.default,
  clone: _clone.default,
  datum: _datum.default,
  on: _on.default,
  dispatch: _dispatch.default
};
var _default = selection;
exports.default = _default;
},{"./select":"node_modules/d3-selection/src/selection/select.js","./selectAll":"node_modules/d3-selection/src/selection/selectAll.js","./filter":"node_modules/d3-selection/src/selection/filter.js","./data":"node_modules/d3-selection/src/selection/data.js","./enter":"node_modules/d3-selection/src/selection/enter.js","./exit":"node_modules/d3-selection/src/selection/exit.js","./join":"node_modules/d3-selection/src/selection/join.js","./merge":"node_modules/d3-selection/src/selection/merge.js","./order":"node_modules/d3-selection/src/selection/order.js","./sort":"node_modules/d3-selection/src/selection/sort.js","./call":"node_modules/d3-selection/src/selection/call.js","./nodes":"node_modules/d3-selection/src/selection/nodes.js","./node":"node_modules/d3-selection/src/selection/node.js","./size":"node_modules/d3-selection/src/selection/size.js","./empty":"node_modules/d3-selection/src/selection/empty.js","./each":"node_modules/d3-selection/src/selection/each.js","./attr":"node_modules/d3-selection/src/selection/attr.js","./style":"node_modules/d3-selection/src/selection/style.js","./property":"node_modules/d3-selection/src/selection/property.js","./classed":"node_modules/d3-selection/src/selection/classed.js","./text":"node_modules/d3-selection/src/selection/text.js","./html":"node_modules/d3-selection/src/selection/html.js","./raise":"node_modules/d3-selection/src/selection/raise.js","./lower":"node_modules/d3-selection/src/selection/lower.js","./append":"node_modules/d3-selection/src/selection/append.js","./insert":"node_modules/d3-selection/src/selection/insert.js","./remove":"node_modules/d3-selection/src/selection/remove.js","./clone":"node_modules/d3-selection/src/selection/clone.js","./datum":"node_modules/d3-selection/src/selection/datum.js","./on":"node_modules/d3-selection/src/selection/on.js","./dispatch":"node_modules/d3-selection/src/selection/dispatch.js"}],"node_modules/d3-selection/src/select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([[document.querySelector(selector)]], [document.documentElement]) : new _index.Selection([[selector]], _index.root);
}
},{"./selection/index":"node_modules/d3-selection/src/selection/index.js"}],"node_modules/d3-selection/src/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("./creator"));

var _select = _interopRequireDefault(require("./select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return (0, _select.default)((0, _creator.default)(name).call(document.documentElement));
}
},{"./creator":"node_modules/d3-selection/src/creator.js","./select":"node_modules/d3-selection/src/select.js"}],"node_modules/d3-selection/src/local.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = local;
var nextId = 0;

function local() {
  return new Local();
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function (node) {
    var id = this._;

    while (!(id in node)) if (!(node = node.parentNode)) return;

    return node[id];
  },
  set: function (node, value) {
    return node[this._] = value;
  },
  remove: function (node) {
    return this._ in node && delete node[this._];
  },
  toString: function () {
    return this._;
  }
};
},{}],"node_modules/d3-selection/src/sourceEvent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _on = require("./selection/on");

function _default() {
  var current = _on.event,
      source;

  while (source = current.sourceEvent) current = source;

  return current;
}
},{"./selection/on":"node_modules/d3-selection/src/selection/on.js"}],"node_modules/d3-selection/src/point.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}
},{}],"node_modules/d3-selection/src/mouse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node) {
  var event = (0, _sourceEvent.default)();
  if (event.changedTouches) event = event.changedTouches[0];
  return (0, _point.default)(node, event);
}
},{"./sourceEvent":"node_modules/d3-selection/src/sourceEvent.js","./point":"node_modules/d3-selection/src/point.js"}],"node_modules/d3-selection/src/selectAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([document.querySelectorAll(selector)], [document.documentElement]) : new _index.Selection([selector == null ? [] : selector], _index.root);
}
},{"./selection/index":"node_modules/d3-selection/src/selection/index.js"}],"node_modules/d3-selection/src/touch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = (0, _sourceEvent.default)().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return (0, _point.default)(node, touch);
    }
  }

  return null;
}
},{"./sourceEvent":"node_modules/d3-selection/src/sourceEvent.js","./point":"node_modules/d3-selection/src/point.js"}],"node_modules/d3-selection/src/touches.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches) {
  if (touches == null) touches = (0, _sourceEvent.default)().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = (0, _point.default)(node, touches[i]);
  }

  return points;
}
},{"./sourceEvent":"node_modules/d3-selection/src/sourceEvent.js","./point":"node_modules/d3-selection/src/point.js"}],"node_modules/d3-selection/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "creator", {
  enumerable: true,
  get: function () {
    return _creator.default;
  }
});
Object.defineProperty(exports, "local", {
  enumerable: true,
  get: function () {
    return _local.default;
  }
});
Object.defineProperty(exports, "matcher", {
  enumerable: true,
  get: function () {
    return _matcher.default;
  }
});
Object.defineProperty(exports, "mouse", {
  enumerable: true,
  get: function () {
    return _mouse.default;
  }
});
Object.defineProperty(exports, "namespace", {
  enumerable: true,
  get: function () {
    return _namespace.default;
  }
});
Object.defineProperty(exports, "namespaces", {
  enumerable: true,
  get: function () {
    return _namespaces.default;
  }
});
Object.defineProperty(exports, "clientPoint", {
  enumerable: true,
  get: function () {
    return _point.default;
  }
});
Object.defineProperty(exports, "select", {
  enumerable: true,
  get: function () {
    return _select.default;
  }
});
Object.defineProperty(exports, "selectAll", {
  enumerable: true,
  get: function () {
    return _selectAll.default;
  }
});
Object.defineProperty(exports, "selection", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "selector", {
  enumerable: true,
  get: function () {
    return _selector.default;
  }
});
Object.defineProperty(exports, "selectorAll", {
  enumerable: true,
  get: function () {
    return _selectorAll.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.styleValue;
  }
});
Object.defineProperty(exports, "touch", {
  enumerable: true,
  get: function () {
    return _touch.default;
  }
});
Object.defineProperty(exports, "touches", {
  enumerable: true,
  get: function () {
    return _touches.default;
  }
});
Object.defineProperty(exports, "window", {
  enumerable: true,
  get: function () {
    return _window.default;
  }
});
Object.defineProperty(exports, "event", {
  enumerable: true,
  get: function () {
    return _on.event;
  }
});
Object.defineProperty(exports, "customEvent", {
  enumerable: true,
  get: function () {
    return _on.customEvent;
  }
});

var _create = _interopRequireDefault(require("./create"));

var _creator = _interopRequireDefault(require("./creator"));

var _local = _interopRequireDefault(require("./local"));

var _matcher = _interopRequireDefault(require("./matcher"));

var _mouse = _interopRequireDefault(require("./mouse"));

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = _interopRequireDefault(require("./namespaces"));

var _point = _interopRequireDefault(require("./point"));

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _index = _interopRequireDefault(require("./selection/index"));

var _selector = _interopRequireDefault(require("./selector"));

var _selectorAll = _interopRequireDefault(require("./selectorAll"));

var _style = require("./selection/style");

var _touch = _interopRequireDefault(require("./touch"));

var _touches = _interopRequireDefault(require("./touches"));

var _window = _interopRequireDefault(require("./window"));

var _on = require("./selection/on");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./create":"node_modules/d3-selection/src/create.js","./creator":"node_modules/d3-selection/src/creator.js","./local":"node_modules/d3-selection/src/local.js","./matcher":"node_modules/d3-selection/src/matcher.js","./mouse":"node_modules/d3-selection/src/mouse.js","./namespace":"node_modules/d3-selection/src/namespace.js","./namespaces":"node_modules/d3-selection/src/namespaces.js","./point":"node_modules/d3-selection/src/point.js","./select":"node_modules/d3-selection/src/select.js","./selectAll":"node_modules/d3-selection/src/selectAll.js","./selection/index":"node_modules/d3-selection/src/selection/index.js","./selector":"node_modules/d3-selection/src/selector.js","./selectorAll":"node_modules/d3-selection/src/selectorAll.js","./selection/style":"node_modules/d3-selection/src/selection/style.js","./touch":"node_modules/d3-selection/src/touch.js","./touches":"node_modules/d3-selection/src/touches.js","./window":"node_modules/d3-selection/src/window.js","./selection/on":"node_modules/d3-selection/src/selection/on.js"}],"node_modules/d3-format/src/formatDecimal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function _default(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity

  var i,
      coefficient = x.slice(0, i); // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).

  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
}
},{}],"node_modules/d3-format/src/exponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x) {
  return x = (0, _formatDecimal.default)(Math.abs(x)), x ? x[1] : NaN;
}
},{"./formatDecimal.js":"node_modules/d3-format/src/formatDecimal.js"}],"node_modules/d3-format/src/formatGroup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(grouping, thousands) {
  return function (value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}
},{}],"node_modules/d3-format/src/formatNumerals.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
}
},{}],"node_modules/d3-format/src/formatSpecifier.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatSpecifier;
exports.FormatSpecifier = FormatSpecifier;
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function () {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === undefined ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
},{}],"node_modules/d3-format/src/formatTrim.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function _default(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".":
        i0 = i1 = i;
        break;

      case "0":
        if (i0 === 0) i0 = i;
        i1 = i;
        break;

      default:
        if (i0 > 0) {
          if (!+s[i]) break out;
          i0 = 0;
        }

        break;
    }
  }

  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
},{}],"node_modules/d3-format/src/formatPrefixAuto.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.prefixExponent = void 0;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixExponent;
exports.prefixExponent = prefixExponent;

function _default(x, p) {
  var d = (0, _formatDecimal.default)(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (exports.prefixExponent = prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + (0, _formatDecimal.default)(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}
},{"./formatDecimal.js":"node_modules/d3-format/src/formatDecimal.js"}],"node_modules/d3-format/src/formatRounded.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x, p) {
  var d = (0, _formatDecimal.default)(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}
},{"./formatDecimal.js":"node_modules/d3-format/src/formatDecimal.js"}],"node_modules/d3-format/src/formatTypes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatPrefixAuto = _interopRequireDefault(require("./formatPrefixAuto.js"));

var _formatRounded = _interopRequireDefault(require("./formatRounded.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  "%": function (x, p) {
    return (x * 100).toFixed(p);
  },
  "b": function (x) {
    return Math.round(x).toString(2);
  },
  "c": function (x) {
    return x + "";
  },
  "d": function (x) {
    return Math.round(x).toString(10);
  },
  "e": function (x, p) {
    return x.toExponential(p);
  },
  "f": function (x, p) {
    return x.toFixed(p);
  },
  "g": function (x, p) {
    return x.toPrecision(p);
  },
  "o": function (x) {
    return Math.round(x).toString(8);
  },
  "p": function (x, p) {
    return (0, _formatRounded.default)(x * 100, p);
  },
  "r": _formatRounded.default,
  "s": _formatPrefixAuto.default,
  "X": function (x) {
    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function (x) {
    return Math.round(x).toString(16);
  }
};
exports.default = _default;
},{"./formatPrefixAuto.js":"node_modules/d3-format/src/formatPrefixAuto.js","./formatRounded.js":"node_modules/d3-format/src/formatRounded.js"}],"node_modules/d3-format/src/identity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x;
}
},{}],"node_modules/d3-format/src/locale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

var _formatGroup = _interopRequireDefault(require("./formatGroup.js"));

var _formatNumerals = _interopRequireDefault(require("./formatNumerals.js"));

var _formatSpecifier = _interopRequireDefault(require("./formatSpecifier.js"));

var _formatTrim = _interopRequireDefault(require("./formatTrim.js"));

var _formatTypes = _interopRequireDefault(require("./formatTypes.js"));

var _formatPrefixAuto = require("./formatPrefixAuto.js");

var _identity = _interopRequireDefault(require("./identity.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var map = Array.prototype.map,
    prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

function _default(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? _identity.default : (0, _formatGroup.default)(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? _identity.default : (0, _formatNumerals.default)(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "-" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = (0, _formatSpecifier.default)(specifier);
    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type; // The "n" type is an alias for ",g".

    if (type === "n") comma = true, type = "g"; // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!_formatTypes.default[type]) precision === undefined && (precision = 12), trim = true, type = "g"; // If zero fill is specified, padding goes after sign and before digits.

    if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "="; // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.

    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : ""; // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?

    var formatType = _formatTypes.default[type],
        maybeSuffix = /[defgprs%]/.test(type); // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].

    precision = precision === undefined ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i,
          n,
          c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value; // Perform the initial formatting.

        var valueNegative = value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision); // Trim insignificant zeros.

        if (trim) value = (0, _formatTrim.default)(value); // If a negative value rounds to zero during formatting, treat as positive.

        if (valueNegative && +value === 0) valueNegative = false; // Compute the prefix and suffix.

        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + _formatPrefixAuto.prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : ""); // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.

        if (maybeSuffix) {
          i = -1, n = value.length;

          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      } // If the fill character is not "0", grouping is applied before padding.


      if (comma && !zero) value = group(value, Infinity); // Compute the padding.

      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : ""; // If the fill character is "0", grouping is applied after padding.

      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = ""; // Reconstruct the final output based on the desired alignment.

      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;

        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;

        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;

        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }

      return numerals(value);
    }

    format.toString = function () {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = (0, _formatSpecifier.default)(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor((0, _exponent.default)(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function (value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}
},{"./exponent.js":"node_modules/d3-format/src/exponent.js","./formatGroup.js":"node_modules/d3-format/src/formatGroup.js","./formatNumerals.js":"node_modules/d3-format/src/formatNumerals.js","./formatSpecifier.js":"node_modules/d3-format/src/formatSpecifier.js","./formatTrim.js":"node_modules/d3-format/src/formatTrim.js","./formatTypes.js":"node_modules/d3-format/src/formatTypes.js","./formatPrefixAuto.js":"node_modules/d3-format/src/formatPrefixAuto.js","./identity.js":"node_modules/d3-format/src/identity.js"}],"node_modules/d3-format/src/defaultLocale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultLocale;
exports.formatPrefix = exports.format = void 0;

var _locale = _interopRequireDefault(require("./locale.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locale;
var format;
exports.format = format;
var formatPrefix;
exports.formatPrefix = formatPrefix;
defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});

function defaultLocale(definition) {
  locale = (0, _locale.default)(definition);
  exports.format = format = locale.format;
  exports.formatPrefix = formatPrefix = locale.formatPrefix;
  return locale;
}
},{"./locale.js":"node_modules/d3-format/src/locale.js"}],"node_modules/d3-format/src/precisionFixed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step) {
  return Math.max(0, -(0, _exponent.default)(Math.abs(step)));
}
},{"./exponent.js":"node_modules/d3-format/src/exponent.js"}],"node_modules/d3-format/src/precisionPrefix.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor((0, _exponent.default)(value) / 3))) * 3 - (0, _exponent.default)(Math.abs(step)));
}
},{"./exponent.js":"node_modules/d3-format/src/exponent.js"}],"node_modules/d3-format/src/precisionRound.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, (0, _exponent.default)(max) - (0, _exponent.default)(step)) + 1;
}
},{"./exponent.js":"node_modules/d3-format/src/exponent.js"}],"node_modules/d3-format/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "formatDefaultLocale", {
  enumerable: true,
  get: function () {
    return _defaultLocale.default;
  }
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function () {
    return _defaultLocale.format;
  }
});
Object.defineProperty(exports, "formatPrefix", {
  enumerable: true,
  get: function () {
    return _defaultLocale.formatPrefix;
  }
});
Object.defineProperty(exports, "formatLocale", {
  enumerable: true,
  get: function () {
    return _locale.default;
  }
});
Object.defineProperty(exports, "formatSpecifier", {
  enumerable: true,
  get: function () {
    return _formatSpecifier.default;
  }
});
Object.defineProperty(exports, "FormatSpecifier", {
  enumerable: true,
  get: function () {
    return _formatSpecifier.FormatSpecifier;
  }
});
Object.defineProperty(exports, "precisionFixed", {
  enumerable: true,
  get: function () {
    return _precisionFixed.default;
  }
});
Object.defineProperty(exports, "precisionPrefix", {
  enumerable: true,
  get: function () {
    return _precisionPrefix.default;
  }
});
Object.defineProperty(exports, "precisionRound", {
  enumerable: true,
  get: function () {
    return _precisionRound.default;
  }
});

var _defaultLocale = _interopRequireWildcard(require("./defaultLocale.js"));

var _locale = _interopRequireDefault(require("./locale.js"));

var _formatSpecifier = _interopRequireWildcard(require("./formatSpecifier.js"));

var _precisionFixed = _interopRequireDefault(require("./precisionFixed.js"));

var _precisionPrefix = _interopRequireDefault(require("./precisionPrefix.js"));

var _precisionRound = _interopRequireDefault(require("./precisionRound.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./defaultLocale.js":"node_modules/d3-format/src/defaultLocale.js","./locale.js":"node_modules/d3-format/src/locale.js","./formatSpecifier.js":"node_modules/d3-format/src/formatSpecifier.js","./precisionFixed.js":"node_modules/d3-format/src/precisionFixed.js","./precisionPrefix.js":"node_modules/d3-format/src/precisionPrefix.js","./precisionRound.js":"node_modules/d3-format/src/precisionRound.js"}],"node_modules/d3-array/src/ascending.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
},{}],"node_modules/d3-array/src/bisector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }

      return lo;
    },
    right: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }

      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function (d, x) {
    return (0, _ascending.default)(f(d), x);
  };
}
},{"./ascending":"node_modules/d3-array/src/ascending.js"}],"node_modules/d3-array/src/bisect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bisectLeft = exports.bisectRight = void 0;

var _ascending = _interopRequireDefault(require("./ascending"));

var _bisector = _interopRequireDefault(require("./bisector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ascendingBisect = (0, _bisector.default)(_ascending.default);
var bisectRight = ascendingBisect.right;
exports.bisectRight = bisectRight;
var bisectLeft = ascendingBisect.left;
exports.bisectLeft = bisectLeft;
var _default = bisectRight;
exports.default = _default;
},{"./ascending":"node_modules/d3-array/src/ascending.js","./bisector":"node_modules/d3-array/src/bisector.js"}],"node_modules/d3-array/src/pairs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.pair = pair;

function _default(array, f) {
  if (f == null) f = pair;
  var i = 0,
      n = array.length - 1,
      p = array[0],
      pairs = new Array(n < 0 ? 0 : n);

  while (i < n) pairs[i] = f(p, p = array[++i]);

  return pairs;
}

function pair(a, b) {
  return [a, b];
}
},{}],"node_modules/d3-array/src/cross.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _pairs = require("./pairs");

function _default(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;
  if (reduce == null) reduce = _pairs.pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
}
},{"./pairs":"node_modules/d3-array/src/pairs.js"}],"node_modules/d3-array/src/descending.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
},{}],"node_modules/d3-array/src/number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x === null ? NaN : +x;
}
},{}],"node_modules/d3-array/src/variance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
}
},{"./number":"node_modules/d3-array/src/number.js"}],"node_modules/d3-array/src/deviation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _variance = _interopRequireDefault(require("./variance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(array, f) {
  var v = (0, _variance.default)(array, f);
  return v ? Math.sqrt(v) : v;
}
},{"./variance":"node_modules/d3-array/src/variance.js"}],"node_modules/d3-array/src/extent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}
},{}],"node_modules/d3-array/src/array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = exports.slice = void 0;
var array = Array.prototype;
var slice = array.slice;
exports.slice = slice;
var map = array.map;
exports.map = map;
},{}],"node_modules/d3-array/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"node_modules/d3-array/src/identity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x;
}
},{}],"node_modules/d3-array/src/range.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}
},{}],"node_modules/d3-array/src/ticks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.tickIncrement = tickIncrement;
exports.tickStep = tickStep;
var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function _default(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;
  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));

    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));

    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();
  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}
},{}],"node_modules/d3-array/src/threshold/sturges.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}
},{}],"node_modules/d3-array/src/histogram.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("./array");

var _bisect = _interopRequireDefault(require("./bisect"));

var _constant = _interopRequireDefault(require("./constant"));

var _extent = _interopRequireDefault(require("./extent"));

var _identity = _interopRequireDefault(require("./identity"));

var _range = _interopRequireDefault(require("./range"));

var _ticks = require("./ticks");

var _sturges = _interopRequireDefault(require("./threshold/sturges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var value = _identity.default,
      domain = _extent.default,
      threshold = _sturges.default;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1); // Convert number of thresholds into uniform thresholds.

    if (!Array.isArray(tz)) {
      tz = (0, _ticks.tickStep)(x0, x1, tz);
      tz = (0, _range.default)(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    } // Remove any thresholds outside the domain.


    var m = tz.length;

    while (tz[0] <= x0) tz.shift(), --m;

    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin; // Initialize bins.

    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    } // Assign data to bins by value, ignoring any outside the domain.


    for (i = 0; i < n; ++i) {
      x = values[i];

      if (x0 <= x && x <= x1) {
        bins[(0, _bisect.default)(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(_), histogram) : value;
  };

  histogram.domain = function (_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : (0, _constant.default)([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function (_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? (0, _constant.default)(_array.slice.call(_)) : (0, _constant.default)(_), histogram) : threshold;
  };

  return histogram;
}
},{"./array":"node_modules/d3-array/src/array.js","./bisect":"node_modules/d3-array/src/bisect.js","./constant":"node_modules/d3-array/src/constant.js","./extent":"node_modules/d3-array/src/extent.js","./identity":"node_modules/d3-array/src/identity.js","./range":"node_modules/d3-array/src/range.js","./ticks":"node_modules/d3-array/src/ticks.js","./threshold/sturges":"node_modules/d3-array/src/threshold/sturges.js"}],"node_modules/d3-array/src/quantile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, p, valueof) {
  if (valueof == null) valueof = _number.default;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}
},{"./number":"node_modules/d3-array/src/number.js"}],"node_modules/d3-array/src/threshold/freedmanDiaconis.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("../array");

var _ascending = _interopRequireDefault(require("../ascending"));

var _number = _interopRequireDefault(require("../number"));

var _quantile = _interopRequireDefault(require("../quantile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, min, max) {
  values = _array.map.call(values, _number.default).sort(_ascending.default);
  return Math.ceil((max - min) / (2 * ((0, _quantile.default)(values, 0.75) - (0, _quantile.default)(values, 0.25)) * Math.pow(values.length, -1 / 3)));
}
},{"../array":"node_modules/d3-array/src/array.js","../ascending":"node_modules/d3-array/src/ascending.js","../number":"node_modules/d3-array/src/number.js","../quantile":"node_modules/d3-array/src/quantile.js"}],"node_modules/d3-array/src/threshold/scott.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _deviation = _interopRequireDefault(require("../deviation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, min, max) {
  return Math.ceil((max - min) / (3.5 * (0, _deviation.default)(values) * Math.pow(values.length, -1 / 3)));
}
},{"../deviation":"node_modules/d3-array/src/deviation.js"}],"node_modules/d3-array/src/max.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}
},{}],"node_modules/d3-array/src/mean.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) sum += value;else --m;
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) sum += value;else --m;
    }
  }

  if (m) return sum / m;
}
},{"./number":"node_modules/d3-array/src/number.js"}],"node_modules/d3-array/src/median.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

var _number = _interopRequireDefault(require("./number"));

var _quantile = _interopRequireDefault(require("./quantile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) {
        numbers.push(value);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return (0, _quantile.default)(numbers.sort(_ascending.default), 0.5);
}
},{"./ascending":"node_modules/d3-array/src/ascending.js","./number":"node_modules/d3-array/src/number.js","./quantile":"node_modules/d3-array/src/quantile.js"}],"node_modules/d3-array/src/merge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;

  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;

    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}
},{}],"node_modules/d3-array/src/min.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}
},{}],"node_modules/d3-array/src/permute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(array, indexes) {
  var i = indexes.length,
      permutes = new Array(i);

  while (i--) permutes[i] = array[indexes[i]];

  return permutes;
}
},{}],"node_modules/d3-array/src/scan.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];
  if (compare == null) compare = _ascending.default;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
}
},{"./ascending":"node_modules/d3-array/src/ascending.js"}],"node_modules/d3-array/src/shuffle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}
},{}],"node_modules/d3-array/src/sum.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  } else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}
},{}],"node_modules/d3-array/src/transpose.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _min = _interopRequireDefault(require("./min"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(matrix) {
  if (!(n = matrix.length)) return [];

  for (var i = -1, m = (0, _min.default)(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }

  return transpose;
}

function length(d) {
  return d.length;
}
},{"./min":"node_modules/d3-array/src/min.js"}],"node_modules/d3-array/src/zip.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _transpose = _interopRequireDefault(require("./transpose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return (0, _transpose.default)(arguments);
}
},{"./transpose":"node_modules/d3-array/src/transpose.js"}],"node_modules/d3-array/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "bisect", {
  enumerable: true,
  get: function () {
    return _bisect.default;
  }
});
Object.defineProperty(exports, "bisectRight", {
  enumerable: true,
  get: function () {
    return _bisect.bisectRight;
  }
});
Object.defineProperty(exports, "bisectLeft", {
  enumerable: true,
  get: function () {
    return _bisect.bisectLeft;
  }
});
Object.defineProperty(exports, "ascending", {
  enumerable: true,
  get: function () {
    return _ascending.default;
  }
});
Object.defineProperty(exports, "bisector", {
  enumerable: true,
  get: function () {
    return _bisector.default;
  }
});
Object.defineProperty(exports, "cross", {
  enumerable: true,
  get: function () {
    return _cross.default;
  }
});
Object.defineProperty(exports, "descending", {
  enumerable: true,
  get: function () {
    return _descending.default;
  }
});
Object.defineProperty(exports, "deviation", {
  enumerable: true,
  get: function () {
    return _deviation.default;
  }
});
Object.defineProperty(exports, "extent", {
  enumerable: true,
  get: function () {
    return _extent.default;
  }
});
Object.defineProperty(exports, "histogram", {
  enumerable: true,
  get: function () {
    return _histogram.default;
  }
});
Object.defineProperty(exports, "thresholdFreedmanDiaconis", {
  enumerable: true,
  get: function () {
    return _freedmanDiaconis.default;
  }
});
Object.defineProperty(exports, "thresholdScott", {
  enumerable: true,
  get: function () {
    return _scott.default;
  }
});
Object.defineProperty(exports, "thresholdSturges", {
  enumerable: true,
  get: function () {
    return _sturges.default;
  }
});
Object.defineProperty(exports, "max", {
  enumerable: true,
  get: function () {
    return _max.default;
  }
});
Object.defineProperty(exports, "mean", {
  enumerable: true,
  get: function () {
    return _mean.default;
  }
});
Object.defineProperty(exports, "median", {
  enumerable: true,
  get: function () {
    return _median.default;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _merge.default;
  }
});
Object.defineProperty(exports, "min", {
  enumerable: true,
  get: function () {
    return _min.default;
  }
});
Object.defineProperty(exports, "pairs", {
  enumerable: true,
  get: function () {
    return _pairs.default;
  }
});
Object.defineProperty(exports, "permute", {
  enumerable: true,
  get: function () {
    return _permute.default;
  }
});
Object.defineProperty(exports, "quantile", {
  enumerable: true,
  get: function () {
    return _quantile.default;
  }
});
Object.defineProperty(exports, "range", {
  enumerable: true,
  get: function () {
    return _range.default;
  }
});
Object.defineProperty(exports, "scan", {
  enumerable: true,
  get: function () {
    return _scan.default;
  }
});
Object.defineProperty(exports, "shuffle", {
  enumerable: true,
  get: function () {
    return _shuffle.default;
  }
});
Object.defineProperty(exports, "sum", {
  enumerable: true,
  get: function () {
    return _sum.default;
  }
});
Object.defineProperty(exports, "ticks", {
  enumerable: true,
  get: function () {
    return _ticks.default;
  }
});
Object.defineProperty(exports, "tickIncrement", {
  enumerable: true,
  get: function () {
    return _ticks.tickIncrement;
  }
});
Object.defineProperty(exports, "tickStep", {
  enumerable: true,
  get: function () {
    return _ticks.tickStep;
  }
});
Object.defineProperty(exports, "transpose", {
  enumerable: true,
  get: function () {
    return _transpose.default;
  }
});
Object.defineProperty(exports, "variance", {
  enumerable: true,
  get: function () {
    return _variance.default;
  }
});
Object.defineProperty(exports, "zip", {
  enumerable: true,
  get: function () {
    return _zip.default;
  }
});

var _bisect = _interopRequireWildcard(require("./bisect"));

var _ascending = _interopRequireDefault(require("./ascending"));

var _bisector = _interopRequireDefault(require("./bisector"));

var _cross = _interopRequireDefault(require("./cross"));

var _descending = _interopRequireDefault(require("./descending"));

var _deviation = _interopRequireDefault(require("./deviation"));

var _extent = _interopRequireDefault(require("./extent"));

var _histogram = _interopRequireDefault(require("./histogram"));

var _freedmanDiaconis = _interopRequireDefault(require("./threshold/freedmanDiaconis"));

var _scott = _interopRequireDefault(require("./threshold/scott"));

var _sturges = _interopRequireDefault(require("./threshold/sturges"));

var _max = _interopRequireDefault(require("./max"));

var _mean = _interopRequireDefault(require("./mean"));

var _median = _interopRequireDefault(require("./median"));

var _merge = _interopRequireDefault(require("./merge"));

var _min = _interopRequireDefault(require("./min"));

var _pairs = _interopRequireDefault(require("./pairs"));

var _permute = _interopRequireDefault(require("./permute"));

var _quantile = _interopRequireDefault(require("./quantile"));

var _range = _interopRequireDefault(require("./range"));

var _scan = _interopRequireDefault(require("./scan"));

var _shuffle = _interopRequireDefault(require("./shuffle"));

var _sum = _interopRequireDefault(require("./sum"));

var _ticks = _interopRequireWildcard(require("./ticks"));

var _transpose = _interopRequireDefault(require("./transpose"));

var _variance = _interopRequireDefault(require("./variance"));

var _zip = _interopRequireDefault(require("./zip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./bisect":"node_modules/d3-array/src/bisect.js","./ascending":"node_modules/d3-array/src/ascending.js","./bisector":"node_modules/d3-array/src/bisector.js","./cross":"node_modules/d3-array/src/cross.js","./descending":"node_modules/d3-array/src/descending.js","./deviation":"node_modules/d3-array/src/deviation.js","./extent":"node_modules/d3-array/src/extent.js","./histogram":"node_modules/d3-array/src/histogram.js","./threshold/freedmanDiaconis":"node_modules/d3-array/src/threshold/freedmanDiaconis.js","./threshold/scott":"node_modules/d3-array/src/threshold/scott.js","./threshold/sturges":"node_modules/d3-array/src/threshold/sturges.js","./max":"node_modules/d3-array/src/max.js","./mean":"node_modules/d3-array/src/mean.js","./median":"node_modules/d3-array/src/median.js","./merge":"node_modules/d3-array/src/merge.js","./min":"node_modules/d3-array/src/min.js","./pairs":"node_modules/d3-array/src/pairs.js","./permute":"node_modules/d3-array/src/permute.js","./quantile":"node_modules/d3-array/src/quantile.js","./range":"node_modules/d3-array/src/range.js","./scan":"node_modules/d3-array/src/scan.js","./shuffle":"node_modules/d3-array/src/shuffle.js","./sum":"node_modules/d3-array/src/sum.js","./ticks":"node_modules/d3-array/src/ticks.js","./transpose":"node_modules/d3-array/src/transpose.js","./variance":"node_modules/d3-array/src/variance.js","./zip":"node_modules/d3-array/src/zip.js"}],"node_modules/d3-scale/src/init.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRange = initRange;
exports.initInterpolator = initInterpolator;

function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;

    case 1:
      this.range(domain);
      break;

    default:
      this.range(range).domain(domain);
      break;
  }

  return this;
}

function initInterpolator(domain, interpolator) {
  switch (arguments.length) {
    case 0:
      break;

    case 1:
      this.interpolator(domain);
      break;

    default:
      this.interpolator(interpolator).domain(domain);
      break;
  }

  return this;
}
},{}],"node_modules/d3-collection/src/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.prefix = void 0;
var prefix = "$";
exports.prefix = prefix;

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function (key) {
    return prefix + key in this;
  },
  get: function (key) {
    return this[prefix + key];
  },
  set: function (key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function (key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function () {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function () {
    var keys = [];

    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));

    return keys;
  },
  values: function () {
    var values = [];

    for (var property in this) if (property[0] === prefix) values.push(this[property]);

    return values;
  },
  entries: function () {
    var entries = [];

    for (var property in this) if (property[0] === prefix) entries.push({
      key: property.slice(1),
      value: this[property]
    });

    return entries;
  },
  size: function () {
    var size = 0;

    for (var property in this) if (property[0] === prefix) ++size;

    return size;
  },
  empty: function () {
    for (var property in this) if (property[0] === prefix) return false;

    return true;
  },
  each: function (f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map(); // Copy constructor.

  if (object instanceof Map) object.each(function (value, key) {
    map.set(key, value);
  }); // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;
      if (f == null) while (++i < n) map.set(i, object[i]);else while (++i < n) map.set(f(o = object[i], i, object), o);
    } // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);
  return map;
}

var _default = map;
exports.default = _default;
},{}],"node_modules/d3-collection/src/nest.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _map = _interopRequireDefault(require("./map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = (0, _map.default)(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function (values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });
    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array,
        sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();else array = [], map.each(function (v, k) {
      array.push({
        key: k,
        values: entries(v, depth)
      });
    });
    return sortKey != null ? array.sort(function (a, b) {
      return sortKey(a.key, b.key);
    }) : array;
  }

  return nest = {
    object: function (array) {
      return apply(array, 0, createObject, setObject);
    },
    map: function (array) {
      return apply(array, 0, createMap, setMap);
    },
    entries: function (array) {
      return entries(apply(array, 0, createMap, setMap), 0);
    },
    key: function (d) {
      keys.push(d);
      return nest;
    },
    sortKeys: function (order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    },
    sortValues: function (order) {
      sortValues = order;
      return nest;
    },
    rollup: function (f) {
      rollup = f;
      return nest;
    }
  };
}

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return (0, _map.default)();
}

function setMap(map, key, value) {
  map.set(key, value);
}
},{"./map":"node_modules/d3-collection/src/map.js"}],"node_modules/d3-collection/src/set.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireWildcard(require("./map"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Set() {}

var proto = _map.default.prototype;
Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function (value) {
    value += "";
    this[_map.prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set(); // Copy constructor.

  if (object instanceof Set) object.each(function (value) {
    set.add(value);
  }); // Otherwise, assume it’s an array.
  else if (object) {
      var i = -1,
          n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);else while (++i < n) set.add(f(object[i], i, object));
    }
  return set;
}

var _default = set;
exports.default = _default;
},{"./map":"node_modules/d3-collection/src/map.js"}],"node_modules/d3-collection/src/keys.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var keys = [];

  for (var key in map) keys.push(key);

  return keys;
}
},{}],"node_modules/d3-collection/src/values.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var values = [];

  for (var key in map) values.push(map[key]);

  return values;
}
},{}],"node_modules/d3-collection/src/entries.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var entries = [];

  for (var key in map) entries.push({
    key: key,
    value: map[key]
  });

  return entries;
}
},{}],"node_modules/d3-collection/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "nest", {
  enumerable: true,
  get: function () {
    return _nest.default;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function () {
    return _map.default;
  }
});
Object.defineProperty(exports, "keys", {
  enumerable: true,
  get: function () {
    return _keys.default;
  }
});
Object.defineProperty(exports, "values", {
  enumerable: true,
  get: function () {
    return _values.default;
  }
});
Object.defineProperty(exports, "entries", {
  enumerable: true,
  get: function () {
    return _entries.default;
  }
});

var _nest = _interopRequireDefault(require("./nest"));

var _set = _interopRequireDefault(require("./set"));

var _map = _interopRequireDefault(require("./map"));

var _keys = _interopRequireDefault(require("./keys"));

var _values = _interopRequireDefault(require("./values"));

var _entries = _interopRequireDefault(require("./entries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nest":"node_modules/d3-collection/src/nest.js","./set":"node_modules/d3-collection/src/set.js","./map":"node_modules/d3-collection/src/map.js","./keys":"node_modules/d3-collection/src/keys.js","./values":"node_modules/d3-collection/src/values.js","./entries":"node_modules/d3-collection/src/entries.js"}],"node_modules/d3-scale/src/array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = exports.map = void 0;
var array = Array.prototype;
var map = array.map;
exports.map = map;
var slice = array.slice;
exports.slice = slice;
},{}],"node_modules/d3-scale/src/ordinal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ordinal;
exports.implicit = void 0;

var _d3Collection = require("d3-collection");

var _array = require("./array");

var _init = require("./init");

var implicit = {
  name: "implicit"
};
exports.implicit = implicit;

function ordinal() {
  var index = (0, _d3Collection.map)(),
      domain = [],
      range = [],
      unknown = implicit;

  function scale(d) {
    var key = d + "",
        i = index.get(key);

    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }

    return range[(i - 1) % range.length];
  }

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = (0, _d3Collection.map)();
    var i = -1,
        n = _.length,
        d,
        key;

    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));

    return scale;
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), scale) : range.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return ordinal(domain, range).unknown(unknown);
  };

  _init.initRange.apply(scale, arguments);

  return scale;
}
},{"d3-collection":"node_modules/d3-collection/src/index.js","./array":"node_modules/d3-scale/src/array.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/band.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = band;
exports.point = point;

var _d3Array = require("d3-array");

var _init = require("./init");

var _ordinal = _interopRequireDefault(require("./ordinal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function band() {
  var scale = (0, _ordinal.default)().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;
  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = (0, _d3Array.range)(n).map(function (i) {
      return start + step * i;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function (_) {
    return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function () {
    return bandwidth;
  };

  scale.step = function () {
    return step;
  };

  scale.round = function (_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function (_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };

  scale.paddingInner = function (_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };

  scale.paddingOuter = function (_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.align = function (_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function () {
    return band(domain(), range).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };

  return _init.initRange.apply(rescale(), arguments);
}

function pointish(scale) {
  var copy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function () {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}
},{"d3-array":"node_modules/d3-array/src/index.js","./init":"node_modules/d3-scale/src/init.js","./ordinal":"node_modules/d3-scale/src/ordinal.js"}],"node_modules/d3-color/src/define.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.extend = extend;

function _default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);

  for (var key in definition) prototype[key] = definition[key];

  return prototype;
}
},{}],"node_modules/d3-color/src/color.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = Color;
exports.default = color;
exports.rgbConvert = rgbConvert;
exports.rgb = rgb;
exports.Rgb = Rgb;
exports.hslConvert = hslConvert;
exports.hsl = hsl;
exports.brighter = exports.darker = void 0;

var _define = _interopRequireWildcard(require("./define.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Color() {}

var darker = 0.7;
exports.darker = darker;
var brighter = 1 / darker;
exports.brighter = brighter;
var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};
(0, _define.default)(Color, color, {
  copy: function (channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function () {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
  : l === 3 ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  : l === 8 ? new Rgb(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
  : l === 4 ? new Rgb(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, ((m & 0xf) << 4 | m & 0xf) / 0xff) // #f000
  : null // invalid hex
  ) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
  : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Rgb, rgb, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function () {
    return this;
  },
  displayable: function () {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity;
  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;

  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Hsl, hsl, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function () {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl: function () {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
  }
}));
/* From FvD 13.37, CSS Color Module Level 3 */

function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
},{"./define.js":"node_modules/d3-color/src/define.js"}],"node_modules/d3-color/src/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rad2deg = exports.deg2rad = void 0;
var deg2rad = Math.PI / 180;
exports.deg2rad = deg2rad;
var rad2deg = 180 / Math.PI;
exports.rad2deg = rad2deg;
},{}],"node_modules/d3-color/src/lab.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gray = gray;
exports.default = lab;
exports.Lab = Lab;
exports.lch = lch;
exports.hcl = hcl;
exports.Hcl = Hcl;

var _define = _interopRequireWildcard(require("./define.js"));

var _color = require("./color.js");

var _math = require("./math.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// https://observablehq.com/@mbostock/lab-and-rgb
var K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) return hcl2lab(o);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn),
      x,
      z;
  if (r === g && g === b) x = z = y;else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Lab, lab, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function (k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function () {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new _color.Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);

  var h = Math.atan2(o.b, o.a) * _math.rad2deg;

  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function lch(l, c, h, opacity) {
  return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

function hcl2lab(o) {
  if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * _math.deg2rad;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}

(0, _define.default)(Hcl, hcl, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker: function (k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb: function () {
    return hcl2lab(this).rgb();
  }
}));
},{"./define.js":"node_modules/d3-color/src/define.js","./color.js":"node_modules/d3-color/src/color.js","./math.js":"node_modules/d3-color/src/math.js"}],"node_modules/d3-color/src/cubehelix.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cubehelix;
exports.Cubehelix = Cubehelix;

var _define = _interopRequireWildcard(require("./define.js"));

var _color = require("./color.js");

var _math = require("./math.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * _math.rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Cubehelix, cubehelix, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    k = k == null ? _color.brighter : Math.pow(_color.brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? _color.darker : Math.pow(_color.darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * _math.deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new _color.Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));
},{"./define.js":"node_modules/d3-color/src/define.js","./color.js":"node_modules/d3-color/src/color.js","./math.js":"node_modules/d3-color/src/math.js"}],"node_modules/d3-color/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "color", {
  enumerable: true,
  get: function () {
    return _color.default;
  }
});
Object.defineProperty(exports, "rgb", {
  enumerable: true,
  get: function () {
    return _color.rgb;
  }
});
Object.defineProperty(exports, "hsl", {
  enumerable: true,
  get: function () {
    return _color.hsl;
  }
});
Object.defineProperty(exports, "lab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "hcl", {
  enumerable: true,
  get: function () {
    return _lab.hcl;
  }
});
Object.defineProperty(exports, "lch", {
  enumerable: true,
  get: function () {
    return _lab.lch;
  }
});
Object.defineProperty(exports, "gray", {
  enumerable: true,
  get: function () {
    return _lab.gray;
  }
});
Object.defineProperty(exports, "cubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});

var _color = _interopRequireWildcard(require("./color.js"));

var _lab = _interopRequireWildcard(require("./lab.js"));

var _cubehelix = _interopRequireDefault(require("./cubehelix.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./color.js":"node_modules/d3-color/src/color.js","./lab.js":"node_modules/d3-color/src/lab.js","./cubehelix.js":"node_modules/d3-color/src/cubehelix.js"}],"node_modules/d3-interpolate/src/basis.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basis = basis;
exports.default = _default;

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1,
      t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}

function _default(values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}
},{}],"node_modules/d3-interpolate/src/basisClosed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _basis = require("./basis.js");

function _default(values) {
  var n = values.length;
  return function (t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return (0, _basis.basis)((t - i / n) * n, v0, v1, v2, v3);
  };
}
},{"./basis.js":"node_modules/d3-interpolate/src/basis.js"}],"node_modules/d3-interpolate/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"node_modules/d3-interpolate/src/color.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hue = hue;
exports.gamma = gamma;
exports.default = nogamma;

var _constant = _interopRequireDefault(require("./constant.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linear(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0, _constant.default)(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : (0, _constant.default)(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : (0, _constant.default)(isNaN(a) ? b : a);
}
},{"./constant.js":"node_modules/d3-interpolate/src/constant.js"}],"node_modules/d3-interpolate/src/rgb.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbBasisClosed = exports.rgbBasis = exports.default = void 0;

var _d3Color = require("d3-color");

var _basis = _interopRequireDefault(require("./basis.js"));

var _basisClosed = _interopRequireDefault(require("./basisClosed.js"));

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function rgbGamma(y) {
  var color = (0, _color.gamma)(y);

  function rgb(start, end) {
    var r = color((start = (0, _d3Color.rgb)(start)).r, (end = (0, _d3Color.rgb)(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;
  return rgb;
}(1);

exports.default = _default;

function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i,
        color;

    for (i = 0; i < n; ++i) {
      color = (0, _d3Color.rgb)(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }

    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function (t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(_basis.default);
exports.rgbBasis = rgbBasis;
var rgbBasisClosed = rgbSpline(_basisClosed.default);
exports.rgbBasisClosed = rgbBasisClosed;
},{"d3-color":"node_modules/d3-color/src/index.js","./basis.js":"node_modules/d3-interpolate/src/basis.js","./basisClosed.js":"node_modules/d3-interpolate/src/basisClosed.js","./color.js":"node_modules/d3-interpolate/src/color.js"}],"node_modules/d3-interpolate/src/numberArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.isNumberArray = isNumberArray;

function _default(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0,
      c = b.slice(),
      i;
  return function (t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;

    return c;
  };
}

function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
},{}],"node_modules/d3-interpolate/src/array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.genericArray = genericArray;

var _value = _interopRequireDefault(require("./value.js"));

var _numberArray = _interopRequireWildcard(require("./numberArray.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  return ((0, _numberArray.isNumberArray)(b) ? _numberArray.default : genericArray)(a, b);
}

function genericArray(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = (0, _value.default)(a[i], b[i]);

  for (; i < nb; ++i) c[i] = b[i];

  return function (t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);

    return c;
  };
}
},{"./value.js":"node_modules/d3-interpolate/src/value.js","./numberArray.js":"node_modules/d3-interpolate/src/numberArray.js"}],"node_modules/d3-interpolate/src/date.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  var d = new Date();
  return a = +a, b = +b, function (t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}
},{}],"node_modules/d3-interpolate/src/number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b = +b, function (t) {
    return a * (1 - t) + b * t;
  };
}
},{}],"node_modules/d3-interpolate/src/object.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _value = _interopRequireDefault(require("./value.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var i = {},
      c = {},
      k;
  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = (0, _value.default)(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function (t) {
    for (k in i) c[k] = i[k](t);

    return c;
  };
}
},{"./value.js":"node_modules/d3-interpolate/src/value.js"}],"node_modules/d3-interpolate/src/string.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

function _default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators
  // Coerce inputs to strings.

  a = a + "", b = b + ""; // Interpolate pairs of numbers in a & b.

  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({
        i: i,
        x: (0, _number.default)(am, bm)
      });
    }

    bi = reB.lastIndex;
  } // Add remains of b.


  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  } // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.


  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);

    return s.join("");
  });
}
},{"./number.js":"node_modules/d3-interpolate/src/number.js"}],"node_modules/d3-interpolate/src/value.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _rgb = _interopRequireDefault(require("./rgb.js"));

var _array = require("./array.js");

var _date = _interopRequireDefault(require("./date.js"));

var _number = _interopRequireDefault(require("./number.js"));

var _object = _interopRequireDefault(require("./object.js"));

var _string = _interopRequireDefault(require("./string.js"));

var _constant = _interopRequireDefault(require("./constant.js"));

var _numberArray = _interopRequireWildcard(require("./numberArray.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var t = typeof b,
      c;
  return b == null || t === "boolean" ? (0, _constant.default)(b) : (t === "number" ? _number.default : t === "string" ? (c = (0, _d3Color.color)(b)) ? (b = c, _rgb.default) : _string.default : b instanceof _d3Color.color ? _rgb.default : b instanceof Date ? _date.default : (0, _numberArray.isNumberArray)(b) ? _numberArray.default : Array.isArray(b) ? _array.genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? _object.default : _number.default)(a, b);
}
},{"d3-color":"node_modules/d3-color/src/index.js","./rgb.js":"node_modules/d3-interpolate/src/rgb.js","./array.js":"node_modules/d3-interpolate/src/array.js","./date.js":"node_modules/d3-interpolate/src/date.js","./number.js":"node_modules/d3-interpolate/src/number.js","./object.js":"node_modules/d3-interpolate/src/object.js","./string.js":"node_modules/d3-interpolate/src/string.js","./constant.js":"node_modules/d3-interpolate/src/constant.js","./numberArray.js":"node_modules/d3-interpolate/src/numberArray.js"}],"node_modules/d3-interpolate/src/discrete.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}
},{}],"node_modules/d3-interpolate/src/hue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _color = require("./color.js");

function _default(a, b) {
  var i = (0, _color.hue)(+a, +b);
  return function (t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
}
},{"./color.js":"node_modules/d3-interpolate/src/color.js"}],"node_modules/d3-interpolate/src/round.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b = +b, function (t) {
    return Math.round(a * (1 - t) + b * t);
  };
}
},{}],"node_modules/d3-interpolate/src/transform/decompose.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.identity = void 0;
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
exports.identity = identity;

function _default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}
},{}],"node_modules/d3-interpolate/src/transform/parse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCss = parseCss;
exports.parseSvg = parseSvg;

var _decompose = _interopRequireWildcard(require("./decompose.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var cssNode, cssRoot, cssView, svgNode;

function parseCss(value) {
  if (value === "none") return _decompose.identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return (0, _decompose.default)(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return _decompose.identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return _decompose.identity;
  value = value.matrix;
  return (0, _decompose.default)(value.a, value.b, value.c, value.d, value.e, value.f);
}
},{"./decompose.js":"node_modules/d3-interpolate/src/transform/decompose.js"}],"node_modules/d3-interpolate/src/transform/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interpolateTransformSvg = exports.interpolateTransformCss = void 0;

var _number = _interopRequireDefault(require("../number.js"));

var _parse = require("./parse.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path

      q.push({
        i: s.push(pop(s) + "rotate(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({
        i: s.push(pop(s) + "skewX(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function (a, b) {
    var s = [],
        // string constants and placeholders
    q = []; // number interpolators

    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc

    return function (t) {
      var i = -1,
          n = q.length,
          o;

      while (++i < n) s[(o = q[i]).i] = o.x(t);

      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(_parse.parseCss, "px, ", "px)", "deg)");
exports.interpolateTransformCss = interpolateTransformCss;
var interpolateTransformSvg = interpolateTransform(_parse.parseSvg, ", ", ")", ")");
exports.interpolateTransformSvg = interpolateTransformSvg;
},{"../number.js":"node_modules/d3-interpolate/src/number.js","./parse.js":"node_modules/d3-interpolate/src/transform/parse.js"}],"node_modules/d3-interpolate/src/zoom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
} // p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]


function _default(p0, p1) {
  var ux0 = p0[0],
      uy0 = p0[1],
      w0 = p0[2],
      ux1 = p1[0],
      uy1 = p1[1],
      w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S; // Special case for u0 ≅ u1.

  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;

    i = function (t) {
      return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    };
  } // General case.
  else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;

      i = function (t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
      };
    }

  i.duration = S * 1000;
  return i;
}
},{}],"node_modules/d3-interpolate/src/hsl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function hsl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hsl)(start)).h, (end = (0, _d3Color.hsl)(end)).h),
        s = (0, _color.default)(start.s, end.s),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hsl(_color.hue);

exports.default = _default;
var hslLong = hsl(_color.default);
exports.hslLong = hslLong;
},{"d3-color":"node_modules/d3-color/src/index.js","./color.js":"node_modules/d3-interpolate/src/color.js"}],"node_modules/d3-interpolate/src/lab.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lab;

var _d3Color = require("d3-color");

var _color = _interopRequireDefault(require("./color.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lab(start, end) {
  var l = (0, _color.default)((start = (0, _d3Color.lab)(start)).l, (end = (0, _d3Color.lab)(end)).l),
      a = (0, _color.default)(start.a, end.a),
      b = (0, _color.default)(start.b, end.b),
      opacity = (0, _color.default)(start.opacity, end.opacity);
  return function (t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}
},{"d3-color":"node_modules/d3-color/src/index.js","./color.js":"node_modules/d3-interpolate/src/color.js"}],"node_modules/d3-interpolate/src/hcl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hclLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function hcl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hcl)(start)).h, (end = (0, _d3Color.hcl)(end)).h),
        c = (0, _color.default)(start.c, end.c),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hcl(_color.hue);

exports.default = _default;
var hclLong = hcl(_color.default);
exports.hclLong = hclLong;
},{"d3-color":"node_modules/d3-color/src/index.js","./color.js":"node_modules/d3-interpolate/src/color.js"}],"node_modules/d3-interpolate/src/cubehelix.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubehelixLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function cubehelix(hue) {
  return function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = (0, _d3Color.cubehelix)(start)).h, (end = (0, _d3Color.cubehelix)(end)).h),
          s = (0, _color.default)(start.s, end.s),
          l = (0, _color.default)(start.l, end.l),
          opacity = (0, _color.default)(start.opacity, end.opacity);
      return function (t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;
    return cubehelix;
  }(1);
}

var _default = cubehelix(_color.hue);

exports.default = _default;
var cubehelixLong = cubehelix(_color.default);
exports.cubehelixLong = cubehelixLong;
},{"d3-color":"node_modules/d3-color/src/index.js","./color.js":"node_modules/d3-interpolate/src/color.js"}],"node_modules/d3-interpolate/src/piecewise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = piecewise;

function piecewise(interpolate, values) {
  var i = 0,
      n = values.length - 1,
      v = values[0],
      I = new Array(n < 0 ? 0 : n);

  while (i < n) I[i] = interpolate(v, v = values[++i]);

  return function (t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}
},{}],"node_modules/d3-interpolate/src/quantize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(interpolator, n) {
  var samples = new Array(n);

  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));

  return samples;
}
},{}],"node_modules/d3-interpolate/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "interpolate", {
  enumerable: true,
  get: function () {
    return _value.default;
  }
});
Object.defineProperty(exports, "interpolateArray", {
  enumerable: true,
  get: function () {
    return _array.default;
  }
});
Object.defineProperty(exports, "interpolateBasis", {
  enumerable: true,
  get: function () {
    return _basis.default;
  }
});
Object.defineProperty(exports, "interpolateBasisClosed", {
  enumerable: true,
  get: function () {
    return _basisClosed.default;
  }
});
Object.defineProperty(exports, "interpolateDate", {
  enumerable: true,
  get: function () {
    return _date.default;
  }
});
Object.defineProperty(exports, "interpolateDiscrete", {
  enumerable: true,
  get: function () {
    return _discrete.default;
  }
});
Object.defineProperty(exports, "interpolateHue", {
  enumerable: true,
  get: function () {
    return _hue.default;
  }
});
Object.defineProperty(exports, "interpolateNumber", {
  enumerable: true,
  get: function () {
    return _number.default;
  }
});
Object.defineProperty(exports, "interpolateNumberArray", {
  enumerable: true,
  get: function () {
    return _numberArray.default;
  }
});
Object.defineProperty(exports, "interpolateObject", {
  enumerable: true,
  get: function () {
    return _object.default;
  }
});
Object.defineProperty(exports, "interpolateRound", {
  enumerable: true,
  get: function () {
    return _round.default;
  }
});
Object.defineProperty(exports, "interpolateString", {
  enumerable: true,
  get: function () {
    return _string.default;
  }
});
Object.defineProperty(exports, "interpolateTransformCss", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformCss;
  }
});
Object.defineProperty(exports, "interpolateTransformSvg", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformSvg;
  }
});
Object.defineProperty(exports, "interpolateZoom", {
  enumerable: true,
  get: function () {
    return _zoom.default;
  }
});
Object.defineProperty(exports, "interpolateRgb", {
  enumerable: true,
  get: function () {
    return _rgb.default;
  }
});
Object.defineProperty(exports, "interpolateRgbBasis", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasis;
  }
});
Object.defineProperty(exports, "interpolateRgbBasisClosed", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasisClosed;
  }
});
Object.defineProperty(exports, "interpolateHsl", {
  enumerable: true,
  get: function () {
    return _hsl.default;
  }
});
Object.defineProperty(exports, "interpolateHslLong", {
  enumerable: true,
  get: function () {
    return _hsl.hslLong;
  }
});
Object.defineProperty(exports, "interpolateLab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "interpolateHcl", {
  enumerable: true,
  get: function () {
    return _hcl.default;
  }
});
Object.defineProperty(exports, "interpolateHclLong", {
  enumerable: true,
  get: function () {
    return _hcl.hclLong;
  }
});
Object.defineProperty(exports, "interpolateCubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});
Object.defineProperty(exports, "interpolateCubehelixLong", {
  enumerable: true,
  get: function () {
    return _cubehelix.cubehelixLong;
  }
});
Object.defineProperty(exports, "piecewise", {
  enumerable: true,
  get: function () {
    return _piecewise.default;
  }
});
Object.defineProperty(exports, "quantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});

var _value = _interopRequireDefault(require("./value.js"));

var _array = _interopRequireDefault(require("./array.js"));

var _basis = _interopRequireDefault(require("./basis.js"));

var _basisClosed = _interopRequireDefault(require("./basisClosed.js"));

var _date = _interopRequireDefault(require("./date.js"));

var _discrete = _interopRequireDefault(require("./discrete.js"));

var _hue = _interopRequireDefault(require("./hue.js"));

var _number = _interopRequireDefault(require("./number.js"));

var _numberArray = _interopRequireDefault(require("./numberArray.js"));

var _object = _interopRequireDefault(require("./object.js"));

var _round = _interopRequireDefault(require("./round.js"));

var _string = _interopRequireDefault(require("./string.js"));

var _index = require("./transform/index.js");

var _zoom = _interopRequireDefault(require("./zoom.js"));

var _rgb = _interopRequireWildcard(require("./rgb.js"));

var _hsl = _interopRequireWildcard(require("./hsl.js"));

var _lab = _interopRequireDefault(require("./lab.js"));

var _hcl = _interopRequireWildcard(require("./hcl.js"));

var _cubehelix = _interopRequireWildcard(require("./cubehelix.js"));

var _piecewise = _interopRequireDefault(require("./piecewise.js"));

var _quantize = _interopRequireDefault(require("./quantize.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./value.js":"node_modules/d3-interpolate/src/value.js","./array.js":"node_modules/d3-interpolate/src/array.js","./basis.js":"node_modules/d3-interpolate/src/basis.js","./basisClosed.js":"node_modules/d3-interpolate/src/basisClosed.js","./date.js":"node_modules/d3-interpolate/src/date.js","./discrete.js":"node_modules/d3-interpolate/src/discrete.js","./hue.js":"node_modules/d3-interpolate/src/hue.js","./number.js":"node_modules/d3-interpolate/src/number.js","./numberArray.js":"node_modules/d3-interpolate/src/numberArray.js","./object.js":"node_modules/d3-interpolate/src/object.js","./round.js":"node_modules/d3-interpolate/src/round.js","./string.js":"node_modules/d3-interpolate/src/string.js","./transform/index.js":"node_modules/d3-interpolate/src/transform/index.js","./zoom.js":"node_modules/d3-interpolate/src/zoom.js","./rgb.js":"node_modules/d3-interpolate/src/rgb.js","./hsl.js":"node_modules/d3-interpolate/src/hsl.js","./lab.js":"node_modules/d3-interpolate/src/lab.js","./hcl.js":"node_modules/d3-interpolate/src/hcl.js","./cubehelix.js":"node_modules/d3-interpolate/src/cubehelix.js","./piecewise.js":"node_modules/d3-interpolate/src/piecewise.js","./quantize.js":"node_modules/d3-interpolate/src/quantize.js"}],"node_modules/d3-scale/src/constant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"node_modules/d3-scale/src/number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return +x;
}
},{}],"node_modules/d3-scale/src/continuous.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = identity;
exports.copy = copy;
exports.transformer = transformer;
exports.default = continuous;

var _d3Array = require("d3-array");

var _d3Interpolate = require("d3-interpolate");

var _array = require("./array");

var _constant = _interopRequireDefault(require("./constant"));

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unit = [0, 1];

function identity(x) {
  return x;
}

function normalize(a, b) {
  return (b -= a = +a) ? function (x) {
    return (x - a) / b;
  } : (0, _constant.default)(isNaN(b) ? NaN : 0.5);
}

function clamper(domain) {
  var a = domain[0],
      b = domain[domain.length - 1],
      t;
  if (a > b) t = a, a = b, b = t;
  return function (x) {
    return Math.max(a, Math.min(b, x));
  };
} // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].


function bimap(domain, range, interpolate) {
  var d0 = domain[0],
      d1 = domain[1],
      r0 = range[0],
      r1 = range[1];
  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
  return function (x) {
    return r0(d0(x));
  };
}

function polymap(domain, range, interpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1; // Reverse descending domains.

  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range[i], range[i + 1]);
  }

  return function (x) {
    var i = (0, _d3Array.bisect)(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}

function transformer() {
  var domain = unit,
      range = unit,
      interpolate = _d3Interpolate.interpolate,
      transform,
      untransform,
      unknown,
      clamp = identity,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
  }

  scale.invert = function (y) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), _d3Interpolate.interpolateNumber)))(y)));
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = _array.map.call(_, _number.default), clamp === identity || (clamp = clamper(domain)), rescale()) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = _array.slice.call(_), interpolate = _d3Interpolate.interpolateRound, rescale();
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = _ ? clamper(domain) : identity, scale) : clamp !== identity;
  };

  scale.interpolate = function (_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function (t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}

function continuous(transform, untransform) {
  return transformer()(transform, untransform);
}
},{"d3-array":"node_modules/d3-array/src/index.js","d3-interpolate":"node_modules/d3-interpolate/src/index.js","./array":"node_modules/d3-scale/src/array.js","./constant":"node_modules/d3-scale/src/constant.js","./number":"node_modules/d3-scale/src/number.js"}],"node_modules/d3-scale/src/tickFormat.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Array = require("d3-array");

var _d3Format = require("d3-format");

function _default(start, stop, count, specifier) {
  var step = (0, _d3Array.tickStep)(start, stop, count),
      precision;
  specifier = (0, _d3Format.formatSpecifier)(specifier == null ? ",f" : specifier);

  switch (specifier.type) {
    case "s":
      {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionPrefix)(step, value))) specifier.precision = precision;
        return (0, _d3Format.formatPrefix)(specifier, value);
      }

    case "":
    case "e":
    case "g":
    case "p":
    case "r":
      {
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionRound)(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }

    case "f":
    case "%":
      {
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionFixed)(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
  }

  return (0, _d3Format.format)(specifier);
}
},{"d3-array":"node_modules/d3-array/src/index.js","d3-format":"node_modules/d3-format/src/index.js"}],"node_modules/d3-scale/src/linear.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearish = linearish;
exports.default = linear;

var _d3Array = require("d3-array");

var _continuous = _interopRequireWildcard(require("./continuous"));

var _init = require("./init");

var _tickFormat = _interopRequireDefault(require("./tickFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function (count) {
    var d = domain();
    return (0, _d3Array.ticks)(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function (count, specifier) {
    var d = domain();
    return (0, _tickFormat.default)(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };

  scale.nice = function (count) {
    if (count == null) count = 10;
    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = (0, _d3Array.tickIncrement)(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = (0, _d3Array.tickIncrement)(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = (0, _d3Array.tickIncrement)(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = (0, _continuous.default)(_continuous.identity, _continuous.identity);

  scale.copy = function () {
    return (0, _continuous.copy)(scale, linear());
  };

  _init.initRange.apply(scale, arguments);

  return linearish(scale);
}
},{"d3-array":"node_modules/d3-array/src/index.js","./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js","./tickFormat":"node_modules/d3-scale/src/tickFormat.js"}],"node_modules/d3-scale/src/identity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = identity;

var _array = require("./array");

var _linear = require("./linear");

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function identity(domain) {
  var unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function (_) {
    return arguments.length ? (domain = _array.map.call(_, _number.default), scale) : domain.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return identity(domain).unknown(unknown);
  };

  domain = arguments.length ? _array.map.call(domain, _number.default) : [0, 1];
  return (0, _linear.linearish)(scale);
}
},{"./array":"node_modules/d3-scale/src/array.js","./linear":"node_modules/d3-scale/src/linear.js","./number":"node_modules/d3-scale/src/number.js"}],"node_modules/d3-scale/src/nice.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(domain, interval) {
  domain = domain.slice();
  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}
},{}],"node_modules/d3-scale/src/log.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggish = loggish;
exports.default = log;

var _d3Array = require("d3-array");

var _d3Format = require("d3-format");

var _nice = _interopRequireDefault(require("./nice"));

var _continuous = require("./continuous");

var _init = require("./init");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformLog(x) {
  return Math.log(x);
}

function transformExp(x) {
  return Math.exp(x);
}

function transformLogn(x) {
  return -Math.log(-x);
}

function transformExpn(x) {
  return -Math.exp(-x);
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    return Math.pow(base, x);
  };
}

function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    return Math.log(x) / base;
  });
}

function reflect(f) {
  return function (x) {
    return -f(-x);
  };
}

function loggish(transform) {
  var scale = transform(transformLog, transformExp),
      domain = scale.domain,
      base = 10,
      logs,
      pows;

  function rescale() {
    logs = logp(base), pows = powp(base);

    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }

    return scale;
  }

  scale.base = function (_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function (count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;
    if (r = v < u) i = u, u = v, v = i;
    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = (0, _d3Array.ticks)(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function (count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = (0, _d3Format.format)(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?

    return function (d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function () {
    return domain((0, _nice.default)(domain(), {
      floor: function (x) {
        return pows(Math.floor(logs(x)));
      },
      ceil: function (x) {
        return pows(Math.ceil(logs(x)));
      }
    }));
  };

  return scale;
}

function log() {
  var scale = loggish((0, _continuous.transformer)()).domain([1, 10]);

  scale.copy = function () {
    return (0, _continuous.copy)(scale, log()).base(scale.base());
  };

  _init.initRange.apply(scale, arguments);

  return scale;
}
},{"d3-array":"node_modules/d3-array/src/index.js","d3-format":"node_modules/d3-format/src/index.js","./nice":"node_modules/d3-scale/src/nice.js","./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/symlog.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.symlogish = symlogish;
exports.default = symlog;

var _linear = require("./linear");

var _continuous = require("./continuous");

var _init = require("./init");

function transformSymlog(c) {
  return function (x) {
    return Math.sign(x) * Math.log1p(Math.abs(x / c));
  };
}

function transformSymexp(c) {
  return function (x) {
    return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
  };
}

function symlogish(transform) {
  var c = 1,
      scale = transform(transformSymlog(c), transformSymexp(c));

  scale.constant = function (_) {
    return arguments.length ? transform(transformSymlog(c = +_), transformSymexp(c)) : c;
  };

  return (0, _linear.linearish)(scale);
}

function symlog() {
  var scale = symlogish((0, _continuous.transformer)());

  scale.copy = function () {
    return (0, _continuous.copy)(scale, symlog()).constant(scale.constant());
  };

  return _init.initRange.apply(scale, arguments);
}
},{"./linear":"node_modules/d3-scale/src/linear.js","./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/pow.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.powish = powish;
exports.default = pow;
exports.sqrt = sqrt;

var _linear = require("./linear");

var _continuous = require("./continuous");

var _init = require("./init");

function transformPow(exponent) {
  return function (x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}

function transformSqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

function transformSquare(x) {
  return x < 0 ? -x * x : x * x;
}

function powish(transform) {
  var scale = transform(_continuous.identity, _continuous.identity),
      exponent = 1;

  function rescale() {
    return exponent === 1 ? transform(_continuous.identity, _continuous.identity) : exponent === 0.5 ? transform(transformSqrt, transformSquare) : transform(transformPow(exponent), transformPow(1 / exponent));
  }

  scale.exponent = function (_) {
    return arguments.length ? (exponent = +_, rescale()) : exponent;
  };

  return (0, _linear.linearish)(scale);
}

function pow() {
  var scale = powish((0, _continuous.transformer)());

  scale.copy = function () {
    return (0, _continuous.copy)(scale, pow()).exponent(scale.exponent());
  };

  _init.initRange.apply(scale, arguments);

  return scale;
}

function sqrt() {
  return pow.apply(null, arguments).exponent(0.5);
}
},{"./linear":"node_modules/d3-scale/src/linear.js","./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/quantile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantile;

var _d3Array = require("d3-array");

var _array = require("./array");

var _init = require("./init");

function quantile() {
  var domain = [],
      range = [],
      thresholds = [],
      unknown;

  function rescale() {
    var i = 0,
        n = Math.max(1, range.length);
    thresholds = new Array(n - 1);

    while (++i < n) thresholds[i - 1] = (0, _d3Array.quantile)(domain, i / n);

    return scale;
  }

  function scale(x) {
    return isNaN(x = +x) ? unknown : range[(0, _d3Array.bisect)(thresholds, x)];
  }

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : [i > 0 ? thresholds[i - 1] : domain[0], i < thresholds.length ? thresholds[i] : domain[domain.length - 1]];
  };

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [];

    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);

    domain.sort(_d3Array.ascending);
    return rescale();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), rescale()) : range.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.quantiles = function () {
    return thresholds.slice();
  };

  scale.copy = function () {
    return quantile().domain(domain).range(range).unknown(unknown);
  };

  return _init.initRange.apply(scale, arguments);
}
},{"d3-array":"node_modules/d3-array/src/index.js","./array":"node_modules/d3-scale/src/array.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/quantize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantize;

var _d3Array = require("d3-array");

var _array = require("./array");

var _linear = require("./linear");

var _init = require("./init");

function quantize() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range = [0, 1],
      unknown;

  function scale(x) {
    return x <= x ? range[(0, _d3Array.bisect)(domain, x, 0, n)] : unknown;
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);

    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);

    return scale;
  }

  scale.domain = function (_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function (_) {
    return arguments.length ? (n = (range = _array.slice.call(_)).length - 1, rescale()) : range.slice();
  };

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : i < 1 ? [x0, domain[0]] : i >= n ? [domain[n - 1], x1] : [domain[i - 1], domain[i]];
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : scale;
  };

  scale.thresholds = function () {
    return domain.slice();
  };

  scale.copy = function () {
    return quantize().domain([x0, x1]).range(range).unknown(unknown);
  };

  return _init.initRange.apply((0, _linear.linearish)(scale), arguments);
}
},{"d3-array":"node_modules/d3-array/src/index.js","./array":"node_modules/d3-scale/src/array.js","./linear":"node_modules/d3-scale/src/linear.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/threshold.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = threshold;

var _d3Array = require("d3-array");

var _array = require("./array");

var _init = require("./init");

function threshold() {
  var domain = [0.5],
      range = [0, 1],
      unknown,
      n = 1;

  function scale(x) {
    return x <= x ? range[(0, _d3Array.bisect)(domain, x, 0, n)] : unknown;
  }

  scale.domain = function (_) {
    return arguments.length ? (domain = _array.slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
  };

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return threshold().domain(domain).range(range).unknown(unknown);
  };

  return _init.initRange.apply(scale, arguments);
}
},{"d3-array":"node_modules/d3-array/src/index.js","./array":"node_modules/d3-scale/src/array.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-time/src/interval.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newInterval;
var t0 = new Date(),
    t1 = new Date();

function newInterval(floori, offseti, count, field) {
  function interval(date) {
    return floori(date = arguments.length === 0 ? new Date() : new Date(+date)), date;
  }

  interval.floor = function (date) {
    return floori(date = new Date(+date)), date;
  };

  interval.ceil = function (date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function (date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function (date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function (start, stop, step) {
    var range = [],
        previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date

    do range.push(previous = new Date(+start)), offseti(start, step), floori(start); while (previous < start && start < stop);

    return range;
  };

  interval.filter = function (test) {
    return newInterval(function (date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function (date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty

        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty

        }
      }
    });
  };

  if (count) {
    interval.count = function (start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function (step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
        return field(d) % step === 0;
      } : function (d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }

  return interval;
}
},{}],"node_modules/d3-time/src/millisecond.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.milliseconds = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var millisecond = (0, _interval.default)(function () {// noop
}, function (date, step) {
  date.setTime(+date + step);
}, function (start, end) {
  return end - start;
}); // An optimized implementation for this simple case.

millisecond.every = function (k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return (0, _interval.default)(function (date) {
    date.setTime(Math.floor(date / k) * k);
  }, function (date, step) {
    date.setTime(+date + step * k);
  }, function (start, end) {
    return (end - start) / k;
  });
};

var _default = millisecond;
exports.default = _default;
var milliseconds = millisecond.range;
exports.milliseconds = milliseconds;
},{"./interval.js":"node_modules/d3-time/src/interval.js"}],"node_modules/d3-time/src/duration.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.durationWeek = exports.durationDay = exports.durationHour = exports.durationMinute = exports.durationSecond = void 0;
var durationSecond = 1e3;
exports.durationSecond = durationSecond;
var durationMinute = 6e4;
exports.durationMinute = durationMinute;
var durationHour = 36e5;
exports.durationHour = durationHour;
var durationDay = 864e5;
exports.durationDay = durationDay;
var durationWeek = 6048e5;
exports.durationWeek = durationWeek;
},{}],"node_modules/d3-time/src/second.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seconds = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var second = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds());
}, function (date, step) {
  date.setTime(+date + step * _duration.durationSecond);
}, function (start, end) {
  return (end - start) / _duration.durationSecond;
}, function (date) {
  return date.getUTCSeconds();
});
var _default = second;
exports.default = _default;
var seconds = second.range;
exports.seconds = seconds;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/minute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minutes = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var minute = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationMinute);
}, function (start, end) {
  return (end - start) / _duration.durationMinute;
}, function (date) {
  return date.getMinutes();
});
var _default = minute;
exports.default = _default;
var minutes = minute.range;
exports.minutes = minutes;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/hour.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hours = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hour = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond - date.getMinutes() * _duration.durationMinute);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationHour);
}, function (start, end) {
  return (end - start) / _duration.durationHour;
}, function (date) {
  return date.getHours();
});
var _default = hour;
exports.default = _default;
var hours = hour.range;
exports.hours = hours;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/day.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.days = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var day = (0, _interval.default)(function (date) {
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setDate(date.getDate() + step);
}, function (start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationDay;
}, function (date) {
  return date.getDate() - 1;
});
var _default = day;
exports.default = _default;
var days = day.range;
exports.days = days;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/week.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saturdays = exports.fridays = exports.thursdays = exports.wednesdays = exports.tuesdays = exports.mondays = exports.sundays = exports.saturday = exports.friday = exports.thursday = exports.wednesday = exports.tuesday = exports.monday = exports.sunday = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function weekday(i) {
  return (0, _interval.default)(function (date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationWeek;
  });
}

var sunday = weekday(0);
exports.sunday = sunday;
var monday = weekday(1);
exports.monday = monday;
var tuesday = weekday(2);
exports.tuesday = tuesday;
var wednesday = weekday(3);
exports.wednesday = wednesday;
var thursday = weekday(4);
exports.thursday = thursday;
var friday = weekday(5);
exports.friday = friday;
var saturday = weekday(6);
exports.saturday = saturday;
var sundays = sunday.range;
exports.sundays = sundays;
var mondays = monday.range;
exports.mondays = mondays;
var tuesdays = tuesday.range;
exports.tuesdays = tuesdays;
var wednesdays = wednesday.range;
exports.wednesdays = wednesdays;
var thursdays = thursday.range;
exports.thursdays = thursdays;
var fridays = friday.range;
exports.fridays = fridays;
var saturdays = saturday.range;
exports.saturdays = saturdays;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/month.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.months = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var month = (0, _interval.default)(function (date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setMonth(date.getMonth() + step);
}, function (start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function (date) {
  return date.getMonth();
});
var _default = month;
exports.default = _default;
var months = month.range;
exports.months = months;
},{"./interval.js":"node_modules/d3-time/src/interval.js"}],"node_modules/d3-time/src/year.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.years = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var year = (0, _interval.default)(function (date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function (start, end) {
  return end.getFullYear() - start.getFullYear();
}, function (date) {
  return date.getFullYear();
}); // An optimized implementation for this simple case.

year.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.default)(function (date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var _default = year;
exports.default = _default;
var years = year.range;
exports.years = years;
},{"./interval.js":"node_modules/d3-time/src/interval.js"}],"node_modules/d3-time/src/utcMinute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMinutes = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcMinute = (0, _interval.default)(function (date) {
  date.setUTCSeconds(0, 0);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationMinute);
}, function (start, end) {
  return (end - start) / _duration.durationMinute;
}, function (date) {
  return date.getUTCMinutes();
});
var _default = utcMinute;
exports.default = _default;
var utcMinutes = utcMinute.range;
exports.utcMinutes = utcMinutes;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/utcHour.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcHours = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcHour = (0, _interval.default)(function (date) {
  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationHour);
}, function (start, end) {
  return (end - start) / _duration.durationHour;
}, function (date) {
  return date.getUTCHours();
});
var _default = utcHour;
exports.default = _default;
var utcHours = utcHour.range;
exports.utcHours = utcHours;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/utcDay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcDays = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcDay = (0, _interval.default)(function (date) {
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  return (end - start) / _duration.durationDay;
}, function (date) {
  return date.getUTCDate() - 1;
});
var _default = utcDay;
exports.default = _default;
var utcDays = utcDay.range;
exports.utcDays = utcDays;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/utcWeek.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcSaturdays = exports.utcFridays = exports.utcThursdays = exports.utcWednesdays = exports.utcTuesdays = exports.utcMondays = exports.utcSundays = exports.utcSaturday = exports.utcFriday = exports.utcThursday = exports.utcWednesday = exports.utcTuesday = exports.utcMonday = exports.utcSunday = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function utcWeekday(i) {
  return (0, _interval.default)(function (date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function (start, end) {
    return (end - start) / _duration.durationWeek;
  });
}

var utcSunday = utcWeekday(0);
exports.utcSunday = utcSunday;
var utcMonday = utcWeekday(1);
exports.utcMonday = utcMonday;
var utcTuesday = utcWeekday(2);
exports.utcTuesday = utcTuesday;
var utcWednesday = utcWeekday(3);
exports.utcWednesday = utcWednesday;
var utcThursday = utcWeekday(4);
exports.utcThursday = utcThursday;
var utcFriday = utcWeekday(5);
exports.utcFriday = utcFriday;
var utcSaturday = utcWeekday(6);
exports.utcSaturday = utcSaturday;
var utcSundays = utcSunday.range;
exports.utcSundays = utcSundays;
var utcMondays = utcMonday.range;
exports.utcMondays = utcMondays;
var utcTuesdays = utcTuesday.range;
exports.utcTuesdays = utcTuesdays;
var utcWednesdays = utcWednesday.range;
exports.utcWednesdays = utcWednesdays;
var utcThursdays = utcThursday.range;
exports.utcThursdays = utcThursdays;
var utcFridays = utcFriday.range;
exports.utcFridays = utcFridays;
var utcSaturdays = utcSaturday.range;
exports.utcSaturdays = utcSaturdays;
},{"./interval.js":"node_modules/d3-time/src/interval.js","./duration.js":"node_modules/d3-time/src/duration.js"}],"node_modules/d3-time/src/utcMonth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMonths = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcMonth = (0, _interval.default)(function (date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function (start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function (date) {
  return date.getUTCMonth();
});
var _default = utcMonth;
exports.default = _default;
var utcMonths = utcMonth.range;
exports.utcMonths = utcMonths;
},{"./interval.js":"node_modules/d3-time/src/interval.js"}],"node_modules/d3-time/src/utcYear.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcYears = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcYear = (0, _interval.default)(function (date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function (start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function (date) {
  return date.getUTCFullYear();
}); // An optimized implementation for this simple case.

utcYear.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.default)(function (date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

var _default = utcYear;
exports.default = _default;
var utcYears = utcYear.range;
exports.utcYears = utcYears;
},{"./interval.js":"node_modules/d3-time/src/interval.js"}],"node_modules/d3-time/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeInterval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "timeMillisecond", {
  enumerable: true,
  get: function () {
    return _millisecond.default;
  }
});
Object.defineProperty(exports, "timeMilliseconds", {
  enumerable: true,
  get: function () {
    return _millisecond.milliseconds;
  }
});
Object.defineProperty(exports, "utcMillisecond", {
  enumerable: true,
  get: function () {
    return _millisecond.default;
  }
});
Object.defineProperty(exports, "utcMilliseconds", {
  enumerable: true,
  get: function () {
    return _millisecond.milliseconds;
  }
});
Object.defineProperty(exports, "timeSecond", {
  enumerable: true,
  get: function () {
    return _second.default;
  }
});
Object.defineProperty(exports, "timeSeconds", {
  enumerable: true,
  get: function () {
    return _second.seconds;
  }
});
Object.defineProperty(exports, "utcSecond", {
  enumerable: true,
  get: function () {
    return _second.default;
  }
});
Object.defineProperty(exports, "utcSeconds", {
  enumerable: true,
  get: function () {
    return _second.seconds;
  }
});
Object.defineProperty(exports, "timeMinute", {
  enumerable: true,
  get: function () {
    return _minute.default;
  }
});
Object.defineProperty(exports, "timeMinutes", {
  enumerable: true,
  get: function () {
    return _minute.minutes;
  }
});
Object.defineProperty(exports, "timeHour", {
  enumerable: true,
  get: function () {
    return _hour.default;
  }
});
Object.defineProperty(exports, "timeHours", {
  enumerable: true,
  get: function () {
    return _hour.hours;
  }
});
Object.defineProperty(exports, "timeDay", {
  enumerable: true,
  get: function () {
    return _day.default;
  }
});
Object.defineProperty(exports, "timeDays", {
  enumerable: true,
  get: function () {
    return _day.days;
  }
});
Object.defineProperty(exports, "timeWeek", {
  enumerable: true,
  get: function () {
    return _week.sunday;
  }
});
Object.defineProperty(exports, "timeWeeks", {
  enumerable: true,
  get: function () {
    return _week.sundays;
  }
});
Object.defineProperty(exports, "timeSunday", {
  enumerable: true,
  get: function () {
    return _week.sunday;
  }
});
Object.defineProperty(exports, "timeSundays", {
  enumerable: true,
  get: function () {
    return _week.sundays;
  }
});
Object.defineProperty(exports, "timeMonday", {
  enumerable: true,
  get: function () {
    return _week.monday;
  }
});
Object.defineProperty(exports, "timeMondays", {
  enumerable: true,
  get: function () {
    return _week.mondays;
  }
});
Object.defineProperty(exports, "timeTuesday", {
  enumerable: true,
  get: function () {
    return _week.tuesday;
  }
});
Object.defineProperty(exports, "timeTuesdays", {
  enumerable: true,
  get: function () {
    return _week.tuesdays;
  }
});
Object.defineProperty(exports, "timeWednesday", {
  enumerable: true,
  get: function () {
    return _week.wednesday;
  }
});
Object.defineProperty(exports, "timeWednesdays", {
  enumerable: true,
  get: function () {
    return _week.wednesdays;
  }
});
Object.defineProperty(exports, "timeThursday", {
  enumerable: true,
  get: function () {
    return _week.thursday;
  }
});
Object.defineProperty(exports, "timeThursdays", {
  enumerable: true,
  get: function () {
    return _week.thursdays;
  }
});
Object.defineProperty(exports, "timeFriday", {
  enumerable: true,
  get: function () {
    return _week.friday;
  }
});
Object.defineProperty(exports, "timeFridays", {
  enumerable: true,
  get: function () {
    return _week.fridays;
  }
});
Object.defineProperty(exports, "timeSaturday", {
  enumerable: true,
  get: function () {
    return _week.saturday;
  }
});
Object.defineProperty(exports, "timeSaturdays", {
  enumerable: true,
  get: function () {
    return _week.saturdays;
  }
});
Object.defineProperty(exports, "timeMonth", {
  enumerable: true,
  get: function () {
    return _month.default;
  }
});
Object.defineProperty(exports, "timeMonths", {
  enumerable: true,
  get: function () {
    return _month.months;
  }
});
Object.defineProperty(exports, "timeYear", {
  enumerable: true,
  get: function () {
    return _year.default;
  }
});
Object.defineProperty(exports, "timeYears", {
  enumerable: true,
  get: function () {
    return _year.years;
  }
});
Object.defineProperty(exports, "utcMinute", {
  enumerable: true,
  get: function () {
    return _utcMinute.default;
  }
});
Object.defineProperty(exports, "utcMinutes", {
  enumerable: true,
  get: function () {
    return _utcMinute.utcMinutes;
  }
});
Object.defineProperty(exports, "utcHour", {
  enumerable: true,
  get: function () {
    return _utcHour.default;
  }
});
Object.defineProperty(exports, "utcHours", {
  enumerable: true,
  get: function () {
    return _utcHour.utcHours;
  }
});
Object.defineProperty(exports, "utcDay", {
  enumerable: true,
  get: function () {
    return _utcDay.default;
  }
});
Object.defineProperty(exports, "utcDays", {
  enumerable: true,
  get: function () {
    return _utcDay.utcDays;
  }
});
Object.defineProperty(exports, "utcWeek", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSunday;
  }
});
Object.defineProperty(exports, "utcWeeks", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSundays;
  }
});
Object.defineProperty(exports, "utcSunday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSunday;
  }
});
Object.defineProperty(exports, "utcSundays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSundays;
  }
});
Object.defineProperty(exports, "utcMonday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcMonday;
  }
});
Object.defineProperty(exports, "utcMondays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcMondays;
  }
});
Object.defineProperty(exports, "utcTuesday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcTuesday;
  }
});
Object.defineProperty(exports, "utcTuesdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcTuesdays;
  }
});
Object.defineProperty(exports, "utcWednesday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcWednesday;
  }
});
Object.defineProperty(exports, "utcWednesdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcWednesdays;
  }
});
Object.defineProperty(exports, "utcThursday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcThursday;
  }
});
Object.defineProperty(exports, "utcThursdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcThursdays;
  }
});
Object.defineProperty(exports, "utcFriday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcFriday;
  }
});
Object.defineProperty(exports, "utcFridays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcFridays;
  }
});
Object.defineProperty(exports, "utcSaturday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSaturday;
  }
});
Object.defineProperty(exports, "utcSaturdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSaturdays;
  }
});
Object.defineProperty(exports, "utcMonth", {
  enumerable: true,
  get: function () {
    return _utcMonth.default;
  }
});
Object.defineProperty(exports, "utcMonths", {
  enumerable: true,
  get: function () {
    return _utcMonth.utcMonths;
  }
});
Object.defineProperty(exports, "utcYear", {
  enumerable: true,
  get: function () {
    return _utcYear.default;
  }
});
Object.defineProperty(exports, "utcYears", {
  enumerable: true,
  get: function () {
    return _utcYear.utcYears;
  }
});

var _interval = _interopRequireDefault(require("./interval.js"));

var _millisecond = _interopRequireWildcard(require("./millisecond.js"));

var _second = _interopRequireWildcard(require("./second.js"));

var _minute = _interopRequireWildcard(require("./minute.js"));

var _hour = _interopRequireWildcard(require("./hour.js"));

var _day = _interopRequireWildcard(require("./day.js"));

var _week = require("./week.js");

var _month = _interopRequireWildcard(require("./month.js"));

var _year = _interopRequireWildcard(require("./year.js"));

var _utcMinute = _interopRequireWildcard(require("./utcMinute.js"));

var _utcHour = _interopRequireWildcard(require("./utcHour.js"));

var _utcDay = _interopRequireWildcard(require("./utcDay.js"));

var _utcWeek = require("./utcWeek.js");

var _utcMonth = _interopRequireWildcard(require("./utcMonth.js"));

var _utcYear = _interopRequireWildcard(require("./utcYear.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./interval.js":"node_modules/d3-time/src/interval.js","./millisecond.js":"node_modules/d3-time/src/millisecond.js","./second.js":"node_modules/d3-time/src/second.js","./minute.js":"node_modules/d3-time/src/minute.js","./hour.js":"node_modules/d3-time/src/hour.js","./day.js":"node_modules/d3-time/src/day.js","./week.js":"node_modules/d3-time/src/week.js","./month.js":"node_modules/d3-time/src/month.js","./year.js":"node_modules/d3-time/src/year.js","./utcMinute.js":"node_modules/d3-time/src/utcMinute.js","./utcHour.js":"node_modules/d3-time/src/utcHour.js","./utcDay.js":"node_modules/d3-time/src/utcDay.js","./utcWeek.js":"node_modules/d3-time/src/utcWeek.js","./utcMonth.js":"node_modules/d3-time/src/utcMonth.js","./utcYear.js":"node_modules/d3-time/src/utcYear.js"}],"node_modules/d3-time-format/src/locale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatLocale;

var _d3Time = require("d3-time");

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }

  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }

  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newDate(y, m, d) {
  return {
    y: y,
    m: m,
    d: d,
    H: 0,
    M: 0,
    S: 0,
    L: 0
  };
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;
  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  }; // These recursive directive definitions must be deferred.

  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function (date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;
      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, Z) {
    return function (string) {
      var d = newDate(1900, undefined, 1),
          i = parseSpecifier(d, specifier, string += "", 0),
          week,
          day;
      if (i != string.length) return null; // If a UNIX timestamp is specified, return it.

      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0)); // If this is utcParse, never use the local timezone.

      if (Z && !("Z" in d)) d.Z = 0; // The am-pm flag is 0 for AM, and 1 for PM.

      if ("p" in d) d.H = d.H % 12 + d.p * 12; // If the month was not specified, inherit from the quarter.

      if (d.m === undefined) d.m = "q" in d ? d.q : 0; // Convert day-of-week and week-of-year to day-of-year.

      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;

        if ("Z" in d) {
          week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
          week = day > 4 || day === 0 ? _d3Time.utcMonday.ceil(week) : (0, _d3Time.utcMonday)(week);
          week = _d3Time.utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
          week = day > 4 || day === 0 ? _d3Time.timeMonday.ceil(week) : (0, _d3Time.timeMonday)(week);
          week = _d3Time.timeDay.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
      } // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.


      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      } // Otherwise, all fields are in local time.


      return localDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);

      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }

  return {
    format: function (specifier) {
      var f = newFormat(specifier += "", formats);

      f.toString = function () {
        return specifier;
      };

      return f;
    },
    parse: function (specifier) {
      var p = newParse(specifier += "", false);

      p.toString = function () {
        return specifier;
      };

      return p;
    },
    utcFormat: function (specifier) {
      var f = newFormat(specifier += "", utcFormats);

      f.toString = function () {
        return specifier;
      };

      return f;
    },
    utcParse: function (specifier) {
      var p = newParse(specifier += "", true);

      p.toString = function () {
        return specifier;
      };

      return p;
    }
  };
}

var pads = {
  "-": "",
  "_": " ",
  "0": "0"
},
    numberRe = /^\s*\d+/,
    // note: ignores next directive
percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {},
      i = -1,
      n = names.length;

  while (++i < n) map[names[i].toLowerCase()] = i;

  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseQuarter(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.s = +n[0], i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + _d3Time.timeDay.count((0, _d3Time.timeYear)(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day = d.getDay();
  return day === 0 ? 7 : day;
}

function formatWeekNumberSunday(d, p) {
  return pad(_d3Time.timeSunday.count((0, _d3Time.timeYear)(d) - 1, d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day = d.getDay();
  d = day >= 4 || day === 0 ? (0, _d3Time.timeThursday)(d) : _d3Time.timeThursday.ceil(d);
  return pad(_d3Time.timeThursday.count((0, _d3Time.timeYear)(d), d) + ((0, _d3Time.timeYear)(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(_d3Time.timeMonday.count((0, _d3Time.timeYear)(d) - 1, d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + _d3Time.utcDay.count((0, _d3Time.utcYear)(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(_d3Time.utcSunday.count((0, _d3Time.utcYear)(d) - 1, d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day = d.getUTCDay();
  d = day >= 4 || day === 0 ? (0, _d3Time.utcThursday)(d) : _d3Time.utcThursday.ceil(d);
  return pad(_d3Time.utcThursday.count((0, _d3Time.utcYear)(d), d) + ((0, _d3Time.utcYear)(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(_d3Time.utcMonday.count((0, _d3Time.utcYear)(d) - 1, d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}
},{"d3-time":"node_modules/d3-time/src/index.js"}],"node_modules/d3-time-format/src/defaultLocale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultLocale;
exports.utcParse = exports.utcFormat = exports.timeParse = exports.timeFormat = void 0;

var _locale = _interopRequireDefault(require("./locale.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locale;
var timeFormat;
exports.timeFormat = timeFormat;
var timeParse;
exports.timeParse = timeParse;
var utcFormat;
exports.utcFormat = utcFormat;
var utcParse;
exports.utcParse = utcParse;
defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale = (0, _locale.default)(definition);
  exports.timeFormat = timeFormat = locale.format;
  exports.timeParse = timeParse = locale.parse;
  exports.utcFormat = utcFormat = locale.utcFormat;
  exports.utcParse = utcParse = locale.utcParse;
  return locale;
}
},{"./locale.js":"node_modules/d3-time-format/src/locale.js"}],"node_modules/d3-time-format/src/isoFormat.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isoSpecifier = void 0;

var _defaultLocale = require("./defaultLocale.js");

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
exports.isoSpecifier = isoSpecifier;

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString ? formatIsoNative : (0, _defaultLocale.utcFormat)(isoSpecifier);
var _default = formatIso;
exports.default = _default;
},{"./defaultLocale.js":"node_modules/d3-time-format/src/defaultLocale.js"}],"node_modules/d3-time-format/src/isoParse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isoFormat = require("./isoFormat.js");

var _defaultLocale = require("./defaultLocale.js");

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : (0, _defaultLocale.utcParse)(_isoFormat.isoSpecifier);
var _default = parseIso;
exports.default = _default;
},{"./isoFormat.js":"node_modules/d3-time-format/src/isoFormat.js","./defaultLocale.js":"node_modules/d3-time-format/src/defaultLocale.js"}],"node_modules/d3-time-format/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeFormatDefaultLocale", {
  enumerable: true,
  get: function () {
    return _defaultLocale.default;
  }
});
Object.defineProperty(exports, "timeFormat", {
  enumerable: true,
  get: function () {
    return _defaultLocale.timeFormat;
  }
});
Object.defineProperty(exports, "timeParse", {
  enumerable: true,
  get: function () {
    return _defaultLocale.timeParse;
  }
});
Object.defineProperty(exports, "utcFormat", {
  enumerable: true,
  get: function () {
    return _defaultLocale.utcFormat;
  }
});
Object.defineProperty(exports, "utcParse", {
  enumerable: true,
  get: function () {
    return _defaultLocale.utcParse;
  }
});
Object.defineProperty(exports, "timeFormatLocale", {
  enumerable: true,
  get: function () {
    return _locale.default;
  }
});
Object.defineProperty(exports, "isoFormat", {
  enumerable: true,
  get: function () {
    return _isoFormat.default;
  }
});
Object.defineProperty(exports, "isoParse", {
  enumerable: true,
  get: function () {
    return _isoParse.default;
  }
});

var _defaultLocale = _interopRequireWildcard(require("./defaultLocale.js"));

var _locale = _interopRequireDefault(require("./locale.js"));

var _isoFormat = _interopRequireDefault(require("./isoFormat.js"));

var _isoParse = _interopRequireDefault(require("./isoParse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./defaultLocale.js":"node_modules/d3-time-format/src/defaultLocale.js","./locale.js":"node_modules/d3-time-format/src/locale.js","./isoFormat.js":"node_modules/d3-time-format/src/isoFormat.js","./isoParse.js":"node_modules/d3-time-format/src/isoParse.js"}],"node_modules/d3-scale/src/time.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendar = calendar;
exports.default = _default;

var _d3Array = require("d3-array");

var _d3Time = require("d3-time");

var _d3TimeFormat = require("d3-time-format");

var _array = require("./array");

var _continuous = _interopRequireWildcard(require("./continuous"));

var _init = require("./init");

var _nice = _interopRequireDefault(require("./nice"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var durationSecond = 1000,
    durationMinute = durationSecond * 60,
    durationHour = durationMinute * 60,
    durationDay = durationHour * 24,
    durationWeek = durationDay * 7,
    durationMonth = durationDay * 30,
    durationYear = durationDay * 365;

function date(t) {
  return new Date(t);
}

function number(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
  var scale = (0, _continuous.default)(_continuous.identity, _continuous.identity),
      invert = scale.invert,
      domain = scale.domain;
  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");
  var tickIntervals = [[second, 1, durationSecond], [second, 5, 5 * durationSecond], [second, 15, 15 * durationSecond], [second, 30, 30 * durationSecond], [minute, 1, durationMinute], [minute, 5, 5 * durationMinute], [minute, 15, 15 * durationMinute], [minute, 30, 30 * durationMinute], [hour, 1, durationHour], [hour, 3, 3 * durationHour], [hour, 6, 6 * durationHour], [hour, 12, 12 * durationHour], [day, 1, durationDay], [day, 2, 2 * durationDay], [week, 1, durationWeek], [month, 1, durationMonth], [month, 3, 3 * durationMonth], [year, 1, durationYear]];

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond : minute(date) < date ? formatSecond : hour(date) < date ? formatMinute : day(date) < date ? formatHour : month(date) < date ? week(date) < date ? formatDay : formatWeek : year(date) < date ? formatMonth : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10; // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.

    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = (0, _d3Array.bisector)(function (i) {
        return i[2];
      }).right(tickIntervals, target);

      if (i === tickIntervals.length) {
        step = (0, _d3Array.tickStep)(start / durationYear, stop / durationYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = Math.max((0, _d3Array.tickStep)(start, stop, interval), 1);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function (y) {
    return new Date(invert(y));
  };

  scale.domain = function (_) {
    return arguments.length ? domain(_array.map.call(_, number)) : domain().map(date);
  };

  scale.ticks = function (interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop

    return r ? t.reverse() : t;
  };

  scale.tickFormat = function (count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function (interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step)) ? domain((0, _nice.default)(d, interval)) : scale;
  };

  scale.copy = function () {
    return (0, _continuous.copy)(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
  };

  return scale;
}

function _default() {
  return _init.initRange.apply(calendar(_d3Time.timeYear, _d3Time.timeMonth, _d3Time.timeWeek, _d3Time.timeDay, _d3Time.timeHour, _d3Time.timeMinute, _d3Time.timeSecond, _d3Time.timeMillisecond, _d3TimeFormat.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
}
},{"d3-array":"node_modules/d3-array/src/index.js","d3-time":"node_modules/d3-time/src/index.js","d3-time-format":"node_modules/d3-time-format/src/index.js","./array":"node_modules/d3-scale/src/array.js","./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js","./nice":"node_modules/d3-scale/src/nice.js"}],"node_modules/d3-scale/src/utcTime.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _time = require("./time");

var _d3TimeFormat = require("d3-time-format");

var _d3Time = require("d3-time");

var _init = require("./init");

function _default() {
  return _init.initRange.apply((0, _time.calendar)(_d3Time.utcYear, _d3Time.utcMonth, _d3Time.utcWeek, _d3Time.utcDay, _d3Time.utcHour, _d3Time.utcMinute, _d3Time.utcSecond, _d3Time.utcMillisecond, _d3TimeFormat.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]), arguments);
}
},{"./time":"node_modules/d3-scale/src/time.js","d3-time-format":"node_modules/d3-time-format/src/index.js","d3-time":"node_modules/d3-time/src/index.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/sequential.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;
exports.default = sequential;
exports.sequentialLog = sequentialLog;
exports.sequentialSymlog = sequentialSymlog;
exports.sequentialPow = sequentialPow;
exports.sequentialSqrt = sequentialSqrt;

var _continuous = require("./continuous");

var _init = require("./init");

var _linear = require("./linear");

var _log = require("./log");

var _symlog = require("./symlog");

var _pow = require("./pow");

function transformer() {
  var x0 = 0,
      x1 = 1,
      t0,
      t1,
      k10,
      transform,
      interpolator = _continuous.identity,
      clamp = false,
      unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : interpolator(k10 === 0 ? 0.5 : (x = (transform(x) - t0) * k10, clamp ? Math.max(0, Math.min(1, x)) : x));
  }

  scale.domain = function (_) {
    return arguments.length ? (t0 = transform(x0 = +_[0]), t1 = transform(x1 = +_[1]), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [x0, x1];
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function (t) {
    transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0);
    return scale;
  };
}

function copy(source, target) {
  return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
}

function sequential() {
  var scale = (0, _linear.linearish)(transformer()(_continuous.identity));

  scale.copy = function () {
    return copy(scale, sequential());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialLog() {
  var scale = (0, _log.loggish)(transformer()).domain([1, 10]);

  scale.copy = function () {
    return copy(scale, sequentialLog()).base(scale.base());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialSymlog() {
  var scale = (0, _symlog.symlogish)(transformer());

  scale.copy = function () {
    return copy(scale, sequentialSymlog()).constant(scale.constant());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialPow() {
  var scale = (0, _pow.powish)(transformer());

  scale.copy = function () {
    return copy(scale, sequentialPow()).exponent(scale.exponent());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialSqrt() {
  return sequentialPow.apply(null, arguments).exponent(0.5);
}
},{"./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js","./linear":"node_modules/d3-scale/src/linear.js","./log":"node_modules/d3-scale/src/log.js","./symlog":"node_modules/d3-scale/src/symlog.js","./pow":"node_modules/d3-scale/src/pow.js"}],"node_modules/d3-scale/src/sequentialQuantile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sequentialQuantile;

var _d3Array = require("d3-array");

var _continuous = require("./continuous");

var _init = require("./init");

function sequentialQuantile() {
  var domain = [],
      interpolator = _continuous.identity;

  function scale(x) {
    if (!isNaN(x = +x)) return interpolator(((0, _d3Array.bisect)(domain, x) - 1) / (domain.length - 1));
  }

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [];

    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);

    domain.sort(_d3Array.ascending);
    return scale;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function () {
    return sequentialQuantile(interpolator).domain(domain);
  };

  return _init.initInterpolator.apply(scale, arguments);
}
},{"d3-array":"node_modules/d3-array/src/index.js","./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js"}],"node_modules/d3-scale/src/diverging.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diverging;
exports.divergingLog = divergingLog;
exports.divergingSymlog = divergingSymlog;
exports.divergingPow = divergingPow;
exports.divergingSqrt = divergingSqrt;

var _continuous = require("./continuous");

var _init = require("./init");

var _linear = require("./linear");

var _log = require("./log");

var _sequential = require("./sequential");

var _symlog = require("./symlog");

var _pow = require("./pow");

function transformer() {
  var x0 = 0,
      x1 = 0.5,
      x2 = 1,
      t0,
      t1,
      t2,
      k10,
      k21,
      interpolator = _continuous.identity,
      transform,
      clamp = false,
      unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : (x = 0.5 + ((x = +transform(x)) - t1) * (x < t1 ? k10 : k21), interpolator(clamp ? Math.max(0, Math.min(1, x)) : x));
  }

  scale.domain = function (_) {
    return arguments.length ? (t0 = transform(x0 = +_[0]), t1 = transform(x1 = +_[1]), t2 = transform(x2 = +_[2]), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), scale) : [x0, x1, x2];
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function (t) {
    transform = t, t0 = t(x0), t1 = t(x1), t2 = t(x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1);
    return scale;
  };
}

function diverging() {
  var scale = (0, _linear.linearish)(transformer()(_continuous.identity));

  scale.copy = function () {
    return (0, _sequential.copy)(scale, diverging());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingLog() {
  var scale = (0, _log.loggish)(transformer()).domain([0.1, 1, 10]);

  scale.copy = function () {
    return (0, _sequential.copy)(scale, divergingLog()).base(scale.base());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingSymlog() {
  var scale = (0, _symlog.symlogish)(transformer());

  scale.copy = function () {
    return (0, _sequential.copy)(scale, divergingSymlog()).constant(scale.constant());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingPow() {
  var scale = (0, _pow.powish)(transformer());

  scale.copy = function () {
    return (0, _sequential.copy)(scale, divergingPow()).exponent(scale.exponent());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingSqrt() {
  return divergingPow.apply(null, arguments).exponent(0.5);
}
},{"./continuous":"node_modules/d3-scale/src/continuous.js","./init":"node_modules/d3-scale/src/init.js","./linear":"node_modules/d3-scale/src/linear.js","./log":"node_modules/d3-scale/src/log.js","./sequential":"node_modules/d3-scale/src/sequential.js","./symlog":"node_modules/d3-scale/src/symlog.js","./pow":"node_modules/d3-scale/src/pow.js"}],"node_modules/d3-scale/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "scaleBand", {
  enumerable: true,
  get: function () {
    return _band.default;
  }
});
Object.defineProperty(exports, "scalePoint", {
  enumerable: true,
  get: function () {
    return _band.point;
  }
});
Object.defineProperty(exports, "scaleIdentity", {
  enumerable: true,
  get: function () {
    return _identity.default;
  }
});
Object.defineProperty(exports, "scaleLinear", {
  enumerable: true,
  get: function () {
    return _linear.default;
  }
});
Object.defineProperty(exports, "scaleLog", {
  enumerable: true,
  get: function () {
    return _log.default;
  }
});
Object.defineProperty(exports, "scaleSymlog", {
  enumerable: true,
  get: function () {
    return _symlog.default;
  }
});
Object.defineProperty(exports, "scaleOrdinal", {
  enumerable: true,
  get: function () {
    return _ordinal.default;
  }
});
Object.defineProperty(exports, "scaleImplicit", {
  enumerable: true,
  get: function () {
    return _ordinal.implicit;
  }
});
Object.defineProperty(exports, "scalePow", {
  enumerable: true,
  get: function () {
    return _pow.default;
  }
});
Object.defineProperty(exports, "scaleSqrt", {
  enumerable: true,
  get: function () {
    return _pow.sqrt;
  }
});
Object.defineProperty(exports, "scaleQuantile", {
  enumerable: true,
  get: function () {
    return _quantile.default;
  }
});
Object.defineProperty(exports, "scaleQuantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});
Object.defineProperty(exports, "scaleThreshold", {
  enumerable: true,
  get: function () {
    return _threshold.default;
  }
});
Object.defineProperty(exports, "scaleTime", {
  enumerable: true,
  get: function () {
    return _time.default;
  }
});
Object.defineProperty(exports, "scaleUtc", {
  enumerable: true,
  get: function () {
    return _utcTime.default;
  }
});
Object.defineProperty(exports, "scaleSequential", {
  enumerable: true,
  get: function () {
    return _sequential.default;
  }
});
Object.defineProperty(exports, "scaleSequentialLog", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialLog;
  }
});
Object.defineProperty(exports, "scaleSequentialPow", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialPow;
  }
});
Object.defineProperty(exports, "scaleSequentialSqrt", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialSqrt;
  }
});
Object.defineProperty(exports, "scaleSequentialSymlog", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialSymlog;
  }
});
Object.defineProperty(exports, "scaleSequentialQuantile", {
  enumerable: true,
  get: function () {
    return _sequentialQuantile.default;
  }
});
Object.defineProperty(exports, "scaleDiverging", {
  enumerable: true,
  get: function () {
    return _diverging.default;
  }
});
Object.defineProperty(exports, "scaleDivergingLog", {
  enumerable: true,
  get: function () {
    return _diverging.divergingLog;
  }
});
Object.defineProperty(exports, "scaleDivergingPow", {
  enumerable: true,
  get: function () {
    return _diverging.divergingPow;
  }
});
Object.defineProperty(exports, "scaleDivergingSqrt", {
  enumerable: true,
  get: function () {
    return _diverging.divergingSqrt;
  }
});
Object.defineProperty(exports, "scaleDivergingSymlog", {
  enumerable: true,
  get: function () {
    return _diverging.divergingSymlog;
  }
});
Object.defineProperty(exports, "tickFormat", {
  enumerable: true,
  get: function () {
    return _tickFormat.default;
  }
});

var _band = _interopRequireWildcard(require("./band"));

var _identity = _interopRequireDefault(require("./identity"));

var _linear = _interopRequireDefault(require("./linear"));

var _log = _interopRequireDefault(require("./log"));

var _symlog = _interopRequireDefault(require("./symlog"));

var _ordinal = _interopRequireWildcard(require("./ordinal"));

var _pow = _interopRequireWildcard(require("./pow"));

var _quantile = _interopRequireDefault(require("./quantile"));

var _quantize = _interopRequireDefault(require("./quantize"));

var _threshold = _interopRequireDefault(require("./threshold"));

var _time = _interopRequireDefault(require("./time"));

var _utcTime = _interopRequireDefault(require("./utcTime"));

var _sequential = _interopRequireWildcard(require("./sequential"));

var _sequentialQuantile = _interopRequireDefault(require("./sequentialQuantile"));

var _diverging = _interopRequireWildcard(require("./diverging"));

var _tickFormat = _interopRequireDefault(require("./tickFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./band":"node_modules/d3-scale/src/band.js","./identity":"node_modules/d3-scale/src/identity.js","./linear":"node_modules/d3-scale/src/linear.js","./log":"node_modules/d3-scale/src/log.js","./symlog":"node_modules/d3-scale/src/symlog.js","./ordinal":"node_modules/d3-scale/src/ordinal.js","./pow":"node_modules/d3-scale/src/pow.js","./quantile":"node_modules/d3-scale/src/quantile.js","./quantize":"node_modules/d3-scale/src/quantize.js","./threshold":"node_modules/d3-scale/src/threshold.js","./time":"node_modules/d3-scale/src/time.js","./utcTime":"node_modules/d3-scale/src/utcTime.js","./sequential":"node_modules/d3-scale/src/sequential.js","./sequentialQuantile":"node_modules/d3-scale/src/sequentialQuantile.js","./diverging":"node_modules/d3-scale/src/diverging.js","./tickFormat":"node_modules/d3-scale/src/tickFormat.js"}],"node_modules/d3-dispatch/src/dispatch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var noop = {
  value: function () {}
};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }

  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {
      type: t,
      name: name
    };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function (typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length; // If no callback was specified, return the callback of the given type and name.

    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;

      return;
    } // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.


    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);

    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function () {
    var copy = {},
        _ = this._;

    for (var t in _) copy[t] = _[t].slice();

    return new Dispatch(copy);
  },
  call: function (type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function (type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }

  if (callback != null) type.push({
    name: name,
    value: callback
  });
  return type;
}

var _default = dispatch;
exports.default = _default;
},{}],"node_modules/d3-dispatch/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});

var _dispatch = _interopRequireDefault(require("./dispatch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./dispatch.js":"node_modules/d3-dispatch/src/dispatch.js"}],"node_modules/d3-timer/src/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.now = now;
exports.Timer = Timer;
exports.timer = timer;
exports.timerFlush = timerFlush;
var frame = 0,
    // is an animation frame pending?
timeout = 0,
    // is a timeout pending?
interval = 0,
    // are any timers active?
pokeDelay = 1000,
    // how frequently we check for clock skew
taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
  setTimeout(f, 17);
};

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call = this._time = this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function (callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);

    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;else taskHead = this;
      taskTail = this;
    }

    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function () {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.

  ++frame; // Pretend we’ve set an alarm, if we haven’t already.

  var t = taskHead,
      e;

  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }

  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;

  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(),
      delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0,
      t1 = taskHead,
      t2,
      time = Infinity;

  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }

  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.

  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.

  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}
},{}],"node_modules/d3-timer/src/timeout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _timer = require("./timer.js");

function _default(callback, delay, time) {
  var t = new _timer.Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(function (elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}
},{"./timer.js":"node_modules/d3-timer/src/timer.js"}],"node_modules/d3-timer/src/interval.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _timer = require("./timer.js");

function _default(callback, delay, time) {
  var t = new _timer.Timer(),
      total = delay;
  if (delay == null) return t.restart(callback, delay, time), t;
  delay = +delay, time = time == null ? (0, _timer.now)() : +time;
  t.restart(function tick(elapsed) {
    elapsed += total;
    t.restart(tick, total += delay, time);
    callback(elapsed);
  }, delay, time);
  return t;
}
},{"./timer.js":"node_modules/d3-timer/src/timer.js"}],"node_modules/d3-timer/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "now", {
  enumerable: true,
  get: function () {
    return _timer.now;
  }
});
Object.defineProperty(exports, "timer", {
  enumerable: true,
  get: function () {
    return _timer.timer;
  }
});
Object.defineProperty(exports, "timerFlush", {
  enumerable: true,
  get: function () {
    return _timer.timerFlush;
  }
});
Object.defineProperty(exports, "timeout", {
  enumerable: true,
  get: function () {
    return _timeout.default;
  }
});
Object.defineProperty(exports, "interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});

var _timer = require("./timer.js");

var _timeout = _interopRequireDefault(require("./timeout.js"));

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./timer.js":"node_modules/d3-timer/src/timer.js","./timeout.js":"node_modules/d3-timer/src/timeout.js","./interval.js":"node_modules/d3-timer/src/interval.js"}],"node_modules/d3-transition/src/transition/schedule.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.init = init;
exports.set = set;
exports.get = get;
exports.ENDED = exports.ENDING = exports.RUNNING = exports.STARTED = exports.STARTING = exports.SCHEDULED = exports.CREATED = void 0;

var _d3Dispatch = require("d3-dispatch");

var _d3Timer = require("d3-timer");

var emptyOn = (0, _d3Dispatch.dispatch)("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
exports.CREATED = CREATED;
var SCHEDULED = 1;
exports.SCHEDULED = SCHEDULED;
var STARTING = 2;
exports.STARTING = STARTING;
var STARTED = 3;
exports.STARTED = STARTED;
var RUNNING = 4;
exports.RUNNING = RUNNING;
var ENDING = 5;
exports.ENDING = ENDING;
var ENDED = 6;
exports.ENDED = ENDED;

function _default(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index,
    // For context during callback.
    group: group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween; // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!

  schedules[id] = self;
  self.timer = (0, _d3Timer.timer)(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time); // If the elapsed delay is less than our first sleep, start immediately.

    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o; // If the state is not SCHEDULED, then we previously errored on start.

    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue; // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!

      if (o.state === STARTED) return (0, _d3Timer.timeout)(start); // Interrupt the active transition, if any.

      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } // Cancel any pre-empted transitions.
      else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
    } // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.


    (0, _d3Timer.timeout)(function () {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    }); // Dispatch the start event.
    // Note this must be done before the tween are initialized.

    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted

    self.state = STARTED; // Initialize the tween, deleting null tween.

    tween = new Array(n = self.tween.length);

    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }

    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    } // Dispatch the end event.


    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];

    for (var i in schedules) return; // eslint-disable-line no-unused-vars


    delete node.__transition;
  }
}
},{"d3-dispatch":"node_modules/d3-dispatch/src/index.js","d3-timer":"node_modules/d3-timer/src/index.js"}],"node_modules/d3-transition/src/interrupt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./transition/schedule.js");

function _default(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;
  if (!schedules) return;
  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty = false;
      continue;
    }

    active = schedule.state > _schedule.STARTING && schedule.state < _schedule.ENDING;
    schedule.state = _schedule.ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}
},{"./transition/schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/selection/interrupt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _interrupt = _interopRequireDefault(require("../interrupt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return this.each(function () {
    (0, _interrupt.default)(this, name);
  });
}
},{"../interrupt.js":"node_modules/d3-transition/src/interrupt.js"}],"node_modules/d3-transition/src/transition/tween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.tweenValue = tweenValue;

var _schedule = require("./schedule.js");

function tweenRemove(id, name) {
  var tween0, tween1;
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = tween0 = tween;

      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();

      for (var t = {
        name: name,
        value: value
      }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }

      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function _default(name, value) {
  var id = this._id;
  name += "";

  if (arguments.length < 2) {
    var tween = (0, _schedule.get)(this.node(), id).tween;

    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }

    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;
  transition.each(function () {
    var schedule = (0, _schedule.set)(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function (node) {
    return (0, _schedule.get)(node, id).value[name];
  };
}
},{"./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/interpolate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

function _default(a, b) {
  var c;
  return (typeof b === "number" ? _d3Interpolate.interpolateNumber : b instanceof _d3Color.color ? _d3Interpolate.interpolateRgb : (c = (0, _d3Color.color)(b)) ? (b = c, _d3Interpolate.interpolateRgb) : _d3Interpolate.interpolateString)(a, b);
}
},{"d3-color":"node_modules/d3-color/src/index.js","d3-interpolate":"node_modules/d3-interpolate/src/index.js"}],"node_modules/d3-transition/src/transition/attr.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _tween = require("./tween.js");

var _interpolate = _interopRequireDefault(require("./interpolate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function _default(name, value) {
  var fullname = (0, _d3Selection.namespace)(name),
      i = fullname === "transform" ? _d3Interpolate.interpolateTransformSvg : _interpolate.default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, (0, _tween.tweenValue)(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
},{"d3-interpolate":"node_modules/d3-interpolate/src/index.js","d3-selection":"node_modules/d3-selection/src/index.js","./tween.js":"node_modules/d3-transition/src/transition/tween.js","./interpolate.js":"node_modules/d3-transition/src/transition/interpolate.js"}],"node_modules/d3-transition/src/transition/attrTween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

function attrInterpolate(name, i) {
  return function (t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function (t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function _default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = (0, _d3Selection.namespace)(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
},{"d3-selection":"node_modules/d3-selection/src/index.js"}],"node_modules/d3-transition/src/transition/delay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function delayFunction(id, value) {
  return function () {
    (0, _schedule.init)(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function () {
    (0, _schedule.init)(this, id).delay = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : (0, _schedule.get)(this.node(), id).delay;
}
},{"./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/duration.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function durationFunction(id, value) {
  return function () {
    (0, _schedule.set)(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function () {
    (0, _schedule.set)(this, id).duration = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : (0, _schedule.get)(this.node(), id).duration;
}
},{"./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/ease.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    (0, _schedule.set)(this, id).ease = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each(easeConstant(id, value)) : (0, _schedule.get)(this.node(), id).ease;
}
},{"./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index.js");

function _default(match) {
  if (typeof match !== "function") match = (0, _d3Selection.matcher)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Transition(subgroups, this._parents, this._name, this._id);
}
},{"d3-selection":"node_modules/d3-selection/src/index.js","./index.js":"node_modules/d3-transition/src/transition/index.js"}],"node_modules/d3-transition/src/transition/merge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index.js");

function _default(transition) {
  if (transition._id !== this._id) throw new Error();

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Transition(merges, this._parents, this._name, this._id);
}
},{"./index.js":"node_modules/d3-transition/src/transition/index.js"}],"node_modules/d3-transition/src/transition/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function (t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0,
      on1,
      sit = start(name) ? _schedule.init : _schedule.set;
  return function () {
    var schedule = sit(this, id),
        on = schedule.on; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}

function _default(name, listener) {
  var id = this._id;
  return arguments.length < 2 ? (0, _schedule.get)(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}
},{"./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/remove.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function removeFunction(id) {
  return function () {
    var parent = this.parentNode;

    for (var i in this.__transition) if (+i !== id) return;

    if (parent) parent.removeChild(this);
  };
}

function _default() {
  return this.on("end.remove", removeFunction(this._id));
}
},{}],"node_modules/d3-transition/src/transition/select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index.js");

var _schedule = _interopRequireWildcard(require("./schedule.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default(select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = (0, _d3Selection.selector)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        (0, _schedule.default)(subgroup[i], name, id, i, subgroup, (0, _schedule.get)(node, id));
      }
    }
  }

  return new _index.Transition(subgroups, this._parents, name, id);
}
},{"d3-selection":"node_modules/d3-selection/src/index.js","./index.js":"node_modules/d3-transition/src/transition/index.js","./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/selectAll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index.js");

var _schedule = _interopRequireWildcard(require("./schedule.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default(select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = (0, _d3Selection.selectorAll)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = (0, _schedule.get)(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            (0, _schedule.default)(child, name, id, k, children, inherit);
          }
        }

        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new _index.Transition(subgroups, parents, name, id);
}
},{"d3-selection":"node_modules/d3-selection/src/index.js","./index.js":"node_modules/d3-transition/src/transition/index.js","./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/selection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var Selection = _d3Selection.selection.prototype.constructor;

function _default() {
  return new Selection(this._groups, this._parents);
}
},{"d3-selection":"node_modules/d3-selection/src/index.js"}],"node_modules/d3-transition/src/transition/style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _schedule = require("./schedule.js");

var _tween = require("./tween.js");

var _interpolate = _interopRequireDefault(require("./interpolate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name),
        string1 = (this.style.removeProperty(name), (0, _d3Selection.style)(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), (0, _d3Selection.style)(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0,
      on1,
      listener0,
      key = "style." + name,
      event = "end." + key,
      remove;
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}

function _default(name, value, priority) {
  var i = (name += "") === "transform" ? _d3Interpolate.interpolateTransformCss : _interpolate.default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, (0, _tween.tweenValue)(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
},{"d3-interpolate":"node_modules/d3-interpolate/src/index.js","d3-selection":"node_modules/d3-selection/src/index.js","./schedule.js":"node_modules/d3-transition/src/transition/schedule.js","./tween.js":"node_modules/d3-transition/src/transition/tween.js","./interpolate.js":"node_modules/d3-transition/src/transition/interpolate.js"}],"node_modules/d3-transition/src/transition/styleTween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function styleInterpolate(name, i, priority) {
  return function (t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }

  tween._value = value;
  return tween;
}

function _default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
},{}],"node_modules/d3-transition/src/transition/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _tween = require("./tween.js");

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function _default(value) {
  return this.tween("text", typeof value === "function" ? textFunction((0, _tween.tweenValue)(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
},{"./tween.js":"node_modules/d3-transition/src/transition/tween.js"}],"node_modules/d3-transition/src/transition/textTween.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function textInterpolate(i) {
  return function (t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function _default(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, textTween(value));
}
},{}],"node_modules/d3-transition/src/transition/transition.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index.js");

var _schedule = _interopRequireWildcard(require("./schedule.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default() {
  var name = this._name,
      id0 = this._id,
      id1 = (0, _index.newId)();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = (0, _schedule.get)(node, id0);
        (0, _schedule.default)(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new _index.Transition(groups, this._parents, name, id1);
}
},{"./index.js":"node_modules/d3-transition/src/transition/index.js","./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/end.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function _default() {
  var on0,
      on1,
      that = this,
      id = that._id,
      size = that.size();
  return new Promise(function (resolve, reject) {
    var cancel = {
      value: reject
    },
        end = {
      value: function () {
        if (--size === 0) resolve();
      }
    };
    that.each(function () {
      var schedule = (0, _schedule.set)(this, id),
          on = schedule.on; // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.

      if (on !== on0) {
        on1 = (on0 = on).copy();

        on1._.cancel.push(cancel);

        on1._.interrupt.push(cancel);

        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}
},{"./schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/transition/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transition = Transition;
exports.default = transition;
exports.newId = newId;

var _d3Selection = require("d3-selection");

var _attr = _interopRequireDefault(require("./attr.js"));

var _attrTween = _interopRequireDefault(require("./attrTween.js"));

var _delay = _interopRequireDefault(require("./delay.js"));

var _duration = _interopRequireDefault(require("./duration.js"));

var _ease = _interopRequireDefault(require("./ease.js"));

var _filter = _interopRequireDefault(require("./filter.js"));

var _merge = _interopRequireDefault(require("./merge.js"));

var _on = _interopRequireDefault(require("./on.js"));

var _remove = _interopRequireDefault(require("./remove.js"));

var _select = _interopRequireDefault(require("./select.js"));

var _selectAll = _interopRequireDefault(require("./selectAll.js"));

var _selection = _interopRequireDefault(require("./selection.js"));

var _style = _interopRequireDefault(require("./style.js"));

var _styleTween = _interopRequireDefault(require("./styleTween.js"));

var _text = _interopRequireDefault(require("./text.js"));

var _textTween = _interopRequireDefault(require("./textTween.js"));

var _transition = _interopRequireDefault(require("./transition.js"));

var _tween = _interopRequireDefault(require("./tween.js"));

var _end = _interopRequireDefault(require("./end.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return (0, _d3Selection.selection)().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = _d3Selection.selection.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  merge: _merge.default,
  selection: _selection.default,
  transition: _transition.default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: _on.default,
  attr: _attr.default,
  attrTween: _attrTween.default,
  style: _style.default,
  styleTween: _styleTween.default,
  text: _text.default,
  textTween: _textTween.default,
  remove: _remove.default,
  tween: _tween.default,
  delay: _delay.default,
  duration: _duration.default,
  ease: _ease.default,
  end: _end.default
};
},{"d3-selection":"node_modules/d3-selection/src/index.js","./attr.js":"node_modules/d3-transition/src/transition/attr.js","./attrTween.js":"node_modules/d3-transition/src/transition/attrTween.js","./delay.js":"node_modules/d3-transition/src/transition/delay.js","./duration.js":"node_modules/d3-transition/src/transition/duration.js","./ease.js":"node_modules/d3-transition/src/transition/ease.js","./filter.js":"node_modules/d3-transition/src/transition/filter.js","./merge.js":"node_modules/d3-transition/src/transition/merge.js","./on.js":"node_modules/d3-transition/src/transition/on.js","./remove.js":"node_modules/d3-transition/src/transition/remove.js","./select.js":"node_modules/d3-transition/src/transition/select.js","./selectAll.js":"node_modules/d3-transition/src/transition/selectAll.js","./selection.js":"node_modules/d3-transition/src/transition/selection.js","./style.js":"node_modules/d3-transition/src/transition/style.js","./styleTween.js":"node_modules/d3-transition/src/transition/styleTween.js","./text.js":"node_modules/d3-transition/src/transition/text.js","./textTween.js":"node_modules/d3-transition/src/transition/textTween.js","./transition.js":"node_modules/d3-transition/src/transition/transition.js","./tween.js":"node_modules/d3-transition/src/transition/tween.js","./end.js":"node_modules/d3-transition/src/transition/end.js"}],"node_modules/d3-ease/src/linear.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = linear;

function linear(t) {
  return +t;
}
},{}],"node_modules/d3-ease/src/quad.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.quadIn = quadIn;
exports.quadOut = quadOut;
exports.quadInOut = quadInOut;

function quadIn(t) {
  return t * t;
}

function quadOut(t) {
  return t * (2 - t);
}

function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
},{}],"node_modules/d3-ease/src/cubic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubicIn = cubicIn;
exports.cubicOut = cubicOut;
exports.cubicInOut = cubicInOut;

function cubicIn(t) {
  return t * t * t;
}

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
},{}],"node_modules/d3-ease/src/poly.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polyInOut = exports.polyOut = exports.polyIn = void 0;
var exponent = 3;

var polyIn = function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;
  return polyIn;
}(exponent);

exports.polyIn = polyIn;

var polyOut = function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;
  return polyOut;
}(exponent);

exports.polyOut = polyOut;

var polyInOut = function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;
  return polyInOut;
}(exponent);

exports.polyInOut = polyInOut;
},{}],"node_modules/d3-ease/src/sin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sinIn = sinIn;
exports.sinOut = sinOut;
exports.sinInOut = sinInOut;
var pi = Math.PI,
    halfPi = pi / 2;

function sinIn(t) {
  return 1 - Math.cos(t * halfPi);
}

function sinOut(t) {
  return Math.sin(t * halfPi);
}

function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}
},{}],"node_modules/d3-ease/src/exp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expIn = expIn;
exports.expOut = expOut;
exports.expInOut = expInOut;

function expIn(t) {
  return Math.pow(2, 10 * t - 10);
}

function expOut(t) {
  return 1 - Math.pow(2, -10 * t);
}

function expInOut(t) {
  return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
}
},{}],"node_modules/d3-ease/src/circle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleIn = circleIn;
exports.circleOut = circleOut;
exports.circleInOut = circleInOut;

function circleIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function circleOut(t) {
  return Math.sqrt(1 - --t * t);
}

function circleInOut(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
},{}],"node_modules/d3-ease/src/bounce.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bounceIn = bounceIn;
exports.bounceOut = bounceOut;
exports.bounceInOut = bounceInOut;
var b1 = 4 / 11,
    b2 = 6 / 11,
    b3 = 8 / 11,
    b4 = 3 / 4,
    b5 = 9 / 11,
    b6 = 10 / 11,
    b7 = 15 / 16,
    b8 = 21 / 22,
    b9 = 63 / 64,
    b0 = 1 / b1 / b1;

function bounceIn(t) {
  return 1 - bounceOut(1 - t);
}

function bounceOut(t) {
  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}

function bounceInOut(t) {
  return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
}
},{}],"node_modules/d3-ease/src/back.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backInOut = exports.backOut = exports.backIn = void 0;
var overshoot = 1.70158;

var backIn = function custom(s) {
  s = +s;

  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;
  return backIn;
}(overshoot);

exports.backIn = backIn;

var backOut = function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;
  return backOut;
}(overshoot);

exports.backOut = backOut;

var backInOut = function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;
  return backInOut;
}(overshoot);

exports.backInOut = backInOut;
},{}],"node_modules/d3-ease/src/elastic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elasticInOut = exports.elasticOut = exports.elasticIn = void 0;
var tau = 2 * Math.PI,
    amplitude = 1,
    period = 0.3;

var elasticIn = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticIn(t) {
    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticIn.period = function (p) {
    return custom(a, p);
  };

  return elasticIn;
}(amplitude, period);

exports.elasticIn = elasticIn;

var elasticOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticOut(t) {
    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticOut.period = function (p) {
    return custom(a, p);
  };

  return elasticOut;
}(amplitude, period);

exports.elasticOut = elasticOut;

var elasticInOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0 ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p) : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticInOut.period = function (p) {
    return custom(a, p);
  };

  return elasticInOut;
}(amplitude, period);

exports.elasticInOut = elasticInOut;
},{}],"node_modules/d3-ease/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "easeLinear", {
  enumerable: true,
  get: function () {
    return _linear.linear;
  }
});
Object.defineProperty(exports, "easeQuad", {
  enumerable: true,
  get: function () {
    return _quad.quadInOut;
  }
});
Object.defineProperty(exports, "easeQuadIn", {
  enumerable: true,
  get: function () {
    return _quad.quadIn;
  }
});
Object.defineProperty(exports, "easeQuadOut", {
  enumerable: true,
  get: function () {
    return _quad.quadOut;
  }
});
Object.defineProperty(exports, "easeQuadInOut", {
  enumerable: true,
  get: function () {
    return _quad.quadInOut;
  }
});
Object.defineProperty(exports, "easeCubic", {
  enumerable: true,
  get: function () {
    return _cubic.cubicInOut;
  }
});
Object.defineProperty(exports, "easeCubicIn", {
  enumerable: true,
  get: function () {
    return _cubic.cubicIn;
  }
});
Object.defineProperty(exports, "easeCubicOut", {
  enumerable: true,
  get: function () {
    return _cubic.cubicOut;
  }
});
Object.defineProperty(exports, "easeCubicInOut", {
  enumerable: true,
  get: function () {
    return _cubic.cubicInOut;
  }
});
Object.defineProperty(exports, "easePoly", {
  enumerable: true,
  get: function () {
    return _poly.polyInOut;
  }
});
Object.defineProperty(exports, "easePolyIn", {
  enumerable: true,
  get: function () {
    return _poly.polyIn;
  }
});
Object.defineProperty(exports, "easePolyOut", {
  enumerable: true,
  get: function () {
    return _poly.polyOut;
  }
});
Object.defineProperty(exports, "easePolyInOut", {
  enumerable: true,
  get: function () {
    return _poly.polyInOut;
  }
});
Object.defineProperty(exports, "easeSin", {
  enumerable: true,
  get: function () {
    return _sin.sinInOut;
  }
});
Object.defineProperty(exports, "easeSinIn", {
  enumerable: true,
  get: function () {
    return _sin.sinIn;
  }
});
Object.defineProperty(exports, "easeSinOut", {
  enumerable: true,
  get: function () {
    return _sin.sinOut;
  }
});
Object.defineProperty(exports, "easeSinInOut", {
  enumerable: true,
  get: function () {
    return _sin.sinInOut;
  }
});
Object.defineProperty(exports, "easeExp", {
  enumerable: true,
  get: function () {
    return _exp.expInOut;
  }
});
Object.defineProperty(exports, "easeExpIn", {
  enumerable: true,
  get: function () {
    return _exp.expIn;
  }
});
Object.defineProperty(exports, "easeExpOut", {
  enumerable: true,
  get: function () {
    return _exp.expOut;
  }
});
Object.defineProperty(exports, "easeExpInOut", {
  enumerable: true,
  get: function () {
    return _exp.expInOut;
  }
});
Object.defineProperty(exports, "easeCircle", {
  enumerable: true,
  get: function () {
    return _circle.circleInOut;
  }
});
Object.defineProperty(exports, "easeCircleIn", {
  enumerable: true,
  get: function () {
    return _circle.circleIn;
  }
});
Object.defineProperty(exports, "easeCircleOut", {
  enumerable: true,
  get: function () {
    return _circle.circleOut;
  }
});
Object.defineProperty(exports, "easeCircleInOut", {
  enumerable: true,
  get: function () {
    return _circle.circleInOut;
  }
});
Object.defineProperty(exports, "easeBounce", {
  enumerable: true,
  get: function () {
    return _bounce.bounceOut;
  }
});
Object.defineProperty(exports, "easeBounceIn", {
  enumerable: true,
  get: function () {
    return _bounce.bounceIn;
  }
});
Object.defineProperty(exports, "easeBounceOut", {
  enumerable: true,
  get: function () {
    return _bounce.bounceOut;
  }
});
Object.defineProperty(exports, "easeBounceInOut", {
  enumerable: true,
  get: function () {
    return _bounce.bounceInOut;
  }
});
Object.defineProperty(exports, "easeBack", {
  enumerable: true,
  get: function () {
    return _back.backInOut;
  }
});
Object.defineProperty(exports, "easeBackIn", {
  enumerable: true,
  get: function () {
    return _back.backIn;
  }
});
Object.defineProperty(exports, "easeBackOut", {
  enumerable: true,
  get: function () {
    return _back.backOut;
  }
});
Object.defineProperty(exports, "easeBackInOut", {
  enumerable: true,
  get: function () {
    return _back.backInOut;
  }
});
Object.defineProperty(exports, "easeElastic", {
  enumerable: true,
  get: function () {
    return _elastic.elasticOut;
  }
});
Object.defineProperty(exports, "easeElasticIn", {
  enumerable: true,
  get: function () {
    return _elastic.elasticIn;
  }
});
Object.defineProperty(exports, "easeElasticOut", {
  enumerable: true,
  get: function () {
    return _elastic.elasticOut;
  }
});
Object.defineProperty(exports, "easeElasticInOut", {
  enumerable: true,
  get: function () {
    return _elastic.elasticInOut;
  }
});

var _linear = require("./linear.js");

var _quad = require("./quad.js");

var _cubic = require("./cubic.js");

var _poly = require("./poly.js");

var _sin = require("./sin.js");

var _exp = require("./exp.js");

var _circle = require("./circle.js");

var _bounce = require("./bounce.js");

var _back = require("./back.js");

var _elastic = require("./elastic.js");
},{"./linear.js":"node_modules/d3-ease/src/linear.js","./quad.js":"node_modules/d3-ease/src/quad.js","./cubic.js":"node_modules/d3-ease/src/cubic.js","./poly.js":"node_modules/d3-ease/src/poly.js","./sin.js":"node_modules/d3-ease/src/sin.js","./exp.js":"node_modules/d3-ease/src/exp.js","./circle.js":"node_modules/d3-ease/src/circle.js","./bounce.js":"node_modules/d3-ease/src/bounce.js","./back.js":"node_modules/d3-ease/src/back.js","./elastic.js":"node_modules/d3-ease/src/elastic.js"}],"node_modules/d3-transition/src/selection/transition.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("../transition/index.js");

var _schedule = _interopRequireDefault(require("../transition/schedule.js"));

var _d3Ease = require("d3-ease");

var _d3Timer = require("d3-timer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: _d3Ease.easeCubicInOut
};

function inherit(node, id) {
  var timing;

  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = (0, _d3Timer.now)(), defaultTiming;
    }
  }

  return timing;
}

function _default(name) {
  var id, timing;

  if (name instanceof _index.Transition) {
    id = name._id, name = name._name;
  } else {
    id = (0, _index.newId)(), (timing = defaultTiming).time = (0, _d3Timer.now)(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        (0, _schedule.default)(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new _index.Transition(groups, this._parents, name, id);
}
},{"../transition/index.js":"node_modules/d3-transition/src/transition/index.js","../transition/schedule.js":"node_modules/d3-transition/src/transition/schedule.js","d3-ease":"node_modules/d3-ease/src/index.js","d3-timer":"node_modules/d3-timer/src/index.js"}],"node_modules/d3-transition/src/selection/index.js":[function(require,module,exports) {
"use strict";

var _d3Selection = require("d3-selection");

var _interrupt = _interopRequireDefault(require("./interrupt.js"));

var _transition = _interopRequireDefault(require("./transition.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_d3Selection.selection.prototype.interrupt = _interrupt.default;
_d3Selection.selection.prototype.transition = _transition.default;
},{"d3-selection":"node_modules/d3-selection/src/index.js","./interrupt.js":"node_modules/d3-transition/src/selection/interrupt.js","./transition.js":"node_modules/d3-transition/src/selection/transition.js"}],"node_modules/d3-transition/src/active.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./transition/index.js");

var _schedule = require("./transition/schedule.js");

var root = [null];

function _default(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).state > _schedule.SCHEDULED && schedule.name === name) {
        return new _index.Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}
},{"./transition/index.js":"node_modules/d3-transition/src/transition/index.js","./transition/schedule.js":"node_modules/d3-transition/src/transition/schedule.js"}],"node_modules/d3-transition/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "transition", {
  enumerable: true,
  get: function () {
    return _index2.default;
  }
});
Object.defineProperty(exports, "active", {
  enumerable: true,
  get: function () {
    return _active.default;
  }
});
Object.defineProperty(exports, "interrupt", {
  enumerable: true,
  get: function () {
    return _interrupt.default;
  }
});

require("./selection/index.js");

var _index2 = _interopRequireDefault(require("./transition/index.js"));

var _active = _interopRequireDefault(require("./active.js"));

var _interrupt = _interopRequireDefault(require("./interrupt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./selection/index.js":"node_modules/d3-transition/src/selection/index.js","./transition/index.js":"node_modules/d3-transition/src/transition/index.js","./active.js":"node_modules/d3-transition/src/active.js","./interrupt.js":"node_modules/d3-transition/src/interrupt.js"}],"node_modules/d3-tip/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Collection = require("d3-collection");

var _d3Selection = require("d3-selection");

/**
 * d3.tip
 * Copyright (c) 2013-2017 Justin Palmer
 *
 * Tooltips for d3.js SVG visualizations
 */
// eslint-disable-next-line no-extra-semi
function _default() {
  var direction = d3TipDirection,
      offset = d3TipOffset,
      html = d3TipHTML,
      rootElement = document.body,
      node = initNode(),
      svg = null,
      point = null,
      target = null;

  function tip(vis) {
    svg = getSVGNode(vis);
    if (!svg) return;
    point = svg.createSVGPoint();
    rootElement.appendChild(node);
  } // Public - show the tooltip on the screen
  //
  // Returns a tip


  tip.show = function () {
    var args = Array.prototype.slice.call(arguments);
    if (args[args.length - 1] instanceof SVGElement) target = args.pop();
    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir = direction.apply(this, args),
        nodel = getNodeEl(),
        i = directions.length,
        coords,
        scrollTop = document.documentElement.scrollTop || rootElement.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || rootElement.scrollLeft;
    nodel.html(content).style('opacity', 1).style('pointer-events', 'all');

    while (i--) nodel.classed(directions[i], false);

    coords = directionCallbacks.get(dir).apply(this);
    nodel.classed(dir, true).style('top', coords.top + poffset[0] + scrollTop + 'px').style('left', coords.left + poffset[1] + scrollLeft + 'px');
    return tip;
  }; // Public - hide the tooltip
  //
  // Returns a tip


  tip.hide = function () {
    var nodel = getNodeEl();
    nodel.style('opacity', 0).style('pointer-events', 'none');
    return tip;
  }; // Public: Proxy attr calls to the d3 tip container.
  // Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  // eslint-disable-next-line no-unused-vars


  tip.attr = function (n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().attr(n);
    }

    var args = Array.prototype.slice.call(arguments);

    _d3Selection.selection.prototype.attr.apply(getNodeEl(), args);

    return tip;
  }; // Public: Proxy style calls to the d3 tip container.
  // Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value
  // eslint-disable-next-line no-unused-vars


  tip.style = function (n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().style(n);
    }

    var args = Array.prototype.slice.call(arguments);

    _d3Selection.selection.prototype.style.apply(getNodeEl(), args);

    return tip;
  }; // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction


  tip.direction = function (v) {
    if (!arguments.length) return direction;
    direction = v == null ? v : functor(v);
    return tip;
  }; // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or


  tip.offset = function (v) {
    if (!arguments.length) return offset;
    offset = v == null ? v : functor(v);
    return tip;
  }; // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip


  tip.html = function (v) {
    if (!arguments.length) return html;
    html = v == null ? v : functor(v);
    return tip;
  }; // Public: sets or gets the root element anchor of the tooltip
  //
  // v - root element of the tooltip
  //
  // Returns root node of tip


  tip.rootElement = function (v) {
    if (!arguments.length) return rootElement;
    rootElement = v == null ? v : functor(v);
    return tip;
  }; // Public: destroys the tooltip and removes it from the DOM
  //
  // Returns a tip


  tip.destroy = function () {
    if (node) {
      getNodeEl().remove();
      node = null;
    }

    return tip;
  };

  function d3TipDirection() {
    return 'n';
  }

  function d3TipOffset() {
    return [0, 0];
  }

  function d3TipHTML() {
    return ' ';
  }

  var directionCallbacks = (0, _d3Collection.map)({
    n: directionNorth,
    s: directionSouth,
    e: directionEast,
    w: directionWest,
    nw: directionNorthWest,
    ne: directionNorthEast,
    sw: directionSouthWest,
    se: directionSouthEast
  }),
      directions = directionCallbacks.keys();

  function directionNorth() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    };
  }

  function directionSouth() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    };
  }

  function directionEast() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    };
  }

  function directionWest() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    };
  }

  function directionNorthWest() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    };
  }

  function directionNorthEast() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    };
  }

  function directionSouthWest() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    };
  }

  function directionSouthEast() {
    var bbox = getScreenBBox(this);
    return {
      top: bbox.se.y,
      left: bbox.se.x
    };
  }

  function initNode() {
    var div = (0, _d3Selection.select)(document.createElement('div'));
    div.style('position', 'absolute').style('top', 0).style('opacity', 0).style('pointer-events', 'none').style('box-sizing', 'border-box');
    return div.node();
  }

  function getSVGNode(element) {
    var svgNode = element.node();
    if (!svgNode) return null;
    if (svgNode.tagName.toLowerCase() === 'svg') return svgNode;
    return svgNode.ownerSVGElement;
  }

  function getNodeEl() {
    if (node == null) {
      node = initNode(); // re-add node to DOM

      rootElement.appendChild(node);
    }

    return (0, _d3Selection.select)(node);
  } // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast),
  // nw(northwest), sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}


  function getScreenBBox(targetShape) {
    var targetel = target || targetShape;

    while (targetel.getScreenCTM == null && targetel.parentNode != null) {
      targetel = targetel.parentNode;
    }

    var bbox = {},
        matrix = targetel.getScreenCTM(),
        tbbox = targetel.getBBox(),
        width = tbbox.width,
        height = tbbox.height,
        x = tbbox.x,
        y = tbbox.y;
    point.x = x;
    point.y = y;
    bbox.nw = point.matrixTransform(matrix);
    point.x += width;
    bbox.ne = point.matrixTransform(matrix);
    point.y += height;
    bbox.se = point.matrixTransform(matrix);
    point.x -= width;
    bbox.sw = point.matrixTransform(matrix);
    point.y -= height / 2;
    bbox.w = point.matrixTransform(matrix);
    point.x += width;
    bbox.e = point.matrixTransform(matrix);
    point.x -= width / 2;
    point.y -= height / 2;
    bbox.n = point.matrixTransform(matrix);
    point.y += height;
    bbox.s = point.matrixTransform(matrix);
    return bbox;
  } // Private - replace D3JS 3.X d3.functor() function


  function functor(v) {
    return typeof v === 'function' ? v : function () {
      return v;
    };
  }

  return tip;
}
},{"d3-collection":"node_modules/d3-collection/src/index.js","d3-selection":"node_modules/d3-selection/src/index.js"}],"node_modules/data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reusableBarChart = reusableBarChart;

var _d3Scale = require("d3-scale");

var _d3Array = require("d3-array");

require("d3-transition");

var _d3Ease = require("d3-ease");

var _d3Tip = _interopRequireDefault(require("d3-tip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reusableBarChart() {
  let initialConfiguration = {
    width: 300,
    height: 50,
    padding: 5,
    data: [],
    colorScale: (0, _d3Scale.scaleLinear)().range(['#dfecda', '#65b344']),
    tooltipFormatter: d => {
      return `${d.data.label}: ${d.data.value}`;
    }
  };
  let width = initialConfiguration.width,
      height = initialConfiguration.height,
      padding = initialConfiguration.padding,
      data = initialConfiguration.data,
      colorScale = initialConfiguration.colorScale,
      tooltipFormatter = initialConfiguration.tooltipFormatter;
  let updateData,
      xScale = null;

  function chart(selection) {
    selection.each(function () {
      const barChartSvg = selection.append('svg').attr('height', height).attr('width', width);
      xScale = (0, _d3Scale.scaleBand)().domain(data.map(d => d.label)).range([0, width]);
      const xScalePadding = padding / xScale.bandwidth();
      xScale.paddingInner(xScalePadding);
      const yScale = (0, _d3Scale.scaleLinear)().domain([0, (0, _d3Array.max)(data, d => d.value)]).range([height, 0]);
      colorScale.domain([0, data.length]);
      const tooltip = (0, _d3Tip.default)().attr("class", "d3-tip").direction(function (d) {
        return d.isArea ? 's' : 'n';
      }).offset(function (d) {
        return d.isArea ? [8, 0] : [-8, 0];
      }).html(tooltipFormatter);
      barChartSvg.call(tooltip);
      const bars = barChartSvg.append("g").selectAll("rect").data(data);
      bars.enter().append("rect").attr('class', 'bar-area').attr("x", d => xScale(d.label)).attr("y", 0).attr("width", xScale.bandwidth()).attr("height", d => yScale(d.value)).attr("fill", (d, i) => '#eaeaea').on("mouseover", function (d) {
        tooltip.show({
          data: d,
          isArea: true
        }, this);
      }).on("mouseout", function () {
        tooltip.hide();
      });
      bars.enter().append("rect").attr('class', 'bar').attr("x", d => xScale(d.label)).attr("y", d => yScale(d.value)).attr("width", xScale.bandwidth()).attr("height", d => height - yScale(d.value)).attr("fill", (d, i) => colorScale(i)).on("mouseover", function (d) {
        tooltip.show({
          data: d,
          isArea: false
        }, this);
      }).on("mouseout", function () {
        tooltip.hide();
      });

      updateData = function () {
        xScale.domain(data.map(d => d.label));
        yScale.domain([0, (0, _d3Array.max)(data, d => d.value)]);
        colorScale.domain([0, data.length]);
        const updatedBars = barChartSvg.selectAll('.bar').data(data);
        const updatedBarAreas = barChartSvg.selectAll('.bar-area').data(data);
        updatedBarAreas.enter().append("rect").attr('class', 'bar-area').attr("x", d => xScale(d.label)).attr("y", 0).attr("width", xScale.bandwidth()).attr("height", d => yScale(d.value)).attr("fill", (d, i) => '#eaeaea').on("mouseover", function (d) {
          tooltip.show({
            data: d,
            isArea: true
          }, this);
        }).on("mouseout", function () {
          tooltip.hide();
        });
        updatedBars.enter().append("rect").attr('class', 'bar').attr("x", d => xScale(d.label)).attr("y", d => yScale(d.value)).attr("width", xScale.bandwidth()).attr("height", d => height - yScale(d.value)).attr("fill", (d, i) => colorScale(i)).on("mouseover", function (d) {
          tooltip.show({
            data: d,
            isArea: false
          }, this);
        }).on("mouseout", function () {
          tooltip.hide();
        });
        updatedBarAreas.transition().ease(_d3Ease.easeLinear).duration(750).attr("x", d => xScale(d.label)).attr("y", 0).attr("width", xScale.bandwidth()).attr("height", d => yScale(d.value)).attr("fill", (d, i) => '#eaeaea');
        updatedBars.transition().ease(_d3Ease.easeLinear).duration(750).attr("x", d => xScale(d.label)).attr("y", d => yScale(d.value)).attr("width", xScale.bandwidth()).attr("height", d => height - yScale(d.value)).attr("fill", (d, i) => colorScale(i));
        updatedBarAreas.exit().transition().ease(_d3Ease.easeLinear).duration(100).remove();
        updatedBars.exit().transition().ease(_d3Ease.easeLinear).duration(100).remove();
      };
    });
  }

  chart.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.padding = function (value) {
    if (!arguments.length) return padding;
    padding = value;
    const xScalePadding = padding / xScale.bandwidth();
    xScale.paddingInner(xScalePadding);
    if (typeof updateData === 'function') updateData();
    return chart;
  };

  chart.colors = function (value) {
    if (!arguments.length) return colorScale;
    colorScale.range([value[0], value[1]]);
    if (typeof updateData === 'function') updateData();
    return chart;
  };

  chart.tooltipFormatter = function (value) {
    if (!arguments.length) {
      return tooltipFormatter;
    } else {
      if (value == null) {
        tooltipFormatter = initialConfiguration.tooltipFormatter;
      } else {
        tooltipFormatter = value;
      }

      return chart;
    }
  };

  chart.data = function (value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === 'function') updateData();
    return chart;
  };

  return chart;
}
},{"d3-scale":"node_modules/d3-scale/src/index.js","d3-array":"node_modules/d3-array/src/index.js","d3-transition":"node_modules/d3-transition/src/index.js","d3-ease":"node_modules/d3-ease/src/index.js","d3-tip":"node_modules/d3-tip/index.js"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"css/barchart.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/load.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _d3Selection = require("d3-selection");

var _d3Format = require("d3-format");

var _reusableBarChart = require("data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart");

require("data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css");

require("../css/barchart.css");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var baseUrl = "http://localhost:8000";

function loadMenu(data) {
  var parentContainer = $(".data-menu__links");

  function setActive(el) {
    resetActive();
    $(this).addClass("menu__link_h4--active");
  }

  function resetActive() {
    $(".menu__link_h4--active", parentContainer).removeClass("menu__link_h4--active");
  }

  var categoryTemplate = $(".data-menu__category")[0].cloneNode(true);
  $(".data-menu__category").remove();

  for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        category = _Object$entries$_i[0],
        subcategories = _Object$entries$_i[1];

    var newCategory = categoryTemplate.cloneNode(true);
    $(".link__h1_title div", newCategory).text(category);
    parentContainer.append(newCategory);
    var h2Wrapper = $(".category__dropdown_wrapper", newCategory);
    var subCategoryTemplate = $(".data-menu__subcategory", h2Wrapper)[0].cloneNode(true);
    $(".data-menu__subcategory", h2Wrapper).remove();

    for (var _i2 = 0, _Object$entries2 = Object.entries(subcategories); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          subcategory = _Object$entries2$_i[0],
          indicators = _Object$entries2$_i[1];

      var newSubCategory = subCategoryTemplate.cloneNode(true);
      $(".data-menu__sub-category_trigger div", newSubCategory).text(subcategory);
      h2Wrapper.append(newSubCategory);
      var h3Wrapper = $(".sub-category__dropdown_wrapper", newSubCategory);
      var indicatorTemplate = $(".data-menu__indicator", h3Wrapper)[0].cloneNode(true);
      $(".data-menu__indicator", h3Wrapper).remove();

      for (var _i3 = 0, _Object$entries3 = Object.entries(indicators); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
            indicator = _Object$entries3$_i[0],
            subindicators = _Object$entries3$_i[1];

        var indicatorLabel = subindicators.indicator;
        var newIndicator = indicatorTemplate.cloneNode(true);
        $(".data-menu__indicator_trigger div", newIndicator).text(indicatorLabel);
        h3Wrapper.append(newIndicator);
        var indicatorWrapper = $(".indicator__dropdown_wrapper", newIndicator);
        var subIndicatorTemplate = $(".data-menu__sub-indicator", newIndicator)[0].cloneNode(true);
        $(".data-menu__sub-indicator", indicatorWrapper).remove();
        $(".menu__link_h4--active", indicatorWrapper).remove();

        if (subindicators.classes != undefined) {
          for (var _i4 = 0, _Object$entries4 = Object.entries(subindicators.classes); _i4 < _Object$entries4.length; _i4++) {
            var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
                subindicator = _Object$entries4$_i[0],
                value = _Object$entries4$_i[1];

            var newSubIndicator = subIndicatorTemplate.cloneNode(true);
            $("div:nth-child(2)", newSubIndicator).text(subindicator);
            indicatorWrapper.append(newSubIndicator);
            $(newSubIndicator).on("click", setActive);
          }

          ;
        } else {
          indicatorWrapper.remove();
        }
      }
    }

    ;
  }
}

function loadProfile(data) {
  var profileWrapper = $(".location-profile");
  var categoryTemplate = $(".location-profile__data-category--first")[0].cloneNode(true);
  var subcategoryTemplate = $(".data-category__indicator", categoryTemplate)[0].cloneNode(true);
  var indicatorTemplate = $(".indicator__chart", subcategoryTemplate)[0].cloneNode(true);
  $(".location-profile__data-category--first").remove();
  $(".location-profile__data-category").remove();
  $(".data-category__indicator", categoryTemplate).remove();
  $(".data-category__indicator--last", categoryTemplate).remove();
  $(".indicator__chart", subcategoryTemplate).remove();

  function addCategory(category, subcategories) {
    var newCategorySection = categoryTemplate.cloneNode(true);
    var wrapper = $(".grid__module_section", newCategorySection);
    $(".data-category__header_title h2", newCategorySection).text(category);
    profileWrapper.append(newCategorySection);

    for (var _i5 = 0, _Object$entries5 = Object.entries(subcategories); _i5 < _Object$entries5.length; _i5++) {
      var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
          subcategory = _Object$entries5$_i[0],
          indicators = _Object$entries5$_i[1];

      addSubcategory(wrapper, subcategory, indicators);
    }
  }

  function addSubcategory(wrapper, subcategory, indicators) {
    var newSubcategorySection = subcategoryTemplate.cloneNode(true);
    $(".indicator__title_wrapper h3", newSubcategorySection).text(subcategory);
    wrapper.append(newSubcategorySection);

    for (var _i6 = 0, _Object$entries6 = Object.entries(indicators); _i6 < _Object$entries6.length; _i6++) {
      var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i6], 2),
          indicator = _Object$entries6$_i[0],
          classes = _Object$entries6$_i[1];

      addIndicator(newSubcategorySection, indicator, classes);
    }
  }

  function addIndicator(wrapper, indicator, classes) {
    var newIndicatorSection = indicatorTemplate.cloneNode(true);
    $(".indicator__chart_title", newIndicatorSection).text(classes.indicator);
    wrapper.append(newIndicatorSection);
    var chartContainer = $(".indicator__chart_container", newIndicatorSection);
    addChart(chartContainer[0], classes.classes);
  }

  function addChart(container, classes) {
    var fmt = (0, _d3Format.format)(",.2f");
    var myChart = (0, _reusableBarChart.reusableBarChart)(); // TODO how big should this be?

    myChart.height(100);
    myChart.width(850);
    myChart.tooltipFormatter(function (d) {
      return "".concat(d.data.label, ": ").concat(fmt(d.data.value));
    });
    var data = [];

    for (var _i7 = 0, _Object$entries7 = Object.entries(classes); _i7 < _Object$entries7.length; _i7++) {
      var _Object$entries7$_i = _slicedToArray(_Object$entries7[_i7], 2),
          key = _Object$entries7$_i[0],
          value = _Object$entries7$_i[1];

      if (value != null) data.push({
        label: key,
        value: value
      });
    }

    $("img", container).remove();
    (0, _d3Selection.select)(container).call(myChart.data(data));
  }

  for (var _i8 = 0, _Object$entries8 = Object.entries(data); _i8 < _Object$entries8.length; _i8++) {
    var _Object$entries8$_i = _slicedToArray(_Object$entries8[_i8], 2),
        category = _Object$entries8$_i[0],
        subcategories = _Object$entries8$_i[1];

    addCategory(category, subcategories);
  }
}

function load() {
  var profileId = 1;
  var geographyId = 3;
  $.ajax({
    url: baseUrl + "/api/v1/profiles/" + profileId + "/geographies/" + geographyId + "/"
  }).done(function (data) {
    console.log(data);
    loadMenu(data);
    loadProfile(data);
    $(".d3-tip").css("z-index", 100);

    Webflow.require('ix2').init();
  });
}
},{"d3-selection":"node_modules/d3-selection/src/index.js","d3-format":"node_modules/d3-format/src/index.js","data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart":"node_modules/data-visualisations/src/charts/bar/reusable-bar-chart/reusable-bar-chart.js","data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css":"node_modules/data-visualisations/src/charts/bar/reusable-bar-chart/stories.styles.css","../css/barchart.css":"css/barchart.css"}],"js/index.js":[function(require,module,exports) {
"use strict";

var _load = _interopRequireDefault(require("./load"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log((0, _load.default)());
},{"./load":"js/load.js"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53026" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map