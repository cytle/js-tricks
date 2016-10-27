import Drink from '../libs/drink';
import { fetchJsonData } from '../libs/functions';

import wAlert from 'widget/alert';

// 可以被取消的状态
const canCancelStatus = [
  0, // '初始化'
  1, // '已支付'
  // 2, // '已取消'
  3, // '处理中'
  4, // '配送中'
  // 5, // '完成'
];


class PurchaseOrderDrink extends Drink {

  get dormPurchaseOrders() {
    return this.lists.dormPurchaseOrders;
  }

  get warehousePurchaseOrders() {
    return this.lists.warehousePurchaseOrders;
  }

  find(id) {
    const path = `/customer_service/purchaseOrders/${id}`;
    return this.base.fetchReceive(path)(id);
  }

  queryDormPurchaseOrders(dormId, where = {}) {
    const path = `/customer_service/dorms/${dormId}/purchaseOrders?${$.param(where)}`;
    return this.dormPurchaseOrders.fetchReceive(path)({ dormId });
  }

  queryWarehousePurchaseOrders(warehouseId, where = {}) {
    const path = `/customer_service/warehouses/${warehouseId}/purchaseOrders?${$.param(where)}`;
    return this.warehousePurchaseOrders.fetchReceive(path)({ warehouseId });
  }

  cancel(order, type, remark) {
    let msg = '当前状态不允许取消';
    if (! order.orderId || isNaN(order.orderId)) {
      msg = '无效的id';
    } else if (! type) {
      msg = '请选择责任归属';
    } else if (! remark || remark.length === 0) {
      msg = '请输入取消理由';
    } else if (this.canCancel(order)) {
      return fetchJsonData(`/customer_service/purchaseOrders/${order.orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          type,
          remark,
        }
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
    if (! order || order.isFetching || order.didInvalidate) {
      return false;
    }
    return canCancelStatus.indexOf(order.status) !== -1;
  }
}

export default new PurchaseOrderDrink({
  base: 'purchaseOrder',
  keyName: 'orderId',
  lists: {
    'dormPurchaseOrders': {},
    'warehousePurchaseOrders': {},
  }
});

