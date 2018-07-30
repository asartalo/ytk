// TODO: Maybe this can be a library?
function enforcedActionTypes(...types) {
  return new Proxy(new Set(types), {
    get: function(set, prop) {
      if (set.has(prop)) {
        return prop;
      } else {
        throw Error(`'${prop}' action type was not defined`);
      }
    },
  });
}

export default enforcedActionTypes;
