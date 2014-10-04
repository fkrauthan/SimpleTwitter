/**
 * @jsx React.DOM
 */

var React = require('react');

var NavigationStore = require('../../stores/NavigationStore');

var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavigatableMixin = require('react-router-component').NavigatableMixin;

var UnAuthenticated = React.createClass({
    mixins: [NavigatableMixin],

    getInitialState: function() {
        return {
            'path': NavigationStore.get('path')
        };
    },

    navItemSelected: function(key, href) {
        this.navigate(href, {}, function(err) {
            if (err) {
                throw err;
            }
        });
    },

    isNavItemActive: function(url) {
        var curUrl = this.getPath();
        if(curUrl == null) {
            curUrl = this.state.path;
        }

        if(url === curUrl) {
            return true;
        }
        return curUrl.lastIndexOf(url, 0) === 0;
    },

    render: function() {
        return (
            <Nav navbar={true} onSelect={this.navItemSelected}>
                <NavItem key={1} active={this.isNavItemActive("/login")} href="/login">Login</NavItem>
                <NavItem key={2} active={this.isNavItemActive("/register")} href="/register">Register</NavItem>
            </Nav>
            );
    }
});
module.exports = UnAuthenticated;
