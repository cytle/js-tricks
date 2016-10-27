import {
  Button,
} from 'widget/react/bootstrap';

import {
  purchaseOrderBusiType,
  purchaseOrderStatus,
  transPurchaseOrderBusiTypeEnum,
  transPurchaseOrderStatus,
  transWarehouseTypeEnum,
} from '../../../../consts';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
  DatepickerRange,
} from 'widget/ezList/components';

import {
  purchaseOrderDrink,
} from '../../../../drinks';

import {
  getSelectOptions,
  formatTime,
  splitIds,
  connectEntity,
  fixedMoney,
} from '../../../../libs/functions';

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


const getHandleFetch = (dorm, dispatch) => (where = {}) => {
  if (! dorm || ! dorm.dormId) {
    return false;
  }
  if (where.orderIds) {
    where = Object.assign({}, where, {
      orderIds: splitIds(where.orderIds)
    });
  }
  return dispatch(purchaseOrderDrink.queryDormPurchaseOrders(dorm.dormId, where));
};

const getCreateHref = (uid, history, query) => (id) => {
  return history.createHref(
      `/custom/query/users/${uid}/dorm/purchaseOrders/${id}`,
      query
    );
};


const Orders = (props) => {
  const {
    dorm,
    dormPurchaseOrders: purchaseOrders,
    location,
    children,
    dispatch,
    params,
    history
  } = props;

  const {
    orderIds,
    busiTypeEnum,
    status,
    begin,
    end,
  } = location.query;

  const handleFetch = getHandleFetch(dorm, dispatch);
  const createHref = getCreateHref(params.uid, history, location.query);

  return (
    <div>
      <SearchForm
        inline
        onSubmit={handleFetch}
        isFetching={purchaseOrders.isFetching}
      >
        <FormGroup controlId="dormPurchaseOrdersOrderId" label="订单ID：">
          <FormControl
            type="text"
            placeholder="多个订单逗号隔开"
            name="orderIds"
            defaultValue={orderIds}
          />
        </FormGroup>
        <FormGroup controlId="dormPurchaseOrdersBusiType" label="订单类型：">
          <FormControl
            componentClass="select"
            name="busiTypeEnum"
            defaultValue={busiTypeEnum}
            options={busiTypeEnumOptions}
          />
        </FormGroup>
        <FormGroup controlId="dormPurchaseOrdersStatus" label="订单状态：">
          <FormControl
            componentClass="select"
            name="status"
            defaultValue={status}
            options={statusOptions}
          />
        </FormGroup>
        <FormGroup controlId="dormPurchaseOrdersCreateDate" label="下单时间：">
          <DatepickerRange
            inline
            startName="begin"
            endName="end"
            defaultValue={{ dateStart: begin, dateEnd: end }}
          />
        </FormGroup>

        <FormGroup controlId="dormPurchaseOrdersSubmit" >
          <Button type="submit" bsSize="small">
            查询
          </Button>
        </FormGroup>
      </SearchForm>
      <List
        onFetch={handleFetch}
        list={purchaseOrders}
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

      <hr />

      {children}
    </div>
  );
};

Orders.propTypes = {
  dorm: React.PropTypes.object,
  dormPurchaseOrders: React.PropTypes.object,

  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  dispatch: React.PropTypes.fun,
  children: React.PropTypes.any,
};


export default connectEntity(Orders, ['dorm', 'dormPurchaseOrders']);

