// const tranformerMap = {
//   old_key: {
//     newKey: "newKey",
//     // if you want to transform the value
//     handle: (val) => {
//       return val + "new";
//     },
//   },
// };

function transform(rawObj, transformMap) {
  function transformValue(value, handle) {
    return handle ? handle(value) : value;
  }

  function applyTransform(obj, map, path = []) {
    const transformedObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      const newPath = path.concat(key);
      const stringPath = newPath.join(".");
      if (map.hasOwnProperty(stringPath)) {
        const { newKey, handle } = map[stringPath];
        const newKeys = newKey.split(".");
        const lastNewKey = newKeys.pop();
        let targetObj = transformedObj;
        newKeys.forEach((k) => {
          if (!targetObj[k]) targetObj[k] = {};
          targetObj = targetObj[k];
        });
        targetObj[lastNewKey] = transformValue(obj[key], handle);
      } else if (obj[key] && typeof obj[key] === "object") {
        transformedObj[key] = applyTransform(obj[key], map, newPath);
      } else {
        transformedObj[key] = obj[key];
      }
    }
    return transformedObj;
  }

  return applyTransform(rawObj, transformMap);
}

export default transform;
