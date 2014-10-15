/** @jsx React.DOM */

var React = require("react");

var _ = require("lodash");

// How Reddit ranking algorithms work
// http://amix.dk/blog/post/19588
// How Not To Sort By Average Rating
// http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
var wilson = require('wilson-score');

var Z_SCORE = 1.0; // 1.0 = 85%, 1.644853 = 95%, 2.3 = 99%

var Rating = React.createClass({
    render: function() {
        if (!this.props.rating) {
            return (
                <div>No Rating</div>
            );
        }
        var score = wilson(this.props.rating.pos, this.props.rating.neg + this.props.rating.pos, Z_SCORE);
        return (
            <div>
                { _.isNaN(score) ? 'Insufficient Data'
                    :
                <span><strong>Rating={score * 100}</strong> (pos={this.props.rating.pos} neg={this.props.rating.neg})</span>
                }
            </div>
        );
    }
});

module.exports = Rating;
