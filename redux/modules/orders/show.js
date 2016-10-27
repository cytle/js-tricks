import { Component } from 'widget/react';
import Power from 'widget/power';
import wAlert from 'widget/alert';
import {
  Row,
  Col,
  Button,
  Modal,
  Glyphicon,
  Form,
  FormGroup,
  FormControl,
} from 'widget/react/bootstrap';

import {
  transOrderType,
  transOrderStatus,
  transOrderPayType,
  transOrderPaySource,
  transOrderPayStatus,
  transOrderOperateType,
  transOrderRefundStatus,
  transOrderPayRefundStatus,
} from '../../consts';

import {
  ItemHorizontal,
  Table,
} from 'widget/ezList/components';
import {
  orderDrink
} from '../../drinks';
import {
  formatTime,
  transCentMoney,
  connectEntity,
} from '../../libs/functions';


const getPowerElement = (type = 'global') => {
  type = type.toLowerCase().replace(/_/g, '-');
  return `custom-query-order-${type}-cancel`;
};

// 获取支付时间
const getOrderPayPayTime = (orderPay) => {
  // 如果为未支付，时间为空
  if (orderPay.status === 'WAITING') {
    return '';
  }

  // 如果是货到付款取更新时间（货到付款没有退款）
  if (orderPay.type === 'CASH_ON_DELIVERY') {
    return orderPay.updateTime;
  }

  // 其他情况去创建时间
  return orderPay.createTime;
};

const getOrderPayInfo = (orderPay) => {
  const info = [];


  if (orderPay.remark) {
    info.push(orderPay.remark);
  }

  const payTime = getOrderPayPayTime(orderPay);

  if (payTime) {
    info.push(`在${payTime}完成支付`);
  }

  if (orderPay.refundStatus && orderPay.refundStatus !== 'NO_REFUND') {
    info.push(`现在处于「${transOrderPayRefundStatus(orderPay.refundStatus)}」`);
  }

  return <div title={`最后更新于${orderPay.updateTime}`}>{info.join('，')}</div>;
};

const getLogisticsInfo = (logistics) => {
  if (! logistics) {
    return '';
  }

  return (
    <Row>
      <Col md="6">
        <ItemHorizontal labelSize="4" label="物流公司">
          {logistics.deliveryCompany}
        </ItemHorizontal>
      </Col>

      <Col md="6">
        <ItemHorizontal labelSize="4" label="物流单号">
          {logistics.deliveryOrderNo}
        </ItemHorizontal>
      </Col>
    </Row>
  );
};

class Order extends Component {
  constructor() {
    super();
    this.state = {
      order: {
        id: null
      },
      isCancel: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  componentWillMount() {
    const id = this.props.params.id;

    this.setState({
      order: this.props.getOrder(id) || { id }
    });
    this.props.dispatch(orderDrink.find(id));
  }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.params.id;

    this.setState({
      order: nextProps.getOrder(id) || { id }
    });

    if (id !== this.state.order.id) {
      this.props.dispatch(orderDrink.find(id));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.order.lastUpdated !== nextState.order.lastUpdated ||
      this.state.isCancel !== nextState.isCancel;
  }

  refresh() {
    const order = this.state.order;

    this.props.dispatch(orderDrink.find(order.id));
  }

  handleCancel(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const remark = formData.get('remark');
    const order = this.state.order;

    this.setState({ isCancel: true });

    orderDrink
      .cancel(order, remark)
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
    // FIXME 需要转跳到当前列表页 而不是返回，不过好像也没有问题
    this.props.history.goBack();
  }

  render() {
    const {
      order,
      isCancel,
    } = this.state;

    return (
      <div>
        <div className="static-modal">
          <Modal
            bsSize="large"
            container={this}
            show="true"
            onHide={this.handleClose}
          >
            <Modal.Header>
              <Modal.Title>销售订单详情</Modal.Title>

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
                订单编号：{order.id}
              </div>
            </Modal.Header>

            <Modal.Body
              className="detail-box"
            >
              <div className="tools-warp lead text-blue">
                <small style={{ fontSize: '0.7em' }}>状态：</small>
                {transOrderStatus(order.status)}
              </div>
              <h4 className="lead" >订单商品</h4>
              <Table
                theadData={[
                  '序号',
                  '商品id',
                  '商品名称',
                  '单价（元）',
                  '数量',
                  '金额（元）',
                ]}
                tbodyData={order.itemList}
                tbodyDataItemCallBack={
                  (item, index) => [
                    index + 1,
                    item.itemId,
                    item.name,
                    transCentMoney(item.price),
                    item.quantity,
                    transCentMoney(item.amount)
                  ]
                }
              >
                <tfoot>
                  <tr>
                    <th>合计</th>
                    <th colSpan="3"></th>
                    <th>
                      {order.itemList && order.itemList.reduce(
                        (p, item) => p + item.quantity, 0)}
                    </th>
                    <th>
                      {order.itemList && transCentMoney(order.itemList.reduce(
                        (p, item) => p + item.price * item.quantity, 0))}
                    </th>
                  </tr>
                </tfoot>
              </Table>
              <hr />


              <ItemHorizontal labelSize="2" label="下单时间">
                {order.createTime}
              </ItemHorizontal>

              <Row>
                <Col md="6">
                  <ItemHorizontal labelSize="4" label="订单类型">
                    {transOrderType(order.type)}
                  </ItemHorizontal>
                </Col>

                <Col md="6">
                  <ItemHorizontal labelSize="4" label="退款状态">
                    {transOrderRefundStatus(order.refundStatus)}
                  </ItemHorizontal>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <ItemHorizontal labelSize="4" label="卖家姓名">
                    {order.sellerName}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="卖家手机号">
                    {order.sellerPhone}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="卖家地址">
                      {order.sellerAddress}
                  </ItemHorizontal>
                </Col>
                <Col md="6">
                  <ItemHorizontal labelSize="4" label="买家姓名">
                    {order.buyerName}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="买家手机号">
                    {order.buyerPhone}
                  </ItemHorizontal>
                  <ItemHorizontal labelSize="4" label="买家地址">
                    {order.buyerAddress}
                  </ItemHorizontal>
                </Col>
              </Row>

              {getLogisticsInfo(order.logistics)}

              <h4 className="lead">支付详情</h4>

              <Table
                theadData={[
                  '序号',
                  '支付方式',
                  '支付来源',
                  '支付状态',
                  '金额（元）',
                  '流水号/活动/优惠券',
                  '说明',
                ]}
                tbodyData={order.payList}
                tbodyDataItemCallBack={
                  (item, index) => [
                    index + 1,
                    transOrderPayType(item.type),
                    transOrderPaySource(item.source),
                    transOrderPayStatus(item.status),
                    transCentMoney(item.amount),
                    item.outId,
                    getOrderPayInfo(item),
                  ]
                }
              />
              <hr />

              <h4 className="lead">订单变动历史</h4>

              <Table
                theadData={[
                  '序号',
                  '时间',
                  '操作说明',
                  '变动后状态',
                ]}
                tbodyData={order.operateList}
                tbodyDataItemCallBack={
                  (item, index) => [
                    index + 1,
                    item.createTime,
                    item.remark,
                    transOrderStatus(item.orderStatus),
                  ]
                }
              />

              <div
                className={(!order.operateLogList || order.operateLogList.length === 0) ?
                  'hidden' : ''}
              >
                <hr />

                <h4 className="lead">后台操作记录</h4>
                <Table

                  theadData={[
                    '序号',
                    '操作时间',
                    '操作人',
                    '操作类型',
                    '操作备注',
                  ]}
                  tbodyData={order.operateLogList}
                  tbodyDataItemCallBack={
                    (item, index) => [
                      index + 1,
                      item.create_time,
                      `${item.uname}(uid:${item.uid})`,
                      transOrderOperateType(item.type),
                      (<span className="pre-text">{item.remark}</span>),
                    ]
                  }
                />
              </div>
              <Power element={getPowerElement(order.type)}>

                <div className={(orderDrink.canCancel(order) ? '' : 'hidden')} >
                  <h4 className="lead">订单取消</h4>
                  <Form
                    onSubmit={this.handleCancel}
                  >
                    <FormGroup controlId="dormOrdersStatus" label="取消原因">
                      <FormControl
                        componentClass="textarea"
                        name="remark"
                        placeholder="最多20字"
                      />
                    </FormGroup>

                    <FormGroup controlId="dormOrdersSubmit" >
                      <Button
                        disabled={isCancel}
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

Order.propTypes = {
  dispatch: React.PropTypes.fun,
  getOrder: React.PropTypes.func,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  children: React.PropTypes.any,
};

export default connectEntity(Order, ['getOrder']);

