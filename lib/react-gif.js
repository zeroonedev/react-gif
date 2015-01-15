var React = require('react');
var Exploder = require('exploder');

function merge(a, b) {
  var object = {};
  Object.keys(a).forEach(function(key) { object[key] = a[key]; });
  Object.keys(b).forEach(function(key) { object[key] = b[key]; });
  return object;
}

module.exports = React.createClass({
  displayName: 'Gif',

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      currentFrame: 0
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
    if (this.props.play) this.play();
    if (this.props.stop) this.stop();
  },

  explode: function(url) {
    var exploder = new Exploder(url);
    exploder.load().then((gif) => {
      console.log('gif', gif);
      this.setState(gif);
      if (this.props.play) {
        this.play()
      }
    });
  },

  play: function() {
    this.intervalId = setInterval(function() {
      this.setState({
        currentFrame: ((this.state.currentFrame + 1) % this.state.frames.length)
      });
    }.bind(this), 100);
  },

  stop: function() {
    clearInterval(this.intervalId);
  },

  render: function () {
    var framesStyle = {
      display: 'inline-style',
      position: 'relative'
    };
    var frameStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      WebkitTransform: 'translateZ(0)',
      msTransform: 'translateZ(0)',
      transform: 'translateZ(0)'
    };

    var frames = this.state.frames ? this.state.frames.map((frame, index) => {
      var show = this.state.currentFrame >= index ? 1 : 0;
      var s = merge(frameStyle, {opacity: show});
      return <img src={frame.url} className='frame' style={s} />
    }) : null;

    return <div className='frames' style={framesStyle}>{frames}</div>;
  }
});
