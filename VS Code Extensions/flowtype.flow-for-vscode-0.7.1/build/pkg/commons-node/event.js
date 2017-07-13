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
exports.attachEvent = attachEvent;
exports.observableFromSubscribeFunction = observableFromSubscribeFunction;

var _eventKit = require('event-kit');

var _rxjs = require('rxjs');

/**
 * Add an event listener an return a disposable for removing it. Note that this function assumes
 * node EventEmitter semantics: namely, that adding the same combination of eventName and callback
 * adds a second listener.
 */
function attachEvent(emitter, eventName, callback) {
  emitter.addListener(eventName, callback);
  return new _eventKit.Disposable(function () {
    emitter.removeListener(eventName, callback);
  });
}

function observableFromSubscribeFunction(fn) {
  return _rxjs.Observable.create(function (observer) {
    var disposable = fn(observer.next.bind(observer));
    return function () {
      disposable.dispose();
    };
  });
}
//# sourceMappingURL=event.js.map