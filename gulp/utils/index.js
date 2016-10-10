import {readdirSync} from 'fs';
import {difference, forEach, keys, merge, reduce} from 'ramda';

const utils = difference(readdirSync('gulp/utils'), ['index.js']);
const reducer = (helpers, util) => {
    // use commomjs imports here for dynamic imports
    return merge(helpers, require('./' + util));
};
const helpers = reduce(reducer, {}, utils);

// use commomjs exports here for dynamic exports
forEach(key => exports[key] = helpers[key], keys(helpers));
