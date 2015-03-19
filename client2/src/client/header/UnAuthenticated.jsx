/**
 * @jsx React.DOM
 */

import React from 'react';

import { Nav, NavItem } from 'react-bootstrap';
import { NavigatableMixin } from 'react-router-component';

let UnAuthenticated = React.createClass({
    mixins: [NavigatableMixin],

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
            curUrl = this.props.path;
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
export default UnAuthenticated;
