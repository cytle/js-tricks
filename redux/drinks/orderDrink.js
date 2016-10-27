import Drink from '../libs/drink';
import { fetchJsonData } from '../libs/functions';

import wAlert from 'widget/alert';

// 可以被取消的状态
const canCancelStatus = [
  'INIT',
  'CONFIRMED',
  'DELIVERED',
  'DELIVERING',
];


class OrderDrink extends Drink {

  get dormOrders() {
    return this.lists.dormOrders;
  }

  get userOrders() {
    return this.lists.userOrders;
  }

  find(id) {
    const path = `/customer_service/orders/${id}`;
    return this.base.fetchReceive(path)(id);
  }

  queryDormOrders(uid, where = {}) {
    const path = `/customer_service/users/${uid}/dorm/orders?${$.param(where)}`;
    return this.dormOrders.fetchReceive(path)({ uid, where });
  }

  queryUserOrders(uid, where = {}) {
    const path = `/customer_service/users/${uid}/orders?${$.param(where)}`;
    return this.userOrders.fetchReceive(path)({ uid, where });
  }

  cancel(order, remark) {
    let msg = '当前状态不允许取消';
    if (! order.id || isNaN(order.id)) {
      msg = '无效的id';
    } else if (! remark || remark.length === 0) {
      msg = '请输入取消理由';
    } else if (this.canCancel(order)) {
      const data = new FormData();
      data.append('json', JSON.stringify({
        remark
      }));

      return fetchJsonData(`/customer_service/orders/cancel/${order.type}/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: { remark }
      });
    }

    wAlert(msg, 'error');

    return Promise.reject({
      status: 1,
      msg,
      data: null,
    });
  }


  canCancel(order) {
    if (! order || ! order.status || order.isFetching || order.didInvalidate) {
      return false;
    }
    return canCancelStatus.indexOf(order.status) !== -1;
  }
}

export default new OrderDrink({
  base: 'order',
  keyName: 'id',
  lists: {
    'dormOrders': { withPage: true },
    'userOrders': {},
  }
});

