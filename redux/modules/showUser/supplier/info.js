import { connectEntity } from '../../../libs/functions';
import {
  Row,
  Col,
} from 'widget/react/bootstrap';

import {
  ItemHorizontal,
  Table
} from 'widget/ezList/components';

import {
  transSupplierSupplyAuthority,
  transSupplierStatus,
  transSupplierRefundType,
  transSupplierBankAccountType,
  transWarehouseStatus,
  transWarehouseType,
} from '../../../consts';

import {
  supplierDrink
} from '../../../drinks';

// 供应商 店长仓库信息展示
const WarehouseNode = (props) => {
  const supplier = props.supplier || {};

  const warehouse = props.warehouse || {};

  if (supplierDrink.supplierIsWarehouse(supplier)) {
    return (
      <div>
        <br />
        <h4 className="lead">店长仓库信息 <small>Warehouse</small></h4>
        <Row>
          <Col md="6">
            <ItemHorizontal labelSize="4" label="ID">
              {warehouse.id}
            </ItemHorizontal>
            <ItemHorizontal labelSize="4" label="名称">
              {warehouse.name}
            </ItemHorizontal>
            <ItemHorizontal labelSize="4" label="状态">
              {transWarehouseStatus(warehouse.status)}
            </ItemHorizontal>
          </Col>
          <Col md="6">
            <ItemHorizontal labelSize="4" label="类型">
              {transWarehouseType(warehouse.type)}
            </ItemHorizontal>
            <ItemHorizontal labelSize="4" label="联系人">
              {warehouse.contactName}
            </ItemHorizontal>
            <ItemHorizontal labelSize="4" label="联系人电话">
              {warehouse.contactPhone}
            </ItemHorizontal>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      <br />
      <h4 className="lead">店长仓库信息 <small>Warehouse</small></h4>

      <p className="text-center text-muted">当前供应商不给店长供货</p>
    </div>
  );
};

WarehouseNode.propTypes = {
  children: React.PropTypes.object,
  supplier: React.PropTypes.object,
  warehouse: React.PropTypes.object,
};

const WarehouseNodeWithEntity = connectEntity(WarehouseNode, ['warehouse']);


// 信息
const Info = (props) => {
  const {
    children,
  } = props;

  const supplier = props.supplier || {};

  return (
    <div className="detail-box">
      <h4 className="lead">个人信息 <small>Info</small></h4>
      <Row>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="供货商ID">
            {supplier.supplierId}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="供货商名称">
            {supplier.supplierName}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="合作状态">
            {transSupplierStatus(supplier.status)}
          </ItemHorizontal>

        </Col>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="退货标志">
            {transSupplierRefundType(supplier.refundType)}
          </ItemHorizontal>

          <ItemHorizontal labelSize="4" label="供货商权限">
            {
              supplier.supplyAuthority &&
              supplier.supplyAuthority
                .map(item => transSupplierSupplyAuthority(item))
                .join(',')
            }
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="详细地址">
            {supplier.address}
          </ItemHorizontal>
        </Col>
      </Row>

      <br />
      <h4 className="lead">联系人信息 <small>Contact</small></h4>
      <Table
        theadData={[
          '序号',
          '联系人',
          '手机',
          '座机',
          '邮箱'
        ]}
        tbodyData={supplier.contactList}
        tbodyDataItemCallBack={
          (item, index) => [
            (item.isDefault ? '* ' : '') + (index + 1),
            item.truename,
            item.mobile,
            item.tel,
            item.email,
          ]
        }
      />
      <p className="text-muted">* 表示默认联系人</p>

      <br />
      <h4 className="lead">财务信息 <small>Bank Account</small></h4>
      <Table
        theadData={[
          '序号',
          '账户类型',
          '开户银行',
          // '开户城市',
          '开户支行',
          '账户名称',
          '银行帐号',
        ]}
        tbodyData={supplier.backAccountList}
        tbodyDataItemCallBack={
          (item, index) => [
            (item.isDefault ? '* ' : '') + (index + 1),
            transSupplierBankAccountType(item.type),
            item.bankName,
            // item.truename,
            item.bankBranch,
            item.bankAccount,
            item.bankAccountNumber,
          ]
        }
      />
      <p className="text-muted">* 表示默认账户</p>

      <WarehouseNodeWithEntity supplier={supplier} />

      {children}
    </div>
  );
};

Info.propTypes = {
  children: React.PropTypes.object,
  supplier: React.PropTypes.object,
};

export default connectEntity(Info, ['supplier']);
