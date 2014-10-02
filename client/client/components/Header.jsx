/**
 * @jsx React.DOM
 */

var React = require('react');

var AuthenticatedHeader = require('./header/Authenticated.jsx');
var UnAuthenticatedHeader = require('./header/UnAuthenticated.jsx');

var Navbar = require('react-bootstrap').Navbar;

var Header = React.createClass({
    render: function() {
        var headerElement;
        if(true) {
            headerElement = <UnAuthenticatedHeader />
        }
        else {
            headerElement = <AuthenticatedHeader />
        }

        return (
            <Navbar brand="SimpleTwitter">
                {headerElement}
            </Navbar>
            );
    }
});
module.exports = Header;
