/**
 * @jsx React.DOM
 */

import React from 'react';
import DocumentTitle from 'react-document-title';
import fluxMixin from 'flummox/mixin';

import LensedStateMixin from 'react-lensed-state';
import { Well, Glyphicon, Input, Button } from 'react-bootstrap';


let Login = React.createClass({
    mixins: [fluxMixin(['login']), LensedStateMixin],

    render: function() {
        var usernameStyle = this.state.errors.username ? 'error' : null;
        var passwordStyle = this.state.errors.password ? 'error' : null;

        var usernameError = this.state.errors.username;
        var passwordError = this.state.errors.password;

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
                                    <input type="hidden" name="actions" value="login" />
                                    <input type="hidden" name="action" value="login" />

                                    <Input bsStyle={usernameStyle} help={usernameError} type="text" name="login[login][username]" placeholder="Username" addonBefore={<Glyphicon glyph="user" />} valueLink={this.linkState('username')} />
                                    <Input bsStyle={passwordStyle} help={passwordError} type="password" name="login[login][password]" placeholder="Password" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('password')} />

                                    <Button bsStyle="primary" className="btn-block" type="submit"><Glyphicon glyph="log-in" /> Sign in</Button>
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
