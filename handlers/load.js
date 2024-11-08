const { DB } = require("../db/db.js");

const handleLoad = () => {
  let collections;
  try {
    collections = DB.readCollections();
    return { result: { collections } };
  } catch (err) {
    console.warn(err);
    return {
      error: new Error("error while loading collections:", err),
    };
  }
};

exports.handleLoad = handleLoad;
