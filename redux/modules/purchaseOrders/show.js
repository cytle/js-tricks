import { Component } from 'widget/react';
import Power from 'widget/power';
import {
  Row,
  Col,
  Button,
  Modal,
  Glyphicon,
  Form,
} from 'widget/react/bootstrap';
import wAlert from 'widget/alert';

import {
  transPurchaseOrderBusiTypeEnum,
  transPurchaseOrderStatus,
  transPurchaseOrderCancelType,
  transPurchaseOrderPayType,
} from '../../consts';

import {
  ItemHorizontal,
  Table,
  FormGroup,
  FormControl,
  IconRmb,
} from 'widget/ezList/components';

import {
  formatTime,
  getSelectOptions,
  fixedMoney,
  connectEntity,
} from '../../libs/functions';

import {
  purchaseOrderDrink
} from '../../drinks';


const cancelTypeOptions = getSelectOptions({
  selectValues: [1, 2, 3],
  transFunc: transPurchaseOrderCancelType,
});

const cancelInfo = (order) => {
  if (order.status === 2 && order.dormDealerPurchase) {
    const {
      cancelType,
      cancelRemark,
    } = order.dormDealerPurchase;

    return (
      <Row className="">
        <Col sm="12">
          <h4 className="lead text-danger">取消信息</h4>
          <ItemHorizontal warp labelSize="2" label="责任归属">
            {transPurchaseOrderCancelType(cancelType)}
          </ItemHorizontal>
          <ItemHorizontal
            className={cancelType === 0 ? 'hidden' : ''}
            labelSize="2"
            label="取消备注"
            warp
          >
            <span className="pre-text">
              {cancelRemark}
            </span>
          </ItemHorizontal>
        </Col>
      </Row>
    );
  }

  return '';
};
class PurchaseOrderShow extends Component {
  constructor() {
    super();
    this.state = {
      order: {
        orderId: null
      },
      isCancel: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() {
    const id = this.props.params.id;

    this.setState({
      order: this.props.getPurchaseOrder(id) || { orderId: id }
    });
    this.props.dispatch(purchaseOrderDrink.find(id));
  }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.params.id;

    this.setState({
      order: nextProps.getPurchaseOrder(id) || { orderId: id }
    });

    if (id !== this.state.order.orderId) {
      this.props.dispatch(purchaseOrderDrink.find(id));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.order.lastUpdated !== nextState.order.lastUpdated ||
      this.state.isCancel !== nextState.isCancel;
  }
  refresh() {
    const order = this.state.order;
    this.props.dispatch(purchaseOrderDrink.find(order.orderId));
  }
  handleCancel(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const remark = formData.get('remark');
    const type = formData.get('type');
    const order = this.state.order;

    this.setState({ isCancel: true });
    purchaseOrderDrink
      .cancel(order, type, remark)
      .then(() => {
        wAlert('取消订单成功');
        return this.refresh();
      })
      .catch(() => {
        this.setState({
          isCancel: false
        });
        return this.refresh();
      });
  }


  handleClose() {
    this.props.history.goBack();
  }

  render() {
    const order = this.state.order;

    return (
      <div>
        <div className="static-modal">
          <Modal
            bsSize="large"
            container={this}
            show="true"
            onHide={this.handleClose}
          >
            <Modal.Header >
              <Modal.Title>店长补货单详情</Modal.Title>

              <div
                className="tools text-muted text-right"
                title={'获取于：' + formatTime(order.receivedAt)}
              >
                <span className={(order.isFetching ? '' : 'hidden')} >
                  <Glyphicon glyph="refresh" className="icon-spin" />
                  &nbsp;
                  刷新中
                </span>
                <span
                  onClick={this.refresh}
                  style={{ cursor: 'pointer' }}
                  className={(order.isFetching ? 'hidden' : '')}
                >
                  <Glyphicon glyph="repeat" />
                  &nbsp;
                  刷新
                </span>
                <br />
                订单编号：{order.orderId}
              </div>
            </Modal.Header>

            <Modal.Body
              className="detail-box"
            >
              <div className="tools-warp lead text-blue">
                <small style={{ fontSize: '0.7em' }}>订单状态：</small>
                <span>{transPurchaseOrderStatus(order.status)}</span>
              </div>

              <h4 className="lead" >补货单商品</h4>
              <Table
                theadData={[
                  '商品ID',
                  '商品名称',
                  '出货规格',
                  '出货规格价格',
                  '订货数',
                  '实发数',
                  '最后金额【出货规格价格*数量】',

                ]}
                tbodyData={order.detailDTOs}
                tbodyDataItemCallBack={
                  item => [
                    item.repoId,
                    item.name,
                    item.specs,
                    fixedMoney(item.price),
                    item.applyNum,
                    item.finalNum,
                    fixedMoney(item.price * item.finalNum),
                  ]
                }
              >
                <tfoot>
                  <tr>
                    <th>合计</th>
                    <th colSpan="3"></th>
                    <th>
                      {order.detailDTOs && order.detailDTOs.reduce(
                        (p, item) => p + item.applyNum, 0)}
                    </th>
                    <th>
                      {order.detailDTOs && order.detailDTOs.reduce(
                        (p, item) => p + item.finalNum, 0)}
                    </th>
                    <th>
                      {order.detailDTOs && fixedMoney(order.detailDTOs.reduce(
                        (p, item) => p + item.price * item.finalNum, 0))}
                    </th>
                  </tr>
                </tfoot>
              </Table>

              <Row>

                <Col md="6">
                  <ItemHorizontal labelSize="4" label="订单类型">
                    {transPurchaseOrderBusiTypeEnum(order.busiTypeEnum)}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="下单时间">
                    {formatTime(order.addTime * 1000)}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="完成时间">
                    {formatTime(order.finishTime * 1000)}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="店长id">
                    {order.dormId}
                  </ItemHorizontal>
                </Col>

                <Col md="6">
                  <ItemHorizontal labelSize="4" label="供应商ID">
                    {order.whId}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="供应商名称">
                    {order.whName}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="供应商联系人姓名">
                    {order.whContactName}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="供应商联系电话">
                    {order.whPhone}
                  </ItemHorizontal>
                </Col>
              </Row>
              <ItemHorizontal wrap labelSize="2" label="店长备注">
                {order.remark || '无'}
              </ItemHorizontal>


              <h4 className="lead" >支付详情</h4>
              <Row>
                <Col md="6">
                  <ItemHorizontal labelSize="4" label="订单金额">
                    <IconRmb />
                    {order.finalAmount}
                    <small>
                      {order.finalAmount !== order.applyAmount ?
                        ` (修改后金额，原金额为${order.applyAmount})` : ''}
                    </small>
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="优惠金额">
                    <IconRmb />
                    {order.discount}
                    <small>
                      {order.useCouponCode && `(优惠券：${order.useCouponCode})`}
                    </small>
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="需支付金额">
                    <IconRmb />
                    {fixedMoney(order.finalAmount - order.discount)}
                  </ItemHorizontal>
                </Col>

                <Col md="6">
                  <ItemHorizontal labelSize="4" label="支付方式">
                    {transPurchaseOrderPayType(order.payType)}
                  </ItemHorizontal>

                  <ItemHorizontal labelSize="4" label="支付时间">
                    {formatTime(order.payTime * 1000)}
                  </ItemHorizontal>
                </Col>

              </Row>

              {cancelInfo(order)}
              <Power element="custom-query-purchase-order-cancel">
                <div className={(purchaseOrderDrink.canCancel(order) ? '' : 'hidden')} >
                  <h4 className="lead">订单取消</h4>
                  <Form onSubmit={this.handleCancel}>
                    <FormGroup controlId="dormOrdersType" label="责任归属">
                      <FormControl
                        componentClass="select"
                        name="type"
                        defaultValue="3"
                        options={cancelTypeOptions}
                      />
                    </FormGroup>
                    <FormGroup controlId="dormOrdersStatus" label="取消原因">
                      <FormControl
                        componentClass="textarea"
                        name="remark"
                        placeholder="最多140字"
                      />
                    </FormGroup>

                    <FormGroup controlId="dormOrdersSubmit" >
                      <Button
                        disabled={this.state.isCancel}
                        type="submit"
                        bsStyle="danger"
                        bsSize="small"
                      >
                        取消订单
                      </Button>
                    </FormGroup>
                  </Form>
                </div>
              </Power>
            </Modal.Body>

            <Modal.Footer>
              <Button bsSize="sm" bsStyle="warning" onClick={this.handleClose}>关闭</Button>
            </Modal.Footer>
          </Modal>
        </div>
        {this.props.children}
      </div>
    );
  }
}

PurchaseOrderShow.propTypes = {
  dispatch: React.PropTypes.func,
  getPurchaseOrder: React.PropTypes.func,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  children: React.PropTypes.any,
};


export default connectEntity(PurchaseOrderShow, ['getPurchaseOrder']);
