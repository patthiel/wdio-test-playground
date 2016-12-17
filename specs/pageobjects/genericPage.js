class Page {
  constructor() {
    this.title = "Generic Page"
  }

  open(path) {
    browser.url('/' + path)
  }
}
module.exports = Page;
