/**
 * @jsx React.DOM
 */

import React from 'react';
import DocumentTitle from 'react-document-title';

let NotFound = React.createClass({
    render: function() {
        return (
            <DocumentTitle title="404 Not Found">
                <div>
                    <div className="page-header">
                        <h1>404 Not Found!</h1>
                    </div>

                    <p>We are sorry but we can't find the page you are looking for :(</p>
                </div>
            </DocumentTitle>
            );
    }
});
export default NotFound;
