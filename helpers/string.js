

export const splitByCommaAndUnique = (ids) =>
  ids && ids
    .replace(/\s/g, '')
    .replace(/，/g, ',')
    .split(',')
    .sort()
    .filter((c, index, arr) => ! index || arr[index - 1] !== c);


export const ucfirst = str =>
  str.substring(0, 1).toUpperCase() + str.substring(1);
