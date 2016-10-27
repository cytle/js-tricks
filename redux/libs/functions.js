import { connect } from 'widget/reactRedux';

export {
  fetchJsonData,
  formatTime,
  objectMap,
  splitByCommaAndUnique as splitIds,
  transCentMoney,
  fixedMoney
} from 'widget/helpers';

export const shouldFetch = baseObj => {
  if (! baseObj) {
    return true;
  }
  // 不在获取+上次获取有效+无效的（didInvalidate||lastReceivedError）
  return ! baseObj.isFetching && ! baseObj.lastReceivedError && baseObj.didInvalidate;
};

export const shouldFetchFactory = (type) =>
  (state, keyValue) => {
    const items = state.entities[type + 's'];
    if (! items) {
      return true;
    }
    return shouldFetch(items[keyValue]);
  };

// 通过keyValue获取相应真实数据工厂方法
export const getEntityFactory = type =>
  (state, keyValue) => {
    const items = state.entities[type + 's'];
    if (! items) {
      return undefined;
    }
    return items[keyValue];
  };

// 通过keyValue获取店长真实数据
export const getDormEntity = getEntityFactory('dorm');
export const getWarehouseEntity = getEntityFactory('warehouse');


export const getUserEntity = getEntityFactory('user');


// 通过uid获取app下的user
export const getUser = (state, uid) => {
  if (! uid) {
    return undefined;
  }
  return state.app.users[uid];
};

// 通过uid获取app下的supplier
export const getSupplier = (state, uid) => {
  const user = getUser(state, uid);
  if (! user) {
    return undefined;
  }
  return user.supplier;
};


// 通过uid获取app下的dorm
export const getDorm = (state, uid) => {
  const user = getUser(state, uid);
  if (! user) {
    return undefined;
  }
  return user.dorm;
};

// 通过uid获取相应角色数据工厂方法
export const getEntityByUidFactory = (type, keyName = 'id', getParentByUid = getUser) =>
  (state, uid) => {
    const parentObj = getParentByUid(state, uid);

    let obj = parentObj ? parentObj[type] : undefined;

    if (obj && obj[keyName]) {
      const keyValue = obj[keyName];

      obj = getEntityFactory(type)(state, keyValue) || obj;
    }

    return obj;
  };


// 通过uid获取user
export const getUserEntityByUid = getUserEntity;

// 通过uid获取店长
export const getDormEntityByUid = getEntityByUidFactory('dorm', 'dormId');

// 通过uid获取供应商
export const getSupplierEntityByUid = getEntityByUidFactory('supplier', 'supplierId');

// 通过uid获取仓库
export const getWarehouseEntityByUid = getEntityByUidFactory('warehouse', 'id', getSupplier);


const getEntityList = (entityItems, list) => Object.assign(
  {},
  list,
  { items: list.items.map(id => entityItems[id]) }
);


const entityInfo = {
  user: {
    keyName: 'uid',
    getEntity: getUserEntityByUid,
  },
  dorm: {
    keyName: 'dormId',
    getEntity: getDormEntityByUid,
  },
  supplier: {
    keyName: 'supplierId',
    getEntity: getSupplierEntityByUid,
  },
  warehouse: {
    keyName: 'id',
    getEntity: getWarehouseEntityByUid,
  },

  selectedRole: {
    getEntity: (state) => state.app.selectedRole,
  },
  selectedUser: {
    getEntity: (state, uid) => uid,
  },

  dormBoxs: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.boxs,
        app.users[uid].dorm.boxs
      )
  },


  withdrawList: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.withdraws,
        app.users[uid].user.withdrawList
      )
  },

  userOrders: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.orders,
        app.users[uid].user.orders
      )
  },

  dormOrders: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.orders,
        app.users[uid].dorm.orders
      )
  },
  dormPurchaseOrders: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.purchaseOrders,
        app.users[uid].dorm.purchaseOrders
      )
  },
  dormTransactionRecords: {
    getEntity: ({ entities, app }, uid) => app.users[uid].dorm.dormTransactionRecords
  },
  dormWarehouses: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.warehouses,
        app.users[uid].dorm.warehouses
      )
  },
  warehousePurchaseOrders: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.purchaseOrders,
        app.users[uid].supplier.warehouse.purchaseOrders
      )
  },
  dormItems: {
    getEntity: ({ entities, app }, uid) => getEntityList(
        entities.dormItems,
        app.users[uid].dorm.dormItems
      )
  },

  usersList: {
    getEntity: ({ entities, app }) => getEntityList(entities.users, app.usersList)
  },

  getUser: {
    getEntity: (state) => keyValue => getUserEntity(state, keyValue)
  },

  getOrder: {
    getEntity: (state) => (id) => state.entities.orders[id]
  },

  getPurchaseOrder: {
    getEntity: (state) => (id) => state.entities.purchaseOrders[id]
  }
};

export const connectEntity = (component, wantEntities) =>
  connect(state => {
    const uid = state.app.selectedUser;
    const props = {};

    [...new Set(wantEntities)].every(entityType => {
      if (entityType in entityInfo) {
        props[entityType] = entityInfo[entityType].getEntity(state, uid);
      }
      return entityType;
    });

    return props;
  })(component);


/* ====================================== */


/**
 * 获取选项 option
 * @param Object
 *     selectValues   所有值
 *     transFunc      值翻译回调
 *     withAllOptions 是否需要「全部」选项
 * @return array
 */
export const getSelectOptions = ({
  selectValues = [],
  transFunc,
  withAllOptions = false,
}) => {
  const options = selectValues.map(value => ({
    value,
    children: transFunc(value)
  }));

  if (withAllOptions) {
    options.unshift({
      value: '',
      children: '全部'
    });
  }
  return options;
};
