import {
  List,
} from 'widget/ezList/components';

import {
  connectEntity,
} from '../../../libs/functions';


import {
  transWarehouseStatus,
  transWarehouseType,
  ROLE_SUPPLIER
} from '../../../consts';


import {
    warehouseDrink
} from '../../../drinks';


const getHandleFetch = (dorm, dispatch) => (where = {}) => {
  if (! dorm || ! dorm.dormId) {
    return false;
  }
  return dispatch(warehouseDrink.queryDormWarehouses(dorm.dormId, where));
};

const getCreateHref = (history) => (warehouseId) =>
  history.createHref(`/custom/query?warehouse=${warehouseId}&role=${ROLE_SUPPLIER}`);

const Warehouse = ({
  dorm,
  dispatch,
  dormWarehouses,
  children,
  history
}) => {
  const handleFetch = getHandleFetch(dorm, dispatch);

  const createHref = getCreateHref(history);
  return (
    <div>
      <p className="text-muted">* 因<b>某些原因</b>，补货仓库不一定都能为店长补货，这里会比店长端显示的补货仓库略多</p>
      <hr />
      <List
        list={dormWarehouses}
        onFetch={handleFetch}
        theadData={[
          '仓库id',
          '联系人姓名',
          '联系人手机',
          '公司名称',
          '供货商id',
          '类型',
          '状态',
          '操作',
        ]}
        tbodyDataItemCallBack={
          item => [
            item.id,
            item.contactName,
            item.contactPhone,
            item.name,
            item.dhId,
            transWarehouseType(item.type),
            transWarehouseStatus(item.status),
            <a href={createHref(item.id)}>查询</a>
          ]
        }
      />
      <hr />

      {children}
    </div>
  );
};

Warehouse.propTypes = {
  dorm: React.PropTypes.object,
  dormWarehouses: React.PropTypes.array,
  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};


export default connectEntity(Warehouse, ['dorm', 'dormWarehouses']);

