export const keyToString = (object: any, value: any) => {
  for (let objKey in object) {
    if (object[objKey] === value) {
      return objKey;
    }
  }
  return false;
};
