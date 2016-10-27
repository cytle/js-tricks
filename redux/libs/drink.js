import { BaseActions, ListActions } from '../libs/actions';

import {
  objectMap,
} from './functions';


/**
 * 将多个reducer 依次执行
 * @param {array of reducer } reducers
 * @return reducer
 */
const reducersReduce = (reducers) =>
  (state, action) =>
    reducers.reduce((prevState, reducer) => {
      return reducer(prevState, action);
    }, state);

/**
 * 生成单个执行的reducer
 * @param {Actions} drinkBase 基础元素
 * @return reducer
 */
const singleEntitiesReducer = drinkBase =>
  (state = {}, action) => {
    state = Object.assign({}, state,
      drinkBase.reducer(state, action));

    const {
      RECEIVE_ACTION,
      REQUEST_ACTION,
    } = drinkBase.types;

    const keyName = drinkBase.keyName;

    switch (action.type) {
      case RECEIVE_ACTION: return Object.assign({}, state, action.data);
      case REQUEST_ACTION: return Object.assign({}, state, {
        [keyName]: action[keyName]
      });
      default: return state;
    }
  };


/**
 * 生成真实数据单个list的reducer，不能处理single事件发生的情况
 * @param {function} single 执行单个对象的reducer
 * @param {Actions} drinkBase 基础元素
 * @param {Actions} drinkList 列表
 * @return reducer
 */
const singleListEntitiesReducer = ({
  single,
  drinkBase,
  drinkList,
}) =>
  (state = {}, action) => {
    // 执行每一个single(item, singleAction)
    if (action.type === drinkList.types.RECEIVE_ACTION) {
      const receive = drinkBase.receive;
      const keyName = drinkBase.keyName;
      const withPage = drinkList.options.withPage;

      // list中的数据
      // const items = withPage ? action.list.data : action.list;
      const items = withPage ? action.list.data : action.list;

      const nextState = {};

      for (const item of items) {
        // 获取主键值
        const keyValue = item[keyName];

        // 创建一个receive action
        const singleAction = receive(item, keyValue, {
          receivedAt: action.receivedAt
        });
        nextState[keyValue] = single(state[keyValue], singleAction);
      }

      state = Object.assign({}, state, nextState);
    }

    return state;
  };


/**
 * 多个列表一块生成真实数据列表的reducer，同时能处理single事件发生的情况
 * @param {Drink} drink
 * @return reducer
 */
const listEntitiesReducer = drink => {
  const drinkBase = drink.base;
  const keyName = drinkBase.keyName;

  // single 执行单个对象（item）的reducer [选填], 没有single 自动生成single
  const single = drink.options.single || singleEntitiesReducer(drinkBase);
  let reducersReducer;

  {
    const drinkLists = drink.lists;
    const drinkListsArr = [];

    for (const name of Object.keys(drinkLists)) {
      const drinkList = drinkLists[name];
      drinkListsArr.push(singleListEntitiesReducer({
        single,
        drinkBase,
        drinkList
      }));
    }
    if (drinkListsArr.length > 0) {
      reducersReducer = reducersReduce(drinkListsArr);
    }
  }

  return (state = {}, action) => {
    // 如果有keyValue, 先执行一遍single。 single中会判断type
    if (action[keyName]) {
      const keyValue = action[keyName];
      state = Object.assign({}, state, {
        [keyValue]: single(state[keyValue], action)
      });
    }

    if (reducersReducer) {
      return reducersReducer(state, action);
    }
    return state;
  };
};
class Drink {
  constructor({
    base,
    keyName = 'id',
    lists = {},
    options = {}
  }) {
    this.keyName = keyName;

    options = Object.assign({
      keyName,
    }, options);

    this.options = options;

    if (base) {
      this.base = new BaseActions(base, this.options);
    }

    this.lists = objectMap(lists,
      (op, listName) =>
        new ListActions(listName, Object.assign({ keyName }, op))
    );
  }

  get entitiesReducer() {
    return listEntitiesReducer(this);
  }

  get baseName() {
    return this.base ? this.base.baseName : null;
  }

  findIfNeed(keyValue, forceWhenLastReceivedError = false) {
    return (dispatch, getState) => {
      const entity = this.base.getEntity(getState(), keyValue);

      if (entity) {
        if (! entity.didInvalidate) {
          return Promise.resolve(entity);
        }

        if (entity.isFetching) {
          return Promise.reject({
            status: 10,
            msg: '正在查询中'
          });
        }

        if (! forceWhenLastReceivedError && entity.lastReceivedError) {
          return Promise.reject(entity.lastReceivedErrorResponse);
        }
      }


      return dispatch(this.find(keyValue));
    };
  }
}

export default Drink;

