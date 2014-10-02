/**
 * @jsx React.DOM
 */

var React = require('react');

var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavigatableMixin = require('react-router-component').NavigatableMixin;

var UnAuthenticated = React.createClass({
    mixins: [NavigatableMixin],

    navItemSelected: function(key, href) {
        this.navigate(href, {}, function(err) {
            if (err) {
                throw err;
            }
        });
    },

    render: function() {
        return (
            <Nav navbar={true} onSelect={this.navItemSelected}>
                <NavItem key={1} href="/login">Login</NavItem>
                <NavItem key={2} href="/register">Register</NavItem>
            </Nav>
            );
    }
});
module.exports = UnAuthenticated;
