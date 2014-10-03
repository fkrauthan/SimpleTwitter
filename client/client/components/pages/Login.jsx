/**
 * @jsx React.DOM
 */

var React = require('react');

var Well = require('react-bootstrap').Well;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var Login = React.createClass({
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
                                <Input type="text" placeholder="Username" addonBefore={<Glyphicon glyph="user" />} />
                                <Input type="password" placeholder="Password" addonBefore={<Glyphicon glyph="lock" />} />

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
