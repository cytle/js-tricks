import actionsFactory from './actionsFactory';

// base
// {
//   isFetching: boolean,   // 是否正在fetch
//   didInvalidate: true,   // 是否无效
//   lastUpdated: integer,  // 最后更新时间
// }


export default baseName => {
  // 获取base相关的actions
  const {
    REQUEST_ACTION,
    INVALIDATE_ACTION,
    RECEIVE_ACTION,
    RECEIVE_ERROR_ACTION,
    options
  } = actionsFactory(baseName);
  const keyName = options.keyName;

  const key = (state = null, action) => {
    switch (action.type) {
      case REQUEST_ACTION:
      case RECEIVE_ACTION:
      case RECEIVE_ERROR_ACTION:
      case INVALIDATE_ACTION: return action[keyName] || state;

      default: return state;
    }
  };

  const isFetching = (state = false, action) => {
    switch (action.type) {
      case REQUEST_ACTION: return true;
      case RECEIVE_ACTION:
      case RECEIVE_ERROR_ACTION: return false;

      default: return state;
    }
  };

  const didInvalidate = (state = true, action) => {
    switch (action.type) {
      case RECEIVE_ACTION: return false;
      case INVALIDATE_ACTION: return true;

      default: return state;
    }
  };

  const lastUpdated = (state = 0, action) => {
    switch (action.type) {
      case RECEIVE_ACTION:
      case REQUEST_ACTION:
      case RECEIVE_ERROR_ACTION:
      case INVALIDATE_ACTION: return Date.now();

      default: return state;
    }
  };

  const receivedAt = (state = 0, action) => {
    switch (action.type) {
      case RECEIVE_ACTION: return action.receivedAt;

      default: return state;
    }
  };

  const lastReceivedError = (state = false, action) => {
    switch (action.type) {
      case INVALIDATE_ACTION:
      case RECEIVE_ACTION: return false;
      case RECEIVE_ERROR_ACTION: return true;

      default: return state;
    }
  };
  const lastReceivedErrorResponse = (state = {}, action) => {
    switch (action.type) {
      case RECEIVE_ERROR_ACTION: return action.responseJson || {
        status: 1,
        msg: '未知错误: lose responseJson'
      };

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
    [keyName]: key,
  };
};
