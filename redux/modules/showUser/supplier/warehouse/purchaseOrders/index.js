import {
  Button,
} from 'widget/react/bootstrap';

import {
  purchaseOrderBusiType,
  purchaseOrderStatus,
  transPurchaseOrderBusiTypeEnum,
  transPurchaseOrderStatus,
  transWarehouseTypeEnum,
} from '../../../../../consts';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
  DatepickerRange,
} from 'widget/ezList/components';

import {
  purchaseOrderDrink,
  supplierDrink,
} from '../../../../../drinks';
import {
  getSelectOptions,
  formatTime,
  splitIds,
  connectEntity,
  fixedMoney,
} from '../../../../../libs/functions';

const busiTypeEnumOptions = getSelectOptions({
  selectValues: Object.keys(purchaseOrderBusiType),
  withAllOptions: true,
  transFunc: transPurchaseOrderBusiTypeEnum,
});
const statusOptions = getSelectOptions({
  selectValues: Object.keys(purchaseOrderStatus),
  withAllOptions: true,
  transFunc: transPurchaseOrderStatus,
});


const getHandleFetch = (warehouse, dispatch) => (where = {}) => {
  if (! warehouse || ! warehouse.id) {
    return false;
  }
  if (where.orderIds) {
    where = Object.assign({}, where, {
      orderIds: splitIds(where.orderIds)
    });
  }
  return dispatch(purchaseOrderDrink.queryWarehousePurchaseOrders(warehouse.id, where));
};

const getCreateHref = (params, history, query) => (id) => {
  const uid = params.uid;

  return history.createHref(
      `/custom/query/users/${uid}/supplier/warehouse/purchaseOrders/${id}`,
      query
    );
};

const Orders = (props) => {
  const {
    warehousePurchaseOrders: purchaseOrders,
    location,
    children,
    warehouse,
    supplier,
    params,
    dispatch,
    history,
  } = props;

  const {
    orderIds,
    busiTypeEnum,
    status,
    begin,
    end,
  } = location.query;

  const handleFetch = getHandleFetch(warehouse, dispatch);
  const createHref = getCreateHref(params, history, location.query);

  return (
    <div>
      <div className={warehouse && warehouse.id ? 'hidden' : ''}>
        <hr />
        <p className="text-center text-muted">
          {supplierDrink.supplierIsWarehouse(supplier) ? '获取供应商中' : '当前供应商不给店长供货'}
        </p>
      </div>
      <div className={warehouse && warehouse.id ? '' : 'hidden'} >
        <SearchForm
          inline
          onSubmit={handleFetch}
          isFetching={purchaseOrders.isFetching}
        >
          <FormGroup controlId="warehousePurchaseOrdersOrderId" label="订单ID：">
            <FormControl
              type="text"
              placeholder="多个订单逗号隔开"
              name="orderIds"
              defaultValue={orderIds}
            />
          </FormGroup>
          <FormGroup controlId="warehousePurchaseOrdersBusiType" label="订单类型：">
            <FormControl
              componentClass="select"
              name="busiTypeEnum"
              defaultValue={busiTypeEnum}
              options={busiTypeEnumOptions}
            />
          </FormGroup>
          <FormGroup controlId="warehousePurchaseOrdersStatus" label="订单状态：">
            <FormControl
              componentClass="select"
              name="status"
              defaultValue={status}
              options={statusOptions}
            />
          </FormGroup>
          <FormGroup controlId="warehousePurchaseOrdersCreateDate" label="下单时间：">
            <DatepickerRange
              inline
              startName="begin"
              endName="end"
              defaultValue={{ dateStart: begin, dateEnd: end }}
            />
          </FormGroup>

          <FormGroup controlId="warehousePurchaseOrdersSubmit" >
            <Button type="submit" bsSize="small">
              查询
            </Button>
          </FormGroup>
        </SearchForm>
        <List
          list={purchaseOrders}
          onFetch={handleFetch}
          theadData={[
            '序号',
            '下单时间',
            '订单号',
            '渠道类型',
            '订单类型',
            '最终订单金额',
            '订单状态',
            '操作',
          ]}

          tbodyDataItemCallBack={
            (item, index) => [
              (index + 1),
              formatTime(item.addTime * 1000),
              item.orderId,
              transWarehouseTypeEnum(item.warehouseTypeEnum),
              transPurchaseOrderBusiTypeEnum(item.busiTypeEnum),
              fixedMoney(item.finalAmount),
              transPurchaseOrderStatus(item.status),
              <a href={createHref(item.orderId)}>详情</a>
            ]
          }
        />
      </div>

      <hr />

      {children}
    </div>
  );
};

Orders.propTypes = {
  warehouse: React.PropTypes.object,
  supplier: React.PropTypes.object,
  warehousePurchaseOrders: React.PropTypes.object,

  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};


export default connectEntity(Orders, ['supplier', 'warehouse', 'warehousePurchaseOrders']);

