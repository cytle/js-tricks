import actionsFactory from './actionsFactory';
import baseReducersFactory from '../base/reducersFactory';

// list
// {
//   currentPage: integer,  // 当前页
//   prePage: integer,      // 每页数量
//   total: integer,        // 总条数
//   items: arrayOfInteger, // id组成的数组
// }
// without page
// []  // id组成的数组

const prefix = 'COMMON_LIST';


const itemsReduce = ({ RECEIVE_ACTION, keyName }) =>
  (state = [], action) => {
    if (action.type === RECEIVE_ACTION) {
      return state.slice(0).map(item => item[keyName]);
    }

    return state;
  };

const getLastPage = list =>
  (('last_page' in list) ? list.last_page : Math.ceil(list.total / list.per_page));

/**
 * 生成app下的处理list的reducer
 * @param baseName list的基础名字
 * @param itemsReducer list中items的额外处理，这是可选的，可以在此按需返回item中的信息（注意传入的
 * state的值为新的items）默认为返回每个item的主键保存。
 *
 * @return function|object
 */
const listReducersFactory = (baseName, itemsReducer) => {
  // 获取base相关的actions
  const {
    RECEIVE_ACTION,
    options
  } = actionsFactory(baseName);

  itemsReducer = itemsReducer || itemsReduce({ RECEIVE_ACTION, keyName: options.keyName });

  const items = (state = [], action) => {
    let nextState;

    switch (action.type) {
      case RECEIVE_ACTION: nextState = action.list.data; break;

      default: nextState = state;
    }

    return itemsReducer(nextState, action);
  };

  const {
    isFetching,
    didInvalidate,
    lastUpdated,
    receivedAt,
    lastReceivedError,
    lastReceivedErrorResponse,

  } = baseReducersFactory(`${prefix}_${baseName}`);

  if (options.withPage) {
    const currentPage = (state = 1, action) => {
      switch (action.type) {
        case RECEIVE_ACTION: return parseInt(action.list.current_page, 10);

        default: return state;
      }
    };

    const prePage = (state = 10, action) => {
      switch (action.type) {
        case RECEIVE_ACTION: return parseInt(action.list.per_page, 10);

        default: return state;
      }
    };
    const lastPage = (state = 0, action) => {
      switch (action.type) {
        case RECEIVE_ACTION: return getLastPage(action.list);

        default: return state;
      }
    };

    const total = (state = 0, action) => {
      switch (action.type) {
        case RECEIVE_ACTION: return parseInt(action.list.total, 10);

        default: return state;
      }
    };

    return {
      isFetching,
      didInvalidate,
      lastUpdated,
      receivedAt,
      lastReceivedError,
      lastReceivedErrorResponse,

      currentPage,
      prePage,
      lastPage,
      total,
      items,
    };
  }

  return {
    isFetching,
    didInvalidate,
    lastUpdated,
    receivedAt,
    lastReceivedError,
    lastReceivedErrorResponse,

    items,
  };
};


export default listReducersFactory;
