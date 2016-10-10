import { sync as globSync } from 'glob';
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin';
import { join } from 'path';
import {
    __,
    compose,
    concat,
    curryN,
    flip,
    last,
    map,
    merge,
    mergeAll,
    mergeWith,
    of,
    pick,
    reduce,
    split,
    zipObj
} from 'ramda';
import webpack from 'webpack';

import {
    BRAND_DIST,
    BUILD_ROOT,
    COMMON_BUNDLE_NAME,
    COMMON_BUNDLE_FILENAME,
    TEMP_FEATURES
} from '../config';
import {
    getFileName,
    isDir
} from './io';
import { ENABLED_FEATURES, FEATURE_BUNDLES } from './read-manifest';
import ForceCaseSensitivityPlugin from 'force-case-sensitivity-webpack-plugin';

/**
 * Map the entry point(s) for a given bundle.
 * This allows for targeted bundles on a per feature basis.
 * @param  {Object} bundle  Target bundle
 * @return {Object}         Entry mappings for the target bundle
 */
const getEntryMappings = map(map(
    curryN(3, join)(TEMP_FEATURES, __, 'js/index.js')
));

/**
 * Create an object has with the filename key (global alias)
 * mapped to a given file path value.
 * @param  {String} globStr Glob String
 * @return {Object}         Hash of global aliases
 */
const resolveTemplateAliases = globStr => {
    const getTemplateName = compose(
        last,
        split('templates/')
    );
    const globals = globSync(globStr);

    return zipObj(
        map(getTemplateName, globals),
        globals
    );
};

const baseOptions = () => {
    return {
        context: TEMP_FEATURES,
        output: {
            path: join(BRAND_DIST, 'js'),
            filename: '[name].js'
            // sourceMapFilename: '[file].map',
            // library: '[name]',
            // libraryTarget: 'var'
        }
    };
};

const devOptions = () => {
    return {
        debug: true,
        devtool: 'eval-source-map'
    };
};

const entryOptions = () => {
    return {
        entry: getEntryMappings(FEATURE_BUNDLES)
    };
};

const externalsOptions = () => {
    return {
        externals: [
            {
                urbnTokenLib: true
            }
        ]
    };
};

// todo remove all loaders but babel going forward
const loadersOptions = () => {
    return {
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(.idea|brandweb|bower_components|dist|keyrings|node_modules|urbnweb|venv)/,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: '.babel'
                    }
                },
                {
                    test: /\.j2$/,
                    exclude: /(.idea|brandweb|bower_components|dist|gulp|keyrings|node_modules|urbnweb|venv)/,
                    loader: 'nunjucks-loader',
                    query: {
                        config: join(BUILD_ROOT, '/nunjucks-config.js')
                    }
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }
            ]
        }
    };
};

const pluginsOptions = () => {
    return {
        plugins: [
            new ngAnnotatePlugin()
        ]
    };
};

const prodOptions = () => {
    return {
        plugins: [
            new ForceCaseSensitivityPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                names: [COMMON_BUNDLE_NAME],
                filename: COMMON_BUNDLE_FILENAME,
                chunks: ENABLED_FEATURES
            })
        ]
    };
};

const resolveOptions = () => {
    return {
        resolve: {
            root: TEMP_FEATURES,
            alias: resolveTemplateAliases(join(TEMP_FEATURES,'**/*.j2'))
        }
    };
};

const stagingOptions = () => {
    return {
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                names: [COMMON_BUNDLE_NAME],
                filename: COMMON_BUNDLE_FILENAME,
                chunks: ENABLED_FEATURES
            })
        ]
    };
};

const watchOptions = () => {
    return {
        watch: true
    };
};

/**
 * Base webpack config
 * @type {Object}
 */
export const webpackBaseConfig = () => mergeAll([
    baseOptions(),
    entryOptions(),
    externalsOptions(),
    loadersOptions(),
    pluginsOptions(),
    resolveOptions()
]);

/**
 * Webpack dev config
 * @type {Object}
 */
export const webpackDevConfig = () => mergeWith(
    concat,
    webpackBaseConfig(),
    devOptions()
);

/**
 * Webpack prod config
 * @type {Object}
 */
export const webpackProdConfig = () => mergeWith(
    concat,
    webpackBaseConfig(),
    prodOptions()
);

/**
 * Webpack staging config
 * @type {Object}
 */
export const webpackStagingConfig = () => mergeWith(
    concat,
    webpackBaseConfig(),
    stagingOptions()
);

/**
 * Webpack watch config
 * @type {Object}
 */
export const webpackWatchConfig = () => mergeWith(
    concat,
    webpackDevConfig(),
    watchOptions()
);

/**
 * Get the webpack config for watching a target feature
 * @param  {String} bundle  Target bundle
 * @return {Object}         Webpack bundle watch config
 */
export const getWebpackBundleWatchConfig = bundle => merge(
    webpackWatchConfig(),
    {
        entry: compose(
            getEntryMappings,
            flip(pick)(FEATURE_BUNDLES),
            of
        )(bundle)
    }
);
