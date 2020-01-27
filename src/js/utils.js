import {format as d3format} from 'd3-format';

const queryCache = {};

export class Cache {
  constructor() {
    this.memoryCache = {}

  }

  getItem(key) {
    const val = localStorage.getItem(key);
    if (val != null)
      return JSON.parse(val);

    if (this.memoryCache[key] != undefined)
      return this.memoryCache[key]

    return null;
  }

  setItem(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.log(`Error using localstorage, reverting to memory cache: ${err}`)
      this.memoryCache[key] = val;
    }
  }
}

const cache = new Cache();

export function getJSON(url, skipCache=false) {
  //if (queryCache[url] != undefined && !skipCache) {
  if (cache.getItem(url) != null && !skipCache) {
    return Promise.resolve(cache.getItem(url));
    //return Promise.resolve(queryCache[url])
  }

  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = () => {
      if (req.status == 200) {
        const json = JSON.parse(req.response);
       cache.setItem(url, json);
        resolve(json);
      } else {
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = () => {
      reject(Error("Network Error"));
    };

    req.send();
  });
}

export class Observable {
  constructor() {
    this.eventListeners = {}
  }

  on(event, func) {
    if (this.eventListeners[event] == undefined)
      this.eventListeners[event] = [];
    this.eventListeners[event].push(func);
  };

  triggerEvent(event, payload) {
    if (this.eventListeners[event] != undefined) {
      this.eventListeners[event].forEach(listener => {
        listener(payload);
      });
    }
  };
}

export const numFmt = d3format(",.2d");

