/**
 * @jsx React.DOM
 */

import React from 'react';
import FluxComponent from 'flummox/component';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

let SimpleTwitterApp = React.createClass({
    render: function() {
        return (
            <div>
                <Header />

                <div className="container">
                    <FluxComponent connectToStores={['navigation']}>
                        <Content />
                    </FluxComponent>
                    <Footer />
                </div>
            </div>
            );
    }
});

export default SimpleTwitterApp;
