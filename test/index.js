var jsdom = require('jsdom');
var assert = require('assert');
var { rollup } = require('rollup');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var externalJSX = require('../');

process.chdir('test');
global.document = jsdom.jsdom('<!doctype html><html><body><div class="wrapper"></div></body></html>');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };

function bundle(options, jsxOptions) {
    options.plugins = [
        externalJSX(jsxOptions),
        babel({
            exclude: '../node_modules/**',
        }),
        resolve(),
        commonjs(),
    ];
    return rollup(options);
}

describe('rollup-plugin-external-jsx', function() {
    this.timeout(5000);

    it('should import a JSX function wrapper', () => {
        return bundle({ entry: 'fixtures/basic.js' }, { include: '**/*.jsx' }).then(bundle => {
            try {
                const { code } = bundle.generate({
                    format: 'iife',
                    moduleName: 'tpl',
                });
                new Function('assert', code)(assert);
            } catch (ex) {
                console.error(ex);
            }
        });
    });

    it('should output sourcemap', () => {
        return bundle({ entry: 'fixtures/basic.js' }, { include: '**/*.jsx' }).then(bundle => {
            const { code, map } = bundle.generate({ sourceMap: true });
            assert.ok(code);
            assert.ok(map);
        });
    });

    it('throws when include is not specified', () => {
        assert.throws(() => {
            bundle({ entry: 'fixtures/basic.js' });
        }, /include option should be specified/);
    });
});
