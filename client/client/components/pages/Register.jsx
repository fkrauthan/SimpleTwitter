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
        'user': RegistrationStore.get('user')
    };
}

var Register = React.createClass({
    mixins: [LensedStateMixin],

    getInitialState: function() {
        return getRegistrationState();
    },

    handleRegister: function() {
        console.log(this.state.user);
        RegistrationActions.register(this.state.user);
    },

    render: function() {
        return (
            <div>
                <div className="page-header">
                    <h1>Please Sign Up</h1>
                </div>

                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <Well>
                            <form action="/register" method="post">
                                <Input type="text" name="username" placeholder="Username" addonBefore={<Glyphicon glyph="user" />} valueLink={this.linkState('user.username')} />
                                <Input type="text" name="email" placeholder="E-Mail" addonBefore={<Glyphicon glyph="envelope" />} valueLink={this.linkState('user.email')} />
                                <Input type="text" name="name" placeholder="Name" addonBefore={<Glyphicon glyph="tag" />} valueLink={this.linkState('user.name')} />
                                <Input type="password" name="password" placeholder="Password" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('user.password')} />
                                <Input type="password" name="password_repeated" placeholder="Password repeated" addonBefore={<Glyphicon glyph="lock" />} valueLink={this.linkState('user.password_repeated')} />

                                <Button bsStyle="primary" className="btn-block" onClick={this.handleRegister}><Glyphicon glyph="road" /> Sign Up</Button>
                            </form>
                        </Well>
                    </div>
                </div>
            </div>
            );
    }
});
module.exports = Register;
