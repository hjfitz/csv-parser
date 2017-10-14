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
    /**
     * Because of how we parse, we need to remove delimiters.
     * @param dirty uncleaned object
     * @return cleaned up object!
     */
    Reader.sanitiseDelimiters = function (dirty) {
        var keys = Object.keys(dirty);
        var firstKey = keys[0];
        var cleanFirstKey = firstKey.substring(1);
        var lastKey = keys[keys.length - 1];
        var cleanLastKey = lastKey.substring(0, lastKey.length - 1);
        var firstClean = [];
        var lastClean = [];
        dirty[firstKey].forEach(function (unClean) {
            firstClean.push(unClean.substring(1));
        });
        dirty[cleanFirstKey] = firstClean;
        delete dirty[firstKey];
        dirty[lastKey].forEach(function (unClean) {
            lastClean.push(unClean.substring(0, unClean.length - 1));
        });
        dirty[cleanLastKey] = lastClean;
        delete dirty[lastKey];
        return dirty;
    };
    Reader.prototype.parseToObject = function () {
        var re = Reader.genRegex(this.options);
        // clone the array so that we can shift things around
        var lines = this.lines.slice(0);
        // separate the headers from the information
        var headerLine = lines.shift().toString();
        var headers = Reader.split(re, headerLine);
        var parsed = {};
        // add keys to parsed - we know they're in order this way
        // so we can loop through everything else this way.
        headers.forEach(function (header) {
            var key = header.toString();
            parsed[key] = [];
        });
        lines.forEach(function (line) {
            var split = line.split(re);
            headers.forEach(function (header) {
                parsed[header].push(split.shift());
            });
        });
        var clean = Reader.sanitiseDelimiters(parsed);
        return clean;
    };
    Reader.prototype.parseToArray = function () {
        var re = Reader.genRegex(this.options);
        var lines = this.lines.slice(0);
        var keys = lines
            .shift()
            .toString()
            .split(re);
        var keyEnd = keys.length - 1;
        keys[0] = keys[0].substring(1);
        keys[keyEnd] = keys[keyEnd].substring(0, keyEnd);
        lines.map(function (line) {
            var splitLine = line.split(re);
            // remove the delimiters
            var end = splitLine.length - 1;
            splitLine[0] = splitLine[0].substring(1);
            splitLine[end] = splitLine[end].substring(0, end);
            var ret = {};
            keys.forEach(function (key) {
                var entry = key.toString();
                ret[entry] = splitLine.shift();
            });
            debugger;
            return ret;
        });
    };
    return Reader;
}());
exports.Reader = Reader;
//# sourceMappingURL=index.js.map