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
	
	module.exports = React.createClass({
	  displayName: "Gif",
	
	  getDefaultProps: function () {
	    return {};
	  },
	
	  getInitialState: function () {
	    return {
	      index: 0
	    };
	  },
	
	  componentDidMount: function () {
	    if (this.props.src) {
	      this.explode(this.props.src);
	    }
	  },
	
	  componentWillReceiveProps: function (nextProps) {
	    if (this.props.src !== nextProps.src) {
	      this.explode(nextProps.src);
	    }
	  },
	
	  explode: function (url) {
	    var _this = this;
	    var exploder = new Exploder(url);
	    exploder.load().then(function (gif) {
	      console.log("gif", gif);
	      _this.setState(gif);
	    });
	  },
	
	  render: function () {
	    var frames = this.state.frames ? this.state.frames.map(function (frame) {
	      return React.createElement("img", { src: frame.url, className: "frame" });
	    }) : null;
	
	    return React.createElement(
	      "div",
	      { id: "frames" },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmZTcwOGIzYmEyYTYyOWZiNjk2MiIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmVhY3QtZ2lmLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIlJlYWN0XCIiLCJ3ZWJwYWNrOi8vLy4vfi9leHBsb2Rlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2V4cGxvZGVyL2xpYi9leHBsb2Rlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2V4cGxvZGVyL2xpYi9naWYuanMiLCJ3ZWJwYWNrOi8vLy4vfi9leHBsb2Rlci9saWIvc3RyZWFtX3JlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2V4cGxvZGVyL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7OztBQ3RDQSxPQUFNLENBQUMsT0FBTyxHQUFHLG1CQUFPLENBQUMsQ0FBaUIsQ0FBQyxDOzs7Ozs7OztBQ0EzQyxLQUFJLEtBQUssR0FBRyxtQkFBTyxDQUFDLENBQU8sQ0FBQyxDQUFDO0FBQzdCLEtBQUksUUFBUSxHQUFHLG1CQUFPLENBQUMsQ0FBVSxDQUFDLENBQUM7O0FBRW5DLE9BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUNqQyxjQUFXLEVBQUUsS0FBSzs7QUFFbEIsa0JBQWUsRUFB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bihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIlJlYWN0XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlJlYWN0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkdpZlwiXSA9IGZhY3RvcnkocmVxdWlyZShcIlJlYWN0XCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJHaWZcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXykge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGZlNzA4YjNiYTJhNjI5ZmI2OTYyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9yZWFjdC1naWYnKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEV4cGxvZGVyID0gcmVxdWlyZSgnZXhwbG9kZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnR2lmJyxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbmRleDogMFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNyYykge1xuICAgICAgdGhpcy5leHBsb2RlKHRoaXMucHJvcHMuc3JjKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3JjICE9PSBuZXh0UHJvcHMuc3JjKSB7XG4gICAgICB0aGlzLmV4cGxvZGUobmV4dFByb3BzLnNyYyk7XG4gICAgfVxuICB9LFxuXG4gIGV4cGxvZGU6IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBleHBsb2RlciA9IG5ldyBFeHBsb2Rlcih1cmwpO1xuICAgIGV4cGxvZGVyLmxvYWQoKS50aGVuKChnaWYpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdnaWYnLCBnaWYpO1xuICAgICAgdGhpcy5zZXRTdGF0ZShnaWYpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmcmFtZXMgPSB0aGlzLnN0YXRlLmZyYW1lcyA/IHRoaXMuc3RhdGUuZnJhbWVzLm1hcCgoZnJhbWUpID0+IHtcbiAgICAgIHJldHVybiA8aW1nIHNyYz17ZnJhbWUudXJsfSBjbGFzc05hbWU9J2ZyYW1lJyAvPlxuICAgIH0pIDogbnVsbDtcblxuICAgIHJldHVybiA8ZGl2IGlkPSdmcmFtZXMnPntmcmFtZXN9PC9kaXY+O1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3JlYWN0LWdpZi5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIlJlYWN0XCJcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2V4cGxvZGVyJyk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXhwbG9kZXIvaW5kZXguanNcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEdpZiBmcm9tICcuL2dpZi5qcyc7XG5pbXBvcnQgU3RyZWFtUmVhZGVyIGZyb20gJy4vc3RyZWFtX3JlYWRlci5qcyc7XG5pbXBvcnQgeyBQcm9taXNlcyB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgdXJsID0gKFVSTCAmJiBVUkwuY3JlYXRlT2JqZWN0VVJMKSA/IFVSTCA6IHdlYmtpdFVSTDtcblxudmFyIGdpZkNhY2hlID0gbmV3IE1hcCgpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwbG9kZXIge1xuICBjb25zdHJ1Y3RvcihmaWxlKSB7XG4gICAgdGhpcy5maWxlID0gZmlsZTtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgdmFyIGNhY2hlZEdpZlByb21pc2UgPSBnaWZDYWNoZS5nZXQodGhpcy5maWxlKVxuICAgIGlmIChjYWNoZWRHaWZQcm9taXNlKSByZXR1cm4gY2FjaGVkR2lmUHJvbWlzZTtcblxuICAgIHZhciBnaWZQcm9taXNlID0gUHJvbWlzZXMueGhyR2V0KHRoaXMuZmlsZSwgJyovKicsICdhcnJheWJ1ZmZlcicpXG4gICAgICAudGhlbihidWZmZXIgPT4gdGhpcy5leHBsb2RlKGJ1ZmZlcikpO1xuXG4gICAgZ2lmQ2FjaGUuc2V0KHRoaXMuZmlsZSwgZ2lmUHJvbWlzZSk7XG4gICAgcmV0dXJuIGdpZlByb21pc2U7XG4gIH1cblxuICBleHBsb2RlKGJ1ZmZlcikge1xuICAgIGNvbnNvbGUuZGVidWcoXCJFWFBMT0RJTkcgXCIgKyB0aGlzLmZpbGUpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHZhciBmcmFtZXMgPSBbXSxcbiAgICAgICAgc3RyZWFtUmVhZGVyID0gbmV3IFN0cmVhbVJlYWRlcihidWZmZXIpO1xuXG4gICAgICAvLyBFbnN1cmUgdGhpcyBpcyBhbiBhbmltYXRlZCBHSUZcbiAgICAgIGlmIChzdHJlYW1SZWFkZXIucmVhZEFzY2lpKDYpICE9IFwiR0lGODlhXCIpIHtcbiAgICAgICAgcmVqZWN0KEVycm9yKFwiTm90IGEgR0lGIVwiKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3RyZWFtUmVhZGVyLnNraXBCeXRlcyg0KTsgLy8gSGVpZ2h0ICYgV2lkdGhcbiAgICAgIGlmIChzdHJlYW1SZWFkZXIucGVla0JpdCgxKSkge1xuICAgICAgICBzdHJlYW1SZWFkZXIubG9nKFwiR0xPQkFMIENPTE9SIFRBQkxFXCIpXG4gICAgICAgIHZhciBjb2xvclRhYmxlU2l6ZSA9IHN0cmVhbVJlYWRlci5yZWFkQnl0ZSgpICYgMHgwNztcbiAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIkdMT0JBTCBDT0xPUiBUQUJMRSBJUyBcIiArIDMgKiBNYXRoLnBvdygyLCBjb2xvclRhYmxlU2l6ZSArIDEpICsgXCIgQllURVNcIilcbiAgICAgICAgc3RyZWFtUmVhZGVyLnNraXBCeXRlcygyKTtcbiAgICAgICAgc3RyZWFtUmVhZGVyLnNraXBCeXRlcygzICogTWF0aC5wb3coMiwgY29sb3JUYWJsZVNpemUgKyAxKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHJlYW1SZWFkZXIubG9nKFwiTk8gR0xPQkFMIENPTE9SIFRBQkxFXCIpXG4gICAgICB9XG4gICAgICAvLyBXRSBIQVZFIEVOT1VHSCBGT1IgVEhFIEdJRiBIRUFERVIhXG4gICAgICB2YXIgZ2lmSGVhZGVyID0gYnVmZmVyLnNsaWNlKDAsIHN0cmVhbVJlYWRlci5pbmRleCk7XG5cbiAgICAgIHZhciBzcGlubmluZyA9IHRydWUsIGV4cGVjdGluZ0ltYWdlID0gZmFsc2U7XG4gICAgICB3aGlsZSAoc3Bpbm5pbmcpIHtcblxuICAgICAgICBpZiAoc3RyZWFtUmVhZGVyLmlzTmV4dChbMHgyMSwgMHhGRl0pKSB7XG4gICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIkFQUExJQ0FUSU9OIEVYVEVOU0lPTlwiKVxuICAgICAgICAgIHN0cmVhbVJlYWRlci5za2lwQnl0ZXMoMik7XG4gICAgICAgICAgdmFyIGJsb2NrU2l6ZSA9IHN0cmVhbVJlYWRlci5yZWFkQnl0ZSgpO1xuICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coc3RyZWFtUmVhZGVyLnJlYWRBc2NpaShibG9ja1NpemUpKTtcblxuICAgICAgICAgIGlmIChzdHJlYW1SZWFkZXIuaXNOZXh0KFsweDAzLCAweDAxXSkpIHtcbiAgICAgICAgICAgIC8vIHdlIGNvb2xcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5za2lwQnl0ZXMoNSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIkEgd2VpcmQgYXBwbGljYXRpb24gZXh0ZW5zaW9uLiBTa2lwIHVudGlsIHdlIGhhdmUgMiBOVUxMIGJ5dGVzXCIpO1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RyZWFtUmVhZGVyLnJlYWRCeXRlKCkgPT09IDAgJiYgc3RyZWFtUmVhZGVyLnBlZWtCeXRlKCkgPT09IDApKTtcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coXCJPSyBtb3Zpbmcgb25cIilcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5za2lwQnl0ZXMoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHN0cmVhbVJlYWRlci5pc05leHQoWzB4MjEsIDB4RkVdKSkge1xuICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coXCJDT01NRU5UIEVYVEVOU0lPTlwiKVxuICAgICAgICAgIHN0cmVhbVJlYWRlci5za2lwQnl0ZXMoMik7XG5cbiAgICAgICAgICB3aGlsZSAoIXN0cmVhbVJlYWRlci5pc05leHQoWzB4MDBdKSkge1xuICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZSA9IHN0cmVhbVJlYWRlci5yZWFkQnl0ZSgpO1xuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhzdHJlYW1SZWFkZXIucmVhZEFzY2lpKGJsb2NrU2l6ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdHJlYW1SZWFkZXIuc2tpcEJ5dGVzKDEpOyAvL05VTEwgdGVybWluYXRvclxuXG4gICAgICAgIH0gZWxzZSBpZiAoc3RyZWFtUmVhZGVyLmlzTmV4dChbMHgyY10pKSB7XG4gICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIklNQUdFIERFU0NSSVBUT1IhXCIpO1xuICAgICAgICAgIGlmICghZXhwZWN0aW5nSW1hZ2UpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBiYXJlIGltYWdlLCBub3QgcHJlZmFjZWQgd2l0aCBhIEdyYXBoaWNzIENvbnRyb2wgRXh0ZW5zaW9uXG4gICAgICAgICAgICAvLyBzbyB3ZSBzaG91bGQgdHJlYXQgaXQgYXMgYSBmcmFtZS5cbiAgICAgICAgICAgIGZyYW1lcy5wdXNoKHsgaW5kZXg6IHN0cmVhbVJlYWRlci5pbmRleCwgZGVsYXk6IDAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4cGVjdGluZ0ltYWdlID0gZmFsc2U7XG5cbiAgICAgICAgICBzdHJlYW1SZWFkZXIuc2tpcEJ5dGVzKDkpO1xuICAgICAgICAgIGlmIChzdHJlYW1SZWFkZXIucGVla0JpdCgxKSkge1xuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIkxPQ0FMIENPTE9SIFRBQkxFXCIpO1xuICAgICAgICAgICAgdmFyIGNvbG9yVGFibGVTaXplID0gc3RyZWFtUmVhZGVyLnJlYWRCeXRlKCkgJiAweDA3O1xuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIkxPQ0FMIENPTE9SIFRBQkxFIElTIFwiICsgMyAqIE1hdGgucG93KDIsIGNvbG9yVGFibGVTaXplICsgMSkgKyBcIiBCWVRFU1wiKVxuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLnNraXBCeXRlcygzICogTWF0aC5wb3coMiwgY29sb3JUYWJsZVNpemUgKyAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coXCJOTyBMT0NBTCBUQUJMRSBQSEVXXCIpO1xuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLnNraXBCeXRlcygxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdHJlYW1SZWFkZXIubG9nKFwiTUlOIENPREUgU0laRSBcIiArIHN0cmVhbVJlYWRlci5yZWFkQnl0ZSgpKTtcbiAgICAgICAgICBzdHJlYW1SZWFkZXIubG9nKFwiREFUQSBTVEFSVFwiKTtcblxuICAgICAgICAgIHdoaWxlICghc3RyZWFtUmVhZGVyLmlzTmV4dChbMHgwMF0pKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2tTaXplID0gc3RyZWFtUmVhZGVyLnJlYWRCeXRlKCk7XG4vLyAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIlNLSVBQSU5HIFwiICsgYmxvY2tTaXplICsgXCIgQllURVNcIik7XG4gICAgICAgICAgICBzdHJlYW1SZWFkZXIuc2tpcEJ5dGVzKGJsb2NrU2l6ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coXCJEQVRBIEVORFwiKTtcbiAgICAgICAgICBzdHJlYW1SZWFkZXIuc2tpcEJ5dGVzKDEpOyAvL05VTEwgdGVybWluYXRvclxuICAgICAgICB9IGVsc2UgaWYgKHN0cmVhbVJlYWRlci5pc05leHQoWzB4MjEsIDB4RjksIDB4MDRdKSkge1xuICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coXCJHUkFQSElDUyBDT05UUk9MIEVYVEVOU0lPTiFcIik7XG4gICAgICAgICAgLy8gV2UgX2RlZmluaXRlbHlfIGhhdmUgYSBmcmFtZS4gTm93IHdlJ3JlIGV4cGVjdGluZyBhbiBpbWFnZVxuICAgICAgICAgIHZhciBpbmRleCA9IHN0cmVhbVJlYWRlci5pbmRleDtcblxuICAgICAgICAgIHN0cmVhbVJlYWRlci5za2lwQnl0ZXMoMyk7XG4gICAgICAgICAgdmFyIGRpc3Bvc2FsTWV0aG9kID0gc3RyZWFtUmVhZGVyLnJlYWRCeXRlKCkgPj4gMjtcbiAgICAgICAgICBzdHJlYW1SZWFkZXIubG9nKFwiRElTUE9TQUwgXCIgKyBkaXNwb3NhbE1ldGhvZCk7XG4gICAgICAgICAgdmFyIGRlbGF5ID0gc3RyZWFtUmVhZGVyLnJlYWRCeXRlKCkgKyBzdHJlYW1SZWFkZXIucmVhZEJ5dGUoKSAqIDI1NjtcbiAgICAgICAgICBmcmFtZXMucHVzaCh7IGluZGV4OiBpbmRleCwgZGVsYXk6IGRlbGF5LCBkaXNwb3NhbDogZGlzcG9zYWxNZXRob2QgfSk7XG4gICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIkZSQU1FIERFTEFZIFwiICsgZGVsYXkpO1xuICAgICAgICAgIHN0cmVhbVJlYWRlci5za2lwQnl0ZXMoMik7XG4gICAgICAgICAgZXhwZWN0aW5nSW1hZ2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtYXliZVRoZUVuZCA9IHN0cmVhbVJlYWRlci5pbmRleDtcbiAgICAgICAgICB3aGlsZSAoIXN0cmVhbVJlYWRlci5maW5pc2hlZCgpICYmICFzdHJlYW1SZWFkZXIuaXNOZXh0KFsweDIxLCAweEY5LCAweDA0XSkpIHtcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5yZWFkQnl0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3RyZWFtUmVhZGVyLmZpbmlzaGVkKCkpIHtcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5pbmRleCA9IG1heWJlVGhlRW5kO1xuICAgICAgICAgICAgc3RyZWFtUmVhZGVyLmxvZyhcIldFIEVORFwiKTtcbiAgICAgICAgICAgIHNwaW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmVhbVJlYWRlci5sb2coXCJVTktOT1dOIERBVEEgRlJPTSBcIiArIG1heWJlVGhlRW5kKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBlbmRPZkZyYW1lcyA9IHN0cmVhbVJlYWRlci5pbmRleDtcblxuICAgICAgdmFyIGdpZkZvb3RlciA9IGJ1ZmZlci5zbGljZSgtMSk7IC8vbGFzdCBiaXQgaXMgYWxsIHdlIG5lZWRcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmcmFtZSA9IGZyYW1lc1tpXTtcbiAgICAgICAgdmFyIG5leHRJbmRleCA9IChpIDwgZnJhbWVzLmxlbmd0aCAtIDEpID8gZnJhbWVzW2kgKyAxXS5pbmRleCA6IGVuZE9mRnJhbWVzO1xuICAgICAgICBmcmFtZS5ibG9iID0gbmV3IEJsb2IoWyBnaWZIZWFkZXIsIGJ1ZmZlci5zbGljZShmcmFtZS5pbmRleCwgbmV4dEluZGV4KSwgZ2lmRm9vdGVyIF0sIHt0eXBlOiAnaW1hZ2UvZ2lmJ30pO1xuICAgICAgICBmcmFtZS51cmwgPSB1cmwuY3JlYXRlT2JqZWN0VVJMKGZyYW1lLmJsb2IpO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlKG5ldyBHaWYoZnJhbWVzKSk7XG4gICAgfSlcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2V4cGxvZGVyL2xpYi9leHBsb2Rlci5qc1xuICoqLyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZGVmYXVsdEZyYW1lRGVsYXkgPSAxMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2lmIHtcbiAgY29uc3RydWN0b3IoZnJhbWVzKSB7XG4gICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICAgIHRoaXMub2Zmc2V0cyA9IFtdXG5cbiAgICBmcmFtZXMuZm9yRWFjaCgoZnJhbWUpID0+IHtcbiAgICAgIHRoaXMub2Zmc2V0cy5wdXNoKHRoaXMubGVuZ3RoKTtcbiAgICAgIHRoaXMubGVuZ3RoICs9IChmcmFtZS5kZWxheSB8fCBkZWZhdWx0RnJhbWVEZWxheSk7XG4gICAgfSk7XG4gIH1cblxuICBmcmFtZUF0KGZyYWN0aW9uKSB7XG4gICAgdmFyIG9mZnNldCA9IGZyYWN0aW9uICogdGhpcy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDEsIGwgPSB0aGlzLm9mZnNldHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5vZmZzZXRzW2ldID4gb2Zmc2V0KSBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGkgLSAxO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2V4cGxvZGVyL2xpYi9naWYuanNcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtUmVhZGVyIHtcbiAgY29uc3RydWN0b3IoYXJyYXlCdWZmZXIpIHtcbiAgICB0aGlzLmRhdGEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy5pbmRleCA9IDA7XG4gICAgdGhpcy5sb2coXCJUT1RBTCBMRU5HVEg6IFwiICsgdGhpcy5kYXRhLmxlbmd0aCk7XG4gIH1cblxuICBmaW5pc2hlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCA+PSB0aGlzLmRhdGEubGVuZ3RoO1xuICB9XG5cbiAgcmVhZEJ5dGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmluZGV4KytdO1xuICB9XG5cbiAgcGVla0J5dGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmluZGV4XTtcbiAgfVxuXG4gIHNraXBCeXRlcyhuKSB7XG4gICAgdGhpcy5pbmRleCArPSBuO1xuICB9XG5cbiAgcGVla0JpdChpKSB7XG4gICAgcmV0dXJuICEhKHRoaXMucGVla0J5dGUoKSAmICgxIDw8IDggLSBpKSk7XG4gIH1cblxuICByZWFkQXNjaWkobikge1xuICAgIHZhciBzID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIHMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLnJlYWRCeXRlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIGlzTmV4dChhcnJheSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJheVtpXSAhPT0gdGhpcy5kYXRhW3RoaXMuaW5kZXggKyBpXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGxvZyhzdHIpIHtcbi8vICBjb25zb2xlLmxvZyh0aGlzLmluZGV4ICsgXCI6IFwiICsgc3RyKTtcbiAgfVxuXG4gIGVycm9yKHN0cikge1xuICAgIGNvbnNvbGUuZXJyb3IodGhpcy5pbmRleCArIFwiOiBcIiArIHN0cik7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9leHBsb2Rlci9saWIvc3RyZWFtX3JlYWRlci5qc1xuICoqLyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnQgdmFyIFByb21pc2VzID0ge1xuICB4aHJHZXQ6ICh1cmwsIGFjY2VwdCwgcmVzcG9uc2VUeXBlKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHZhciBsb2FkZXIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGxvYWRlci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgbG9hZGVyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgYWNjZXB0KTtcbiAgICAgIGxvYWRlci5yZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGU7XG4gICAgICBsb2FkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgY2FsbGVkIGV2ZW4gb24gNDA0IGV0Y1xuICAgICAgICAvLyBzbyBjaGVjayB0aGUgc3RhdHVzXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIHRoZSBwcm9taXNlIHdpdGggdGhlIHJlc3BvbnNlIHRleHRcbiAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSByZWplY3Qgd2l0aCB0aGUgc3RhdHVzIHRleHRcbiAgICAgICAgICAvLyB3aGljaCB3aWxsIGhvcGVmdWxseSBiZSBhIG1lYW5pbmdmdWwgZXJyb3JcbiAgICAgICAgICByZWplY3QoRXJyb3IodGhpcy5zdGF0dXNUZXh0KSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIEhhbmRsZSBuZXR3b3JrIGVycm9yc1xuICAgICAgbG9hZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KEVycm9yKFwiTmV0d29yayBFcnJvclwiKSk7XG4gICAgICB9O1xuICAgICAgbG9hZGVyLnNlbmQoKTtcbiAgICB9KVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXhwbG9kZXIvbGliL3V0aWxzLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiLi9kaXN0L3JlYWN0LWdpZi5qcyJ9