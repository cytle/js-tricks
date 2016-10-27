import baseActionsFactory from '../base/actionsFactory';

const actions = {};
const prefix = 'COMMON_LIST';

export default (baseName, options = {}) => {
  if (! actions[baseName]) {
    // 默认是 withPage 为是
    if (options.withPage !== false) {
      options.withPage = true;
    }

    const {
      REQUEST_ACTION,
      INVALIDATE_ACTION,
      RECEIVE_ACTION,
      RECEIVE_ERROR_ACTION,
    } = baseActionsFactory(`${prefix}_${baseName}`, options);

    // 使失效
    const invalidate = () =>
      ({
        type: INVALIDATE_ACTION,
      });

    // 请求
    const request = (action = {}) =>
      Object.assign({}, {
        type: REQUEST_ACTION,
      }, action);

    // 成功收到内容
    const receive = (data, action = {}) =>
      Object.assign({}, {
        type: RECEIVE_ACTION,
        list: data,
        receivedAt: Date.now()
      }, action);

    // 请求失败
    const receiveError = (responseJson, action = {}) =>
      Object.assign({}, {
        type: RECEIVE_ERROR_ACTION,
        responseJson,
        receivedAt: Date.now()
      }, action);


    actions[baseName] = {
      REQUEST_ACTION,
      INVALIDATE_ACTION,
      RECEIVE_ACTION,
      RECEIVE_ERROR_ACTION,
      invalidate,
      request,
      receive,
      receiveError,
      options
    };
  }

  return actions[baseName];
};
