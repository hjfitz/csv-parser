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

  /**
   * Because of how we parse, we need to remove delimiters.
   * @param dirty uncleaned object
   * @return cleaned up object!
   */
  static sanitiseDelimiters(dirty): Object {
    const keys: Array<string> = Object.keys(dirty);
    const firstKey: string = keys[0];
    const cleanFirstKey: string = firstKey.substring(1);
    const lastKey: string = keys[keys.length - 1];
    const cleanLastKey: string = lastKey.substring(0, lastKey.length - 1);
    const firstClean: Array<string> = [];
    const lastClean: Array<string> = [];
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
    // RFC 4180 states that a csv file can end in nothing OR
    // a newline
    if (this.lines[this.lines.length - 1] === "") this.lines.pop();
  }

  parseToObject(): Object {
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

    lines.forEach(line => {
      const split: Array<string> = line.split(re);
      headers.forEach(header => {
        parsed[header].push(split.shift());
      });
    });
    const clean: Object = Reader.sanitiseDelimiters(parsed);
    return clean;
  }

  parseToArray() {
    const re: RegExp = Reader.genRegex(this.options);

    const lines: Array<String> = this.lines.slice(0);

    const keys: Array<String> = lines
      .shift()
      .toString()
      .split(re);

    const keyEnd: number = keys.length - 1;
    keys[0] = keys[0].substring(1);
    keys[keyEnd] = keys[keyEnd].substring(0, keyEnd);

    lines.map(line => {
      const splitLine: Array<String> = line.split(re);
      // remove the delimiters
      const end: number = splitLine.length - 1;
      splitLine[0] = splitLine[0].substring(1);
      splitLine[end] = splitLine[end].substring(0, end);
      const ret: Object = {};
      keys.forEach(key => {
        const entry = key.toString();
        ret[entry] = splitLine.shift();
      });
      debugger;
      return ret;
    });
  }
}

export { Reader };
