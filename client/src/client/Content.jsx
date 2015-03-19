/**
 * @jsx React.DOM
 */

import React from 'react';

import { Locations, Location, NotFound, NavigatableMixin } from 'react-router-component';

import NotFoundPage from './pages/NotFound';
import AboutPage from './pages/About';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';


let Content = React.createClass({
    mixins: [NavigatableMixin],

    onBeforeNavigation: function(path, navigation) {
        this.props.flux.getActions('navigation').changePath(path);
    },

    render: function() {
        return (
            <Locations path={this.props.path} onBeforeNavigation={this.onBeforeNavigation}>
                <Location path="/about" handler={AboutPage} />
                <Location path="/register" handler={RegisterPage} />
                <Location path="/login" handler={LoginPage} />
                <NotFound handler={NotFoundPage} />
            </Locations>
            );
    }
});
export default Content;
