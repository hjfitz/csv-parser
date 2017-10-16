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

  static removeDelims(line: String[]): String[] {
    const end = line.length - 1;
    line[0] = line[0].substring(1);
    line[end] = line[end].substring(0, line[end].length - 1);
    return line;
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
    const lines: String[] = this.lines.slice(0);
    // separate the headers from the information
    const headerLine: string = lines.shift().toString();
    const headers: String[] = Reader.removeDelims(headerLine.split(re));
    const parsed: Object = {};
    // add keys to parsed - we know they're in order this way
    // so we can loop through everything else this way.
    headers.forEach(header => {
      const key: string = header.toString();
      parsed[key] = [];
    });

    lines.forEach(line => {
      const split: String[] = Reader.removeDelims(line.split(re));
      headers.forEach(header => {
        const key = header.toString();
        parsed[key].push(split.shift());
      });
    });
    return parsed;
  }

  parseToArray() {
    const re: RegExp = Reader.genRegex(this.options);

    const lines: String[] = this.lines.slice(0);

    const keys: String[] = Reader.removeDelims(
      lines
        .shift()
        .toString()
        .split(re)
    );

    lines.map(line => {
      let splitLine: String[] = line.split(re);
      // remove the delimiters
      splitLine = Reader.removeDelims(splitLine);
      const ret: Object = {};
      keys.forEach(key => {
        const entry = key.toString();
        ret[entry] = splitLine.shift();
      });
      return ret;
    });
    return lines;
  }
}

export { Reader };
