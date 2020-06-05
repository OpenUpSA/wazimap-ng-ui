import {Observable} from '../utils';

const loginModalClassName = '.login-modal';

export class LoginDialogue extends Observable {
    constructor(rootElement) {
        super();

        this.username = '';
        this.password = '';
        this.credentialsReceived = false;
    }

    async displayLogin(msg) {
        await this.showModal();
        return {
            username: this.username,
            password: this.password
        }
    }

    async showModal() {
        $(loginModalClassName).removeClass('hidden');

        $(loginModalClassName).find('input[type="submit"]').on('click', () => {
            this.loginClicked();
        })

        await this.waitForCredentials();
    }

    loginClicked() {
        this.username = $('input#Email').val();
        this.password = $('input#Password').val();
        this.credentialsReceived = true;

        $(loginModalClassName).addClass('hidden');
    }

    async waitForCredentials() {
        let count = 0;
        while (true) {
            if (this.credentialsReceived)
                break
            await new Promise(resolve => setTimeout(resolve, 200))

            count += 1

            if (count > 500) {
                throw "Tired of waiting for login. Something went wrong"
            }
        }
    }
}