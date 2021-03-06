import { createFilter } from 'rollup-pluginutils';
import acorn from 'acorn-jsx';
import MagicString from 'magic-string';

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
    var sourceMap = opts.sourceMap !== false;
    delete opts.header;
    delete opts.include;
    delete opts.exclude;

    return {
        name: 'external-jsx',

        transform: function transform(code, id) {
            if (filter(id)) {
                var magicString = new MagicString( code );
                var ast = acorn.parse(code, {
                    sourceType: 'module',
                    plugins: { jsx: true }
                });

                ast.body.reverse().find(function (node) {
                    if (node.type === 'ExpressionStatement') {
                        var JSX = magicString.slice(node.start, node.end);
                        magicString.overwrite(node.start, node.end, ("export default function() { return " + JSX + " }"));
                        return true;
                    }
                });

                magicString.trim();

                if (header) {
                    magicString.prepend(header).trim();
                }

                code = magicString.toString();
                var map = sourceMap ? magicString.generateMap() : null;

                return {
                    code: code,
                    map: map,
                };
            }
        }
    };
}

export default index;