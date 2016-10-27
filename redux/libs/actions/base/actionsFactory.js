
const actions = {};


export default (baseName, options = {}) => {
  if (! actions[baseName]) {
    const prefix = 'COMMON_BASE';

    if (! options.keyName) {
      options.keyName = 'id';
    }

    const REQUEST_ACTION = `${prefix}_REQUEST_${baseName}`;
    const INVALIDATE_ACTION = `${prefix}_INVALIDATE_${baseName}`;
    const RECEIVE_ACTION = `${prefix}_RECEIVE_${baseName}`;
    const RECEIVE_ERROR_ACTION = `${prefix}_RECEIVE_ERROR_${baseName}`;
    const UPDATE_ACTION = `${prefix}_UPDATE_${baseName}`;
    const UPDATE_ERROR_ACTION = `${prefix}_UPDATE_ERROR_${baseName}`;

    const keyName = options.keyName;

    // 使失效
    const invalidate = (keyValue) =>
      ({
        type: INVALIDATE_ACTION,
        [keyName]: keyValue,
      });

    // 请求
    const request = (keyValue, action = {}) =>
      Object.assign({}, {
        type: REQUEST_ACTION,
        [keyName]: keyValue
      }, action);

    // 成功收到内容
    const receive = (data, keyValue, action = {}) =>
      Object.assign({}, {
        type: RECEIVE_ACTION,
        [keyName]: keyValue || data[keyName],
        data,
        receivedAt: Date.now()
      }, action);

    // 请求失败
    const receiveError = (responseJson, keyValue, action = {}) =>
      Object.assign({}, {
        type: RECEIVE_ERROR_ACTION,
        [keyName]: keyValue,
        responseJson,
        receivedAt: Date.now()
      }, action);
    // const update = () =>


    actions[baseName] = {
      REQUEST_ACTION,
      INVALIDATE_ACTION,
      RECEIVE_ACTION,
      RECEIVE_ERROR_ACTION,
      UPDATE_ACTION,
      UPDATE_ERROR_ACTION,
      invalidate,
      request,
      receive,
      receiveError,
      options
    };
  }

  return actions[baseName];
};
