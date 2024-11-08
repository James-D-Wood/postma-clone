const { DB } = require("../db/db.js");
const { Collection, Item, Request } = require("../models/request.js");

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
    const items = [];

    try {
      collectionName = postmanImport.info.name;
      if (!collectionName) {
        throw new Error(".info.name is nil");
      }
      for (let i = 0; i < postmanImport.item.length; i++) {
        const el = postmanImport.item[0];

        // TODO: there definitely must be a better way to do this in JS
        if (!el.name) {
          throw new Error(".item[].name is nil");
        }
        if (!el.request) {
          throw new Error(".item[].request is nil");
        }
        if (!el.request.method) {
          throw new Error(".item[].request.method is nil");
        }
        if (!el.request.url) {
          throw new Error(".item[].request.url is nil");
        }
        if (!el.request.url.raw) {
          throw new Error(".item[].request.url.raw is nil");
        }

        const url = el.request.url.raw;
        const method = el.request.method;
        const headers = el.request.header ?? [];
        const body = el.request.body ?? null;

        const request = new Request(url, method, headers, body);
        const item = new Item(el.name, request);
        items.push(item);
      }
    } catch (err) {
      throw new Error("error parsing import:", err);
    }

    // append
    const importCollection = new Collection(collectionName, items);
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
