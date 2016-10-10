describe('Wdio waitforExist Suite', () => {

    it('waitForExist Timeout - test will FAIL', () => {
        browser.url('http://www.apple.com');
        browser.waitForExist('something', 5000);	
    });

    it('waitForExist Timeout - test SHOULD FAIL', () => {
	    browser.waitForExist('.ac-gn-link ac-gn-link-watch', 5000);
    });

    it('waitForExist Succeeds - Test should PASS', () => {
    	browser.waitForExist('.ac-gn-link', 5000);
    });

});