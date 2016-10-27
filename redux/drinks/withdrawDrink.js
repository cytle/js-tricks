import Drink from '../libs/drink';

class WithdrawDrink extends Drink {

  get withdrawList() {
    return this.lists.withdrawList;
  }
  query(uid, where = {}) {
    where = Object.assign(where, { uid });

    const path = `/financialaffairsapi/withdraw/applies/customer_query?${$.param(where)}`;

    // if (! where.status || where.status === 'verifying') {
    //   if (where.status) {
    //     delete where.status;
    //   }
    //   path = `/financialaffairsapi/withdraw/applies/customer_query?${$.param(where)}`;
    // } else {
    //   path = `/financialaffairsapi/withdraw/applies/processed?${$.param(where)}`;
    // }
    return this.withdrawList.fetchReceive(path)({ uid, where });
  }
}

export default new WithdrawDrink({
  base: 'withdraw',
  keyName: 'item_id',
  lists: {
    'withdrawList': {
      parse: withdrawList => {
        return Object.assign(
          {},
          withdrawList,
          {
            data: withdrawList.list
          }
        );
      }
    },
  }
});

