import Drink from '../libs/drink';


class DormTransactionRecordDrink extends Drink {

  get dormTransactionRecords() {
    return this.lists.dormTransactionRecords;
  }

  query(dormId, where = {}) {
    const path = `/customer_service/dorms/${dormId}/dormTransactionRecords?${$.param(where)}`;
    return this.dormTransactionRecords.fetchReceive(path)({ dormId, where });
  }


}

export default new DormTransactionRecordDrink({
  keyName: 'itemId',
  lists: {
    'dormTransactionRecords': {
      withPage: true,
      itemsReducer: (state = []) => state
    },
  }
});

