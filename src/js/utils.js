export function getJSON(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        var json = JSON.parse(req.response);
        resolve(json);
      } else {
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

export function Observer() {
  this.eventListeners = {}
}

Observer.prototype = {

  on: function(event, func) {
    if (this.eventListeners[event] == undefined)
      this.eventListeners[event] = [];

    this.eventListeners[event].push(func);
  },

  triggerEvent: function(event, payload) {
    if (this.eventListeners[event] != undefined) {
      this.eventListeners[event].forEach(function(listener) {
        listener(payload);
      });
    }
  },
}