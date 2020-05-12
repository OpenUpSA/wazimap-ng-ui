import {Observable} from './utils'
const AUTHENTICATION_ERROR = "Not Authenticated";

export class API extends Observable {
    constructor(serverUrl) {
        super();
        this.token = null;
        this.baseUrl = `${serverUrl}/api/v1`;
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

    getProfile(profileId, areaCode) {
        const url = `${this.baseUrl}/all_details/profile/${profileId}/geography/${areaCode}/?format=json`;
        return this.loadUrl(url);
    }

    loadThemes(profileId) {
        const url = `${this.baseUrl}/points/profile/${profileId}/themes/?format=json`;
        return this.loadUrl(url);
    }

    search(profileId, searchTerm) {
        const url = `${this.baseUrl}/geography/search/${profileId}/?q=${searchTerm}&format=json`;
        return this.loadUrl(url);
    }

    loadPoints(profileId, categoryId) {
        const url = `${this.baseUrl}/points/profile/${profileId}/category/${categoryId}/points/?format=json`;
        return this.loadUrl(url);
    }

    async loadUrl(url) {
        let response;
        const self = this;
        response = await this.getTokenJSON(url, self.getToken())
        if (response.status == 401 || response.status == 403) {
            await self.authenticate(url, "ye", "trythisathome");
            response = await this.getTokenJSON(url, self.getToken());
        }

        const json = await response.json();

        return json;
    }

    async authenticate(nextUrl, username, password) {
        const self = this;
        const url = `${this.baseUrl}/rest-auth/login/`;
        const response = await postJSON(url, {username:username, password:password})
        if (response.ok) {
            const json = await response.json();
            if (json['key'] != undefined)
                self.setToken(json['key'])
            else
                throw 'Expected to receive a token';
        } else {
            throw 'Error occurred authenticating';
        }
    }

    async logout() {
        const self = this;
        if (this.getToken() != null) {
            console.log("logging out really really")
            const url = `${this.baseUrl}/rest-auth/logout/`;
            const response =  await postJSON(url, this.token)
            self.setToken(null);
        } else {
            console.log("logging out but not really")
        }

    }

    async getTokenJSON(url) {
        let headers;
        const token = this.getToken();
        if (token != '')
            headers = {Authorization: `Token ${token}`}
        else
            headers = {}

        return getJSON(url, headers)
    }

}

async function postJSON(url, data ={}, headers={}) {
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

async function getJSON(url, headers={}) {
    const response = await fetch(url, {headers: headers})
    return response;
}
