import {format as d3format} from 'd3-format';

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
    req.onerror = () => {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

export class Observer {
  constructor() {
    this.eventListeners = {}
  }

  on = (event, func) => {
    if (this.eventListeners[event] == undefined)
      this.eventListeners[event] = [];

    this.eventListeners[event].push(func);
  };

  triggerEvent = (event, payload) => {
    if (this.eventListeners[event] != undefined) {
      this.eventListeners[event].forEach((listener) => {
        listener(payload);
      });
    }
  };
}

export var numFmt = d3format(",.2d");

