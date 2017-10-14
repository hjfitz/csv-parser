"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Reader = /** @class */ (function () {
    /**
     * Initialiser for a reader object
     * @param filename Name of file to be parsed
     * @param options Options given
     */
    function Reader(filename, options) {
        this.filename = filename;
        this.options = options;
        var file = fs_1.default.readFileSync(filename).toString();
        this.lines = file.split("\n");
    }
    Reader.genRegex = function (_a) {
        var delimiter = _a.delimiter, surround = _a.surround;
        var stringMatch = "(" + surround + delimiter + "[^" + surround + "]+" + surround + ")";
        var regex = new RegExp(stringMatch, "g");
        return regex;
    };
    Reader.prototype.parseToArray = function () {
        var re = Reader.genRegex(this.options);
        // clone the array so that we can shift things around
        var lines = this.lines.slice(0);
        // separate the headers from the information
        var headers = lines.shift().split(this.options.delimiter);
        var parsed = {};
        // add keys to parsed - we know they're in order this way
        // so we can loop through everything else this way.
        headers.forEach(function (header) {
            var key = header.toString();
            parsed[key] = [];
        });
    };
    Reader.prototype.parseToObject = function () { };
    return Reader;
}());
exports.Reader = Reader;
//# sourceMappingURL=index.js.map