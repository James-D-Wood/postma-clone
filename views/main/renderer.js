const renderCollections = async (rootNode) => {
  try {
    if (!rootNode) {
      throw new Error("bad root node");
    }
    const { result, error } = await collections.load();
    if (error) throw error;
    if (result.collections.length > 0) {
      // clear existing nodes
      while (rootNode.hasChildNodes()) {
        rootNode.removeChild(rootNode.lastChild);
      }
      // rebuild tree
      for (let i = 0; i < result.collections.length; i++) {
        const pNode = document.createElement("p");
        pNode.classList.add("collection");
        pNode.textContent = result.collections[i].name;
        rootNode.appendChild(pNode);
      }
    }
  } catch (err) {
    console.warn("error rendering collections:", err);
    alert("An unexpected error occurred");
  }
};

const onImportSubmit = async (event) => {
  event.preventDefault();
  const input = event.target.querySelector("input");
  const file = input.files[0];
  if (!file) {
    alert("No file was selected");
    return;
  }

  // guard against bad file contents
  const fileContents = await file.text();
  try {
    JSON.parse(fileContents);
  } catch {
    alert("Selected file contains invalid json");
    return;
  }

  // request import via IPC channel
  try {
    const { result, error } = await collections.import(fileContents);
    if (error) throw error;
    alert("Import successful");
  } catch (err) {
    console.warn("error invoking import:", err);
    alert("An unexpected error occurred");
  }

  try {
    renderCollections(document.querySelector("#collections"));
  } catch (err) {
    console.warn("error rendering collections:", err);
    alert("An unexpected error occurred");
  }
};

window.addEventListener("load", function () {
  // render collections
  const node = document.querySelector("#collections");
  renderCollections(node);

  // import form
  const form = document.querySelector("#import-upload-form");
  form.addEventListener("submit", onImportSubmit);
});
