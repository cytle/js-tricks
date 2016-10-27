
import { ucfirst } from './string';

const transFactory = map => value => map[value] || value;

/**
 * 创建一个枚举集合
 * 集合功能：
 * - 给每一个枚举添加trans方法，方法名为trans + 类型名称，如transOrderType
 *
 */
export const createEnumCollection = (collection) => {
  for (const k of Object.keys(collection)) {
    const transName = 'trans' + ucfirst(k);
    if (transName in collection) {
      continue;
    }

    collection[transName] = transFactory(collection[k]);
  }
  return collection;
};
