// modelled roughly after Postman export format

function Collection(name, items) {
  this.name = name;
  this.items = items;
}

function Item(name, request) {
  this.name = name;
  this.request = request;
}

function Request(url, method, header, body) {
  this.url = url;
  this.method = method;
  this.header = header;
  this.body = body;
}

exports.Collection = Collection;
exports.Item = Item;
exports.Request = Request;
