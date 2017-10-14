import fs from "fs";

interface Options {
  delimiter: string;
  surround: string;
}

class Reader {
  filename: string;
  options: Options;
  file: string;
  lines: Array<String>;

  static genRegex({ delimiter, surround }): RegExp {
    const stringMatch: string =
      "(" + surround + delimiter + "[^" + surround + "]+" + surround + ")";
    const regex = new RegExp(stringMatch, "g");
    return regex;
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

  parseToArray() {
    const re: RegExp = Reader.genRegex(this.options);
    // clone the array so that we can shift things around
    const lines: Array<String> = this.lines.slice(0);
    // separate the headers from the information
    const headers: Array<String> = lines.shift().split(this.options.delimiter);
    const parsed = {};
    // add keys to parsed - we know they're in order this way
    // so we can loop through everything else this way.
    headers.forEach(header => {
      const key: string = header.toString();
      parsed[key] = [];
    });
  }

  parseToObject() {}
}

export { Reader };
