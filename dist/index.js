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
        this.options = options;
        var file = fs.readFileSync(filename).toString();
        this.lines = file.split("\n");
        // RFC 4180 states that a csv file can end in nothing OR
        // a newline
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
     * Splits a line by a regex and returns it
     * @param regex Regular expression to split by
     * @param line line to split
     * @return a line split by a regex
     */
    Reader.split = function (regex, line) {
        var splitLine = line.split(regex);
        return splitLine;
    };
    Reader.removeDelims = function (line) {
        var end = line.length - 1;
        line[0] = line[0].substring(1);
        line[end] = line[end].substring(0, line[end].length - 1);
        return line;
    };
    Reader.prototype.parseToObject = function () {
        var re = Reader.genRegex(this.options);
        // clone the array so that we can shift things around
        var lines = this.lines.slice(0);
        // separate the headers from the information
        var headerLine = lines.shift().toString();
        var headers = Reader.removeDelims(headerLine.split(re));
        var parsed = {};
        // add keys to parsed - we know they're in order this way
        // so we can loop through everything else this way.
        headers.forEach(function (header) {
            var key = header.toString();
            parsed[key] = [];
        });
        lines.forEach(function (line) {
            var split = Reader.removeDelims(line.split(re));
            headers.forEach(function (header) {
                var key = header.toString();
                parsed[key].push(split.shift());
            });
        });
        return parsed;
    };
    Reader.prototype.parseToArray = function () {
        var re = Reader.genRegex(this.options);
        var lines = this.lines.slice(0);
        var keys = Reader.removeDelims(lines
            .shift()
            .toString()
            .split(re));
        console.log(keys);
        lines.map(function (line) {
            var splitLine = line.split(re);
            // remove the delimiters
            splitLine = Reader.removeDelims(splitLine);
            console.log(splitLine);
            var ret = {};
            keys.forEach(function (key) {
                var entry = key.toString();
                ret[entry] = splitLine.shift();
            });
            debugger;
            return ret;
        });
        return lines;
    };
    return Reader;
}());
exports.Reader = Reader;
//# sourceMappingURL=index.js.map