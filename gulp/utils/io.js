import {
    readFileSync,
    statSync,
    symlinkSync,
    unlinkSync,
    writeFileSync
} from 'fs';
import {
    compose,
    last,
    split
} from 'ramda';

import {
    BASE_ROOT,
    BRAND_ROOT,
    TEMP_ROOT
} from '../config';

/**
 * Change a base src path to a brand src path.
 * @param  {String} srcPath Base src path
 * @return {String}         Brand src path
 */
export const baseToBrandSrc = srcPath => srcPath.replace(BASE_ROOT, BRAND_ROOT);

/**
 * Change a base src path to a temp src path.
 * @param  {String} srcPath Base src path
 * @return {String}         Temp src path
 */
export const baseToTempSrc = srcPath => srcPath.replace(BASE_ROOT, TEMP_ROOT);

/**
 * Change a brand src path to a base src path.
 * @param  {String} srcPath Brand src path
 * @return {String}         Base src path
 */
export const brandToBaseSrc = srcPath => srcPath.replace(BRAND_ROOT, BASE_ROOT);

/**
 * Change a brand src path to a temp src path.
 * @param  {String} srcPath Brand src path
 * @return {String}         Temp src path
 */
export const brandToTempSrc = srcPath => srcPath.replace(BRAND_ROOT, TEMP_ROOT);

/**
 * Copy a file
 * @param  {String} srcPath  Src path for the file
 * @param  {String} destPath Dest path to copy file to
 */
export const copy = (srcPath, destPath) => {
    if (exists(srcPath)) {
        writeFileSync(destPath, readFileSync(srcPath))
    }
};

/**
 * Copy a brand file to the .tmp directory
 * @param  {String} srcPath Brand file src path
 */
export const copyBrandSrcToTemp = srcPath => copy(srcPath, brandToTempSrc(srcPath));

/**
 * Copy a base file to the .tmp directory
 * then merge (copy) the corresponding brand
 * file (if it exists) to the .tmp directory
 * @param  {String} srcPath Base file src path
 */
export const copyMergeBaseSrcToTemp = srcPath => {
    copy(srcPath, baseToTempSrc(srcPath));
    copy(baseToBrandSrc(srcPath), baseToTempSrc(srcPath));
};

/**
 * Does the src path exist?
 * @param  {String}     srcPath
 * @return {Boolean}    True, if src exists; false, otherwise.
 */
export const exists = srcPath => {
    try {
        const stats = statSync(srcPath);
    } catch (err) {
        return false;
    }

    return true;
};

/**
 * Get the file name for a file path
 * @param {String} filePath Path to a file
 * @return {String} Name of the file
 */
export const getFileName = compose(last, split('/'));

/**
 * Is the src path a directory?
 * @param  {String}     srcPath
 * @return {Boolean}    True, if src is a directory; false, otherwise.
 */
export const isDir = srcPath => {
    let stats;

    try {
        stats = statSync(srcPath);
    } catch (err) {
        return false;
    }

    return stats.isDirectory();
};

/**
 * Is the src path a file?
 * @param  {String}     srcPath
 * @return {Boolean}    True, if src is a file; false, otherwise.
 */
export const isFile = srcPath => {
    let stats;

    try {
        stats = statSync(srcPath);
    } catch (err) {
        return false;
    }

    return stats.isFile();
};

/**
 * Is the src path within the base project?
 * @param  {String} srcPath
 * @return {Boolean}         True, if the base project contains the src path; false, otherwise.
 */
export const isBaseSrc = srcPath => srcPath.includes(BASE_ROOT);

/**
 * Is the src path within the brand project?
 * @param  {String} srcPath
 * @return {Boolean}         True, if the brand project contains the src path; false, otherwise.
 */
export const isBrandSrc = srcPath => srcPath.includes(BRAND_ROOT);

/**
 * Is the src path a JavaScript file?
 * @param  {String} srcPath
 * @return {Boolean}         True, if the src path is a JavaScript file; false, otherwise.
 */
export const isJSSrc = srcPath => srcPath.includes('.js');

/**
 * Is the src path an Angular partial?
 * @param  {String} srcPath
 * @return {Boolean}         True, if the src path is a partial file; false, otherwise.
 */
export const isPartialSrc = srcPath => srcPath.includes('.html');

/**
 * Is the src path a SASS file?
 * @param  {String} srcPath
 * @return {Boolean}         True, if the src path is a SASS file; false, otherwise.
 */
export const isSASSSrc = srcPath => srcPath.includes('.scss');

/**
 * Is the src path a template file?
 * @param  {String} srcPath
 * @return {Boolean}         True, if the src path is a template file; false, otherwise.
 */
export const isTemplateSrc = srcPath => srcPath.includes('.j2');

/**
 * Symlink wrapper that checks to see if
 * a symlink already exists
 * @param  {String} src  Src path
 * @param  {String} dest Dest path
 */
export const symlink = (src, dest) => {
    if (exists(dest)) {
        unlinkSync(dest);
    }
    symlinkSync(src, dest);
}
