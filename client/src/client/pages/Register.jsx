/**
 * @jsx React.DOM
 */

import React from 'react';
import DocumentTitle from 'react-document-title';
import fluxMixin from 'flummox/mixin';

import LensedStateMixin from 'react-lensed-state';
import { Well, Glyphicon, Input, Button, Alert } from 'react-bootstrap';


let Register = React.createClass({
    mixins: [fluxMixin(['registration']), LensedStateMixin],

    handleRegister: function(e) {
        e.preventDefault();
        this.flux.getActions('registration').register(this.state.user);
    },

    componentWillUnmount: function() {
        this.flux.getActions('registration').clearSuccessState();
    },

    render: function() {
        var usernameStyle = this.state.errors.username ? 'error' : null;
        var emailStyle = this.state.errors.email ? 'error' : null;
        var nameStyle = this.state.errors.name ? 'error' : null;
        var passwordStyle = this.state.errors.password ? 'error' : null;
        var passwordRepeatedStyle = this.state.errors.password_repeated ? 'error' : null;

        var usernameError = this.state.errors.username;
        var emailError = this.state.errors.email;
        var nameError = this.state.errors.name;
        var passwordError = this.state.errors.password;
        var passwordRepeatedError = this.state.errors.password_repeated;


        var content;
        if(!this.state.successful) {
            content = (<Well>
                <form action="/register" method="post">
                    <input type="hidden" name="actions" value="registration" />
                    <input type="hidden" name="action" value="register" />

                    <Input bsStyle={usernameStyle} help={usernameError} type="text" name="registration[register][username]" placeholder="Username" addonBefore={<Glyphicon glyph="user" />} valueLink={this.linkState('user.username')} />
                    <Input bsStyle={emailStyle} help={emailError} type="text" name="registration[register][email]" placeholder="E-Mail" addonBefore={<Glyphicon glyph="envelope" />} valueLink={this.linkState('user.email')} />
                    <Input bsStyle={nameStyle} help={nameError} type="text" name="registration[register][name]" placeholder="Name" addonBefore={<Glyphicon glyph="tag" />} valueLink={this.linkState('user.name')} />
                    <Input bsStyle={passwordStyle} help={passwordError} type="password" name="registration[register][password]" placeholder="Password" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('user.password')} />
                    <Input bsStyle={passwordRepeatedStyle} help={passwordRepeatedError} type="password" name="registration[register][password_repeated]" placeholder="Password repeated" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('user.password_repeated')} />

                    <Button bsStyle="primary" type="submit" className="btn-block" onClick={this.handleRegister}><Glyphicon glyph="road" /> Sign Up</Button>
                </form>
            </Well>);
        }
        else {
            content = (<Alert bsStyle="success">
                <strong>Success!</strong> You have successful signed up. Please head over to the Login and get started!
            </Alert>);
        }

        return (
            <DocumentTitle title="Sign Up">
                <div>
                    <div className="page-header">
                        <h1>Please Sign Up</h1>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            {content}
                        </div>
                    </div>
                </div>
            </DocumentTitle>
            );
    }
});

export default Register;
