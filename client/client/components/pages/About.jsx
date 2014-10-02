/**
 * @jsx React.DOM
 */

var React = require('react');

var About = React.createClass({
    render: function() {
        return (
            <div>
                <div className="page-header">
                    <h1>About</h1>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <h2>Why should I use it</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fermentum eros eget sapien molestie suscipit. Quisque libero turpis, volutpat eget blandit eget, dignissim eget quam. Duis egestas tellus id dolor suscipit a ornare eros lacinia. Praesent dictum leo a metus consectetur dapibus ac ut dolor. Vestibulum imperdiet scelerisque lorem at ultricies. Nullam in sem fermentum augue varius convallis sed sit amet libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                    </div>

                    <div className="col-md-4">
                        <h2>How much is it</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fermentum eros eget sapien molestie suscipit. Quisque libero turpis, volutpat eget blandit eget, dignissim eget quam. Duis egestas tellus id dolor suscipit a ornare eros lacinia. Praesent dictum leo a metus consectetur dapibus ac ut dolor. Vestibulum imperdiet scelerisque lorem at ultricies. Nullam in sem fermentum augue varius convallis sed sit amet libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                    </div>

                    <div className="col-md-4">
                        <h2>Why was this build</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fermentum eros eget sapien molestie suscipit. Quisque libero turpis, volutpat eget blandit eget, dignissim eget quam. Duis egestas tellus id dolor suscipit a ornare eros lacinia. Praesent dictum leo a metus consectetur dapibus ac ut dolor. Vestibulum imperdiet scelerisque lorem at ultricies. Nullam in sem fermentum augue varius convallis sed sit amet libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                    </div>
                </div>
            </div>
            );
    }
});
module.exports = About;
