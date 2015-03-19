/**
 * @jsx React.DOM
 */

import React from 'react/addons';
import DocumentTitle from 'react-document-title';

import { Well, Glyphicon, Input, Button } from 'react-bootstrap';

let Login = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function() {
        return {
            'username': '',
            'password': ''
        };
    },

    handleLogin: function() {
        //TODO handle login
    },

    render: function() {
        return (
            <DocumentTitle title="Sign In">
                <div>
                    <div className="page-header">
                        <h1>Please Sign In</h1>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            <Well>
                                <form action="/login" method="post">
                                    <Input type="text" name="username" placeholder="Username" addonBefore={<Glyphicon glyph="user" />} valueLink={this.linkState('username')} />
                                    <Input type="password" name="password" placeholder="Password" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('password')} />

                                    <Button bsStyle="primary" className="btn-block" onClick={this.handleLogin}><Glyphicon glyph="log-in" /> Sign in</Button>
                                </form>
                            </Well>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
            );
    }
});
export default Login;
