'use strict';
'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function layout(loggingEvent) {
  var eventInfo = _util2.default.format('[%s] [%s] %s - ', loggingEvent.startTime.toISOString(), loggingEvent.level, loggingEvent.categoryName);

  var data = loggingEvent.data.slice();

  // Since console.log support string format as first parameter, we should preserve this behavior
  // by concating eventInfo with first parameter if it is string.
  if (data.length > 0 && typeof data[0] === 'string') {
    data[0] = eventInfo + data[0];
  } else {
    data.unshift(eventInfo);
  }
  return data;
}

/**
 * Comparing to log4js's console appender(https://fburl.com/69861669), you can expand and explore
 * the object in console logged by this Appender.
 */
function consoleAppender() {
  return function (loggingEvent) {
    console.log.apply(console, layout(loggingEvent)); // eslint-disable-line no-console

    // Also support outputing information into a VS Code console,
    // it is only string based, so we only take the first string
    if (global.flowOutputChannel) {
      var message = layout(loggingEvent)[0];
      global.flowOutputChannel.appendLine(message.replace("nuclide -", "flow -"));
    }
  };
}

module.exports = {
  appender: consoleAppender,
  configure: consoleAppender
};
//# sourceMappingURL=consoleAppender.js.map