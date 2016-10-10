import {statSync} from 'fs';
import {sync} from 'glob';
import {join} from 'path';
import {compose, filter, last, partialRight, split} from 'ramda';

/**
 * Is the given path a directory?
 * @param  {String}     uri
 * @return {Boolean}    True, if a directory; false, otherwise.
 */
export const isDir = (path) => statSync(path).isDirectory();

/**
 * Is the given path a file?
 * @param  {String}     uri
 * @return {Boolean}    True, if a file; false, otherwise.
 */
export const isFile = (path) => statSync(path).isFile();

/**
 * Create a glob string for directory one-level deep
 * @param {String} Target directory
 * @return {String} Glob for directory one-level deep
 */
export const globLeaf = partialRight(join, ['*']);

/**
 * Create a glob string for all HTML
 * and JavaScript in a given directory.
 * @param {String} Target directory
 * @return {String} Glob for all client-side files
 */
export const globAllStr = partialRight(join, ['**/*.{html,j2,js}']);

/**
 * Create a glob string for all CSS in a given directory.
 * @param {String} Target directory
 * @return {String} Glob for CSS
 */
export const globCssStr = partialRight(join, ['**/*.css']);

/**
 * Create a glob string for all HTML in a given directory.
 * @param {String} Target directory
 * @return {String} Glob for HTML
 */
export const globHtmlStr = partialRight(join, ['**/*.{html,j2}']);

/**
 * Create a glob string for all JavaScript in a given directory.
 * @param {String} Target directory
 * @return {String} Glob for JavaScript
 */
export const globJsStr = partialRight(join, ['**/*.js']);

/**
 * Create a glob string for all python scripts in a given directory.
 * @param {String} Target directory
 * @return {String} Glob for python scripts
 */
export const globPyStr = partialRight(join, ['**/*.py']);

/**
 * Create a glob string for all SCSS in a given directory.
 * @param {String} Target directory
 * @return {String} Glob for SCSS
 */
export const globScssStr = partialRight(join, ['**/*.scss']);

/**
 * Glob a directory one-level deep for files
 * @param {String} Directory src path
 * @return {Array[String]} Names of sub-directories one-level deep
 */
export const globForFiles = compose(filter(isFile), sync, globLeaf);

/**
 * Glob a directory one-level deep for sub-directories
 * @param {String} Directory src path
 * @return {Array[String]} Names of sub-directories one-level deep
 */
export const globForSubDirs = compose(filter(isDir), sync, globLeaf);

/**
 * Parse a resource from a given uri
 * @param {String} Uri
 * @return {String} resource
 */
export const parseResource = compose(last, split('/'));
