import Drink from '../libs/drink';
import { supplierSupplyAuthorityDorm } from '../consts';
import { getSupplier, shouldFetch } from '../libs/functions';


class SupplierDrink extends Drink {

  get suppliers() {
    return this.lists.suppliers;
  }

  supplierHasAuthority(supplier, auth) {
    if (! supplier || ! supplier.supplyAuthority) {
      return false;
    }

    return supplier.supplyAuthority.indexOf(auth) !== -1;
  }

  supplierIsWarehouse(supplier) {
    return this.supplierHasAuthority(supplier, supplierSupplyAuthorityDorm);
  }


  queryByIds(ids) {
    const where = { ids };
    const path = `/customer_service/suppliers/queryByIds?${$.param(where)}`;
    return this.suppliers.fetchReceive(path)({ where });
  }

  queryByIdsIfNeed(ids) {
    return (dispatch, getState) => {
      const state = getState();
      const getEntity = this.base.getEntity;
      const suppliers = {};

      ids = [].filter.call(ids,
        (keyValue) => {
          const entity = getEntity(state, keyValue);
          suppliers[keyValue] = entity;
          return shouldFetch(entity);
        }
      );

      if (ids.length > 0) {
        return dispatch(this.queryByIds(ids))
          .then(
            data => {
              for (let i = data.length - 1; i >= 0; i--) {
                const item = data[i];
                suppliers[item.supplierId] = item;
              }
              return Promise.resolve(suppliers);
            },
            Promise.reject
          );
      }

      return Promise.resolve(suppliers);
    };
  }

  find(supplierId) {
    const path = `/customer_service/suppliers/${supplierId}`;
    return this.base.fetchReceive(path)(supplierId);
  }

  findByUid(uid) {
    return (dispatch, getState) => {
      const obj = getSupplier(getState(), uid);
      const keyName = this.base.keyName;

      if (shouldFetch(obj)) {
        if (obj[keyName]) {
          return dispatch(this.findIfNeed(obj[keyName]));
        }

        const path = `/customer_service/users/${uid}/supplier`;
        return dispatch(this.base.fetchReceive(path)(null, { uid }));
      }

      const entity = this.base.getEntity(getState(), obj[keyName]);
      if (entity) {
        return Promise.resolve(
          this.base.receive(
            entity
          ));
      }

      return Promise.resolve(
        this.base.receiveError(
          obj
        ));
    };
  }
}

const parse = supplier => {
  supplier.contact = supplier.contact ? JSON.parse(supplier.contact) : [];

  if (supplier.supplyAuthority) {
    supplier.supplyAuthority += '';
    supplier.supplyAuthority = supplier.supplyAuthority
    .split(',')
    .map(item => parseInt(item, 10));
  } else {
    supplier.supplyAuthority = [];
  }

  return supplier;
};

export default new SupplierDrink({
  base: 'supplier',
  keyName: 'supplierId',
  lists: {
    'suppliers': { withPage: false, parse: (data) => data.map(parse) },
  },
  options: {
    parse
  }
});

