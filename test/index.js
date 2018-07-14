const { expect } = require('chai');
const { Reader } = require('../dist/index');

describe('CSV Reader', () => {
  const reader = new Reader('test.csv', { delimiter: ',', surround: "'" });

  describe('parseToArray()', () => {
    it('Should give an array of key-value pairs', () => {
      const res = reader.parseToArray();
      expect(JSON.stringify(res)).to.equal(JSON.stringify(
        [ { col1: '1', col2: '2', col3: '3' },
          { col1: '1', col2: '2', col3: '3' },
          { col1: '1', col2: '2', col3: '3' } ]
      ));
    });
  });

  describe('parseToObject()', () => {
    it('Should return an object, where each key is a column, and that key should pair with a list of values under that column', () => {
      const res = reader.parseToObject();
      expect(JSON.stringify(res)).to.equal(JSON.stringify(
        { col1: [ '1', '1', '1' ],
          col2: [ '2', '2', '2' ],
          col3: [ '3', '3', '3' ] }
      ));
    });
  });
});
