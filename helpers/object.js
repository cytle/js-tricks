
// 对象 map
export const objectMap = (items, cb) => {
  const newItems = {};
  // TODO 判断是否为对象
  if (! items) return newItems;
  for (const itemName of Object.keys(items)) {
    newItems[itemName] = cb(items[itemName], itemName, items);
  }
  return newItems;
};
