import { createFilter } from 'rollup-pluginutils';
import acorn from 'acorn-jsx';
import MagicString from 'magic-string';

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
    const filter = createFilter(opts.include, opts.exclude || []);
    const header = opts.header !== undefined ? opts.header : DEFAULT_HEADER;
    const sourceMap = opts.sourceMap !== false;
    delete opts.header;
    delete opts.include;
    delete opts.exclude;

    return {
        name: 'external-jsx',

        transform(code, id) {
            if (filter(id)) {
                const magicString = new MagicString( code );
                const ast = acorn.parse(code, {
                    sourceType: 'module',
                    plugins: { jsx: true }
                });

                ast.body.forEach((node) => {
                    if (node.type === 'ExpressionStatement' && node.expression.type === 'JSXElement') {
                        const JSX = magicString.slice(node.start, node.end);
                        magicString.overwrite(node.start, node.end, `export default function() { return ${JSX} }`);
                    }
                });

                magicString.trim();

                if (header) {
                    magicString.prepend(header).trim();
                }

                code = magicString.toString();
                const map = sourceMap ? magicString.generateMap() : null;

                return {
                    code,
                    map,
                };
            }
        }
    };
}
