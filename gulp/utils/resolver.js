import {difference, find, merge, propEq, reduce, sort, union} from 'ramda';

/**
 * Merge two object arrays by matching on a given
 * property and resolving all conflicts by a
 * given resolver. It is presumed that identical object
 * models are shared by the arrays.
 * @param  {String} matchBy  Property name to merge on
 * @param  {Function} resolver Conflict resolver for the two lists
 * @param  {Array[Object]} a        An array of objects
 * @param  {Array[Object]} b        Another array of objects
 * @return {Array[Object]}          Merged array
 */
export const resolve = (matchBy, resolver, a, b) => {
    const r = reduce(
        (reduced, fromA) => {
            const pred = propEq(matchBy, fromA[matchBy]);
            const fromB = find(pred)(reduced.b);
            const resolved = resolver(fromA, fromB);

            return {
                a: union(reduced.a, [resolved]),
                b: difference(reduced.b, [fromB])
            };
        },
        {
            a: [],
            b: b
        },
        a
    );

    return sort((a, b) => a[matchBy] > b[matchBy], union(r.a, r.b));
};
