const { DB } = require("../db/db.js");
const { Collection } = require("../models/request.js");

class Importer {
  static import(postmanImport) {
    // read source file
    let collections;

    // read "db"
    try {
      collections = DB.readCollections();
    } catch (err) {
      throw new Error(`failed to read from db file: ${err}`);
    }

    // parse
    let collectionName;
    try {
      collectionName = postmanImport.info.name;
      if (!collectionName) {
        throw new Error(".info.name is nil");
      }
    } catch (err) {
      throw new Error("error parsing import:", err);
    }

    // append
    const importCollection = new Collection(collectionName, []);
    collections.push(importCollection);

    // write to "db"
    try {
      DB.updateCollections(collections);
    } catch (err) {
      throw new Error(`error saving file to database: ${err}`);
    }
  }
}

const handleImport = (_, data) => {
  let importData;
  try {
    importData = JSON.parse(data);
  } catch {
    return {
      error: new Error(
        "error while importing: import data is not in JSON format"
      ),
    };
  }

  try {
    Importer.import(importData);
  } catch (err) {
    return { error: new Error("error importing collection:", err) };
  }

  return { result: "import complete" };
};

exports.Importer = Importer;
exports.handleImport = handleImport;
