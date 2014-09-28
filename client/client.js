/**
 * @jsx React.DOM
 */

var React = require('react');
var Fluxy = require('fluxy');

var SimpleTwitterApp = require('./client/components/SimpleTwitterApp.jsx');

Fluxy.bootstrap('__fluxy__');

React.renderComponent(
    <SimpleTwitterApp />,
    document.getElementById('simpletwitterapp')
);
