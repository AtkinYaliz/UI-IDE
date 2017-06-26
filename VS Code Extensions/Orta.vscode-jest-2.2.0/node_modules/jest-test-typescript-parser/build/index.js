'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */var _require =

require('jest-editor-support');const babylonParser = _require.parse,ItBlock = _require.ItBlock,Expect = _require.Expect;
const TypeScriptParser = require('./TypeScriptParser');





/**
                                                         * Converts the file into an AST, then passes out a
                                                         * collection of it and expects.
                                                         */
function parse(file) {
  if (file.match(/\.tsx?$/)) {
    return TypeScriptParser.parse(file);
  } else {
    return babylonParser(file);
  }
}

module.exports = {
  TypeScriptParser,
  parse };