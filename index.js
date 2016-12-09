import { createFilter } from 'rollup-pluginutils';

function assign(target, source) {
    Object.keys(source).forEach(function(key) {
        target[key] = source[key];
    });
    return target;
}

const DEFAULT_HEADER = 'import React from \'react\';';

export default function(opts) {
    opts = assign({}, opts || {});
    if (!opts.include) {
        throw Error('include option should be specified');
    }
    let filter = createFilter(opts.include, opts.exclude || []);
    let header = opts.header !== undefined ? opts.header : DEFAULT_HEADER;
    delete opts.header;
    delete opts.include;
    delete opts.exclude;

    return {
        name: 'external-jsx',

        transform(code, id) {
            if (filter(id)) {
                code = "function template() { return " + code + " };";
                return {
                    code: ((header ? header + "\n\n" : "") + "export default " + code),
                    map: { mappings: '' },
                };
            }
        }
    };
}
