/* eslint-env node, jest, es6 */

const Element = jest.genMockFromModule('../Element');

function __setMockFiles(newMockFiles) {
  return { ...this, getProperties: () => newMockFiles.properties };
}

Element.__setMockFiles = __setMockFiles;

module.exports = Element;
