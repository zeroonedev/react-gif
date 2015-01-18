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
      speed: 1
    };
  },

  getInitialState: function() {
    return {
      currentFrame: 0,
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
    if (nextProps.play) this.start();
    if (nextProps.stop) this.stop();
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
          duration = performance.now() - this.state.startTime,
          repeatCount = duration / gifLength,
          fraction = repeatCount % 1;

      this.setState({
        currentFrame: this.gif.frameAt(fraction)
      });

      if (!this.state.stopped)
        requestAnimationFrame(this.animationLoop);
    }
  },

  start: function() {
    this.setState({
      startTime: performance.now(),
      stopped: false
    });
  },

  stop: function() {
    this.setState({
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
