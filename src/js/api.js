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

    loadUrl(url) {
        if (this.getToken() == null)
            console.log("Not logged in")
        else
            console.log("Currently looged in");

        const self = this;
        return getJSON(url, "GET", self.getToken())
            .catch(error => {
                if (error.message == AUTHENTICATION_ERROR) {
                    self.authenticate(url, "ye", "trythisathome")
                        .then(resp => {
                            getJSON(url, "GET", self.getToken());
                        })
                } else {
                    throw error;
                }
            })
    }

    authenticate(nextUrl, username, password) {
        const self = this;
        const url = `${this.baseUrl}/rest-auth/login/`;
        // console.log(`Authenticating: ${url}`)
        return getJSON(url, "POST", null, {username:username, password:password}).then(resp => {
            console.log(`Awesome. Got a key:${resp['key']}`);
            if (resp['key'] != undefined) {
                self.setToken(resp['key']);
            }
            // TODO deal with rejection
        })
    }

    logout() {
        const self = this;
        if (this.getToken() != null) {
            const url = `${this.baseUrl}/rest-auth/logout/`;
            return getJSON(url, "POST", this.token).then(resp => {
                console.log("logging out - really really")
                self.setToken(null);

            })
        }

        console.log("logging out but not really")

        return Promise.resolve();
    }
}


function setPostHeaders(xhr) {
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
}


export function getJSON(url, method='GET', token=null, params=null) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        if (token != null)
            xhr.setRequestHeader('Authorization', `Token ${token}`);

        if (params != null) {
            setPostHeaders(xhr);
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }


        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                const resp = JSON.parse(this.response);
                resolve(resp);
            }
        }

        xhr.onload = () => {
            if (xhr.status == 200) {
                console.log("Ignoring 200 event")
                /*
                const json = JSON.parse(xhr.response);
                resolve(json);
                */
            } else if (xhr.status == 401 || xhr.status == 403) {
                reject(Error(AUTHENTICATION_ERROR));
            }
            else {
                reject(Error(xhr.statusText));
            }
        };

        // Handle network errors
        xhr.onerror = () => {
            reject(Error("Network Error"));
        };
    });
}
