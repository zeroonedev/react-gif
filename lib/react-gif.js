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
    return {
      reverse: false,
      speed: 1
    };
  },

  getInitialState: function() {
    return {
      currentFrame: 0,
      offset: 0,
      stopped: false
    };
  },

  componentDidMount: function() {
    if (this.props.src) {
      this.explode(this.props.src);
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    // if stopped is toggled off
    if (prevState.stopped === true && this.state.stopped === false)
      this.animationLoop();
    // if startTime is updated
    if ((prevState.startTime !== this.state.startTime) && this.animationLoop)
      this.animationLoop();
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.explode(nextProps.src);
    }
    if (!this.props.play && nextProps.play) this.start();
    if (!this.props.stop && nextProps.stop) this.stop();
    if (!this.props.pause && nextProps.pause) this.pause();
  },

  explode: function(url) {
    var exploder = new Exploder(url);
    exploder.load().then((gif) => {
      this.gif = gif;
      this.setState(gif);
      this.startSpeed()
      this.start();
    });
  },

  startSpeed: function() {
    this.animationLoop = () => {
      var gifLength = 10 * this.state.length / this.props.speed,
          duration = performance.now() - this.state.startTime + this.state.offset,
          repeatCount = duration / gifLength,
          fraction = repeatCount % 1;

      if (this.props.reverse) fraction = 1 - fraction;

      if (this.state.stopped) {
        this.setState({
          currentFrame: this.gif.frameAt(0)
        });
        return;
      }

      this.setState({
        currentFrame: this.gif.frameAt(fraction)
      });
      requestAnimationFrame(this.animationLoop);
    }
  },

  start: function() {
    var startTime = performance.now();
    this.setState({
      startTime: startTime,
      stopped: false
    });
  },

  pause: function() {
    var offset = performance.now() - this.state.startTime + this.state.offset;
    this.setState({
      offset: offset,
      stopped: true
    });
  },

  stop: function() {
    this.setState({
      offset: 0,
      stopped: true
    });
  },

  render: function () {
    var framesStyle = {
      display: 'block',
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
      var style = merge(frameStyle, {opacity: show});
      if (index === 0)
        style = merge(style, {position: 'static'});

      return <img src={frame.url} className='frame' style={style} />
    }) : null;

    return <div className='frames' style={framesStyle}>{frames}</div>;
  }
});
