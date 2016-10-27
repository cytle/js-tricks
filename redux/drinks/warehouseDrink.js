import Drink from '../libs/drink';
import { warehouseTypeDealerHouse } from '../consts';
import { shouldFetch, getSupplier } from '../libs/functions';


class WarehouseDrink extends Drink {

  get dormWarehouses() {
    return this.lists.dormWarehouses;
  }

  get warehouses() {
    return this.lists.warehouses;
  }

  warehouseIsSupplier(warehouse) {
    return !! (warehouse && warehouse.type === warehouseTypeDealerHouse);
  }

  find(id) {
    const path = `/customer_service/warehouses/${id}`;
    return this.base.fetchReceive(path)(id);
  }

  findBySupplierId(supplierId) {
    const path = `/customer_service/suppliers/${supplierId}/warehouse`;
    return this.base.fetchReceive(path)(null, { supplierId });
  }

  query(where = {}) {
    const path = `/customer_service/warehouses?${$.param(where)}`;
    return this.warehouses.fetchReceive(path)({ where });
  }

  queryDormWarehouses(dormId) {
    const path = `/customer_service/dorms/${dormId}/warehouses`;
    return this.dormWarehouses.fetchReceive(path)({ dormId });
  }

  findByUid(uid) {
    return (dispatch, getState) => {
      const supplier = getSupplier(getState(), uid);
      const warehouse = supplier.warehouse;

      if (shouldFetch(warehouse)) {
        if (warehouse.id) {
          return dispatch(this.find(warehouse.id));
        }

        if (supplier.supplierId) {
          return dispatch(this.findBySupplierId(supplier.supplierId));
        }
      }

      const entityWarehouse = this.base.getEntity(getState(), warehouse.id);
      if (entityWarehouse) {
        return Promise.resolve(
          this.base.receive(
            entityWarehouse,
            entityWarehouse.id,
            { supplierId: entityWarehouse.dhid }
          ));
      }

      return Promise.resolve(
        this.base.receiveError(
          null,
          warehouse.id,
          { supplierId: supplier.supplierId }
        ));
    };
  }

}

export default new WarehouseDrink({
  base: 'warehouse',
  keyName: 'id',
  lists: {
    'dormWarehouses': { withPage: true },
    'warehouses': { withPage: false },

  }
});

