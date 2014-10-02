/**
 * @jsx React.DOM
 */

var React = require('react');

var Locations = require('react-router-component').Locations;
var Location = require('react-router-component').Location;
var NotFound = require('react-router-component').NotFound;

var NavigationStore = require('../stores/NavigationStore');

var NotFoundPage = require('./pages/NotFound.jsx');
var AboutPage = require('./pages/About.jsx');


var Content = React.createClass({
    getInitialState: function() {
        return {
            'path': NavigationStore.get('path')
        };
    },

    render: function() {
        return (
            <Locations path={this.state.path}>
                <Location path="/about" handler={AboutPage} />
                <NotFound handler={NotFoundPage} />
            </Locations>
            );
    }
});
module.exports = Content;
