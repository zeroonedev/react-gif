'use strict';

var React = require('react');
var Exploder = require('exploder');

function merge(a, b) {
  var object = {};
  Object.keys(a).forEach(function (key) {
    object[key] = a[key];
  });
  Object.keys(b).forEach(function (key) {
    object[key] = b[key];
  });
  return object;
}

module.exports = React.createClass({
  displayName: 'Gif',

  getDefaultProps: function getDefaultProps() {
    return {
      pingPong: false,
      reverse: false,
      speed: 1
    };
  },

  getInitialState: function getInitialState() {
    return {
      currentFrame: 0,
      offset: 0,
      stopped: false
    };
  },

  componentDidMount: function componentDidMount() {
    if (this.props.src) {
      this.explode(this.props.src);
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    // if stopped is toggled off
    if (prevState.stopped === true && this.state.stopped === false) this.animationLoop();
    // if startTime is updated
    if (prevState.startTime !== this.state.startTime && this.animationLoop) this.animationLoop();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.explode(nextProps.src);
    }
    if (!this.props.play && nextProps.play) this.start();
    if (!this.props.stop && nextProps.stop) this.stop();
    if (!this.props.pause && nextProps.pause) this.pause();
  },

  explode: function explode(url) {
    var _this = this;

    var exploder = new Exploder(url);
    exploder.load().then(function (gif) {
      _this.gif = gif;
      _this.setState(gif);
      _this.startSpeed();
      _this.start();
    });
  },

  startSpeed: function startSpeed() {
    var _this2 = this;

    this.animationLoop = function () {
      var gifLength = 10 * _this2.state.length / _this2.props.speed,
          duration = performance.now() - _this2.state.startTime + _this2.state.offset,
          repeatCount = duration / gifLength,
          fraction = repeatCount % 1;

      if (_this2.props.reverse) fraction = 1 - fraction;

      if (_this2.state.stopped || repeatCount >= _this2.props.times) {
        _this2.setState({
          currentFrame: _this2.gif.frameAt(0)
        });
        return;
      }

      _this2.setState({
        currentFrame: _this2.props.pingPong && repeatCount % 2 >= 1 ? _this2.gif.frameAt(1 - fraction) : _this2.gif.frameAt(fraction)
      });
      requestAnimationFrame(_this2.animationLoop);
    };
  },

  start: function start() {
    var startTime = performance.now();
    this.setState({
      startTime: startTime,
      stopped: false
    });
  },

  pause: function pause() {
    var offset = performance.now() - this.state.startTime + this.state.offset;
    this.setState({
      offset: offset,
      stopped: true
    });
  },

  stop: function stop() {
    this.setState({
      offset: 0,
      stopped: true
    });
  },

  render: function render() {
    var _this3 = this;

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

    var frames = this.state.frames ? this.state.frames.map(function (frame, index) {
      var show = _this3.state.currentFrame >= index ? 1 : 0;
      var style = merge(frameStyle, { opacity: show });
      if (index === 0) style = merge(style, { position: 'static' });

      return React.createElement('img', { src: frame.url, className: 'frame', style: style });
    }) : null;

    return React.createElement(
      'div',
      { className: 'frames', style: framesStyle },
      frames
    );
  }
});

