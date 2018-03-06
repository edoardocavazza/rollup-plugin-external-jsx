import template from './tpl.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

class TestComponent extends React.Component {
    render() {
        return template.call(this);
    }
}

ReactDOM.render(<TestComponent />, document.querySelector('.wrapper'));

let sections = document.querySelectorAll('section');
let articles = document.querySelectorAll('article');

assert.equal(typeof template, 'function');
assert.equal(sections.length, 1);
assert.equal(articles.length, 2);
assert.equal(articles[0].textContent, 'Article 1');
assert.equal(articles[1].textContent, 'Article 2');
