import Drink from '../libs/drink';

class DormItemDrink extends Drink {

  get dormItems() {
    return this.lists.dormItems;
  }

  find(id) {
    const path = `/customer_service/dormItems/${id}`;
    return this.base.fetchReceive(path)(id);
  }

  query(dormId, where = {}) {
    const path = `/customer_service/dorms/${dormId}/dormItems?${$.param(where)}`;
    return this.dormItems.fetchReceive(path)({ dormId });
  }
}

export default new DormItemDrink({
  base: 'dormItem',
  keyName: 'item_id',
  lists: {
    'dormItems': {},
  }
});

