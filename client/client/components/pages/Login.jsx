/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Well = require('react-bootstrap').Well;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var Login = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function() {
        return {
            'username': '',
            'password': ''
        };
    },

    render: function() {
        return (
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

                                <Button bsStyle="primary" className="btn-block"><Glyphicon glyph="log-in" /> Sign in</Button>
                            </form>
                        </Well>
                    </div>
                </div>
            </div>
            );
    }
});
module.exports = Login;
