import { createFilter } from 'rollup-pluginutils';

function assign(target, source) {
    Object.keys(source).forEach(function(key) {
        target[key] = source[key];
    });
    return target;
}

var DEFAULT_HEADER = 'import React from \'react\';';

function index(opts) {
    opts = assign({}, opts || {});
    if (!opts.include) {
        throw Error('include option should be specified');
    }
    var filter = createFilter(opts.include, opts.exclude || []);
    var header = opts.header !== undefined ? opts.header : DEFAULT_HEADER;
    delete opts.header;
    delete opts.include;
    delete opts.exclude;

    return {
        name: 'external-jsx',

        transform: function transform(code, id) {
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

export default index;