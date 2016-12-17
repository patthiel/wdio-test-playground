"use strict"

var Page = require('./genericPage');

class LoginPage extends Page {
  get signInHeader() { return $('[data-qa-header-login]')}
  get username() { return $('[data-qa-login-email]')}
  get password() { return $('[data-qa-login-password]')}
  get loginButton() { return $('[data-qa-login-submit]')}

  open() {
    super.open('')
  }

  signIn() {
    this.loginButton.click();
  }

}
module.exports = new LoginPage()
