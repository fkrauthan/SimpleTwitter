/**
 * @jsx React.DOM
 */

var React = require('react');

var Locations = require('react-router-component').Locations;
var Location = require('react-router-component').Location;
var NotFound = require('react-router-component').NotFound;
var NavigatableMixin = require('react-router-component').NavigatableMixin;

var NavigationStore = require('../stores/NavigationStore');
var NavigationActions = require('../actions/NavigationActions');

var NotFoundPage = require('./pages/NotFound.jsx');
var AboutPage = require('./pages/About.jsx');
var RegisterPage = require('./pages/Register.jsx');
var LoginPage = require('./pages/Login.jsx');


var Content = React.createClass({
    mixins: [NavigatableMixin],

    getInitialState: function() {
        return {
            'path': NavigationStore.get('path')
        };
    },

    onBeforeNavigation: function(path, navigation) {
        NavigationActions.changePath(path);
    },

    render: function() {
        return (
            <Locations path={this.state.path} onBeforeNavigation={this.onBeforeNavigation}>
                <Location path="/about" handler={AboutPage} />
                <Location path="/register" handler={RegisterPage} />
                <Location path="/login" handler={LoginPage} />
                <NotFound handler={NotFoundPage} />
            </Locations>
            );
    }
});
module.exports = Content;
