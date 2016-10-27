import {
  box,
  dorm,
  dormItem,
  dormTransactionRecord,
  order,
  orderPay,
  orderOperate,
  purchaseOrder,
  supplier,
  warehouse,
  withdraw,
} from 'widget/status/enums';

export const boxStatus = box.status;
export const dormItemStatus = dormItem.status;
export const orderStatus = order.statusEnum;
export const orderType = order.typeEnum;
export const purchaseOrderBusiType = purchaseOrder.busiType;
export const purchaseOrderStatus = purchaseOrder.status;

export const transBoxStatus = box.transStatus;
export const transCashType = dormTransactionRecord.transType;

export const transDormFreezeStatus = dorm.transFreezeStatus;
export const transDormFreezeType = dorm.transFreezeType;
export const transDormRole = dorm.transRole;
export const transDormStatus = dorm.transStatus;
export const transDormVerifiedStatus = dorm.transVerifiedStatus;
export const transDormItemStatus = dormItem.transStatus;

export const transOrderOperateType = orderOperate.transTypeEnum;
export const transOrderPayRefundStatus = orderPay.transRefundStatusEnum;
export const transOrderPaySource = orderPay.transSourceEnum;
export const transOrderPayStatus = orderPay.transStatusEnum;
export const transOrderPayType = orderPay.transTypeEnum;
export const transOrderRefundStatus = order.transRefundStatusEnum;
export const transOrderStatus = order.transStatusEnum;
export const transOrderType = order.transTypeEnum;

export const transPurchaseOrderBusiTypeEnum = purchaseOrder.transBusiTypeEnum;
export const transPurchaseOrderCancelType = purchaseOrder.transCancelType;
export const transPurchaseOrderPayType = purchaseOrder.transPayType;
export const transPurchaseOrderStatus = purchaseOrder.transStatus;

export const transSupplierBankAccountType = supplier.transBankAccountType;
export const transSupplierRefundType = supplier.transRefundType;
export const transSupplierStatus = supplier.transStatus;
export const transSupplierSupplyAuthority = supplier.transSupplyAuthority;

export const transWarehouseStatus = warehouse.transStatus;
export const transWarehouseType = warehouse.transType;
export const transWarehouseTypeEnum = warehouse.transTypeEnum;
export const transWithdrawApplyStatusMap = withdraw.transApplyStatusMapEnum;

export const MODULE_SHOW = 'users';
export const MODULE_FORM = 'form';
export const MODULE_FIND = 'findUsers';
export const ROLE_USER = 'user';
export const ROLE_BUYER = 'buyer';
export const ROLE_DORM = 'dorm';
export const ROLE_SUPPLIER = 'supplier';

export const SUPPLY_AUTHORITY_FOR_DORM = '1'; // 给店长供货
export const SUPPLY_AUTHORITY_FOR_DORMHOUSE = '2'; // 给直营仓供货
export const SUPPLY_AUTHORITY_FOR_SUPPLIER = '3'; // 给经销商供货

export const supplierSupplyAuthorityDorm = 1;
export const warehouseTypeDealerHouse = 3;


// 导航
export const roleItems = {
  user: {
    withdraw: '提现信息',
    finance: '金融信息',
  },
  buyer: {
    orders: '订单信息',
  },
  dorm: {
    info: '基本信息',
    orders: '销售单信息',
    purchaseOrders: '补货单信息',
    dormTransactionRecords: '资金流水信息',
    dormItems: '库存信息',
    warehouses: '补货仓库',
    // boxs: '盒子',
  },
  supplier: {
    'info': '基本信息',
    'warehouse/purchaseOrders': '店长补货单信息',
  }
};


export const userRole = {
  user: '用户',
  buyer: '顾客',
  dorm: '店长',
  supplier: '供货商',
};

