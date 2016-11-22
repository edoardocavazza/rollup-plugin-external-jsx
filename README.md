# rollup-plugin-external-jsx

Converts JSX files to modules:

```js
import template from './hello.jsx';

class HelloMessage extends React.Component {
  render() {
    return template.call(this);
  }
}
```

## Installation

```sh
npm i rollup-plugin-external-jsx -D
```

## Usage

```js
import { rollup } from 'rollup';
import externalJSX from 'rollup-plugin-external-jsx';

rollup({
    entry: 'hello.js',
    plugins: [
        externalJSX({
            // Required to be specified
            include: "**/*.jsx",
            // import header
            header: "import React from 'react';",
        }),
    ],
});
```

## Options
### `header`

Import the DOM library to use for JSX rendered script.

In a React Component template, we are going import the `React.createElement`:
```js
externalJSX({
    // Required to be specified
    include: "**/*.jsx",
    // import header
    header: "import React from 'react';",
}),
```
Or we can use any other Virtual/Incremental dom library. For example, using the JSX with IncrementalDOM (via [babel-plugin-incremental-dom](https://github.com/jridgewell/babel-plugin-incremental-dom)) will require the IDOM helpers:
```js
externalJSX({
    // Required to be specified
    include: "**/*.jsx",
    // import header
    header: "import { elementOpen, elementClose, ... } from 'incremental-dom';",
}),
```

### `include`

A glob (or a list of globs) of files to process.

### `exclude`

A glob (or a list of globs) of files to not process.

# License

MIT © [Edoardo Cavazza](mailto:edoardo.cavazza@chialab.it)
