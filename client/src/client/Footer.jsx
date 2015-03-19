/**
 * @jsx React.DOM
 */

import React from 'react/addons';

import { Link } from 'react-router-component';

let Footer = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    render: function() {
        return (
            <div>
                <hr />
                <footer>
                    <div className="row">
                        <div className="col-md-6">
                            <p>
                                © <a href="http://www.fkrauthan.de">fkrauthan.de</a> 2015
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
export default Footer;
