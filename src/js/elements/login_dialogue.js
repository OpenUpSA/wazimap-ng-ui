import {Observable} from '../utils';

export class LoginDialogue extends Observable {
    constructor(rootElement) {
        super();
        // this.draw();

    }

    displayLogin(msg) {
        const username = prompt(`Please enter your name (${msg})`, "");
        const password = prompt("Please enter your password", "");

        return {
            username: username,
            password: password
        }
    }

}