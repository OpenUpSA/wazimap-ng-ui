import { Observable } from '../utils';


export class LoginDialogue extends Observable {
  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.credentialsReceived = false;
    this.loginModalClassName = '.login-modal';
  }

  async displayLogin() {
    await this._showModal();
    return {
      username: this.username,
      password: this.password
    }
  }

  async _showModal() {
    $(".login__close").addClass('hidden');
    $(this.loginModalClassName).removeClass('hidden');
    $(this.loginModalClassName).css('display', 'flex', 'align', 'center', 'justify', 'center');
    $(this.loginModalClassName).find('input[type="submit"]').on('click', () => {
      this._loginClicked();
    })

    await this._waitForCredentials();
  }

  _loginClicked() {
    this.username = $('input#Email').val();
    this.password = $('input#Password').val();
    if (this.username && this.password) {
      this.credentialsReceived = true;
      $(this.loginModalClassName).addClass('hidden');
    }

  }

  async _waitForCredentials() {
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
