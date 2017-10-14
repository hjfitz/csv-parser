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

  parseToArray() {}

  parseToObject() {}
}

export { Reader, Writer };
