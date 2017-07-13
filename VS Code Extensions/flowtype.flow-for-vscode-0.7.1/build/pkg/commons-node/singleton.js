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

var GLOBAL_MAP_NAME = '__NUCLIDE_SINGLETONS__';

function getMap() {
  var map = global[GLOBAL_MAP_NAME];
  if (!map) {
    map = global[GLOBAL_MAP_NAME] = new Map();
  }
  return map;
}

/**
 * Creates a per-global singleton value.
 * constructor will be called exactly once, future invocations will
 * return the result of the constructor call.
 */
function get(field, constructor) {
  var map = getMap();
  if (!map.has(field)) {
    map.set(field, constructor());
  }
  // Cast through `any` because `map.get` can return null/undefined. We know that `field` exists
  // because we have just checked it above. However, we cannot just call `get` and then check it
  // against null because T may be a nullable type, in which case this would break subtly. So, we
  // circumvent the type system here to maintain the desired runtime behavior.
  return map.get(field);
}

function clear(field) {
  getMap().delete(field);
}

function reset(field, constructor) {
  clear(field);
  return get(field, constructor);
}

exports.default = {
  // Disable Object shorthand on the following line because an issue in Flow prevents using
  // shorthand with the reserved word "get" (among others).
  //
  // eslint-disable-next-line babel/object-shorthand
  get: get,
  clear: clear,
  reset: reset
};
//# sourceMappingURL=singleton.js.map