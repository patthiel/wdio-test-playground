import { readFileSync } from 'fs';
import {
    join,
    resolve
} from 'path';
import {
    __,
    compose,
    concat,
    contains,
    curry,
    curryN,
    dropLastWhile,
    equals,
    flatten,
    filter,
    groupBy,
    identity,
    ifElse,
    join as arrJoin,
    keys,
    last,
    map,
    not,
    omit,
    partialRight,
    pathOr,
    prepend,
    propOr,
    replace,
    reject,
    split,
    union
} from 'ramda';

import {
    A15_ROOT,
    BASE_PROJECT,
    BASE_ROOT,
    BRAND_PROJECT,
    MANIFEST,
    TEMP_FEATURES,
    TEMP_ROOT
} from '../config';
import { globForSubDirs } from './glob';

/**
 * Core Feature Manifest Model
 * @private
 * @type {Object}
 */
const coreFeatureModel = {
    'package': 'brandweb.features.core',
    enabled: true,
    client: {
        feature: 'core',
        bundle: 'common'
    }
};

/**
 * Load the contents of the manifest file into memory as a string. The file
 * should not be very large, so the risk of memory overflow is low.
 * @return {String} Serialized JSON
 */
export const readManifestFile = () => readFileSync(MANIFEST);

/**
 * Parse manifest JSON and reduce to an array of features, with the core
 * feature first.
 * @private
 * @param {String} manifestJson
 * @returns {Array[Object]} List of feature objects from the manifest
 */
const parseFeatures = compose(
    prepend(coreFeatureModel),
    propOr([], 'features'),
    JSON.parse
);

/**
 * Produce a list of features from the global manifest file
 * @private
 * @returns {Array[Object]} List of feature objects
 */
const getComposableFeatures = curryN(3, compose)(
    __,
    parseFeatures,
    readManifestFile
);

/**
 * Produce a list of enabled features from the global manifest file
 * @returns {Array[Object]} List of enabled feature objects
 */
export const getEnabledFeatures = getComposableFeatures(filter(f => f.enabled));

/**
 * Produce a list of disabled features from the global manifest file
 * @returns {Array[Object]} List of disabled feature objects
 */
export const getDisabledFeatures = getComposableFeatures(reject(f => f.enabled));

/**
 * Produce a list of legacy features from the global manifest file
 * @returns {Array[Object]} List of legacy feature objects
 */
export const getLegacyFeatures = getComposableFeatures(filter(f => f.client.legacy));

/**
 * Produce a list of active features from the global manifest file
 * @returns {Array[Object]} List of active feature objects
 */
export const getActiveFeatures = getComposableFeatures(reject(f => f.client.legacy));

/**
 * Split apart a package path string
 * @private
 * @param {Object} f Feature object
 * @returns {Array[String]} List of package path segments (ex: ['brandweb', 'features', 'core'])
 */
const getPackageSegments = compose(
    split('.'),
    propOr('', 'package')
);

/**
 * Get the base name of a feature
 * @private
 * @param {Array[String]} p Package segments (ex: ['brandweb', 'features', 'core'])
 * @returns {String} The last element in a list of package segments (ex: 'core')
 */
const getFeatureName = compose(
    last,
    getPackageSegments
);

/**
 * Produce a list of enabled feature names from the global manifest file
 * @return {Array[String]} A list of feature names. Example: ['homepage']
 */
export const getEnabledFeatureNames = compose(
    map(getFeatureName),
    getEnabledFeatures
);

/**
 * Produce a list of disabled feature names from the global manifest file
 * @return {Array[String]} A list of feature names. Example: ['homepage']
 */
export const getDisabledFeatureNames = compose(
    map(getFeatureName),
    getDisabledFeatures
);

/**
 * Produce a list of legacy feature names from the global manifest file
 * @return {Array[String]} A list of feature names. Example: ['homepage']
 */
export const getLegacyFeatureNames = compose(
    map(getFeatureName),
    getLegacyFeatures
);

/**
 * Produce a list of active feature names from the global manifest file
 * @return {Array[String]} A list of feature names. Example: ['homepage']
 */
export const getActiveFeatureNames = compose(
    map(getFeatureName),
    getActiveFeatures
);

/**
 * Assemble a feature path from package segments, using / as a delimiter
 * @private
 * @param {Array[String]} p Package segments (ex: ['brandweb', 'features', 'core'])
 * @returns {String} Feature path (ex: 'brandweb/features/core')
 */
const getFeaturePath = compose(
    arrJoin('/'),
    prepend('.'),
    getPackageSegments
);

// get all enabled features from the manifest
// and split the package prop into segments
// for sorting and filtering purposes
// -> [String]
const getEnabledSegments = compose(
    map(getPackageSegments),
    getEnabledFeatures
);

/**
 * Produce a list of enabled base-specific features from the global manifest file
 * @private
 * @returns {Array[Object]} List of enabled feature objects
 */
const getBaseFeatures = compose(
    filter(p => p[0] === BASE_PROJECT),
    getEnabledSegments
);

/**
 * Produce a list of enabled feature names that are part of the base project
 * @return {Array[String]} A list of feature names. Example: ['homepage']
 */
export const baseFeatureNames = compose(
    map(last),
    getBaseFeatures
);

/**
 * Produce a list of enabled brand-specific features from the global manifest file
 * @private
 * @returns {Array[Object]} List of enabled feature objects
 */
const getBrandFeatures = compose(
    filter(p => p[0] === BRAND_PROJECT),
    getEnabledSegments
);

/**
 * Produce a list of enabled feature names that are part of the brand project
 * @return {Array[String]} A list of feature names. Example: ['homepage']
 */
export const brandFeatureNames = compose(
    map(last),
    getBrandFeatures
);

/**
 * Append file glob to a path
 * @private
 * @param {String} glob Any file or folder path that gulp can understand
 * @param {String} dir A directory path string
 * @returns {Array} File paths mapped over all selected features
 */
function getPath(glob, dir) {
    const globString = glob ? glob : '';
    return join(dir, globString);
}

// get the paths from the manifest for the base project
// _ -> [String]
const getBasePaths = compose(
    map(replace(BASE_PROJECT, BASE_ROOT)),
    map(arrJoin('/')),
    getBaseFeatures
);

// glob the paths from the manifest for the base project
// String -> [String]
export const globBasePaths = compose(
    map(
        __,
        getBasePaths()
    ),
    curry(getPath)
);

// get the paths from the manifest for the brand project
// _ -> [String]
const getBrandPaths = compose(
    map(arrJoin('/')),
    getBrandFeatures
);

// glob the paths from the manifest for the brand project
// String -> [String]
export const globBrandPaths = compose(
    map(
        __,
        getBrandPaths()
    ),
    curry(getPath)
);

// get the paths from the manifest for the brand project
// and convert to paths for the base project
// String -> [String]
const getBrandtoBasePaths = compose(
    map(replace(BRAND_PROJECT, BASE_ROOT)),
    globBrandPaths
);

// get the paths from the manifest for the base project
// and the converted base to brand paths
// String -> [String]
export const globCompleteBasePaths = globStr => union(
    globBasePaths(globStr),
    getBrandtoBasePaths(globStr)
);

/**
 * Get the feature paths in the .tmp directory
 * and concat with a globStr
 * @param  {String} globStr     Glob str to concat to feature paths
 * @return {Array[String]}      All .tmp feature paths concatted with glob str
 */
export const globTempPaths = globStr => {
    return map(partialRight(join, [globStr]), globForSubDirs(TEMP_FEATURES));
};

/**
 * Trim the list items up to and including the provided item.
 * @param  {*} item
 * @param  {Array} list
 * @return {Array}
 */
export const takeUntilInclusive = curry(
    (item, list) => ifElse(
        contains(item),
        dropLastWhile(compose(not, equals(item))),
        identity
    )(list)
);

/**
 * Get the feature paths for the project (includes
 * both base and brand), and concat with a given list
 * of globStrs.
 * @param  {Array[Strings]} globStrs List of glob strs
 * @return {Array[Strings]}      All project features concatted with a globStr
 */
export const globProjectPaths = compose(
    flatten,
    map(glob => concat(
        globCompleteBasePaths(glob),
        globBrandPaths(glob)
    ))
);

/**
 * List of enabled features for the project
 * @type {Array[String]}
 */
export const ENABLED_FEATURES = reject(
    f => /core|legacy/.test(f),
    union(
        baseFeatureNames(),
        brandFeatureNames()
    )
);

/**
 * Get the member feature names of each bundle
 * @return {Object[Array[Strings]]} All enabled features grouped by bundle name
 * @example
 *     {
 *       core: ['core', 'legacy'],
 *       catalog: ['category', 'homepage', 'product']
 *     }
 */
export const getBundledFeatureNames = compose(
    map(compose(
        reject(f => f === 'missing'),
        map(pathOr('missing', ['client', 'feature']))
    )),
    omit('missing'),
    groupBy(pathOr('missing', ['client', 'bundle'])),
    getEnabledFeatures
);

/**
 * Object of lists of enabled features for the project, grouped by bundle.
 * @type {Object[Array[Strings]]}
 */
export const FEATURE_BUNDLES = getBundledFeatureNames();
