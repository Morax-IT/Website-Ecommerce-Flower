function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();

  keys.forEach((key) => {
    let value = obj[key];
    if (value) {
      sorted[key] = encodeURIComponent(value).replace(/%20/g, "+");
    }
  });

  return sorted;
}

module.exports = sortObject;
