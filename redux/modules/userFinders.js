import {
  userDrink,
  dormDrink,
  supplierDrink,
  orderDrink,
  purchaseOrderDrink,
  warehouseDrink
} from '../drinks';
import wAlert from 'widget/alert';
import {
  transOrderType,
  ROLE_USER,
  ROLE_BUYER,
  ROLE_DORM,
  ROLE_SUPPLIER,
} from '../consts';


function fetchPromiseError(jsonResponse) {
  return Promise.resolve([{
    isError: true,
    jsonResponse
  }]);
}

function fetchPromiseResolve(data) {
  return Promise.resolve(data);
}

// 以下是客服查询入口，进行身份查询
/*
const findBySupplier = {
  catchRegex: [string|RegExp],
  find: callback(dispatch, { key, value, role }) { return Promise }
};
*/

// 通过供应商查询
const findBySupplier = {
  catchRegex: 'supplier',
  find: (dispatch, { value, role = ROLE_SUPPLIER }) => (
    dispatch(supplierDrink.findIfNeed(value, true))
    .then(data => Promise.resolve(
      [{
        uid: data.uid,
        source: '供货商',
        role
      }]
    ), fetchPromiseError)
  )
};

// 通过店长仓库
const findByWarehouse = {
  catchRegex: 'warehouse',
  find: (dispatch, { value, role = ROLE_SUPPLIER, urlMore }) => (
    dispatch(warehouseDrink.findIfNeed(value))
    .then((warehouse) => {
      if (! warehouseDrink.warehouseIsSupplier(warehouse)) {
        wAlert('该补货单的供货商不是经销商，暂时无法查询', 'warn');
        return Promise.resolve([]);
      }

      return dispatch(supplierDrink.findIfNeed(warehouse.dhId))
        .then(supplier => Promise.resolve(
          [{
            uid: supplier.uid,
            source: '店长仓库',
            role,
            urlMore
          }]
        ), fetchPromiseError);
    }, fetchPromiseError)
  )
};

const findByDorm = {
  catchRegex: 'dorm',
  find: (dispatch, { value, role = ROLE_DORM, urlMore }) => (
    dispatch(dormDrink.findIfNeed(value, true))
    .then(data => Promise.resolve(
      [{
        uid: data.uid,
        source: '店长',
        role,
        urlMore
      }]
    ), fetchPromiseError)
  )
};

const findByUser = {
  catchRegex: 'uid',
  find: (dispatch, { value, role = ROLE_USER }) => (
    dispatch(userDrink.findIfNeed(value, true))
    .then(data => Promise.resolve(
      [{
        uid: data.uid,
        source: '用户',
        role
      }]
    ), fetchPromiseError)
  )
};


const findByOrder = {
  catchRegex: 'orderId',
  find: (dispatch, { value }) => (
    dispatch(orderDrink.findIfNeed(value, true))
    .then(data => Promise.resolve(
      [
        // TODO 判断是否为盒子订单等不以uid为卖家id的订单类型
        {
          uid: data.sellerId,
          source: `「${transOrderType(data.type)}」订单卖家`,
          role: ROLE_DORM,
          urlMore: '/orders?ids=' + data.id
        },
        {
          uid: data.buyerId,
          source: `「${transOrderType(data.type)}」订单买家`,
          role: ROLE_BUYER,
          urlMore: '/orders?ids=' + data.id
        }
      ]
    ), fetchPromiseError)
  )
};

const findByPurchase = {
  catchRegex: 'purchaseId',
  find: (dispatch, { value }) => (
    dispatch(purchaseOrderDrink.findIfNeed(value, true))
    .then((purchase) =>
      Promise.all([
        // 查询店长
        findByDorm.find(dispatch, {
          value: purchase.dormId,
          role: ROLE_DORM,
          urlMore: '/purchaseOrders?orderIds=' + purchase.orderId
        }),

        // 补货单供货商
        findByWarehouse.find(dispatch, {
          value: purchase.whId,
          role: ROLE_SUPPLIER,
          urlMore: '/warehouse/purchaseOrders?orderIds=' + purchase.orderId
        }),
      ])
      .then(values => Promise.resolve(
        values.reduce((p, c) => p.concat(c), [])
      )
    ), fetchPromiseError)
  )
};

const findByPhone = {
  catchRegex: 'phone',
  find: (dispatch, { value, role }) => (
    Promise.all([
      // 查询用户
      dispatch(userDrink.query({ phone: value }))
        .then(fetchPromiseResolve, fetchPromiseError),

      dispatch(dormDrink.query({ phone: value }))
        .then(fetchPromiseResolve, fetchPromiseError),

      dispatch(warehouseDrink.query({ phone: value }))
        .then((warehouses => {
          const ids = warehouses
            .filter(warehouseDrink.warehouseIsSupplier)
            .map(w => w.dhId);

          return dispatch(supplierDrink.queryByIdsIfNeed(ids));
        }), fetchPromiseError)
        .then(fetchPromiseResolve, fetchPromiseError)

    ])
    .then(values => {
      const u = [];
      const users = values[0];
      const dorms = values[1];
      const suppliers = values[2];

      for (let i = users.length - 1; i >= 0; i--) {
        const item = users[i];
        if (! item.isError) {
          u.push({
            uid: item.uid,
            source: '用户',
            role: role || ROLE_USER
          });
        }
      }

      for (let i = dorms.length - 1; i >= 0; i--) {
        const item = dorms[i];
        if (! item.isError) {
          u.push({
            uid: item.uid,
            source: '店长',
            role: role || ROLE_DORM
          });
        }
      }

      for (const key of Object.keys(suppliers)) {
        const item = suppliers[key];
        if (! item.isError && item.uid) {
          u.push({
            uid: item.uid,
            source: '店长仓库',
            role: role || ROLE_SUPPLIER
          });
        }
      }


      return Promise.resolve(u);
    }, fetchPromiseError)
  )
};

const findByAny = {
  catchRegex: /^.*$/,
  find: (dispatch, { value, key, role = ROLE_USER }) => (
    dispatch(userDrink.query({ [key]: value }))
    .then(data => Promise.resolve(
      data.map(
        v => ({
          uid: v.uid,
          source: '用户',
          role
        })
      )
    ), fetchPromiseError)
  )
};

const finders = [
  findBySupplier,
  findByWarehouse,
  findByDorm,
  findByUser,
  findByOrder,
  findByPurchase,
  findByPhone,

  // 放到最后
  findByAny,
];

// 查找finder
const getFinder = key => finders.find(v => {
  const catchRegex = v.catchRegex;
  if (catchRegex instanceof RegExp) {
    return catchRegex.test(key);
  }

  return catchRegex === key;
});

// find工厂
export const getFind = (key, dispatch) => {
  const finder = getFinder(key);

  if (finder) {
    return (params) => finder.find(dispatch, params);
  }
  return undefined;
};
