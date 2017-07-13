'use strict';
'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseQueue = exports.PromisePool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dequeue = require('dequeue');

var _dequeue2 = _interopRequireDefault(_dequeue);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A pool that executes Promise executors in parallel given the poolSize, in order.
 *
 * The executor function passed to the constructor of a Promise is evaluated
 * immediately. This may not always be desirable. Use a PromisePool if you have
 * a sequence of async operations that need to be run in parallel and you also want
 * control the number of concurrent executions.
 */
var PromisePool = exports.PromisePool = function () {
  function PromisePool(poolSize) {
    _classCallCheck(this, PromisePool);

    this._fifo = new _dequeue2.default();
    this._emitter = new _events2.default();
    this._numPromisesRunning = 0;
    this._poolSize = poolSize;
    this._nextRequestId = 1;
  }

  /**
   * @param executor A function that takes resolve and reject callbacks, just
   *     like the Promise constructor.
   * @return A Promise that will be resolved/rejected in response to the
   *     execution of the executor.
   */


  _createClass(PromisePool, [{
    key: 'submit',
    value: function submit(executor) {
      var _this = this;

      var id = this._getNextRequestId();
      this._fifo.push({ id: id, executor: executor });
      var promise = new Promise(function (resolve, reject) {
        _this._emitter.once(id, function (result) {
          var isSuccess = result.isSuccess,
              value = result.value;

          (isSuccess ? resolve : reject)(value);
        });
      });
      this._run();
      return promise;
    }
  }, {
    key: '_run',
    value: function _run() {
      var _this2 = this;

      if (this._numPromisesRunning === this._poolSize) {
        return;
      }

      if (this._fifo.length === 0) {
        return;
      }

      var _fifo$shift = this._fifo.shift(),
          id = _fifo$shift.id,
          executor = _fifo$shift.executor;

      this._numPromisesRunning++;
      new Promise(executor).then(function (result) {
        _this2._emitter.emit(id, { isSuccess: true, value: result });
        _this2._numPromisesRunning--;
        _this2._run();
      }, function (error) {
        _this2._emitter.emit(id, { isSuccess: false, value: error });
        _this2._numPromisesRunning--;
        _this2._run();
      });
    }
  }, {
    key: '_getNextRequestId',
    value: function _getNextRequestId() {
      return (this._nextRequestId++).toString(16);
    }
  }]);

  return PromisePool;
}();

/**
 * FIFO queue that executes Promise executors one at a time, in order.
 *
 * The executor function passed to the constructor of a Promise is evaluated
 * immediately. This may not always be desirable. Use a PromiseQueue if you have
 * a sequence of async operations that need to use a shared resource serially.
 */


var PromiseQueue = exports.PromiseQueue = function () {
  function PromiseQueue() {
    _classCallCheck(this, PromiseQueue);

    this._promisePool = new PromisePool(1);
  }

  /**
   * @param executor A function that takes resolve and reject callbacks, just
   *     like the Promise constructor.
   * @return A Promise that will be resolved/rejected in response to the
   *     execution of the executor.
   */


  _createClass(PromiseQueue, [{
    key: 'submit',
    value: function submit(executor) {
      return this._promisePool.submit(executor);
    }
  }]);

  return PromiseQueue;
}();
//# sourceMappingURL=promise-executors.js.map