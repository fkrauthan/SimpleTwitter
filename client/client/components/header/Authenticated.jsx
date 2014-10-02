/**
 * @jsx React.DOM
 */

var React = require('react');

var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;

var Authenticated = React.createClass({
    render: function() {
        return (
            <Nav navbar="true">
            </Nav>
            );
    }
});
module.exports = Authenticated;
