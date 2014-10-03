/**
 * @jsx React.DOM
 */

var React = require('react');

var Link = require('react-router-component').Link;

var Footer = React.createClass({
    render: function() {
        return (
            <div>
                <hr />
                <footer>
                    <div className="row">
                        <div className="col-md-6">
                            <p>
                                © <a href="http://www.fkrauthan.de">fkrauthan.de</a> 2014
                            </p>
                        </div>
                        <div className="col-md-6 text-right">
                            <p>
                                <Link href="/about">About</Link>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
            );
    }
});
module.exports = Footer;
