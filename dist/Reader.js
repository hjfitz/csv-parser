"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Reader = /** @class */ (function () {
    /**
     * Initialiser for a reader object
     * @param filename Name of file to be parsed
     * @param options Options given
     */
    function Reader(filename, options) {
        this.filename = filename;
        this.regex = Reader.genRegex(options);
        var file = fs.readFileSync(filename).toString();
        this.lines = file.split("\n");
        // RFC 4180 states that a csv file can end in nothing OR a newline
        if (this.lines[this.lines.length - 1] === "")
            this.lines.pop();
    }
    /**
     * Generates a 'regex' based on our options
     * @param param0 Global option
     */
    Reader.genRegex = function (_a) {
        var delimiter = _a.delimiter, surround = _a.surround;
        var stringMatch;
        if (surround === "") {
            stringMatch = delimiter;
        }
        else {
            stringMatch = "" + surround + delimiter + surround;
        }
        var regex = new RegExp(stringMatch, "g");
        return regex;
    };
    /**
     * Remove delimiters from the first and last item in a list
     * We do this because rather than parse like a compile, we're assured
     * that there's a common break point
     * @param line Line to remove delims from
     */
    Reader.removeDelims = function (line) {
        var end = line.length - 1;
        line[0] = line[0].substring(1);
        line[end] = line[end].substring(0, line[end].length - 1);
        return line;
    };
    Reader.prototype.parseToObject = function () {
        var _this = this;
        // clone the array so that we can shift things around
        var lines = this.lines.slice(0);
        // separate the headers from the information
        var headerLine = lines.shift().toString();
        var headers = Reader.removeDelims(headerLine.split(this.regex));
        var parsed = {};
        // add keys to parsed - we know they're in order this way
        // so we can loop through everything else this way.
        headers.forEach(function (header) {
            var key = header.toString();
            parsed[key] = [];
        });
        lines.forEach(function (line) {
            var split = Reader.removeDelims(line.split(_this.regex));
            headers.forEach(function (header) {
                var key = header.toString();
                parsed[key].push(split.shift());
            });
        });
        return parsed;
    };
    Reader.prototype.parseToArray = function () {
        var _this = this;
        var lines = this.lines.slice(0);
        var keys = Reader.removeDelims(lines
            .shift()
            .toString()
            .split(this.regex));
        var parsed = lines.map(function (line) {
            var splitLine = line.split(_this.regex);
            // remove the delimiters
            splitLine = Reader.removeDelims(splitLine);
            var ret = {};
            keys.forEach(function (key) {
                var entry = key.toString();
                ret[entry] = splitLine.shift();
            });
            return ret;
        });
        return parsed;
    };
    return Reader;
}());
exports.default = Reader;
//# sourceMappingURL=Reader.js.map