

// 将一个iterator转化为数组
export function arrayFromIterator(iterator) {
  const values = [];
  for (const value of iterator) {
    values.push(value);
  }
  return values;
}
