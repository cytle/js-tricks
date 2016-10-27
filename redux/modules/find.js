import wAlert from 'widget/alert';
import React, { Component, PropTypes } from 'widget/react';
import {
  Row,
  Col,
  Button,
  FormControl,
  Radio,
  Modal,
} from 'widget/react/bootstrap';

import {
  FormGroupHorizontal,
  SearchForm,
} from 'widget/ezList/components';

import {
  ROLE_USER,
} from '../consts';
import ChooseUser from './chooseUser';
import { getFind } from './userFinders';

class FindUser extends Component {
  constructor() {
    super();
    this.state = {
      isFetching: false,
      showChooseUser: false,
      usersList: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.queryUsersList(this.context.location.query);
  }

  handleClose() {
    this.setState({
      showChooseUser: false
    });
  }

  /**
   * 查询用户
   * @param where object 查询条件
   */
  queryUsersList(where) {
    let key;
    let value;

    for (const name of Object.keys(where)) {
      if (name !== 'role') {
        key = name;
        value = where[name];
        break;
      }
    }

    if (! key) return false;

    this.setState({ isFetching: true });

    // 查找用户
    const find = getFind(key, this.context.dispatch);

    if (find) {
      let role;
      if (where.role && where.role !== ROLE_USER) {
        role = where.role;
      }

      find({ value, key, role })
      .then(usersList => {
        this.setState({
          usersList,
          isFetching: false,
          showChooseUser: usersList.length > 1
        });

        if (usersList.length === 1) {
          const user = usersList[0];
          if (! user.isError) {
            this.showUser(usersList[0].uid, usersList[0].role || ROLE_USER);
          }
        }
      });
    }

    return true;
  }


  showUser(uid, role) {
    // 刷新路由
    this.context.history.pushState(null, `/custom/query/users/${uid}/${role}`, {});
  }

  handleSubmit(where) {
    if (this.queryUsersList(where) === false) {
      wAlert('请至少填入一个信息', 'error');
    }
  }

  render() {
    const query = this.context.location.query;

    return (
      <Row>
        <Col xs={12} md={6}>
          <h2 className="lead">查询入口</h2>
          <SearchForm
            horizontal
            onSubmit={this.handleSubmit}
            isFetching={this.state.isFetching}
          >
            <hr />

            <FormGroupHorizontal controlId="formRole" label="客户身份">
              <Radio name="role" inline defaultChecked value="user">用户</Radio>
              <Radio name="role" inline value="buyer">顾客</Radio>
              <Radio name="role" inline value="dorm">店长</Radio>
              <Radio name="role" inline value="supplier">供应商</Radio>
            </FormGroupHorizontal>

            <hr />

            <FormGroupHorizontal controlId="formPhone">
              <p className="text-muted">以下信息任填一项</p>
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formPhone" label="手机号">
              <FormControl
                type="text"
                placeholder="数据来源：用户、店长、供应商"
                name="phone"
                defaultValue={query.phone}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formUname" label="用户名">
              <FormControl
                type="text"
                placeholder="用户平时登录的账户"
                name="loginName"
                defaultValue={query.loginName}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formUid" label="用户ID">
              <FormControl
                type="text"
                placeholder="uid"
                name="uid"
                defaultValue={query.uid}
              />
            </FormGroupHorizontal>


            <FormGroupHorizontal controlId="formOrderId" label="销售订单ID">
              <FormControl
                type="text"
                placeholder="即orderId"
                name="orderId"
                defaultValue={query.orderId}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formPurchaseId" label="补货订单ID">
              <FormControl
                type="text"
                placeholder="即purchaseId"
                name="purchaseId"
                defaultValue={query.purchaseId}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formDormId" label="店长ID">
              <FormControl
                type="text"
                placeholder="即dormId"
                name="dorm"
                defaultValue={query.dorm}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formSupplierId" label="供应商ID">
              <FormControl
                type="text"
                placeholder="即supplierId"
                name="supplier"
                defaultValue={query.supplier}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal controlId="formWarehouseId" label="店长补货仓库ID">
              <FormControl
                type="text"
                placeholder="店长采购单的供应商ID，即warehouseId"
                name="warehouse"
                defaultValue={query.warehouse}
              />
            </FormGroupHorizontal>

            <FormGroupHorizontal>
              <Button
                type="submit"
                className="pull-right"
                bsStyle="primary"
              >
                查询
              </Button>
            </FormGroupHorizontal>
          </SearchForm>
        </Col>
        <div className="static-modal">
          <Modal
            bsSize="large"
            container={this}
            show={this.state.showChooseUser}
            onHide={this.handleClose}
          >
            <Modal.Header>
              <Modal.Title>发现多个用户</Modal.Title>
            </Modal.Header>

            <Modal.Body
              className="detail-box"
            >
              <ChooseUser usersList={this.state.usersList} />

            </Modal.Body>

            <Modal.Footer>
              <Button bsSize="sm" onClick={this.handleClose}>关闭</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Row>
    );
  }
}

FindUser.contextTypes = {
  dispatch: PropTypes.func,
  router: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default FindUser;
