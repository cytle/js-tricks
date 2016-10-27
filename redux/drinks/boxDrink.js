import Drink from '../libs/drink';

class BoxDrink extends Drink {

  get boxs() {
    return this.lists.boxs;
  }

  find(id) {
    const path = `/customer_service/boxs/${id}`;
    return this.base.fetchReceive(path)(id);
  }

  query(dormId, where = {}) {
    const path = `/customer_service/dorms/${dormId}/boxs?${$.param(where)}`;
    return this.boxs.fetchReceive(path)({ dormId });
  }
}

export default new BoxDrink({
  base: 'box',
  keyName: 'id',
  lists: {
    'boxs': {
      'withPage': false
    },
  }
});

