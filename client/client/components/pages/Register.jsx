/**
 * @jsx React.DOM
 */

var React = require('react');

var RegistrationStore = require('../../stores/RegistrationStore');
var RegistrationActions = require('../../actions/RegistrationActions');

var LensedStateMixin = require('react-lensed-state');

var Well = require('react-bootstrap').Well;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

function getRegistrationState() {
    return {
        'user': RegistrationStore.get('user'),
        'errors': RegistrationStore.get('errors')
    };
}

var Register = React.createClass({
    mixins: [LensedStateMixin],

    getInitialState: function() {
        return getRegistrationState();
    },

    componentDidMount: function() {
        RegistrationStore.addWatch(this._onChange);
    },

    componentWillUnmount: function() {
        RegistrationStore.removeWatch(this._onChange);
    },

    _onChange: function(keys, oldState, newState) {
        this.setState(getRegistrationState());
    },

    handleRegister: function() {
        RegistrationActions.register(this.state.user);
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

        return (
            <div>
                <div className="page-header">
                    <h1>Please Sign Up</h1>
                </div>

                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <Well>
                            <form action="/register" method="post">
                                <Input bsStyle={usernameStyle} help={usernameError} type="text" name="username" placeholder="Username" addonBefore={<Glyphicon glyph="user" />} value={this.state.user.username} valueLink={this.linkState('user.username')} />
                                <Input bsStyle={emailStyle} help={emailError} type="text" name="email" placeholder="E-Mail" addonBefore={<Glyphicon glyph="envelope" />} valueLink={this.linkState('user.email')} />
                                <Input bsStyle={nameStyle} help={nameError} type="text" name="name" placeholder="Name" addonBefore={<Glyphicon glyph="tag" />} valueLink={this.linkState('user.name')} />
                                <Input bsStyle={passwordStyle} help={passwordError} type="password" name="password" placeholder="Password" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('user.password')} />
                                <Input bsStyle={passwordRepeatedStyle} help={passwordRepeatedError} type="password" name="password_repeated" placeholder="Password repeated" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('user.password_repeated')} />

                                <Button bsStyle="primary" type="submit" className="btn-block" onClick={this.handleRegister}><Glyphicon glyph="road" /> Sign Up</Button>
                            </form>
                        </Well>
                    </div>
                </div>
            </div>
            );
    }
});
module.exports = Register;
