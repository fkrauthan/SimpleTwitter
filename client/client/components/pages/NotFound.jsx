/**
 * @jsx React.DOM
 */

var React = require('react');

var NotFound = React.createClass({
    render: function() {
        return (
            <div>
                <div className="page-header">
                    <h1>404 Not Found!</h1>
                </div>

                <p>We are sorry but we can't find the page you are looking for :(</p>
            </div>
            );
    }
});
module.exports = NotFound;
