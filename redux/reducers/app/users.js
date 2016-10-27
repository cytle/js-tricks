import { combineReducers } from 'widget/redux';
import { objectMap } from '../../libs/functions';

import {
  userDrink,
  orderDrink,
  dormTransactionRecordDrink,
  purchaseOrderDrink,
  warehouseDrink,
  dormDrink,
  supplierDrink,
  dormItemDrink,
  withdrawDrink,
  boxDrink,
 } from '../../drinks';

/**
 * 获取角色的reducer
 * @param items
 *
 * @return object
 *
 * 例子：
 *
 * appReducerConfigTrans({
 *   base: baseActions,
 *   lists: {
 *     orders: {listActions}
 *   },
 *   childrends: {}  // 子集结构
 * })
 *
 */
const appReducerConfigTrans = ({ base, lists = {}, childrens = {} }) => {
  const reducers = base ? base.reducerObject : {};
  const listReducers = objectMap(lists, (list) => list.reducer);
  const childrenReducers = objectMap(childrens, appReducerConfigTrans);

  const a = (Object.assign(
      {},
      reducers,
      listReducers,
      childrenReducers
      ));
  return combineReducers(a);
};

// config定义
const user = {
  base: userDrink.base,
  lists: {
    orders: orderDrink.userOrders,
    withdrawList: withdrawDrink.withdrawList
  }
};

const dorm = {
  base: dormDrink.base,
  lists: {
    orders: orderDrink.dormOrders,
    purchaseOrders: purchaseOrderDrink.dormPurchaseOrders,
    dormTransactionRecords: dormTransactionRecordDrink.dormTransactionRecords,
    dormItems: dormItemDrink.dormItems,
    boxs: boxDrink.boxs,
    warehouses: warehouseDrink.dormWarehouses,
  }
};

const warehouse = {
  base: warehouseDrink.base,
  lists: {
    purchaseOrders: purchaseOrderDrink.warehousePurchaseOrders
  }
};

const supplier = {
  base: supplierDrink.base,
  childrens: { warehouse }
};

const baseUser = {
  childrens: {
    user,
    dorm,
    supplier,
  }
};

// 获取单个user处理的reducer
const singleUser = appReducerConfigTrans(baseUser);

// 执行单个user
const users = (state = {}, action) => {
  let actionUid;

  if (action.uid) {
    actionUid = action.uid;
  }

  // 通过dormId 查询 uid
  if (! actionUid && action.dormId) {
    const dormId = action.dormId;
    for (const uid of Object.keys(state)) {
      if (dormId === state[uid].dorm.dormId) {
        actionUid = uid;
        break;
      }
    }
  }

  // 通过supplierId 查询 uid
  if (! actionUid && action.supplierId) {
    const supplierId = action.supplierId;
    for (const uid of Object.keys(state)) {
      if (supplierId === state[uid].supplier.supplierId) {
        actionUid = uid;
        break;
      }
    }
  }

  // 通过warehouseId 查询 uid
  if (! actionUid && action.warehouseId) {
    const warehouseId = action.warehouseId;
    for (const uid of Object.keys(state)) {
      if (warehouseId === state[uid].supplier.warehouse.id) {
        actionUid = uid;
        break;
      }
    }
  }

  if (actionUid) {
    return Object.assign({}, state, {
      [actionUid]: singleUser(state[actionUid], action)
    });
  }

  return state;
};

export default users;
