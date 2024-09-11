// const transformMap2 = {
//   _id: {
//     newKey: "id",
//   },
//   _date: {
//     newKey: "date",
//   },
//   address: {
//     newKey: "zcode",
//     nestedKey: {
//       city: {
//         newKey: "province",
//         handle: (val) => "Province " + val,
//       },
//       anniverDate: {
//         newKey: "anniver",
//       },
//     },
//   },
// };

function transformObj(rawObj, transformMap) {
  // Function to apply transformations directly on the rawObj
  function applyTransform(obj, map) {
    Object.keys(map).forEach((key) => {
      const mapEntry = map[key];
      const { newKey, handle, ...nestedKeys } = mapEntry;

      // Check if the key exists in the object to be transformed
      if (obj.hasOwnProperty(key)) {
        const oldValue = obj[key];

        // If there's a newKey, update the key name
        if (newKey) {
          obj[newKey] = oldValue;
          delete obj[key];
        }

        // If there's a handle function, apply it to the value
        if (handle && obj.hasOwnProperty(newKey)) {
          obj[newKey] = handle(oldValue);
        }

        // If there are nested keys, recursively apply transformations
        if (nestedKeys && typeof oldValue === "object" && oldValue !== null) {
          Object.keys(nestedKeys).forEach((nestedKey) => {
            // Ensure nestedKey is an actual object before recursion
            if (
              typeof nestedKeys[nestedKey] === "object" &&
              nestedKeys[nestedKey] !== null
            ) {
              applyTransform(obj[newKey], nestedKeys[nestedKey]);
            }
          });
        }
      }
    });
  }

  // Apply transformations directly to the rawObj
  applyTransform(rawObj, transformMap);

  return rawObj;
}
export default transformObj;

export const transformPwd = {
  pwd: {
    newKey: "password",
  },
};
