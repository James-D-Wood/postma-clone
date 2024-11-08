const path = require("node:path");
const fs = require("node:fs");

// placeholder file based DB
class DB {
  static DBFILEPATH = path.join(__dirname, "db.json");

  static readCollections = () => {
    return JSON.parse(fs.readFileSync(this.DBFILEPATH, { encoding: "utf8" }));
  };

  static updateCollections = (collections) => {
    fs.writeFileSync(this.DBFILEPATH, JSON.stringify(collections));
  };
}
exports.DB = DB;
