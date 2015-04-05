/**
 * @jsx React.DOM
 */

import React from 'react';
import FluxComponent from 'flummox/component';
import fluxMixin from 'flummox/mixin';

import AuthenticatedHeader from './header/Authenticated';
import UnAuthenticatedHeader from './header/UnAuthenticated';

import { Navbar } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

let Header = React.createClass({
    mixins: [fluxMixin(['credentials'])],

    render: function() {
        var headerElement;
        if(!this.state.token || !this.state.secret) {
            headerElement = <UnAuthenticatedHeader />;
        }
        else {
            headerElement = <AuthenticatedHeader />;
        }

        var brand = <span><Glyphicon glyph="tower" /> SimpleTwitter</span>;

        return (
            <Navbar brand={brand}>
                <FluxComponent connectToStores={['navigation']}>
                    {headerElement}
                </FluxComponent>
            </Navbar>
            );
    }
});
export default Header;
