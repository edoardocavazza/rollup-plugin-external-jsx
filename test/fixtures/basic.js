import template from './tpl.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

class TestComponent extends React.Component {
    render() {
        return template.call(this);
    }
}

ReactDOM.render(<TestComponent />, document.querySelector('.wrapper'));

let sections = Object.keys(document.querySelectorAll('section')).length;
let articles = Object.keys(document.querySelectorAll('article')).length;

assert.equal(typeof template, 'function');
assert.equal(sections, 1);
assert.equal(articles, 2);
