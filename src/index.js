const fs = require('fs');

class Reader {
  static readFile(
    filename,
    { delimiter = ',', fieldContainer = '', arrayUnderKey = true },
  ) {
    const csv = fs.readFileSync(filename);
    const lines = csv.split('\n');
    const headers = lines.shift();
    const parsed = {};
    headers.split(delimiter).forEach(header => {
      return (parsed[header] = []);
    });
  }
}

class Writer {
  static writeFile(filename, { delimiter, fieldContainer, jsonFormat }) {}
}

module.exports = { Reader, Writer };
