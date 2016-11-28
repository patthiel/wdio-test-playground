xdescribe('WDIO waitforExist Suite', () => {

    beforeAll(() => {
        browser.url('http://www.apple.com');
        console.log('This should not be logged!');
    });
	// This test will Fail in the WDIO Runner
    it('waitForExist Timeout - test will FAIL', () => {
        browser.waitForExist('something', 5000);	
    });

    // This test will be executed and should fail, but the results are not outputted
    it('waitForExist Timeout - test SHOULD FAIL', () => {
	    browser.waitForExist('.ac-gn-link ac-gn-link-watch', 5000);
    });
	
    it('waitForExist Succeeds - Test should PASS', () => {
    	browser.waitForExist('.ac-gn-link', 5000);
    });

});
