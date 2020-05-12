import {Observable} from '../utils';

export class LoginDialogue extends Observable {
    constructor(rootElement) {
        super();
        // this.draw();

    }

    displayLogin(msg) {
        const username = prompt(`Please enter your name (${msg})`, "Harry Potter");
        const password = prompt("Please enter your password", "Passwordd");

        return {
            username: username,
            password: password
        }
    }

}