describe('WDIO waitforExist Suite', () => {

    beforeAll(() => {
        // Set Desktop viewport
        browser.setViewportSize({ width: 1200, height: 900 });
    });


    it('should navigate to the a product page', () => {
        browser.url('https://www.anthropologie.com/shop/monogram-mug');
    });

    it('should poll for size select element to be visible', () => {
        browser.waitForVisible('[data-qa-product-sizes-select]', 10000);
    });

    it('should select by visible text', () => {
	    browser.selectByVisibleText('[data-qa-product-sizes-select]', 'C');

        // Pause for 5 seconds to observe, the select box has been updated
        browser.pause(1000);
    });
	
    it('should select by value', () => {
    	browser.selectByValue('[data-qa-product-sizes-select]', 'F');

        // Pause for 5 seconds to observe, the select box has been updated
        browser.pause(1000);
    });

});
