(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["Gif"] = factory(require("React"));
	else
		root["Gif"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(2);
	var Exploder = __webpack_require__(3);
	
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
	  displayName: "Gif",
	
	  getDefaultProps: function () {
	    return {
	      speed: 1
	    };
	  },
	
	  getInitialState: function () {
	    return {
	      currentFrame: 0,
	      offset: 0,
	      stopped: false
	    };
	  },
	
	  componentDidMount: function () {
	    if (this.props.src) {
	      this.explode(this.props.src);
	    }
	  },
	
	  componentDidUpdate: function (prevProps, prevState) {
	    // if stopped is toggled off
	    if (prevState.stopped === true && this.state.stopped === false) this.animationLoop();
	    // if startTime is updated
	    if (prevState.startTime !== this.state.startTime && this.animationLoop) this.animationLoop();
	  },
	
	  componentWillReceiveProps: function (nextProps) {
	    if (this.props.src !== nextProps.src) {
	      this.explode(nextProps.src);
	    }
	    if (nextProps.play) this.start();
	    if (nextProps.stop) this.stop();
	    if (nextProps.pause) this.pause();
	  },
	
	  explode: function (url) {
	    var _this = this;
	    var exploder = new Exploder(url);
	    exploder.load().then(function (gif) {
	      _this.gif = gif;
	      _this.setState(gif);
	      _this.startSpeed();
	      _this.start();
	    });
	  },
	
	  startSpeed: function () {
	    var _this2 = this;
	    this.animationLoop = function () {
	      var gifLength = 10 * _this2.state.length / _this2.props.speed,
	          duration = performance.now() - _this2.state.startTime + _this2.state.offset,
	          repeatCount = duration / gifLength,
	          fraction = repeatCount % 1;
	
	      if (_this2.state.stopped) return;
	
	      _this2.setState({
	        currentFrame: _this2.gif.frameAt(fraction)
	      });
	      requestAnimationFrame(_this2.animationLoop);
	    };
	  },
	
	  start: function () {
	    var startTime = performance.now();
	    this.setState({
	      startTime: startTime,
	      stopped: false
	    });
	  },
	
	  pause: function () {
	    var offset = performance.now() - this.state.startTime + this.state.offset;
	    this.setState({
	      offset: offset,
	      stopped: true
	    });
	  },
	
	  stop: function () {
	    this.setState({
	      offset: 0,
	      stopped: true
	    });
	  },
	
	  render: function () {
	    var _this3 = this;
	    var framesStyle = {
	      display: "block",
	      position: "relative"
	    };
	    var frameStyle = {
	      position: "absolute",
	      top: 0,
	      left: 0,
	      WebkitTransform: "translateZ(0)",
	      msTransform: "translateZ(0)",
	      transform: "translateZ(0)"
	    };
	
	    var frames = this.state.frames ? this.state.frames.map(function (frame, index) {
	      var show = _this3.state.currentFrame >= index ? 1 : 0;
	      var style = merge(frameStyle, { opacity: show });
	      if (index === 0) style = merge(style, { position: "static" });
	
	      return React.createElement("img", { src: frame.url, className: "frame", style: style });
	    }) : null;
	
	    return React.createElement(
	      "div",
	      { className: "frames", style: framesStyle },
	      frames
	    );
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = __webpack_require__(4);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _prototypeProperties = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};
	
	var _interopRequire = function (obj) {
	  return obj && (obj["default"] || obj);
	};
	
	var Gif = _interopRequire(__webpack_require__(5));
	
	var StreamReader = _interopRequire(__webpack_require__(6));
	
	var Promises = __webpack_require__(7).Promises;
	
	
	var url = URL && URL.createObjectURL ? URL : webkitURL;
	
	var gifCache = new Map();
	var Exploder = (function () {
	  function Exploder(file) {
	    this.file = file;
	  }
	
	  _prototypeProperties(Exploder, null, {
	    load: {
	      value: function load() {
	        var _this = this;
	        var cachedGifPromise = gifCache.get(this.file);
	        if (cachedGifPromise) return cachedGifPromise;
	
	        var gifPromise = Promises.xhrGet(this.file, "*/*", "arraybuffer").then(function (buffer) {
	          return _this.explode(buffer);
	        });
	
	        gifCache.set(this.file, gifPromise);
	        return gifPromise;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    explode: {
	      value: function explode(buffer) {
	        console.debug("EXPLODING " + this.file);
	        return new Promise(function (resolve, reject) {
	          var frames = [],
	              streamReader = new StreamReader(buffer);
	
	          // Ensure this is an animated GIF
	          if (streamReader.readAscii(6) != "GIF89a") {
	            reject(Error("Not a GIF!"));
	            return;
	          }
	
	          streamReader.skipBytes(4); // Height & Width
	          if (streamReader.peekBit(1)) {
	            streamReader.log("GLOBAL COLOR TABLE");
	            var colorTableSize = streamReader.readByte() & 7;
	            streamReader.log("GLOBAL COLOR TABLE IS " + 3 * Math.pow(2, colorTableSize + 1) + " BYTES");
	            streamReader.skipBytes(2);
	            streamReader.skipBytes(3 * Math.pow(2, colorTableSize + 1));
	          } else {
	            streamReader.log("NO GLOBAL COLOR TABLE");
	          }
	          // WE HAVE ENOUGH FOR THE GIF HEADER!
	          var gifHeader = buffer.slice(0, streamReader.index);
	
	          var spinning = true,
	              expectingImage = false;
	          while (spinning) {
	            if (streamReader.isNext([33, 255])) {
	              streamReader.log("APPLICATION EXTENSION");
	              streamReader.skipBytes(2);
	              var blockSize = streamReader.readByte();
	              streamReader.log(streamReader.readAscii(blockSize));
	
	              if (streamReader.isNext([3, 1])) {
	                // we cool
	                streamReader.skipBytes(5);
	              } else {
	                streamReader.log("A weird application extension. Skip until we have 2 NULL bytes");
	                while (!(streamReader.readByte() === 0 && streamReader.peekByte() === 0));
	                streamReader.log("OK moving on");
	                streamReader.skipBytes(1);
	              }
	            } else if (streamReader.isNext([33, 254])) {
	              streamReader.log("COMMENT EXTENSION");
	              streamReader.skipBytes(2);
	
	              while (!streamReader.isNext([0])) {
	                var blockSize = streamReader.readByte();
	                streamReader.log(streamReader.readAscii(blockSize));
	              }
	              streamReader.skipBytes(1); //NULL terminator
	            } else if (streamReader.isNext([44])) {
	              streamReader.log("IMAGE DESCRIPTOR!");
	              if (!expectingImage) {
	                // This is a bare image, not prefaced with a Graphics Control Extension
	                // so we should treat it as a frame.
	                frames.push({ index: streamReader.index, delay: 0 });
	              }
	              expectingImage = false;
	
	              streamReader.skipBytes(9);
	              if (streamReader.peekBit(1)) {
	                streamReader.log("LOCAL COLOR TABLE");
	                var colorTableSize = streamReader.readByte() & 7;
	                streamReader.log("LOCAL COLOR TABLE IS " + 3 * Math.pow(2, colorTableSize + 1) + " BYTES");
	                streamReader.skipBytes(3 * Math.pow(2, colorTableSize + 1));
	              } else {
	                streamReader.log("NO LOCAL TABLE PHEW");
	                streamReader.skipBytes(1);
	              }
	
	              streamReader.log("MIN CODE SIZE " + streamReader.readByte());
	              streamReader.log("DATA START");
	
	              while (!streamReader.isNext([0])) {
	                var blockSize = streamReader.readByte();
	                //        streamReader.log("SKIPPING " + blockSize + " BYTES");
	                streamReader.skipBytes(blockSize);
	              }
	              streamReader.log("DATA END");
	              streamReader.skipBytes(1); //NULL terminator
	            } else if (streamReader.isNext([33, 249, 4])) {
	              streamReader.log("GRAPHICS CONTROL EXTENSION!");
	              // We _definitely_ have a frame. Now we're expecting an image
	              var index = streamReader.index;
	
	              streamReader.skipBytes(3);
	              var disposalMethod = streamReader.readByte() >> 2;
	              streamReader.log("DISPOSAL " + disposalMethod);
	              var delay = streamReader.readByte() + streamReader.readByte() * 256;
	              frames.push({ index: index, delay: delay, disposal: disposalMethod });
	              streamReader.log("FRAME DELAY " + delay);
	              streamReader.skipBytes(2);
	              expectingImage = true;
	            } else {
	              var maybeTheEnd = streamReader.index;
	              while (!streamReader.finished() && !streamReader.isNext([33, 249, 4])) {
	                streamReader.readByte();
	              }
	              if (streamReader.finished()) {
	                streamReader.index = maybeTheEnd;
	                streamReader.log("WE END");
	                spinning = false;
	              } else {
	                streamReader.log("UNKNOWN DATA FROM " + maybeTheEnd);
	              }
	            }
	          }
	          var endOfFrames = streamReader.index;
	
	          var gifFooter = buffer.slice(-1); //last bit is all we need
	          for (var i = 0; i < frames.length; i++) {
	            var frame = frames[i];
	            var nextIndex = i < frames.length - 1 ? frames[i + 1].index : endOfFrames;
	            frame.blob = new Blob([gifHeader, buffer.slice(frame.index, nextIndex), gifFooter], { type: "image/gif" });
	            frame.url = url.createObjectURL(frame.blob);
	          }
	
	          resolve(new Gif(frames));
	        });
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    }
	  });
	
	  return Exploder;
	})();
	
	module.exports = Exploder;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _prototypeProperties = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};
	
	var defaultFrameDelay = 10;
	
	var Gif = (function () {
	  function Gif(frames) {
	    var _this = this;
	    this.frames = frames;
	    this.length = 0;
	    this.offsets = [];
	
	    frames.forEach(function (frame) {
	      _this.offsets.push(_this.length);
	      _this.length += frame.delay || defaultFrameDelay;
	    });
	  }
	
	  _prototypeProperties(Gif, null, {
	    frameAt: {
	      value: function frameAt(fraction) {
	        var offset = fraction * this.length;
	        for (var i = 1,
	            l = this.offsets.length; i < l; i++) {
	          if (this.offsets[i] > offset) break;
	        }
	        return i - 1;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    }
	  });
	
	  return Gif;
	})();
	
	module.exports = Gif;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _prototypeProperties = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};
	
	var StreamReader = (function () {
	  function StreamReader(arrayBuffer) {
	    this.data = new Uint8Array(arrayBuffer);
	    this.index = 0;
	    this.log("TOTAL LENGTH: " + this.data.length);
	  }
	
	  _prototypeProperties(StreamReader, null, {
	    finished: {
	      value: function finished() {
	        return this.index >= this.data.length;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    readByte: {
	      value: function readByte() {
	        return this.data[this.index++];
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    peekByte: {
	      value: function peekByte() {
	        return this.data[this.index];
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    skipBytes: {
	      value: function skipBytes(n) {
	        this.index += n;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    peekBit: {
	      value: function peekBit(i) {
	        return !!(this.peekByte() & 1 << 8 - i);
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    readAscii: {
	      value: function readAscii(n) {
	        var s = "";
	        for (var i = 0; i < n; i++) {
	          s += String.fromCharCode(this.readByte());
	        }
	        return s;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    isNext: {
	      value: function isNext(array) {
	        for (var i = 0; i < array.length; i++) {
	          if (array[i] !== this.data[this.index + i]) return false;
	        }
	        return true;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    log: {
	      value: function log(str) {},
	      writable: true,
	      enumerable: true,
	      configurable: true
	    },
	    error: {
	      value: function error(str) {
	        console.error(this.index + ": " + str);
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    }
	  });
	
	  return StreamReader;
	})();
	
	module.exports = StreamReader;
	//  console.log(this.index + ": " + str);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Promises = exports.Promises = {
	  xhrGet: function (url, accept, responseType) {
	    return new Promise(function (resolve, reject) {
	      var loader = new XMLHttpRequest();
	      loader.open("GET", url, true);
	      loader.setRequestHeader("Accept", accept);
	      loader.responseType = responseType;
	      loader.onload = function () {
	        // This is called even on 404 etc
	        // so check the status
	        if (this.status == 200) {
	          // Resolve the promise with the response text
	          resolve(this.response);
	        } else {
	          // Otherwise reject with the status text
	          // which will hopefully be a meaningful error
	          reject(Error(this.statusText));
	        }
	      };
	
	      // Handle network errors
	      loader.onerror = function () {
	        reject(Error("Network Error"));
	      };
	      loader.send();
	    });
	  }
	};

/***/ }
/******/ ])
});

//# sourceMappingURL=react-gif.map