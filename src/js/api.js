import {Observable} from './utils'
import {LoginHandler} from './authentication'

const loginHandler = new LoginHandler();
const AUTHENTICATION_ERROR = "Not Authenticated";

export class API extends Observable {
    constructor(serverUrl) {
        super();
        this.token = null;
        this.baseUrl = `${serverUrl}/api/v1`;
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

    loadUrl(url) {
        return getJSON(url).catch(error => {
            if (error.message == AUTHENTICATION_ERROR) {
                alert("not not not logged in")
            } else {
                throw error;
            }
        })
    }
}

export function getJSON(url, skipCache = true) {

    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = () => {
            if (req.status == 200) {
                const json = JSON.parse(req.response);
                resolve(json);
            } else if (req.status == 401 || req.status == 403) {
                reject(Error(AUTHENTICATION_ERROR));
                loginHandler.triggerEvent("authentication_request", {});    
            }
            else {
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
