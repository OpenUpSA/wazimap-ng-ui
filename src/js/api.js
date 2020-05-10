import {Observable} from './utils'
import {LoginHandler} from './authentication'

const loginHandler = new LoginHandler();

export class API extends Observable {
    constructor(serverUrl) {
        super();
        this.token = null;
        this.baseUrl = `${serverUrl}/api/v1`;
    }

    getProfile(profileId, areaCode) {
        const url = `${this.baseUrl}/all_details/profile/${profileId}/geography/${areaCode}/?format=json`;
        return getJSON(url)
    }

    loadThemes(profileId) {
        const url = `${this.baseUrl}/points/profile/${profileId}/themes/?format=json`;
        return getJSON(url)

    }

    search(profileId, searchTerm) {
        const url = `${this.baseUrl}/geography/search/${profileId}/?q=${searchTerm}&format=json`;
        return getJSON(url)
    }

    loadPoints(profileId, categoryId) {
        const url = `${this.baseUrl}/points/profile/${profileId}/category/${categoryId}/points/?format=json`
        return getJSON(url)

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
            } else if (req.status == 401 || request.status == 403) {
                alert("Not logged in")
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
