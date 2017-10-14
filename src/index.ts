"use strict";

import * as fs from "fs";

interface Options {
  delimiter: string;
  surround: string;
}

class Reader {
  filename: string;
  options: Options;
  file: string;
  lines: Array<String>;

  /**
   * Generates a 'regex' based on our options
   * @param param0 Global option
   */
  static genRegex({ delimiter, surround }): RegExp {
    let stringMatch: string;
    if (surround === "") {
      stringMatch = delimiter;
    } else {
      stringMatch = `${surround}${delimiter}${surround}`;
    }
    const regex = new RegExp(stringMatch, "g");
    return regex;
  }

  /**
   * Splits a line by a regex and returns it
   * @param regex Regular expression to split by
   * @param line line to split
   * @return a line split by a regex
   */
  static split(regex: RegExp, line: string): Array<any> {
    const splitLine: Array<any> = line.split(regex);
    return splitLine;
  }

  static sanitiseDelimiters(dirty, delim): Object {
    const keys: Array<string> = Object.keys(dirty);
    const firstKey: string = keys[0];
    const cleanFirstKey = firstKey.substring(1);
    const lastKey: string = keys[keys.length - 1];
    const cleanLastKey = lastKey.substring(0, lastKey.length - 1);
    const firstClean = [];
    const lastClean = [];
    dirty[firstKey].forEach(unClean => {
      firstClean.push(unClean.substring(1));
    });
    dirty[cleanFirstKey] = firstClean;
    delete dirty[firstKey];

    dirty[lastKey].forEach(unClean => {
      lastClean.push(unClean.substring(0, unClean.length - 1));
    });
    dirty[cleanLastKey] = lastClean;
    delete dirty[lastKey];
    return dirty;
  }

  /**
   * Initialiser for a reader object
   * @param filename Name of file to be parsed
   * @param options Options given
   */
  constructor(filename: string, options: Options) {
    this.filename = filename;
    this.options = options;
    const file = fs.readFileSync(filename).toString();
    this.lines = file.split("\n");
  }

  parseToArray(): Object {
    const re: RegExp = Reader.genRegex(this.options);
    // clone the array so that we can shift things around
    const lines: Array<String> = this.lines.slice(0);
    // separate the headers from the information
    const headerLine: string = lines.shift().toString();
    const headers: Array<string> = Reader.split(re, headerLine);
    const parsed = {};
    // add keys to parsed - we know they're in order this way
    // so we can loop through everything else this way.
    headers.forEach(header => {
      const key: string = header.toString();
      parsed[key] = [];
    });

    if (lines[lines.length - 1] === "") lines.pop();
    lines.forEach(line => {
      const split: Array<string> = line.split(re);
      headers.forEach(header => {
        parsed[header].push(split.shift());
      });
    });
    const clean: Object = Reader.sanitiseDelimiters(
      parsed,
      this.options.delimiter
    );
    return clean;
  }

  parseToObject() {}
}

export { Reader };
