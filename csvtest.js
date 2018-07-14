const CSV = require("./dist/index");

const reader = new CSV.Reader("test.csv", { delimiter: ",", surround: "'" });

console.log(reader.parseToObject());
