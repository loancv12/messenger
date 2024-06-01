function toCamelCase(str) {
  return str
    .split(" ")
    .map(function (word, index) {
      // If it is the first word make sure it is all lowercase
      if (index === 0) {
        return word.toLowerCase();
      }
      // If it is not the first word capitalize the first letter and make the rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

export default toCamelCase;
