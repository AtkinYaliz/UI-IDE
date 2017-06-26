"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const request = require("request-promise");
const css = require("css");
const html = require("htmlparser2");
const css_class_extractor_1 = require("../common/css-class-extractor");
class HtmlParseEngine {
    constructor() {
        this.languageId = 'html';
        this.extension = 'html';
    }
    parse(textDocument) {
        return new Promise((resolve, reject) => {
            const definitions = [];
            const urls = [];
            let tag;
            let isRelStylesheet = false;
            let linkHref;
            const parser = new html.Parser({
                onopentagname: (name) => {
                    tag = name;
                },
                onattribute: (name, value) => {
                    if (name === "rel" && value === "stylesheet") {
                        isRelStylesheet = true;
                    }
                    if (tag === "link" && name === "href" && value.indexOf('http') === 0) {
                        linkHref = value;
                    }
                },
                ontext: (text) => {
                    if (tag === "style") {
                        definitions.push(...css_class_extractor_1.default.extract(css.parse(text)));
                    }
                },
                onclosetag: () => {
                    if (tag === "link" && isRelStylesheet && linkHref) {
                        urls.push(linkHref);
                    }
                    isRelStylesheet = false;
                    linkHref = null;
                }
            });
            parser.write(textDocument.getText());
            parser.end();
            return async.each(urls, (url, callback) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let content = yield request.get(url);
                    definitions.push(...css_class_extractor_1.default.extract(css.parse(content)));
                    return callback();
                }
                catch (error) {
                    return callback(error);
                }
            }), (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(definitions);
            });
        });
    }
}
exports.default = HtmlParseEngine;
//# sourceMappingURL=html-parse-engine.js.map