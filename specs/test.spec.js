const { productPage } = require('./ui-maps/product-ui-map');
const { values } = require('lodash');


describe('WebDriverIO - Anthropologie - Demo Suite', () => {

    beforeAll(() => {
        // Set Desktop viewport
        browser.setViewportSize({ width: 1200, height: 900 });
    });


    it('should navigate to the a product page', () => {
        browser.url('https://www.anthropologie.com/shop/monogram-mug');

        // Create an array of our UI Map Elements
        const pdpMap = values(productPage);
        
        // We can quickly assert for lots of elements being visible! 
        pdpMap
            .map(element => $(element).isVisible())
            .forEach((element, i) => {
                expect(element).toBe(true);
                if (!element) console.log(`${pdpMap[i]} element was not found!`);
            });
    });

    it('should poll for size select element to be visible', () => {
        browser.waitForVisible('[data-qa-product-sizes-select]', 10000);

        /* waitFor methods poll the page for a given number
        *  of seconds for an element to be visible.
        *  Once visible, WebdriverIO moves on to the next line of code
        */
    });

    it('should select by visible text', () => {
	    browser.selectByVisibleText('[data-qa-product-sizes-select]', 'C');

        // Pause for 6 seconds to observe our updated select box
        browser.pause(6000);
    });
	
    it('should select by value', () => {
    	browser.selectByValue('[data-qa-product-sizes-select]', 'F');

        // Pause for 5 seconds to observe
        browser.pause(5000);
    });

    it('should successfully add to cart', () => {
        browser.click('[data-qa-add-to-cart]');
        
        // We can create a custom waitFor command
        browser.waitUntil(function() {
            return !browser.getAttribute('[data-qa-add-to-cart]', 'class').includes('--pending');
        }, 5000);

        // Wait for cart count to exist
        browser.waitForExist('[data-qa-cart-count]', 10000);
        
        const cartCount = $('[data-qa-cart-count]');
        
        expect(cartCount.isVisible()).toBe(true);
        expect(cartCount.getText()).toBe('1');
    });

    it('should navigate to cart', () => {
        browser.click('[data-qa-cart-count]');

        // Wait for a cart element to be visible 
        browser.waitForVisible('[data-qa-cart-title]', 10000);
        
        // Assert Order Summary Header exists
        const orderSummary = browser.element('[data-qa-order-summary-header]');
        expect(orderSummary.isVisible()).toBe(true);

        browser.pause(5000);
    });
});
