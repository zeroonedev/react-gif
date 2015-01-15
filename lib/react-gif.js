var React = require('react');
var Exploder = require('exploder');

module.exports = React.createClass({
  displayName: 'Gif',

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      index: 0
    };
  },

  componentDidMount: function() {
    if (this.props.src) {
      this.explode(this.props.src);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.explode(nextProps.src);
    }
  },

  explode: function(url) {
    var exploder = new Exploder(url);
    exploder.load().then((gif) => {
      console.log('gif', gif);
      this.setState(gif);
    });
  },

  render: function () {
    var frames = this.state.frames ? this.state.frames.map((frame) => {
      return <img src={frame.url} className='frame' />
    }) : null;

    return <div id='frames'>{frames}</div>;
  }
});
