const fs = require("fs");
const path = require("path");

const ensureDir = (name) => {
  if (fs.existsSync(name)) {
    return true;
  } else {
    if (ensureDir(path.dirname(name))) {
      fs.mkdirSync(name);
      return true;
    }
  }
};

module.exports = {
  ensureDir,
};
