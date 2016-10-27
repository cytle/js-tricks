import { fetchJsonData } from '../../libs/functions';

/**
 * const fetchData = fetchJsonDataWithActions(requestOrders, receiveOrders, receiveErrorOrders);
 * const fetchOrdersList = (uid, where = {}) => {
 *   const extendAction = { uid, where };
 *   const url = `/customer_service/orders?${$.param(where)}`;
 *   return fetchData(url)(extendAction);
 * };
 * 实现类似功能如下
 * const fetchOrdersList = (uid, where = {}) =>
 *   dispatch => {
 *     dispatch(requestOrders({ uid, where }));
 *     return fetchJsonData(`/customer_service/orders?${$.param(where)}`)
 *       .then(
 *         data => dispatch(receiveOrders(data, { uid, where })),
 *         response => dispatch(receiveErrorOrders(response, { uid, where }))
 *       );
 *   };
 */
// export const fetchJsonDataWithActions = (req, rec, recError) =>
//   (...fetchArgs) =>
//     (...extendArgs) =>
//       dispatch => {
//         dispatch(req(...extendArgs));
//         return fetchJsonData(...fetchArgs)
//           .then(
//             data => dispatch(rec(data, ...extendArgs)),
//             response => dispatch(recError(response, ...extendArgs))
//           );
//       };

class Actions {
  constructor(baseName, options, actionsFactory) {
    this.baseName = baseName;
    this.actionsFactory = actionsFactory;

    this.selfBaseActions = this.actionsFactory(
      this.baseName, options
      );

    this.options = Object.assign({}, options, this.selfBaseActions.options);

    this.parse = this.options.parse || (a => a);
  }

  fetchReceive(...fetchArgs) {
    return (...extendArgs) =>
      dispatch => {
        dispatch(this.request(...extendArgs));
        return fetchJsonData(...fetchArgs)
          .then(
            data => {
              dispatch(this.receive(this.parse(data), ...extendArgs));
              return Promise.resolve(data);
            },
            response => {
              dispatch(this.receiveError(this.parse(response), ...extendArgs));
              return Promise.reject(response);
            }
          );
      };
  }

  get baseActions() {
    return this.selfBaseActions;
  }
  get types() {
    // TODO 优化
    const {
      REQUEST_ACTION,
      INVALIDATE_ACTION,
      RECEIVE_ACTION,
      RECEIVE_ERROR_ACTION,
      UPDATE_ACTION,
      UPDATE_ERROR_ACTION,
    } = this.baseActions;
    return {
      REQUEST_ACTION,
      INVALIDATE_ACTION,
      RECEIVE_ACTION,
      RECEIVE_ERROR_ACTION,
      UPDATE_ACTION,
      UPDATE_ERROR_ACTION,
    };
  }
  get keyName() {
    return this.options.keyName;
  }
  get request() {
    return this.baseActions.request;
  }
  get receive() {
    return this.baseActions.receive;
  }
  get receiveError() {
    return this.baseActions.receiveError;
  }
  get invalidate() {
    return this.baseActions.invalidate;
  }

}

export default Actions;
