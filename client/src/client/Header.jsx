/**
 * @jsx React.DOM
 */

import React from 'react';
import FluxComponent from 'flummox/component';

import AuthenticatedHeader from './header/Authenticated';
import UnAuthenticatedHeader from './header/UnAuthenticated';

import { Navbar } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

let Header = React.createClass({
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
                <FluxComponent connectToStores={['navigation']}>
                    {headerElement}
                </FluxComponent>
            </Navbar>
            );
    }
});
export default Header;
