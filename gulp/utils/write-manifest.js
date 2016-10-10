import {statSync, writeFileSync} from 'fs';
import {sync} from 'glob';
import {join} from 'path';
import {__, compose, curry, difference, filter, join as arrJoin, intersection, last, map, merge, partialRight, split, union} from 'ramda';

import {BASE_FEATURES, BASE_PROJECT, BRAND_FEATURES, BRAND_PROJECT, MANIFEST} from '../config';
import {isDir, globLeaf, parseResource} from './glob';

/**
 * Manifest Feature Model
 * @private
 * @type {Object}
 */
export const manifestFeatureModel = {
    package: '',
    enabled: true,
    client: {}
};

/**
 * A feature model
 * @private
 * @param  {String} project Name of the project i.e. base or brand
 * @param  {String} name    Name of the feature
 * @return {Object}         Feature Info Model
 */
function getManifestFeatureModel (project, name) {
    return merge(manifestFeatureModel, {
        package: arrJoin('.', [project, 'features', name])
    });
};

// base and brand feature models
const baseFeatureInfo = curry(getManifestFeatureModel)(BASE_PROJECT);
const brandFeatureInfo = curry(getManifestFeatureModel)(BRAND_PROJECT);

// get rid of __pycache and core features
// as both will automatically be required
const rejectFeatureNames = curry(difference)(
    __,
    ['__pycache__', 'core']
);

/**
 * Glob the contents of a project feature
 * directory (leaf) one-level deep
 * @private
 * @param {String} path A directory path
 * @return {Array[String]} Set of a single-level glob
 */
const getFeaturesNames = compose(
    rejectFeatureNames,
    map(parseResource),
    filter(isDir),
    sync,
    globLeaf
);

/**
 * Merge base and brand features into a hash
 * of models and names
 * @param  {String} anSrc   Anweb src path to features dir
 * @param  {String} urbnSrc Urbnweb src path to features dir
 * @return {Object}         Returns a hash of merged feature models and names
 */
function mergeFeatures (baseSrc, brandSrc) {
    const brandNames = getFeaturesNames(brandSrc);
    const baseNames = getFeaturesNames(baseSrc);

    const sharedNames = intersection(brandNames, baseNames);
    const baseOnlyNames = difference(baseNames, sharedNames);

    const baseFeatures = map(baseFeatureInfo, baseOnlyNames);
    const brandFeatures = map(brandFeatureInfo, brandNames);

    return {
        models: union(brandFeatures, baseFeatures),
        names: union(brandNames, baseNames)
    };
};

/**
 * Get features of a specific type
 * @param  {String} type Feature type i.e. 'names' or 'models'
 * @return {Array[String|Object]}      List of features
 */
function getFeatures (type) {
    return mergeFeatures(BASE_FEATURES, BRAND_FEATURES)[type];
}

/**
 * Get all the project features
 * @return {Array[String]} Set of all project feature names
 */
export const getProjectFeatureNames = () => { return getFeatures('names'); };

/**
 * Get all the project features with info
 * @return {Array[String]} Set of all project features
 */
export const getProjectFeatures = () => { return getFeatures('models') };
