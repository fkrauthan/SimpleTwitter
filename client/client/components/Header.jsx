/**
 * @jsx React.DOM
 */

var React = require('react');

var NavigationStore = require('../stores/NavigationStore');

var AuthenticatedHeader = require('./header/Authenticated.jsx');
var UnAuthenticatedHeader = require('./header/UnAuthenticated.jsx');

var Navbar = require('react-bootstrap').Navbar;
var Glyphicon = require('react-bootstrap').Glyphicon;

function getNavigationState() {
    return {
        'path': NavigationStore.get('path')
    };
}

var Header = React.createClass({
    getInitialState: function() {
        return getNavigationState();
    },

    componentDidMount: function() {
        NavigationStore.addWatch(this._onChange);
    },

    componentWillUnmount: function() {
        NavigationStore.removeWatch(this._onChange);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return !(this.state.path === nextState.path);
    },

    _onChange: function(keys, oldState, newState) {
        this.setState(getNavigationState());
    },

    render: function() {
        var headerElement;
        if(true) {
            headerElement = <UnAuthenticatedHeader />;
        }
        else {
            headerElement = <AuthenticatedHeader />;
        }

        var brand = <span><Glyphicon glyph="tower" /> SimpleTwitter</span>;

        return (
            <Navbar brand={brand}>
                {headerElement}
            </Navbar>
            );
    }
});
module.exports = Header;
