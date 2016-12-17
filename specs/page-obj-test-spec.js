const LoginPage = require('./pageobjects/Login.page')

describe('test suite', () => {
  it('should login', () => {
    LoginPage.open()
    LoginPage.signInHeader.click()
    LoginPage.username.waitForExist()
    LoginPage.username.setValue('globaldomain@mailinator.com')
    LoginPage.password.setValue('globaldomain')
    LoginPage.signIn()
    const loginDisplays =
        LoginPage.signInHeader.waitForExist(2500, true)
    expect(loginDisplays).toBe(true)
  })
})
