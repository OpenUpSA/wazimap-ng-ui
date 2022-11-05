import {Observable} from './utils'
import {LoginDialogue} from './elements/login_dialogue';

const loginDialogue = new LoginDialogue();
const AUTHENTICATION_ERROR = "Not Authenticated";

const MAX_FAILURES = 3;

export class API extends Observable {
    constructor(serverUrl) {
        super();
        this.token = null;
        this.baseUrl = `${serverUrl}/api/v1`;
        this.busyLoggingIn = false;
        this.failedLogins = 0;
        this.abortController = null;
    }

    getToken() {
        return sessionStorage.getItem("token");
    }

    setToken(token) {
        if (token == null)
            sessionStorage.removeItem("token")
        else
            sessionStorage.setItem("token", token);

    }

    getProfile(profileId, areaCode, version) {
        const url = `${this.baseUrl}/all_details/profile/${profileId}/geography/${areaCode}/?version=${version}&skip-children=true&format=json`;
        return this.loadUrl(url, this.abortController);
    }

    getProfile(profileId, areaCode) {
        const url = `${this.baseUrl}/all_details/profile/${profileId}/geography/${areaCode}/?skip-children=true&format=json`;
        return this.loadUrl(url, this.abortController);
    }

    getProfileConfiguration(hostname) {
        const url = `${this.baseUrl}/profile_by_url?format=json`;
        return this.loadUrl(url, null, {'wm-hostname': hostname});
    }

    loadChoroplethData(profileId, areaCode, indicatorId) {
        const url = `${this.baseUrl}/profile/${profileId}/geography/${areaCode}/indicator/${indicatorId}/`;
        return this.loadUrl(url, this.abortController);
    }

    getIndicatorChildData(profileId, areaCode, indicatorId) {
        const url = `${this.baseUrl}/profile/${profileId}/geography/${areaCode}/indicator/${indicatorId}/child_data/`;
        return this.loadUrl(url, this.abortController);
    }

    loadThemes(profileId) {
        const url = `${this.baseUrl}/profile/${profileId}/points/themes/?format=json`;
        return this.loadUrl(url);
    }

    search(profileId, searchTerm) {
        const url = `${this.baseUrl}/geography/search/${profileId}/?q=${searchTerm}&format=json`;
        return this.loadUrl(url);
    }

    loadPoints(profileId, categoryId, areaCode) {
        let url = '';
        if (areaCode == undefined)
            url = `${this.baseUrl}/profile/${profileId}/points/category/${categoryId}/points/?format=json`;
        else
            url = `${this.baseUrl}/profile/${profileId}/points/category/${categoryId}/geography/${areaCode}/points/?format=json`;
        return this.loadUrl(url);
    }

    loadAllPoints(profileId, areaCode) {
        let url = `${this.baseUrl}/profile/${profileId}/points/geography/${areaCode}/points/?format=json`
        return this.loadUrl(url);
    }

    async waitToLogIn() {
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

    async loadUrl(url, abortController, headers = {}) {
        let response;
        const self = this;
        response = await this.getTokenJSON(url, abortController, headers)
        if (response.status === 401 || response.status === 403) {
            await this.waitToLogIn();
            try {
                await self.authenticate(url);
                response = await this.getTokenJSON(url, abortController, headers);
            } finally {
                console.log("stopped logging in")

                this.busyLoggingIn = false;

            }
        } else if (response.status === 404) {
            throw response;
        }

        const json = await response.json();

        return json;
    }

    async authenticate(nextUrl) {
        const url = `${this.baseUrl}/rest-auth/login/`;

        if (this.getToken() != null) {
            console.log("Already logged in. Not authenticating")
            return
        }

        if (this.busyLoggingIn)
            return;

        // This is a race condition but shouldn't be a big deal if two requests happen simultaneously
        this.busyLoggingIn = true;
        while (true) {
            if (this.failedLogins >= MAX_FAILURES)
                throw 'Too many failed logins';

            const credentials = await loginDialogue.displayLogin(nextUrl);
            const response = await postJSON(url, credentials)
            if (response.ok) {
                const json = await response.json();
                if (json['key'] != undefined) {
                    this.setToken(json['key'])
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
        if (this.getToken() != null) {
            const url = `${this.baseUrl}/rest-auth/logout/`;
            const response = await postJSON(url, this.token)
            self.setToken(null);
        }
    }

    async getTokenJSON(url, abortController = null, headers = {}) {
        const token = this.getToken();
        if (token != '' && token != null)
            headers['Authorization'] = `Token ${token}`;

        return getJSON(url, abortController, headers)
    }

    async getThemesCount(profileId, areaCode, version) {
        const url = `${this.baseUrl}/profile/${profileId}/geography/${areaCode}/themes_count/?version=${version}&format=json`;
        return this.loadUrl(url, this.abortController);
    }

    async getChildrenIndicators(profileId, areaCode, version) {
        const url = `${this.baseUrl}/children-indicators/profile/${profileId}/geography/${areaCode}/?version=${version}&format=json`;
        return this.loadUrl(url, this.abortController);
    }

    async getIndicatorSummary(profileId, areaCode, version) {
        const url = `${this.baseUrl}/profile/${profileId}/geography/${areaCode}/profile_indicator_summary/?version=${version}&format=json`;
        return this.loadUrl(url, this.abortController);
    }

    cancelAndInitAbortController() {
        if (this.abortController !== null) {
            //on first request this.abortController is null
            this.abortController.abort();
        }

        this.abortController = new AbortController();
    }
}

async function postJSON(url, data = {}, headers = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    headers = {...defaultHeaders, ...headers};
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
}

async function getJSON(url, abortController, headers = {}) {
    const response = await fetch(url,
        {
            headers: headers,
            signal: abortController === null ? null : abortController.signal
        })
    return response;
}
