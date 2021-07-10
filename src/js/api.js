import { Observable } from './utils'
import { LoginDialogue } from './elements/login_dialogue';


const MAX_FAILURES = 3;

export class API extends Observable {
  constructor(serverUrl) {
    super();
    this.token = null;
    this.baseUrl = `${serverUrl}/api/v1`;
    this.busyLoggingIn = false;
    this.failedLogins = 0;
  }

  getToken() {
    return sessionStorage.getItem("token");
  }

  _setToken(token) {
    if (token == null)
      sessionStorage.removeItem("token")
    else
      sessionStorage.setItem("token", token);

  }

  getProfile(profileId, areaCode) {
    const url = `${this.baseUrl}/all_details/profile/${profileId}/geography/${areaCode}/?format=json`;
    return this._loadUrl(url);
  }

  getProfileConfiguration(hostname) {
    const url = `${this.baseUrl}/profile_by_url?format=json`;
    return this._loadUrl(url, { 'wm-hostname': hostname });
  }

  loadChoroplethData(profileId, areaCode, indicatorId) {
    const url = `${this.baseUrl}/profile/${profileId}/geography/${areaCode}/indicator/${indicatorId}/`;
    return this._loadUrl(url);
  }

  loadThemes(profileId) {
    const url = `${this.baseUrl}/profile/${profileId}/points/themes/?format=json`;
    return this._loadUrl(url);
  }

  search(profileId, searchTerm) {
    const url = `${this.baseUrl}/geography/search/${profileId}/?q=${searchTerm}&format=json`;
    return this._loadUrl(url);
  }

  loadPoints(profileId, categoryId, areaCode) {
    let url = '';
    if (areaCode == undefined)
      url = `${this.baseUrl}/profile/${profileId}/points/category/${categoryId}/points/?format=json`;
    else
      url = `${this.baseUrl}/profile/${profileId}/points/category/${categoryId}/geography/${areaCode}/points/?format=json`;
    return this._loadUrl(url);
  }

  loadAllPoints(profileId, areaCode) {
    let url = `${this.baseUrl}/profile/${profileId}/points/geography/${areaCode}/points/?format=json`
    return this._loadUrl(url);
  }

  async _waitToLogIn() {
    let count = 0;
    while (true) {
      if (!this.busyLoggingIn)
        break
      console.log("Another login request already sent. Waiting")
      await new Promise(resolve => setTimeout(resolve, 200))

      count += 1

      if (count > 500) {
        throw "Tired of waiting for login. Something went wrong"
      }
    }
  }

  async _loadUrl(url, headers = {}) {
    let response;
    const self = this;
    response = await this._getTokenJSON(url, headers)
    if (response.status == 401 || response.status == 403) {
      await this._waitToLogIn();
      try {
        await self._authenticate(url);
        response = await this._getTokenJSON(url, headers);
      } catch (err) {
        console.error(err)

      } finally {
        console.log("stopped logging in")

        this.busyLoggingIn = false;

      }
    }
    return await response.json();
  }

  async _authenticate(nextUrl) {
    const url = `${this.baseUrl}/rest-auth/login/`;
    this.token = this.getToken();
    if (this.token != null && this.token != '') {
      console.log("Already logged in, skipping login")
      return
    }

    if (this.busyLoggingIn)
      return;

    const loginDialogue = new LoginDialogue();
    // This is a race condition but shouldn't be a big deal if two requests happen simultaneously
    this.busyLoggingIn = true;
    while (true) {
      if (this.failedLogins >= MAX_FAILURES)
        throw 'Too many failed logins';

      const credentials = await loginDialogue.displayLogin(nextUrl);
      const response = await this._postJSON(url, credentials)
      if (response.ok) {
        const json = await response.json();
        if (json['key'] != undefined) {
          this._setToken(json['key'])
          this.failedLogins = 0;
          break;
        } else {
          throw 'Expected to receive a token';
        }
      } else if (response.status == 400 || response.status == 403) {
        this.failedLogins += 1
        continue
      } else {
        throw "Some network exception occurred: " + response.status;
      }

    }
    this.busyLoggingIn = false;
  }

  async logout() {
    const self = this;
    this.token = this.getToken();
    if (this.token != null) {
      const url = `${this.baseUrl}/rest-auth/logout/`;
      await _postJSON(url, this.token)
      self._setToken(null);
    }
  }

  async _getTokenJSON(url, headers = {}) {
    const token = this.getToken();
    if (token != '' && token != null)
      headers['Authorization'] = `Token ${token}`;

    return this._getJSON(url, headers)
  }

  async _postJSON(url, data = {}, headers = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    headers = { ...defaultHeaders, ...headers };
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: headers,
      redirect: 'follow',
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
  }

  async _getJSON(url, headers = {}) {
    return await fetch(url, { headers: headers });
  }
}
