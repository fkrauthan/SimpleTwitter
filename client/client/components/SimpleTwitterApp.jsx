/**
 * @jsx React.DOM
 */

var React = require('react');
var Header = require('./Header.jsx');
var Content = require('./Content.jsx');
var Footer = require('./Footer.jsx');

var SimpleTwitterApp = React.createClass({
    render: function() {
        return (
            <div>
                <Header />

                <div className="container">
                    <Content />
                    <Footer />
                </div>
            </div>
            );
    }
});
module.exports = SimpleTwitterApp;
